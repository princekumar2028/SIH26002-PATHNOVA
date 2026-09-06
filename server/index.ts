import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSupabaseTest } from "./routes/supabase-test";
import { handleGetIncidents, handleCreateIncident } from "./routes/incidents";
import { handleUploadPhoto } from "./routes/upload-photo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/supabase-test", handleSupabaseTest);

  // Incident Reporting API
  app.get("/api/incidents", handleGetIncidents);
  app.post("/api/incidents", handleCreateIncident);
  app.post("/api/incidents/upload-photo", handleUploadPhoto);

  return app;
}
