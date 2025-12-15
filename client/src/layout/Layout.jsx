import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidepanel from "../components/sidepanel/Sidepanel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import { userApi } from "../../api/api";

export default function Layout() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  // 🔐 Restore user from JWT cookie
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await userApi.get("/me", {
          withCredentials: true,
        });
        dispatch(loginSuccess(res.data.user));
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Checking session...
      </div>
    );
  }

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
