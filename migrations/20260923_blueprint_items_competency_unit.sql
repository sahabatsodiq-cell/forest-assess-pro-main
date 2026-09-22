-- Migration: Blueprint berbasis Unit Kompetensi
-- Date: 2026-09-23

ALTER TABLE blueprint_items
ADD COLUMN IF NOT EXISTS competency_unit_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blueprint_items_competency_unit_id_fkey'
  ) THEN
    ALTER TABLE blueprint_items
    ADD CONSTRAINT blueprint_items_competency_unit_id_fkey
    FOREIGN KEY (competency_unit_id)
    REFERENCES competency_units(id);
  END IF;
END $$;

ALTER TABLE blueprint_items
ALTER COLUMN subject_id DROP NOT NULL;
