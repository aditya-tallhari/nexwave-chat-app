import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, MessageSquareDot, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon className="size-5" /> },
    { path: "/friends", label: "Friends", icon: <UsersIcon className="size-5" /> },
    { path: "/notifications", label: "Notifications", icon: <BellIcon className="size-5" /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 shadow-lg hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <MessageSquareDot className="size-8 text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight text-indigo-400">NexWave</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPath === path
                ? "bg-indigo-600 text-white shadow-inner"
                : "hover:bg-gray-800 hover:text-indigo-300"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                className="object-cover"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{authUser?.fullName}</p>
            <p className="text-xs text-green-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-400 inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;