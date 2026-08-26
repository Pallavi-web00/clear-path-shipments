
CREATE TYPE public.app_role AS ENUM ('admin','driver','customer');
CREATE TYPE public.shipment_status AS ENUM ('Pending','Assigned','Accepted','Picked Up','In Transit','Out for Delivery','Delivered','Rejected','Cancelled');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  license_number TEXT DEFAULT '',
  vehicle_type TEXT DEFAULT '',
  vehicle_number TEXT DEFAULT '',
  address TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  driver_id UUID REFERENCES auth.users ON DELETE SET NULL,
  sender_name TEXT NOT NULL DEFAULT '', sender_phone TEXT DEFAULT '', sender_email TEXT DEFAULT '',
  sender_address TEXT DEFAULT '', sender_city TEXT DEFAULT '', sender_state TEXT DEFAULT '', sender_postal_code TEXT DEFAULT '',
  receiver_name TEXT NOT NULL DEFAULT '', receiver_phone TEXT DEFAULT '', receiver_email TEXT DEFAULT '',
  receiver_address TEXT DEFAULT '', receiver_city TEXT DEFAULT '', receiver_state TEXT DEFAULT '', receiver_postal_code TEXT DEFAULT '',
  parcel_type TEXT DEFAULT '', description TEXT DEFAULT '', weight NUMERIC DEFAULT 0, quantity INTEGER DEFAULT 1,
  package_size TEXT DEFAULT '', fragile BOOLEAN NOT NULL DEFAULT false, estimated_value NUMERIC DEFAULT 0,
  special_instructions TEXT DEFAULT '',
  pickup_location TEXT NOT NULL DEFAULT '', delivery_location TEXT NOT NULL DEFAULT '',
  status public.shipment_status NOT NULL DEFAULT 'Pending',
  pickup_date DATE, expected_delivery_date DATE,
  picked_up_at TIMESTAMPTZ, delivered_at TIMESTAMPTZ,
  delivery_notes TEXT, delivery_signature TEXT, delivery_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments ON DELETE CASCADE,
  status public.shipment_status NOT NULL,
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  updated_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tracking_events TO authenticated;
GRANT ALL ON public.tracking_events TO service_role;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.driver_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ, rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_assignments TO authenticated;
GRANT ALL ON public.driver_assignments TO service_role;
ALTER TABLE public.driver_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles admin insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles admin delete" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "drivers read" ON public.drivers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "drivers admin write" ON public.drivers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "customers read" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "customers self write" ON public.customers FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "shipments read" ON public.shipments FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR driver_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "shipments customer insert" ON public.shipments FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid() AND public.has_role(auth.uid(),'customer'));
CREATE POLICY "shipments update" ON public.shipments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR driver_id = auth.uid() OR customer_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin') OR driver_id = auth.uid() OR customer_id = auth.uid());
CREATE POLICY "shipments admin delete" ON public.shipments FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "events read" ON public.tracking_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR s.driver_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "events insert" ON public.tracking_events FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR s.driver_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
);

CREATE POLICY "assignments read" ON public.driver_assignments FOR SELECT TO authenticated USING (driver_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "assignments admin write" ON public.driver_assignments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "assignments update" ON public.driver_assignments FOR UPDATE TO authenticated USING (driver_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (driver_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "notif read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER t_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_drivers BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_customers BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_shipments BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- new user -> profile + customer role (self sign-up is customer only)
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name',''), COALESCE(NEW.email,''), COALESCE(NEW.raw_user_meta_data->>'phone',''))
  ON CONFLICT (id) DO NOTHING;
  IF COALESCE(NEW.raw_user_meta_data->>'role','customer') = 'customer' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
    INSERT INTO public.customers (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Public tracking (safe fields only)
CREATE OR REPLACE FUNCTION public.track_parcel(_tracking_id TEXT)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.shipments; res JSONB;
BEGIN
  SELECT * INTO s FROM public.shipments WHERE upper(tracking_id) = upper(trim(_tracking_id));
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT jsonb_build_object(
    'tracking_id', s.tracking_id,
    'status', s.status,
    'pickup_location', s.pickup_location,
    'delivery_location', s.delivery_location,
    'shipment_date', s.created_at,
    'pickup_date', s.pickup_date,
    'expected_delivery_date', s.expected_delivery_date,
    'delivered_at', s.delivered_at,
    'events', COALESCE((SELECT jsonb_agg(jsonb_build_object('status', e.status, 'location', e.location, 'description', e.description, 'created_at', e.created_at) ORDER BY e.created_at)
      FROM public.tracking_events e WHERE e.shipment_id = s.id), '[]'::jsonb)
  ) INTO res;
  RETURN res;
END; $$;
GRANT EXECUTE ON FUNCTION public.track_parcel(TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.notify_admins(_title TEXT, _body TEXT, _link TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, link)
  SELECT ur.user_id, _title, _body, _link FROM public.user_roles ur WHERE ur.role = 'admin';
END; $$;
REVOKE ALL ON FUNCTION public.notify_admins(TEXT,TEXT,TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.notify_admins(TEXT,TEXT,TEXT) TO authenticated;
