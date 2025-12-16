import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidepanel from "../components/sidepanel/Sidepanel";
import { useSelector } from "react-redux";

export default function Layout() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <Header />

      <div className="flex flex-col mt-6 md:flex-row min-h-[calc(100vh-140px)] w-full bg-gray-100">
        {isAuthenticated && (
          <aside className="mt-9 pt-3 w-full md:w-[230px]">
            <Sidepanel role={user?.role} />
          </aside>
        )}

        <main className="flex-1 p-8 bg-white rounded-lg m-6 shadow-md">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
