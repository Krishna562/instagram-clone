import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";
import Searchbar from "./Searchbar/Searchbar";
import NotificationBar from "./Notifications/NotificationBar";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {path !== "/" ? null : <Header />}
      <Sidebar />
      <Searchbar />
      <NotificationBar />
      <Outlet />
    </>
  );
};

export default Layout;
