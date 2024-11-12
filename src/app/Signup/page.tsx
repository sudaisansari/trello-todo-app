"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Image from "next/image";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Logo from "@/components/assets/trelloo.png";


const SignUp: React.FC = () => {
  const { user, googleSignIn, emailSignUp } = useUserAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // const userSignUp = () => toast("Signed Up Successfully");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailSignUp = async () => {
    setError(""); // Clear previous error
    try {
      await emailSignUp(email, password);
      router.push("/");
    } catch (error: unknown) { // Use unknown type here
      // Check if error is a FirebaseError or cast it to a known type
      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          setError("This email is already signed up.");
        } else {
          setError("Invalid email or password.");
        }
      } else {
        console.error("Sign up error:", error); // Log unexpected error
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // and this
      try {
        await handleEmailSignUp();
        router.push("/");
      } catch (error) {
        setError("Invalid email or password.");
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (user) {
      // userSignUp()
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#232526] to-[#414345]">
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
      <div className="mb-[50px] flex items-center justify-center gap-x-2">
        <Image src={Logo} alt='Trello' width={40} height={40} />
        <h1 className="font-[700] text-[34px] md:text-[40px] text-white md:leading-[1.66666666667vw]">
          Trello
        </h1>
      </div>
      <div className="bg-[#101204] p-10 rounded-lg shadow-xl w-72 md:w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
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
          onClick={handleEmailSignUp}
          className="w-full p-3 mb-4 rounded bg-[#2F83CD] text-white hover:translate-y-[1px] transition-transform"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-[#2F83CD] text-white hover:translate-y-[1px] transition-transform rounded"
        >
          <FcGoogle />
          Continue with Google
        </button>
        <div className="w-full p-3 rounded text-white">
          Already have an account?{" "}
          <Link href="/SignIn" className="text-[#2F83CD]">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
