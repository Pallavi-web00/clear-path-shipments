
CREATE OR REPLACE FUNCTION public.notify_admins(_title TEXT, _body TEXT, _link TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, link)
  SELECT ur.user_id, _title, _body, _link FROM public.user_roles ur WHERE ur.role = 'admin';
END; $$;
REVOKE ALL ON FUNCTION public.notify_admins(TEXT,TEXT,TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.notify_admins(TEXT,TEXT,TEXT) TO authenticated;
