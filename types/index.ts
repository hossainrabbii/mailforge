export type MailStatus = "pending" | "processing" | "sent" | "failed";

export interface Website {
  _id: string;
  name?: string;
  currentUrl: string;
  remakeUrl?: string;
  mailId: string;
  associateMail: string;
  phone?: string;
  country?: string;
  city?: string;
  mailStatus: MailStatus;
}

export interface Template {
  _id?: string;
  name: string;
  subject: string;
  bodyHtml: string;
  active: boolean;
}

export interface SendMailPayload {
  websiteIds: string[];
  templateId: string;
}

export interface DashboardStats {
  totalWebsites: number;
  emailsSent: number;
  pending: number;
  failed: number;
}
