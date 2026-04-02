import MainContainer from "@/components/container";
import Navbar from "@/components/Navbar";
import TemplatesPage from "@/components/Template";
import { getAllTemplates } from "@/services/templates";
const page = async () => {
  const templates = await getAllTemplates();
  if (!templates.success) {
    return (
      <>
        <Navbar sectionName="Templates" />
        <TemplatesPage template={[]} error={templates.message} />;
      </>
    );
  }
  return (
    <>
      <Navbar sectionName="Templates" />
      <TemplatesPage template={templates?.data} error={null} />
    </>
  );
};

export default page;
