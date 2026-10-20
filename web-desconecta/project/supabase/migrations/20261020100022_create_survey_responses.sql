/*
# Create survey responses for Desconecta

1. New Tables
- `survey_responses`
- `id` (uuid, primary key)
- `name` (text, optional customer name)
- `email` (text, optional contact email)
- `moment` (text, selected disconnection moment)
- `interests` (jsonb, selected kit interests)
- `format` (text, preferred kit format)
- `notes` (text, optional extra preferences)
- `created_at` (timestamptz, submission time)

2. Security
- Row Level Security is enabled.
- Anonymous visitors may submit a response.
- Responses are not readable, editable, or deletable through the public browser client to protect customer contact details.

3. Important notes
- This is a single-tenant, no-login marketing site.
- The insert policy intentionally allows public submissions because the survey is the public product-selection flow.
*/

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  moment text NOT NULL,
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  format text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit survey responses" ON public.survey_responses;
CREATE POLICY "Public can submit survey responses"
  ON public.survey_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Survey responses are private" ON public.survey_responses;
CREATE POLICY "Survey responses are private"
  ON public.survey_responses
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Survey responses cannot be edited publicly" ON public.survey_responses;
CREATE POLICY "Survey responses cannot be edited publicly"
  ON public.survey_responses
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Survey responses cannot be deleted publicly" ON public.survey_responses;
CREATE POLICY "Survey responses cannot be deleted publicly"
  ON public.survey_responses
  FOR DELETE
  TO anon, authenticated
  USING (false);
