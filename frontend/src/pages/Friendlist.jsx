import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router-dom";
import { UserPlusIcon } from "lucide-react";
import NoFriendsFound from "../components/NoFriendFound";

const FriendList = () => {
  const { data: friends = [], isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-lg">
          <p className="text-lg font-semibold text-red-400">Failed to load friends. Please try again.</p>
          <button
            className="mt-4 btn btn-sm rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-8">Your Friends</h1>

        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="avatar w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-700">
                    <img
                      src={friend.profilePic}
                      alt={`${friend.fullName}'s profile`}
                      className="object-cover w-full h-full"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-md text-gray-100 truncate" title={friend.fullName}>
                      {friend.fullName}
                    </h3>
                    {friend.location && (
                      <p className="text-sm text-gray-400 mt-1 truncate">{friend.location}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="badge bg-indigo-900/50 text-indigo-200 px-2.5 py-1 rounded-full">
                    Native: {friend.nativeLanguage}
                  </span>
                  <span className="badge bg-teal-900/50 text-teal-200 px-2.5 py-1 rounded-full">
                    Learning: {friend.learningLanguage}
                  </span>
                </div>
                <Link
                  to={`/chat/${friend._id}`}
                  className="btn mt-5 w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all duration-200"
                >
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Chat
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;