import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="min-h-screen bg-blue-950 text-gray-100 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-[93vh] flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 bg-blue-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-200">Chat Info</h2>
          <div className="avatar flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full ring-2 ring-blue-700 ring-offset-2 ring-offset-blue-950">
              <img
                src={authUser?.profilePic}
                alt="Your Avatar"
                className="object-cover w-full h-full"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{authUser?.fullName}</h3>
              <p className="text-sm text-blue-400">You</p>
            </div>
          </div>
          <div className="avatar flex items-center gap-4">
            <div className="w-16 h-16 rounded-full ring-2 ring-blue-700 ring-offset-2 ring-offset-blue-950">
              <img
                src={channel?.state?.members[targetUserId]?.user?.image || "/default-avatar.png"}
                alt="Target User Avatar"
                className="object-cover w-full h-full"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{channel?.state?.members[targetUserId]?.user?.name || "Unknown"}</h3>
              <p className="text-sm text-blue-400">Partner</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <div className="w-full relative h-full">
                <CallButton handleVideoCall={handleVideoCall} />
                <Window className="bg-blue-800 rounded-xl shadow-lg h-full flex flex-col">
                  <ChannelHeader className="bg-blue-700 text-gray-100 p-4 rounded-t-xl flex items-center justify-between" />
                  <MessageList className="flex-1 p-4 overflow-y-auto" />
                  <MessageInput className="p-4 border-t border-blue-700" focus />
                </Window>
                <Thread className="bg-blue-800 rounded-xl shadow-lg mt-4 p-4 max-h-96 overflow-y-auto" />
              </div>
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;