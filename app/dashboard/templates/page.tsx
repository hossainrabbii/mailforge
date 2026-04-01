import MainContainer from "@/components/container";
import Navbar from "@/components/Navbar";
import TemplatesPage from "@/components/Template";
import { getAllTemplates } from "@/services/templates";
const page = async () => {
  const { data } = await getAllTemplates();

  return (
    <>
      <Navbar sectionName="Templates" />
      <TemplatesPage template={data} />
    </>
  );
};

export default page;
