-- PATHNOVA: Create incidents table
-- Migration: 001_create_incidents_table.sql

CREATE TABLE IF NOT EXISTS incidents (
  id            uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text            NOT NULL,
  description   text,
  latitude      double precision NOT NULL,
  longitude     double precision NOT NULL,
  location_name text,
  severity      text            NOT NULL DEFAULT 'medium',
  photo_url     text,
  status        text            NOT NULL DEFAULT 'reported',
  reported_at   timestamptz     NOT NULL DEFAULT now(),
  created_at    timestamptz     NOT NULL DEFAULT now()
);

-- Add check constraints for valid values
ALTER TABLE incidents
  ADD CONSTRAINT incidents_severity_check
    CHECK (severity IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE incidents
  ADD CONSTRAINT incidents_status_check
    CHECK (status IN ('reported', 'verified', 'in_progress', 'resolved'));

ALTER TABLE incidents
  ADD CONSTRAINT incidents_type_check
    CHECK (incident_type IN ('pothole', 'accident', 'road_damage', 'obstruction', 'flooding', 'other'));

-- Enable Row Level Security (required by Supabase, we'll configure policies later)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (we'll tighten this when auth is added)
CREATE POLICY "Allow public read access on incidents"
  ON incidents FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access on incidents"
  ON incidents FOR INSERT
  WITH CHECK (true);
