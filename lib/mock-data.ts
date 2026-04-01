import type { Website, Template } from "@/types";

export const mockWebsites: Website[] = [
  { _id: "1", name: "Acme Corp", currentUrl: "https://acme.com", remakeUrl: "https://new-acme.com", mailId: "info@acme.com", associateMail: "john@acme.com", phone: "+1234567890", country: "USA", city: "New York", mailStatus: "pending" },
  { _id: "2", name: "TechStart", currentUrl: "https://techstart.io", remakeUrl: "https://new-techstart.io", mailId: "hello@techstart.io", associateMail: "sara@techstart.io", country: "UK", city: "London", mailStatus: "sent" },
  { _id: "3", name: "DesignHub", currentUrl: "https://designhub.co", mailId: "contact@designhub.co", associateMail: "mike@designhub.co", country: "Germany", city: "Berlin", mailStatus: "processing" },
  { _id: "4", name: "CloudNine", currentUrl: "https://cloudnine.dev", remakeUrl: "https://new-cloudnine.dev", mailId: "team@cloudnine.dev", associateMail: "alex@cloudnine.dev", mailStatus: "failed" },
  { _id: "5", name: "GreenLeaf", currentUrl: "https://greenleaf.org", mailId: "info@greenleaf.org", associateMail: "emma@greenleaf.org", country: "Canada", city: "Toronto", mailStatus: "pending" },
];

export const mockTemplates: Template[] = [
  { _id: "1", name: "Website Redesign Pitch", subject: "Transform Your Website – {{name}}", bodyHtml: "<p>Hi {{name}},</p><p>I noticed your current website at <strong>{{currentUrl}}</strong> could benefit from a modern redesign.</p><p>{{remakeSection}}</p><p>Would you be open to a quick chat?</p><p>Best regards</p>", active: true },
  { _id: "2", name: "Follow-up Template", subject: "Quick follow-up – {{name}}", bodyHtml: "<p>Hi {{name}},</p><p>I wanted to follow up on my previous email about redesigning <strong>{{currentUrl}}</strong>.</p><p>Let me know if you're interested!</p>", active: true },
  { _id: "3", name: "SEO Audit Offer", subject: "Free SEO Audit for {{name}}", bodyHtml: "<p>Hi {{name}},</p><p>We've run a preliminary SEO analysis on {{currentUrl}} and found some opportunities for improvement.</p><p>Would you like to see the full report?</p>", active: false },
];
