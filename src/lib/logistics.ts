import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type ShipmentStatus = Database["public"]["Enums"]["shipment_status"];
export type Shipment = Database["public"]["Tables"]["shipments"]["Row"];
export type TrackingEvent = Database["public"]["Tables"]["tracking_events"]["Row"];
export type DriverRow = Database["public"]["Tables"]["drivers"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export const STATUS_FLOW: ShipmentStatus[] = [
  "Pending",
  "Assigned",
  "Accepted",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export const ALL_STATUSES: ShipmentStatus[] = [...STATUS_FLOW, "Rejected", "Cancelled"];

/** The single valid next action for a driver, given the current status. */
export function driverNextStatus(status: ShipmentStatus): ShipmentStatus | null {
  const map: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
    Accepted: "Picked Up",
    "Picked Up": "In Transit",
    "In Transit": "Out for Delivery",
    "Out for Delivery": "Delivered",
  };
  return map[status] ?? null;
}

export function driverActionLabel(next: ShipmentStatus): string {
  switch (next) {
    case "Picked Up":
      return "Mark as Picked Up";
    case "In Transit":
      return "Start In Transit";
    case "Out for Delivery":
      return "Out for Delivery";
    case "Delivered":
      return "Mark Delivered";
    default:
      return next;
  }
}

export function statusTone(status: ShipmentStatus): "muted" | "info" | "warning" | "success" | "danger" {
  switch (status) {
    case "Pending":
      return "warning";
    case "Assigned":
    case "Accepted":
      return "info";
    case "Picked Up":
    case "In Transit":
    case "Out for Delivery":
      return "info";
    case "Delivered":
      return "success";
    case "Rejected":
    case "Cancelled":
      return "danger";
    default:
      return "muted";
  }
}

export function generateTrackingId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `TRK-${new Date().getFullYear()}-${code}`;
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function addTrackingEvent(args: {
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  updatedBy: string;
}) {
  await supabase.from("tracking_events").insert({
    shipment_id: args.shipmentId,
    status: args.status,
    location: args.location,
    description: args.description,
    updated_by: args.updatedBy,
  });
}

export async function notifyUser(userId: string, title: string, body: string, link?: string) {
  await supabase.from("notifications").insert({ user_id: userId, title, body, link: link ?? null });
}

export async function notifyAdmins(title: string, body: string, link?: string) {
  await supabase.rpc("notify_admins", { _title: title, _body: body, _link: link ?? "" });
}
