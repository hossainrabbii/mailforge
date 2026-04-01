import { Badge } from "./ui/badge";

type Status = "pending" | "processing" | "sent" | "failed";

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={map[status]}>
      {status}
    </Badge>
  );
}
