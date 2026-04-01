import MainContainer from "@/components/container";
import Navbar from "@/components/Navbar";
import WebsitesPage from "@/components/Website";
import { getAllWebsites } from "@/services/websites";
const page = async () => {
  const { data } = await getAllWebsites();
  return (
    <>
      <Navbar sectionName="Website" />
      <WebsitesPage website={data} />
    </>
  );
};

export default page;
