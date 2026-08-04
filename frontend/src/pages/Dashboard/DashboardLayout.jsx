import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { userQuery } from "./loader";
import { DashboardContext } from "../../context/DashboardContext";

const DashboardLayout = ({ queryClient }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useQuery(userQuery).data;
  // const { user } = data;

  const logoutUser = async () => {
    try {
      await customFetch.post("/auth/logout");
      queryClient.invalidateQueries();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Logout failed");
    }
  };

  // Helper for user initials avatar
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardContext.Provider value={{ user, logoutUser }}>
      <div className="min-h-screen bg-background text-text-body flex flex-col md:flex-row">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-surface-container border-r border-border h-screen sticky top-0 justify-between p-4 z-20">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-on-primary shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </div>
              <span className="font-page-title text-xl text-on-surface tracking-tight">
                TaskFlow
              </span>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-button text-sm transition-all relative ${
                    isActive
                      ? "bg-surface-bright text-primary font-semibold border-l-4 border-primary pl-2"
                      : "text-text-muted hover:text-on-surface hover:bg-surface-dim"
                  }`
                }
              >
                <span className="material-symbols-outlined text-xl">
                  folder
                </span>
                Projects
              </NavLink>

              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-button text-sm transition-all relative ${
                    isActive
                      ? "bg-surface-bright text-primary font-semibold border-l-4 border-primary pl-2"
                      : "text-text-muted hover:text-on-surface hover:bg-surface-dim"
                  }`
                }
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                Profile
              </NavLink>
            </nav>
          </div>

          {/* User Info & Logout Footer */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-semibold text-sm shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <p className="font-body text-sm font-medium text-on-surface truncate">
                  {user?.name || "User"}
                </p>
                <span
                  className={`inline-block font-label-caps text-[10px] px-2 py-0.5 rounded-full ${
                    user?.role === "ADMIN"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-surface-bright text-text-muted border border-border"
                  }`}
                >
                  {user?.role || "MEMBER"}
                </span>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border text-text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/10 transition-colors font-button text-xs"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              Logout
            </button>
          </div>
        </aside>

        {/* ================= MOBILE TOP BAR ================= */}
        <header className="md:hidden flex items-center justify-between p-4 bg-surface-container border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center font-bold text-on-primary">
              <span className="material-symbols-outlined text-lg">bolt</span>
            </div>
            <span className="font-page-title text-lg text-on-surface">
              TaskFlow
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-on-surface hover:bg-surface-bright rounded-lg flex items-center justify-center"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface-container border-b border-border p-4 space-y-3 z-20">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logoutUser();
              }}
              className="w-full flex items-center gap-2 py-2 text-danger text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        )}

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 p-4 md:p-8 mb-16 md:mb-0 max-w-full overflow-x-hidden">
          <Outlet context={{ user, logoutUser }} />
        </main>

        {/* ================= MOBILE BOTTOM TAB BAR ================= */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container border-t border-border flex justify-around p-2 z-30">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-4 text-xs font-medium rounded-lg ${
                isActive ? "text-primary" : "text-text-muted"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">folder</span>
            Projects
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-4 text-xs font-medium rounded-lg ${
                isActive ? "text-primary" : "text-text-muted"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">person</span>
            Profile
          </NavLink>
        </nav>
      </div>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
