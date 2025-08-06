import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  MessageSquareDot,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async (data) => {
      toast.success("Profile onboarded successfully");

      const updatedUser = {
        ...authUser,
        ...formState,
        isOnboarded: true,
      };

      if (data.user?.isOnBorded) {
        updatedUser.isOnboarded = true;
      }

      queryClient.setQueryData(["authUser"], updatedUser);

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/", { replace: true });
      }, 500);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-[#1f2937] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Complete Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="size-28 rounded-full overflow-hidden bg-[#111827] border border-gray-700">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="size-10 text-gray-500" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-sm btn-accent"
            >
              <ShuffleIcon className="size-4 mr-2" />
              Random Avatar
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              className="w-full h-10 px-4 rounded-md bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Bio</label>
            <textarea
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="w-full h-24 px-4 py-2 rounded-md bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Share your learning goals..."
            />
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Native Language</label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="select select-bordered w-full bg-[#111827] text-white border-gray-600"
                required
              >
                <option value="">Select native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Learning Language</label>
              <select
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className="select select-bordered w-full bg-[#111827] text-white border-gray-600"
                required
              >
                <option value="">Select learning language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-500" />
              <input
                type="text"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="w-full h-10 pl-10 pr-4 rounded-md bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <LoaderIcon className="animate-spin size-5" />
                Onboarding...
              </>
            ) : (
              <>
                <MessageSquareDot className="size-5" />
                Complete Onboarding
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
