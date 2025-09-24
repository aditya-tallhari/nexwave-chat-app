import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or secret is missing.");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    if (!userData.id || !userData.name) {
      throw new Error("userData must include at least 'id' and 'name'");
    }

    console.log("📤 Creating Stream user:", userData);
    await streamClient.upsertUser(userData); // changed from upsertUsers([user]) to upsertUser(user)
    console.log("Stream user created:", userData.id);
    return userData;
  } catch (error) {
    console.error("Error in upserting Stream user:", error.response?.data || error.message);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error.message);
  }
};
