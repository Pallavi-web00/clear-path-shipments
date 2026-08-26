import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Shipment } from "@/lib/logistics";

export function useShipments(scope: { customerId?: string; driverId?: string } = {}) {
  return useQuery({
    queryKey: ["shipments", scope],
    queryFn: async () => {
      let q = supabase.from("shipments").select("*").order("created_at", { ascending: false });
      if (scope.customerId) q = q.eq("customer_id", scope.customerId);
      if (scope.driverId) q = q.eq("driver_id", scope.driverId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Shipment[];
    },
  });
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("shipments").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Shipment | null;
    },
    enabled: !!id,
  });
}

export function useTrackingEvents(shipmentId: string) {
  return useQuery({
    queryKey: ["events", shipmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!shipmentId,
  });
}

export type DriverWithProfile = {
  user_id: string;
  license_number: string | null;
  vehicle_type: string | null;
  vehicle_number: string | null;
  address: string | null;
  status: string;
  name: string;
  email: string;
  phone: string | null;
};

export function useDrivers() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async (): Promise<DriverWithProfile[]> => {
      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = (drivers ?? []).map((d) => d.user_id);
      const { data: profiles } = ids.length
        ? await supabase.from("profiles").select("id,name,email,phone").in("id", ids)
        : { data: [] };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return (drivers ?? []).map((d) => ({
        ...d,
        name: map.get(d.user_id)?.name ?? "Driver",
        email: map.get(d.user_id)?.email ?? "",
        phone: map.get(d.user_id)?.phone ?? "",
      }));
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "customer");
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const [{ data: profiles }, { data: rows }] = await Promise.all([
        supabase.from("profiles").select("*").in("id", ids),
        supabase.from("customers").select("*").in("user_id", ids),
      ]);
      const extra = new Map((rows ?? []).map((c) => [c.user_id, c]));
      return (profiles ?? []).map((p) => ({ ...p, details: extra.get(p.id) ?? null }));
    },
  });
}

/** Map of user id -> display name, for showing customer / driver names in tables. */
export function useProfileNames(ids: string[]) {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  return useQuery({
    queryKey: ["profile-names", unique.sort().join(",")],
    queryFn: async () => {
      if (!unique.length) return {} as Record<string, string>;
      const { data } = await supabase.from("profiles").select("id,name,email,phone").in("id", unique);
      const out: Record<string, string> = {};
      for (const p of data ?? []) out[p.id] = p.name || p.email;
      return out;
    },
    enabled: unique.length > 0,
  });
}

export function useAssignments(shipmentId?: string) {
  return useQuery({
    queryKey: ["assignments", shipmentId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("driver_assignments").select("*").order("assigned_at", { ascending: false });
      if (shipmentId) q = q.eq("shipment_id", shipmentId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}
