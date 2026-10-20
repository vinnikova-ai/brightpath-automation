CREATE TABLE public.ai_advisor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL CHECK (char_length(client_key) = 64),
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.ai_advisor_requests FROM anon, authenticated;
GRANT ALL ON public.ai_advisor_requests TO service_role;
ALTER TABLE public.ai_advisor_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX ai_advisor_requests_key_time ON public.ai_advisor_requests (client_key, created_at DESC);

-- Atomically records one advisor request per hashed visitor address, or reports how long to wait.
CREATE OR REPLACE FUNCTION public.consume_ai_advisor_quota(_client_key text, _limit integer, _window_seconds integer)
RETURNS TABLE (allowed boolean, retry_after_seconds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count integer;
  _oldest timestamptz;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('ai_advisor:' || _client_key));
  DELETE FROM public.ai_advisor_requests WHERE created_at < now() - interval '1 day';
  SELECT count(*), min(created_at) INTO _count, _oldest
  FROM public.ai_advisor_requests
  WHERE client_key = _client_key AND created_at > now() - make_interval(secs => _window_seconds);
  IF _count >= _limit THEN
    RETURN QUERY SELECT false, GREATEST(1, CEIL(EXTRACT(EPOCH FROM (_oldest + make_interval(secs => _window_seconds) - now())))::integer);
    RETURN;
  END IF;
  INSERT INTO public.ai_advisor_requests (client_key) VALUES (_client_key);
  RETURN QUERY SELECT true, 0;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_ai_advisor_quota(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_advisor_quota(text, integer, integer) TO service_role;