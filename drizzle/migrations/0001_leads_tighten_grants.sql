REVOKE ALL ON public.leads FROM anon, authenticated;
GRANT INSERT (task, name, contact) ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;