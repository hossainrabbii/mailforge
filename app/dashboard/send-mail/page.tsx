import MainContainer from "@/components/container";
import Navbar from "@/components/Navbar";
import SendMailPage from "@/components/SendMail";
import { getAllTemplates } from "@/services/templates";
import { getAllWebsites } from "@/services/websites";
const page = async () => {
  const { data } = await getAllWebsites();
  const templates = await getAllTemplates();

  return (
    <>
      <Navbar sectionName="Send Mail" />
      <SendMailPage website={data} template={templates?.data} />
    </>
  );
};

export default page;
