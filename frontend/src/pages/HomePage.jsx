import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  RefreshCwIcon,
  AlertCircleIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils.js";
import FriendCard, { getLanguageFlag } from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendFound.jsx";
import {
  getoutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api.js";

// UserCardSkeleton component
const UserCardSkeleton = () => (
  <div className="card bg-white dark:bg-gray-800 shadow-md p-6 animate-pulse rounded-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="avatar w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 flex gap-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-3 w-full"></div>
    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-full mt-5 w-full"></div>
  </div>
);

// ErrorMessage component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center rounded-xl shadow-sm">
    <AlertCircleIcon className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-3" />
    <h3 className="font-semibold text-md text-red-600 dark:text-red-300">Something Went Wrong</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn btn-outline btn-sm rounded-full text-red-600 dark:text-red-300 border-red-600 dark:border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
      >
        <RefreshCwIcon className="w-4 h-4 mr-2" />
        Try Again
      </button>
    )}
  </div>
);

// UserCard component
const UserCard = ({ user, onSendRequest, hasRequestBeenSent, isPending }) => (
  <div className="card bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-6 rounded-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="avatar w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
        <img
          src={user.profilePic}
          alt={`${user.fullName}'s profile`}
          className="object-cover w-full h-full"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-md text-gray-900 dark:text-white truncate" title={user.fullName}>
          {user.fullName}
        </h3>
        {user.location && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        )}
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 text-xs">
      <span className="badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 px-2.5 py-1 rounded-full">
        {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
      </span>
      <span className="badge bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 px-2.5 py-1 rounded-full">
        {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
      </span>
    </div>
    {user.bio && (
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2" title={user.bio}>
        {user.bio}
      </p>
    )}
    <button
      className={`btn mt-5 w-full rounded-full text-white font-medium text-sm transition-all duration-200 ${
        hasRequestBeenSent
          ? "bg-green-500 dark:bg-green-600 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      }`}
      onClick={() => onSendRequest(user._id)}
      disabled={hasRequestBeenSent || isPending}
      aria-label={hasRequestBeenSent ? "Friend request sent" : `Send friend request to ${user.fullName}`}
    >
      {isPending ? (
        <>
          <span className="loading loading-spinner loading-xs mr-2" />
          Sending...
        </>
      ) : hasRequestBeenSent ? (
        <>
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Request Sent
        </>
      ) : (
        <>
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add Friend
        </>
      )}
    </button>
  </div>
);

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Queries
  const {
    data: friends = [],
    isLoading: loadingFriends,
    error: friendsError,
    refetch: refetchFriends,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const {
    data: recommendedUsers = [],
    isLoading: loadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getoutgoingFriendReqs,
    staleTime: 30 * 1000,
  });

  // Mutation for sending friend requests
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId) => {
      setOutgoingRequestsIds((prev) => new Set([...prev, userId]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (error, userId) => {
      setOutgoingRequestsIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      console.error("Failed to send friend request:", error);
    },
  });

  // Update outgoing requests
  useEffect(() => {
    if (outgoingFriendReqs?.length) {
      const outgoingIds = new Set(outgoingFriendReqs.map((req) => req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Handlers
  const handleSendRequest = useCallback((userId) => {
    sendRequestMutation(userId);
  }, [sendRequestMutation]);

  const handleRetryFriends = useCallback(() => {
    refetchFriends();
  }, [refetchFriends]);

  const handleRetryUsers = useCallback(() => {
    refetchUsers();
  }, [refetchUsers]);

  const skeletonCount = useMemo(() => Math.min(recommendedUsers.length || 6, 12), [recommendedUsers.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Discover Language Partners
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with language learners worldwide to practice and immerse yourself in new cultures.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Friends List */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sticky top-12 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Friends</h2>
                <Link
                  to="/notifications"
                  className="btn btn-ghost btn-sm rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200"
                  aria-label="View friend requests"
                >
                  <UsersIcon className="w-5 h-5" />
                </Link>
              </div>
              {friendsError ? (
                <ErrorMessage message="Failed to load your friends" onRetry={handleRetryFriends} />
              ) : loadingFriends ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md text-indigo-600 dark:text-indigo-400" />
                </div>
              ) : friends.length === 0 ? (
                <NoFriendsFound />
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {friends.map((friend) => (
                    <FriendCard key={friend._id} friend={friend} compact />
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Recommended Users */}
          <main className="lg:col-span-3">
            {usersError ? (
              <ErrorMessage message="Failed to load recommended users" onRetry={handleRetryUsers} />
            ) : loadingUsers ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: skeletonCount }, (_, i) => (
                  <UserCardSkeleton key={i} />
                ))}
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-white dark:bg-gray-800 p-8 text-center rounded-xl shadow-lg">
                <UsersIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  No Recommendations Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  We're working on finding the perfect language partners for you.
                </p>
                <button
                  onClick={handleRetryUsers}
                  className="btn btn-sm rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all duration-200"
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onSendRequest={handleSendRequest}
                    hasRequestBeenSent={outgoingRequestsIds.has(user._id)}
                    isPending={isPending}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;