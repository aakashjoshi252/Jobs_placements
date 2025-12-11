import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidepanel from "../components/sidepanel/Sidepanel";
import { useSelector } from "react-redux";
// import "./Layout.css";

export default function Layout() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  return (
  <>
    <Header />
    <div className="flex flex-col mt-6 md:flex-row min-h-[calc(100vh-140px)]  w-full bg-gray-100">
      {isLoggedIn && (
        <aside className="position-fixed mt-9 pt-3 w-full md:w-[230px]  text-white  ">
          <Sidepanel role={user?.role} />
        </aside>
      )}

      <main className="flex-1 p-8 bg-white rounded-lg m-6 shadow-md md:m-6 md:rounded-lg">
        <Outlet />
      </main>
    </div>
    <Footer />
  </>
);
}

