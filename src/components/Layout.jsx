import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      {path !== "/" ? null : <Header />}
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Layout;
