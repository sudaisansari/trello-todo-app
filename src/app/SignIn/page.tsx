"use client";
import { useUserAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Logo from "@/assets/trelloo.png";
import Image from "next/image";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseError } from "firebase/app";

const SignIn: React.FC = () => {
  const {  googleSignIn, emailSignIn } = useUserAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailSignIn = async () => {
    setIsLoading(true);
    try {
      await emailSignIn(email, password);
      toast.success("Signed in successfully!");
      router.push("/");
    } catch (error: unknown) {
      // Show Firebase error in toast
      if (error instanceof FirebaseError) {
        toast.error(error.message || "Invalid email or password.");
        console.error(error);
      }      
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailSignIn();
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success("Signed in with Google successfully!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        toast.error(error.message || "Failed to sign in with Google.");
        console.error(error);
      }
      //toast.error(error.message || "Failed to sign in with Google.");
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#ff00cc] to-[#3181CD]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-[50px] flex items-center justify-center gap-x-2">
        <Image src={Logo} alt="Trello" width={40} height={40} />
        <h1 className="font-[700] text-[34px] md:text-[40px] text-white md:leading-[1.66666666667vw]">
          Trello
        </h1>
      </div>
      <div className="bg-[#9E89DC] p-10 rounded-lg shadow-xl mx-[10px] min-w-72 max-w-96 md:w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onKeyDown={handleKeyDown}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onKeyDown={handleKeyDown}
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
          className="w-full p-3 mb-4 rounded bg-[#2F83CD] text-white hover:translate-y-[1px] transition-transform"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center">
              <TailSpin height="20" width="20" color="white" />
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-[#2F83CD] text-white hover:translate-y-[1px] transition-transform rounded"
        >
          <FcGoogle />
          Continue with Google
        </button>

        <div className="w-full p-3 rounded text-white">
          Don&apos;t have an account?{" "}
          <Link href="/Signup" className="text-[#2F83CD]">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
