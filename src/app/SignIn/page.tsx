"use client";
import { useUserAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'

const SignIn: React.FC = () => {
  const { user, googleSignIn, emailSignIn } = useUserAuth(); // Use emailSignIn from AuthContext
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // const userSignIn = () => toast("Signed Up Successfully");


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailSignIn = async () => {
    try {
      setError(null);
      await emailSignIn(email, password);
      router.push("/");
    } catch (error) {
      setError("Invalid email or password.");
      console.error(error);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // and this
      try {
        setError(null);
        await emailSignIn(email, password);
        router.push("/");
      } catch (error) {
        setError("Invalid email or password.");
        console.error(error);
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      // userSignIn()
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8F3F65]">
      {/* <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
      <div className="mb-[50px]">
        <h1 className="font-[700] text-[30px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]">
          My Trello board
        </h1>
      </div>
      <div className="bg-[#101204] p-10 rounded-lg shadow-xl w-72 md:w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onKeyDown={((e) => (handleKeyDown(e)))}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onKeyDown={((e) => (handleKeyDown(e)))}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button
          onClick={handleEmailSignIn}
          className="w-full p-3 mb-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          <FcGoogle />
          Continue with Google
        </button>

        <div className="w-full p-3 rounded text-white">
          Don&apos;t have an account?{" "}
          <Link href="/Signup" className="text-indigo-500">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
