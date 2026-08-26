import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type CreateDriverInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  address: string;
  status: string;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const createDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CreateDriverInput) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name, phone: data.phone, role: "driver" },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Could not create driver");
    const uid = created.user.id;

    await supabaseAdmin
      .from("profiles")
      .upsert({ id: uid, name: data.name, email: data.email, phone: data.phone, status: data.status });
    await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role: "driver" });
    const { error: dErr } = await supabaseAdmin.from("drivers").upsert({
      user_id: uid,
      license_number: data.licenseNumber,
      vehicle_type: data.vehicleType,
      vehicle_number: data.vehicleNumber,
      address: data.address,
      status: data.status,
    });
    if (dErr) throw new Error(dErr.message);
    return { ok: true, userId: uid };
  });

export const resetDriverPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; password: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteDriver = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * One-time demo bootstrap. Only runs while the system has no admin yet, so it
 * cannot be used to escalate privileges on a live deployment.
 */
export const seedDemoData = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if ((count ?? 0) > 0) return { ok: true, created: false };

  const make = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: "admin" | "driver" | "customer",
  ) => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone, role },
    });
    if (error || !data.user) throw new Error(error?.message ?? "seed failed");
    const uid = data.user.id;
    await supabaseAdmin.from("profiles").upsert({ id: uid, name, email, phone, status: "active" });
    await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role });
    return uid;
  };

  const adminId = await make("admin@swiftparcel.app", "Admin@12345", "Aarav Mehta", "+91 90000 11111", "admin");
  const driverId = await make("driver@swiftparcel.app", "Driver@12345", "Ravi Kumar", "+91 90000 22222", "driver");
  const driver2Id = await make("driver2@swiftparcel.app", "Driver@12345", "Suresh Nair", "+91 90000 33333", "driver");
  const customerId = await make(
    "customer@swiftparcel.app",
    "Customer@12345",
    "Priya Sharma",
    "+91 90000 44444",
    "customer",
  );

  await supabaseAdmin.from("drivers").upsert([
    {
      user_id: driverId,
      license_number: "KA0520190001",
      vehicle_type: "Van",
      vehicle_number: "KA 05 MJ 1234",
      address: "MG Road, Bangalore",
      status: "active",
    },
    {
      user_id: driver2Id,
      license_number: "KA0520190002",
      vehicle_type: "Bike",
      vehicle_number: "KA 03 HD 8899",
      address: "Jayanagar, Bangalore",
      status: "active",
    },
  ]);
  await supabaseAdmin.from("customers").upsert({
    user_id: customerId,
    address: "12 Residency Road",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "560025",
  });

  const base = {
    customer_id: customerId,
    sender_name: "Priya Sharma",
    sender_phone: "+91 90000 44444",
    sender_email: "customer@swiftparcel.app",
    sender_address: "12 Residency Road",
    sender_city: "Bangalore",
    sender_state: "Karnataka",
    sender_postal_code: "560025",
    parcel_type: "Documents",
    weight: 1.2,
    quantity: 1,
    package_size: "Small",
    fragile: false,
    estimated_value: 1500,
    pickup_location: "Bangalore",
  };

  const rows = [
    {
      ...base,
      tracking_id: "TRK-2026-8F4K92",
      receiver_name: "Anil Rao",
      receiver_phone: "+91 90000 55555",
      receiver_email: "anil@example.com",
      receiver_address: "45 Sayaji Road",
      receiver_city: "Mysore",
      receiver_state: "Karnataka",
      receiver_postal_code: "570001",
      description: "Legal documents",
      delivery_location: "Mysore",
      status: "In Transit" as const,
      driver_id: driverId,
      pickup_date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      expected_delivery_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      picked_up_at: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      ...base,
      tracking_id: "TRK-2026-2A7Q10",
      receiver_name: "Meera Iyer",
      receiver_phone: "+91 90000 66666",
      receiver_email: "meera@example.com",
      receiver_address: "8 Anna Salai",
      receiver_city: "Chennai",
      receiver_state: "Tamil Nadu",
      receiver_postal_code: "600002",
      description: "Electronics accessory",
      parcel_type: "Electronics",
      fragile: true,
      delivery_location: "Chennai",
      status: "Pending" as const,
      pickup_date: new Date().toISOString().slice(0, 10),
      expected_delivery_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    },
    {
      ...base,
      tracking_id: "TRK-2026-5D3W77",
      receiver_name: "Karthik Nair",
      receiver_phone: "+91 90000 77777",
      receiver_email: "karthik@example.com",
      receiver_address: "22 Marine Drive",
      receiver_city: "Kochi",
      receiver_state: "Kerala",
      receiver_postal_code: "682031",
      description: "Gift box",
      parcel_type: "Parcel",
      delivery_location: "Kochi",
      status: "Delivered" as const,
      driver_id: driver2Id,
      pickup_date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
      expected_delivery_date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
      picked_up_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      delivered_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const { data: shipments } = await supabaseAdmin.from("shipments").insert(rows).select("id,tracking_id,status");

  const events: {
    shipment_id: string;
    status: string;
    location: string;
    description: string;
    updated_by: string;
    created_at: string;
  }[] = [];
  for (const s of shipments ?? []) {
    const flow =
      s.status === "Delivered"
        ? ["Pending", "Assigned", "Accepted", "Picked Up", "In Transit", "Out for Delivery", "Delivered"]
        : s.status === "In Transit"
          ? ["Pending", "Assigned", "Accepted", "Picked Up", "In Transit"]
          : ["Pending"];
    flow.forEach((status, i) => {
      events.push({
        shipment_id: s.id,
        status,
        location: "Bangalore",
        description: `${status} — demo event`,
        updated_by: i === 0 ? "Priya Sharma" : i === 1 ? "Aarav Mehta" : "Ravi Kumar",
        created_at: new Date(Date.now() - (flow.length - i) * 7200000).toISOString(),
      });
    });
  }
  if (events.length) await supabaseAdmin.from("tracking_events").insert(events as never);

  await supabaseAdmin.from("notifications").insert([
    { user_id: adminId, title: "Demo data loaded", body: "Sample shipments, drivers and a customer are ready." },
    { user_id: customerId, title: "Welcome to SwiftParcel", body: "Your demo shipments are ready to track." },
    { user_id: driverId, title: "New parcel assigned", body: "TRK-2026-8F4K92 is assigned to you." },
  ]);

  return { ok: true, created: true };
});
