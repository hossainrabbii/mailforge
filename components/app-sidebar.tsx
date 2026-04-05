"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Send,
  Users,
  Settings,
  BarChart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { logout } from "@/services/auth";
import { toast } from "sonner";
const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["user", "admin"],
  },
  {
    name: "Leads",
    href: "/dashboard/leads",
    icon: Globe,
    roles: ["admin", "user"],
  },
  {
    name: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
    roles: ["admin", "user"],
  },
  {
    name: "Out Reach",
    href: "/dashboard/out-reach",
    icon: Send,
    roles: ["admin", "user"],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart,
    roles: ["admin"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin"],
  },
  {
    name: "Admin Panel",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["admin"],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // NEW: read role from localStorage
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        setRole(null);
      }
    }
  }, []);
  const filteredNavItems = navItems.filter(
    (item) => role && item.roles.includes(role),
  );

  const handleLogout = async () => {
    const res = await logout();
    if (!res?.success) {
      toast.warning("Something went wrong.");
      return;
    }
    toast.success("Logout successfully.");
    setTimeout(() => {
      router.push("/");
    }, 100);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2 text-lg font-semibold">MailForge</div>
          <SidebarMenu>
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3",
                        isActive && "bg-muted font-medium",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter>
          {role && (
            <div className="px-3 py-1 mb-2">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  role === "admin"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700",
                )}
              >
                {role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
