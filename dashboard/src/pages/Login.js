import React from "react";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "./firebase"; // your Firebase config
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const email = result.user.email;

      const res = await fetch("http://localhost:5001/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { apiKey } = await res.json();
      localStorage.setItem("dev_id", email);
      localStorage.setItem("api_key", apiKey);
      navigate("/account");
    } catch (err) {
      console.error("❌ Google login failed", err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GithubAuthProvider());
      const email = result.user.email;

      const res = await fetch("http://localhost:5001/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { apiKey } = await res.json();
      localStorage.setItem("dev_id", email);
      localStorage.setItem("api_key", apiKey);
      navigate("/account");
    } catch (err) {
      console.error("❌ GitHub login failed", err);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#1e293b]"> {/* ✅ Your Dexora Blue */}
      <div className="w-full max-w-md bg-[#0e0e0e]/60 text-white rounded-xl p-8 shadow-2xl border border-gray-800 backdrop-blur-md transition-transform transform hover:scale-[1.01] duration-300">

        {/* Animated Logo */}
        <video
          className="mx-auto h-12 mb-6 rounded-full border border-gray-600 shadow-md"
          src="/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <h1 className="text-3xl font-semibold text-center mb-2">Daily Dexora</h1>
        <p className="text-center text-gray-400 mb-8 text-sm">Gasless infra built on Daily Network</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition text-white font-semibold shadow-lg hover:shadow-indigo-400/40"
        >
          Continue with Google
        </button>

        <button
          onClick={handleGithubLogin}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition text-white font-semibold shadow-lg hover:shadow-white/20"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;