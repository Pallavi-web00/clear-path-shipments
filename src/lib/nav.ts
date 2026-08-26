import {
  Bell,
  Calendar,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Navigation,
  Package,
  PackagePlus,
  PieChart,
  Search,
  Settings,
  Truck,
  User,
  Users,
} from "lucide-react";
import type { NavItem } from "@/components/AppShell";

export const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Shipments", to: "/admin/shipments", icon: Package },
  { label: "Drivers", to: "/admin/drivers", icon: Truck },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Assignments", to: "/admin/assignments", icon: ClipboardList },
  { label: "Tracking", to: "/admin/tracking", icon: Search },
  { label: "Reports", to: "/admin/reports", icon: PieChart },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const driverNav: NavItem[] = [
  { label: "Dashboard", to: "/driver/dashboard", icon: LayoutDashboard },
  { label: "My Shipments", to: "/driver/shipments", icon: Package },
  { label: "Pending Acceptance", to: "/driver/pending", icon: Bell },
  { label: "Accepted", to: "/driver/accepted", icon: CheckCircle2 },
  { label: "In Transit", to: "/driver/in-transit", icon: Navigation },
  { label: "Delivered", to: "/driver/delivered", icon: MapPin },
  { label: "Profile", to: "/driver/profile", icon: User },
];

export const customerNav: NavItem[] = [
  { label: "Dashboard", to: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Create Shipment", to: "/customer/create-shipment", icon: PackagePlus },
  { label: "My Shipments", to: "/customer/shipments", icon: Package },
  { label: "Track Parcel", to: "/customer/track", icon: Search },
  { label: "Profile", to: "/customer/profile", icon: Calendar },
];
