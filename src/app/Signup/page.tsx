// "use client"
// import React, { useEffect } from "react";
// import { useUserAuth } from "@/components/context/AuthContext"; // Ensure to use updated hook name
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import Link from "next/link";

// const SignUp: React.FC = () => {
//   const { user, googleSignIn } = useUserAuth();
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
//     };
//     checkAuthentication();
//   }, [user]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#8F3F65] ">
//       <div className="mb-[50px]">
//         <h1 className='font-[700] text-[20px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]'>My Trello board</h1>
//       </div>
//       <div className="bg-[#101204] p-10 rounded-lg shadow-xl w-96">
//         <h1 className="text-white text-2xl mb-5">Sign Up</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           // value={email}
//           // onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           // value={password}
//           // onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <button
//           // onClick={handleSignIn}
//           className="w-full p-3 mb-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
//         >
//           Sign Up
//         </button>
//         <button
//           onClick={handleSignIn}
//           className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
//         >
//           <FcGoogle />
//           Continue with Google
//         </button>
//         <div className='w-full p-3 rounded text-white'>
//           Already have an account?{" "}
//           <Link href="/SignIn" className="text-indigo-500">
//             Sign In
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp: React.FC = () => {
  const { user, googleSignIn, emailSignUp } = useUserAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
          setError("An error occurred check email. Please try again.");
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

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8F3F65]">
      <div className="mb-[50px]">
        <h1 className="font-[700] text-[20px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]">
          My Trello board
        </h1>
      </div>
      <div className="bg-[#101204] p-10 rounded-lg shadow-xl w-72 md:w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
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
          onClick={handleEmailSignUp}
          className="w-full p-3 mb-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 flex items-center justify-center gap-x-2 p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          <FcGoogle />
          Continue with Google
        </button>
        <div className="w-full p-3 rounded text-white">
          Already have an account?{" "}
          <Link href="/SignIn" className="text-indigo-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
