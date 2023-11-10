import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";
import Searchbar from "./Searchbar/Searchbar";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {path !== "/" ? null : <Header />}
      <Sidebar />
      <Searchbar />
      <Outlet />
    </>
  );
};

export default Layout;
