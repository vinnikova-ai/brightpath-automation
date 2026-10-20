CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  name text NOT NULL,
  contact text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_task_allowed CHECK (task IN ('Внедрить LLM/ИИ-ассистента', 'Автоматизировать рутину', 'Создать умный лендинг/бота')),
  CONSTRAINT leads_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 100 AND name = btrim(name)),
  CONSTRAINT leads_contact_length CHECK (char_length(contact) BETWEEN 3 AND 255 AND contact = btrim(contact)),
  CONSTRAINT leads_contact_format CHECK (
    contact ~ '^@?[A-Za-z0-9_]{4,32}$'
    OR contact ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
);

-- Visitors may only add the three form fields; id and created_at are set by the database.
GRANT INSERT (task, name, contact) ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit valid leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(contact) BETWEEN 3 AND 255
);

CREATE INDEX leads_contact_created_idx ON public.leads (lower(contact), created_at DESC);

-- Basic anti-spam: one submission per contact every 10 minutes, max 30 submissions per minute overall.
CREATE OR REPLACE FUNCTION public.leads_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.leads
    WHERE lower(contact) = lower(NEW.contact)
      AND created_at > now() - interval '10 minutes'
  ) THEN
    RAISE EXCEPTION 'lead_rate_limited' USING ERRCODE = 'P0001';
  END IF;
  IF (SELECT count(*) FROM public.leads WHERE created_at > now() - interval '1 minute') >= 30 THEN
    RAISE EXCEPTION 'lead_rate_limited' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.leads_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER leads_rate_limit_before_insert
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.leads_rate_limit();