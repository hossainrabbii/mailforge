"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Globe },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Out Reach", href: "/dashboard/out-reach", icon: Send },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2 text-lg font-semibold">MailForge</div>
          <SidebarMenu>
            {navItems.map((item) => {
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
      </SidebarContent>
    </Sidebar>
  );
}
