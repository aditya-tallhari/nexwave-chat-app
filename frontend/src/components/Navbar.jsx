import { Link, useLocation } from "react-router-dom";
import { BellIcon, LogOutIcon, MessageSquareDot } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const { pathname } = useLocation();

  const isChatPage = pathname?.startsWith("/chat");

  return (
    <nav className="sticky top-0 z-50 h-16 bg-gray-900 border-b border-gray-800 flex items-center shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {isChatPage ? (
          <Link
            to="/"
            className="flex items-center gap-3 pl-2 transition-all duration-200 hover:opacity-90"
          >
            <MessageSquareDot className="size-9 text-indigo-400" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 tracking-wider">
              NexWave
            </span>
          </Link>
        ) : (
          <div className="w-32" /> // Maintains consistent spacing
        )}

        <div className="flex items-center gap-4">
          <Link to="/notifications">
            <button
              className="btn btn-ghost btn-circle hover:bg-gray-800 transition-all duration-200"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6 text-gray-300 hover:text-indigo-400" />
            </button>
          </Link>

          {/* Uncomment to enable ThemeSelector */}
          {/* <ThemeSelector /> */}

          <div className="avatar">
            <div className="w-9 rounded-full ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900 transition-all duration-200 hover:ring-indigo-300">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                className="object-cover"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
            </div>
          </div>

          <button
            className="btn btn-ghost btn-circle hover:bg-gray-800 transition-all duration-200"
            onClick={logoutMutation}
            aria-label="Logout"
          >
            <LogOutIcon className="h-6 w-6 text-gray-300 hover:text-red-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
