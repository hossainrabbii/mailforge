import { ReactNode } from "react";

const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto min-h-screen px-4 lg:px-0">
      {children}
    </div>
  );
};

export default MainContainer;
