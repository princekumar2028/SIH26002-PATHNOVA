import { RequestHandler } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { supabase } from "../config/supabase";

/**
 * Supabase Storage bucket name for incident photos
 */
const BUCKET_NAME = "incident-photos";

/**
 * Allowed MIME types for photo uploads
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Max file size: 5 MB
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Multer middleware — stores file in memory buffer for upload to Supabase
 */
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPG, JPEG, PNG, WEBP`));
    }
  },
}).single("photo"); // field name is "photo"

/**
 * POST /api/incidents/upload-photo
 *
 * Accepts multipart/form-data with a "photo" field.
 * Uploads the image to Supabase Storage and returns a public URL.
 */
export const handleUploadPhoto: RequestHandler = async (req, res) => {
  // Use multer as a promise so we can handle errors cleanly
  uploadMiddleware(req, res, async (multerError) => {
    try {
      // Handle multer errors (file too large, wrong type, etc.)
      if (multerError) {
        res.status(400).json({
          success: false,
          message: multerError.message,
        });
        return;
      }

      // Check that a file was provided
      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          message: "No photo file provided. Use form field name 'photo'.",
        });
        return;
      }

      // Generate a unique filename: uuid + original extension
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const filename = `${randomUUID()}${ext}`;
      const storagePath = `uploads/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        res.status(500).json({
          success: false,
          message: "Failed to upload photo to storage",
          error: error.message,
        });
        return;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      res.status(201).json({
        success: true,
        message: "Photo uploaded successfully",
        photo_url: urlData.publicUrl,
        storage_path: data.path,
        file_size: file.size,
        mime_type: file.mimetype,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Server error during photo upload",
        error: err.message,
      });
    }
  });
};
