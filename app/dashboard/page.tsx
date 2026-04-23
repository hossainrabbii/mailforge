export const dynamic = "force-dynamic";
import { Globe, Send, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllLeads } from "@/services/leads";
import Navbar from "@/components/Navbar";
import { EmailCalendar } from "@/components/EmailCalendar";

const Dashboard = async () => {
  const response = await getAllLeads();

  const data = response?.data ?? [];

  const stats = [
    {
      label: "Total Leads",
      value: data.length,
      icon: Globe,
      color: "text-primary",
    },
    {
      label: "Emails Sent",
      value: data.filter((w: any) => w.mailStatus === "sent").length,
      icon: Send,
      color: "text-success",
    },
    {
      label: "Pending",
      value: data.filter((w: any) => w.mailStatus === "pending").length,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Failed",
      value: data.filter((w: any) => w.mailStatus === "failed").length,
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <Navbar sectionName="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmailCalendar website={data} />
    </div>
  );
};

export default Dashboard;
