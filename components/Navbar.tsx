interface IProps {
  sectionName: string;
}
const Navbar = ({ sectionName }: IProps) => {
  return (
    <section className="border shadow-md p-5 rounded font-semibold mb-4">
      {sectionName}
    </section>
  );
};

export default Navbar;
