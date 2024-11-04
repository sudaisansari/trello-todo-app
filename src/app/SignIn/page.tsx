// "use client"
// import { useUserAuth } from '@/components/context/AuthContext';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect } from 'react'
// import { FcGoogle } from "react-icons/fc";

// const SignIn: React.FC = () => {
//   const { user, googleSignIn } = useUserAuth();
//   // const [loading, setLoading] = useState(true);
//   const router = useRouter()

//   const handleSignIn = async () => {
//     try {
//       await googleSignIn();
//       router.push('/')
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 50));
//       // setLoading(false);
//     };
//     checkAuthentication();
//   }, [user]);


//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#8F3F65] ">
//       <div className="mb-[50px]">
//         <h1 className='font-[700] text-[20px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]'>My Trello board</h1>
//       </div>
//       <div className="bg-[#101204] p-10 rounded-lg shadow-xl w-96">
//         <h1 className="text-white text-2xl mb-5">Sign In</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           // value={email}
//           // onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         {/* <input
//           type="password"
//           placeholder="Password"
//           // value={password}
//           // onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         /> */}
//         <button
//           // onClick={handleSignIn}
//           className="w-full p-3 mb-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
//         >
//           Sign In
//         </button>
//         <button
//           onClick={handleSignIn}
//           className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
//         >
//           <FcGoogle />
//           Continue with Google
//         </button>
//         <div className='w-full p-3 rounded text-white'>
//           Don&apos;t have an account?{" "}
//           <Link href="/Signup" className="text-indigo-500">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SignIn







"use client";
import { useUserAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const SignIn: React.FC = () => {
  const { user, googleSignIn, emailSignIn } = useUserAuth(); // Use emailSignIn from AuthContext
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8F3F65]">
      <div className="mb-[50px]">
        <h1 className="font-[700] text-[20px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]">
          My Trello Board
        </h1>
      </div>
      <div className="bg-[#101204] p-10 rounded-lg shadow-xl md:w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
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
