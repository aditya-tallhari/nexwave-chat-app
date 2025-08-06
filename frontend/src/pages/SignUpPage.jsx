import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareDot } from "lucide-react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  const updateField = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10"
      >
        {/* Left - Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Branding */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className="p-2 bg-[#1f2937] rounded-md">
                <MessageSquareDot className="size-6 text-white" />
              </div>
              <span className="text-2xl font-semibold">NexWave</span>
            </div>
            <h1 className="text-lg font-medium">Create your account</h1>
            <p className="text-sm text-gray-400">Join us and start your journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 text-red-300 rounded-md p-3 mb-5 text-sm">
              {error.response?.data?.message || "Something went wrong"}
            </div>
          )}

          {/* Sign Up Form */}
          <div className="bg-[#1f2937] rounded-xl p-6 shadow-md">
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full h-11 px-4 rounded-md bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition duration-200"
                  value={signupData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full h-11 px-4 rounded-md bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition duration-200"
                  value={signupData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full h-11 px-4 rounded-md bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition duration-200"
                  value={signupData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-start gap-x-3 text-sm">
                <input type="checkbox" className="checkbox checkbox-sm mt-1" required />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">Terms</span> and{" "}
                  <span className="text-primary hover:underline">Privacy Policy</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Redirect to login */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right - Image and Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <img
            src="/sign3.png"
            alt="Sign up illustration"
            className="w-full h-auto rounded-lg object-contain"
          />
          <div className="mt-5 text-center">
            <h3 className="text-lg font-semibold">Learn with global peers</h3>
            <p className="text-sm text-gray-400 mt-1">
              Start your language journey with a friendly, collaborative community.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
