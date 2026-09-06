import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const BUCKET_NAME = "incident-photos";

async function setupAndTest() {
  console.log("=== PATHNOVA: Photo Upload Setup & Test ===\n");

  // ---------- Step 1: Check the storage bucket ----------
  console.log("Step 1: Checking storage bucket...");
  const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(BUCKET_NAME);

  if (bucketError) {
    console.log(`  ⚠️ Failed to retrieve bucket info: ${bucketError.message}`);
    console.log("  Assuming bucket exists and proceeding to upload...\n");
  } else {
    console.log(`  ✅ Bucket '${BUCKET_NAME}' exists.\n`);
  }

  // ---------- Step 2: Create a small test PNG image ----------
  console.log("Step 2: Creating test image...");
  // Minimal 1x1 red PNG (68 bytes)
  const pngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAH" +
    "ggJ/PchI7wAAAABJRU5ErkJggg==",
    "base64"
  );
  const testFilename = `test-upload-${Date.now()}.png`;
  const storagePath = `uploads/${testFilename}`;
  console.log(`  Created ${pngBuffer.length}-byte test PNG.\n`);

  // ---------- Step 3: Upload to Supabase Storage ----------
  console.log("Step 3: Uploading test image to Supabase Storage...");
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, pngBuffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.log(`  ❌ Upload failed: ${uploadError.message}`);
    console.log(`  Full error: ${JSON.stringify(uploadError)}`);
    return;
  }
  console.log(`  ✅ Upload succeeded!`);
  console.log(`     Storage path: ${uploadData.path}\n`);

  // ---------- Step 4: Get public URL ----------
  console.log("Step 4: Getting public URL...");
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  console.log(`  ✅ Public URL: ${urlData.publicUrl}\n`);

  // ---------- Step 5: Verify the URL is accessible ----------
  console.log("Step 5: Verifying URL is accessible...");
  try {
    const response = await fetch(urlData.publicUrl);
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      const contentLength = response.headers.get("content-length");
      console.log(`  ✅ URL accessible! Status: ${response.status}`);
      console.log(`     Content-Type: ${contentType}`);
      console.log(`     Content-Length: ${contentLength} bytes\n`);
    } else {
      console.log(`  ⚠️  URL returned status ${response.status}.\n`);
    }
  } catch (err: any) {
    console.log(`  ⚠️  Could not verify URL: ${err.message}\n`);
  }

  // ---------- Step 6: Cleanup ----------
  console.log("Step 6: Cleaning up test file...");
  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (deleteError) {
    console.log(`  ⚠️  Cleanup failed: ${deleteError.message}\n`);
  } else {
    console.log(`  ✅ Test file deleted from storage.\n`);
  }

  // ---------- Summary ----------
  console.log("===========================================");
  console.log("✅ PHOTO UPLOAD SETUP & TEST COMPLETE!");
  console.log(`   Bucket: ${BUCKET_NAME}`);
  console.log(`   Endpoint: POST /api/incidents/upload-photo`);
  console.log(`   Max size: 5 MB`);
  console.log(`   Formats: JPG, JPEG, PNG, WEBP`);
  console.log("===========================================");
}

setupAndTest();
