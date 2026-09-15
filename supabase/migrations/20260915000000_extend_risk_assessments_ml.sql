-- Idempotent Migration: Extend public.risk_assessments for Prototype ML Risk Estimator

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'risk_assessments'
  ) THEN
    -- Add model_version column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'model_version'
    ) THEN
      ALTER TABLE public.risk_assessments ADD COLUMN model_version TEXT NULL;
    END IF;

    -- Add model_mode column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'model_mode'
    ) THEN
      ALTER TABLE public.risk_assessments 
        ADD COLUMN model_mode TEXT NULL CHECK (model_mode IN ('prototype_ml', 'rule_based_fallback'));
    END IF;

    -- Add ml_risk_score column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'ml_risk_score'
    ) THEN
      ALTER TABLE public.risk_assessments 
        ADD COLUMN ml_risk_score INTEGER NULL CHECK (ml_risk_score BETWEEN 0 AND 100);
    END IF;

    -- Add rule_based_risk_score column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'rule_based_risk_score'
    ) THEN
      ALTER TABLE public.risk_assessments 
        ADD COLUMN rule_based_risk_score INTEGER NULL CHECK (rule_based_risk_score BETWEEN 0 AND 100);
    END IF;

    -- Add contributing_factors column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'contributing_factors'
    ) THEN
      ALTER TABLE public.risk_assessments 
        ADD COLUMN contributing_factors JSONB NOT NULL DEFAULT '[]'::jsonb;
    END IF;

    -- Add simulation_disclaimer column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'risk_assessments' AND column_name = 'simulation_disclaimer'
    ) THEN
      ALTER TABLE public.risk_assessments ADD COLUMN simulation_disclaimer TEXT NULL;
    END IF;
  END IF;
END $$;
