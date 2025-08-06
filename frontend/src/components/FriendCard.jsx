import { Link } from "react-router-dom";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-gray-800 hover:shadow-lg transition-all duration-300 rounded-xl p-5 shadow-md">
      <div className="flex flex-col h-full">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-700">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="object-cover w-full h-full"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-100 truncate" title={friend.fullName}>
              {friend.fullName}
            </h3>
            {friend.location && (
              <p className="text-sm text-gray-400 mt-1 truncate">{friend.location}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5 text-sm">
          <span className="badge bg-indigo-900/50 text-indigo-200 px-2.5 py-1.5 rounded-full">
            {getLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
          </span>
          <span className="badge bg-teal-900/50 text-teal-200 px-2.5 py-1.5 rounded-full">
            {getLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn mt-auto w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all duration-200"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-4 mr-1.5 inline-block align-middle"
      />
    );
  }
  return null;
}

export default FriendCard;