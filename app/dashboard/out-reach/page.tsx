export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import SendMailPage from "@/components/SendMail";
import { getAllLeads } from "@/services/leads";
import { getAllTemplates } from "@/services/templates";
const page = async () => {
  const websites = await getAllLeads();
  const templates = await getAllTemplates();
  if (!websites.success && !templates?.success) {
    return (
      <>
        <Navbar sectionName="Out Reach" />
        <SendMailPage template={[]} website={[]} error="Something went wrong" />
      </>
    );
  }

  if (!websites.success && templates?.success) {
    return (
      <>
        <Navbar sectionName="Out Reach" />
        <SendMailPage
          website={[]}
          template={templates?.data}
          error={websites?.message}
        />
      </>
    );
  }

  if (websites.success && !templates?.success) {
    return (
      <>
        <Navbar sectionName="Out Reach" />

        <SendMailPage
          website={websites?.data}
          template={[]}
          error={templates?.message}
        />
      </>
    );
  }

  return (
    <>
      <Navbar sectionName="Out Reach" />
      <SendMailPage
        website={websites?.data}
        template={templates?.data}
        error={null}
      />
    </>
  );
};

export default page;
