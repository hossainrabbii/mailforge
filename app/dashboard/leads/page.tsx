export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import WebsitesPage from "@/components/Website";
import { getAllWebsites } from "@/services/leads";
const page = async () => {
  const response = await getAllWebsites();
  // console.log(response);
  if (!response.success) {
    return (
      <>
        <Navbar sectionName="Leads" />
        <WebsitesPage website={[]} error={response.message} />
      </>
    );
  }

  return (
    <>
      <Navbar sectionName="Leads" />
      <WebsitesPage website={response.data} error={null} />
    </>
  );
};

export default page;
