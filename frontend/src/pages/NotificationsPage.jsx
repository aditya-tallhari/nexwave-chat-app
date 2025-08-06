import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8 text-center">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-indigo-400" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <UserCheckIcon className="h-6 w-6 text-indigo-400" />
                  Friend Requests
                  <span className="badge bg-indigo-600 text-white ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="avatar w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-700">
                            <img
                              src={request.sender.profilePic}
                              alt={request.sender.fullName}
                              className="object-cover w-full h-full"
                              onError={(e) => (e.target.src = "/default-avatar.png")}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-md">{request.sender.fullName}</h3>
                            <div className="flex flex-wrap gap-2 mt-2 text-sm">
                              <span className="badge bg-indigo-900/50 text-indigo-200 px-2.5 py-1 rounded-full">
                                Native: {request.sender.nativeLanguage}
                              </span>
                              <span className="badge bg-teal-900/50 text-teal-200 px-2.5 py-1 rounded-full">
                                Learning: {request.sender.learningLanguage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn btn-sm rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200"
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <BellIcon className="h-6 w-6 text-green-400" />
                  New Connections
                </h2>

                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="avatar w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-700">
                          <img
                            src={notification.recipient.profilePic}
                            alt={notification.recipient.fullName}
                            className="object-cover w-full h-full"
                            onError={(e) => (e.target.src = "/default-avatar.png")}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-md">{notification.recipient.fullName}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.recipient.fullName} accepted your friend request
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                            <ClockIcon className="h-4 w-4" />
                            Recently
                          </p>
                        </div>
                        <div className="badge bg-green-500 text-white flex items-center gap-1.5">
                          <MessageSquareIcon className="h-4 w-4" />
                          New Friend
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;