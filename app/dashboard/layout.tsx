import AppSidebar from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { fetchWithRefresh } from "@/lib/fetchWithRefresh";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // // check if user is logged in
  // const response = await fetchWithRefresh("/auth/me");

  // // not logged in → redirect to login
  // if (!response?.success) {
  //   redirect("/");
  // }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="p-4">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
