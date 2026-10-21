CREATE TABLE public.concept_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  modules text[] NOT NULL DEFAULT '{}',
  total integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT concept_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 100 AND name = btrim(name)),
  CONSTRAINT concept_contact_length CHECK (char_length(contact) BETWEEN 3 AND 255 AND contact = btrim(contact)),
  CONSTRAINT concept_contact_format CHECK (
    contact ~ '^@?[A-Za-z0-9_]{4,32}$'
    OR contact ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT concept_modules_allowed CHECK (modules <@ ARRAY['database', 'ai', 'webapp']::text[] AND cardinality(modules) <= 3),
  -- Price must match the published price list: base 30 000 ₽ plus each selected add-on.
  CONSTRAINT concept_total_matches CHECK (
    total = 30000
      + CASE WHEN 'database' = ANY(modules) THEN 20000 ELSE 0 END
      + CASE WHEN 'ai' = ANY(modules) THEN 25000 ELSE 0 END
      + CASE WHEN 'webapp' = ANY(modules) THEN 35000 ELSE 0 END
  )
);

GRANT INSERT (name, contact, modules, total) ON public.concept_requests TO anon, authenticated;
GRANT ALL ON public.concept_requests TO service_role;

ALTER TABLE public.concept_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit valid concept requests"
ON public.concept_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(name) BETWEEN 1 AND 100 AND char_length(contact) BETWEEN 3 AND 255);

CREATE INDEX concept_requests_contact_created_idx ON public.concept_requests (lower(contact), created_at DESC);

-- Basic anti-spam: one concept request per contact every 10 minutes, max 30 per minute overall.
CREATE OR REPLACE FUNCTION public.concept_requests_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.concept_requests
    WHERE lower(contact) = lower(NEW.contact)
      AND created_at > now() - interval '10 minutes'
  ) THEN
    RAISE EXCEPTION 'concept_rate_limited' USING ERRCODE = 'P0001';
  END IF;
  IF (SELECT count(*) FROM public.concept_requests WHERE created_at > now() - interval '1 minute') >= 30 THEN
    RAISE EXCEPTION 'concept_rate_limited' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.concept_requests_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER concept_requests_rate_limit_before_insert
BEFORE INSERT ON public.concept_requests
FOR EACH ROW EXECUTE FUNCTION public.concept_requests_rate_limit();