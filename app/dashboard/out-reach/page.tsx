export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import SendMailPage from "@/components/SendMail";
import { getAllTemplates } from "@/services/templates";
import { getAllWebsites } from "@/services/websites";
const page = async () => {
  const websites = await getAllWebsites();
  const templates = await getAllTemplates();
  if (!websites.success && !templates?.success) {
    return (
      <>
        <Navbar sectionName="Send Mail" />
        <SendMailPage template={[]} website={[]} error="Something went wrong" />
      </>
    );
  }

  if (!websites.success && templates?.success) {
    return (
      <>
        <Navbar sectionName="Send Mail" />
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
        <Navbar sectionName="Send Mail" />

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
      <Navbar sectionName="Send Mail" />
      <SendMailPage
        website={websites?.data}
        template={templates?.data}
        error={null}
      />
    </>
  );
};

export default page;
