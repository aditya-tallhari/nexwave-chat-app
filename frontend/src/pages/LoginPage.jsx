import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareDot } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const updateField = (field, value) => {
    setLoginData({ ...loginData, [field]: value });
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
          className="w-full lg:w-1/2 max-w-md"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-[#1f2937] rounded-md">
                <MessageSquareDot className="size-6 text-white" />
              </div>
              <span className="text-2xl font-semibold">NexWave</span>
            </div>
            <h1 className="text-lg font-medium">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-300 rounded-md p-3 mb-5 text-sm">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="bg-[#1f2937] rounded-xl p-6 shadow-md">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-11 px-4 rounded-md bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition duration-200"
                  value={loginData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 rounded-md bg-[#111827] text-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition duration-200"
                  value={loginData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right - Image and Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <img
            src="/sign3.png"
            alt="Sign in"
            className="w-full h-auto rounded-lg object-contain"
          />
          <div className="mt-5 text-center">
            <h3 className="text-lg font-semibold">Connect with learners worldwide</h3>
            <p className="text-sm text-gray-400 mt-1">
              Meet and message with language exchange partners.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
