"use client"
import React, { useEffect } from "react";
import { useUserAuth } from "@/components/context/AuthContext"; // Ensure to use updated hook name
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const { user, googleSignIn } = useUserAuth();
  // const [loading, setLoading] = useState(true);
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      // setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="flex justify-center h-screen bg-[#8F3F65]">
      <div className="flex flex-col items-center gap-y-5 rounded-lg mt-[60px] ">
        <div className="mb-[50px]">
          <h1 className='font-[700] text-[20px] lg:text-[3.125vw] text-white md:leading-[1.66666666667vw]'>My Trello board</h1>
        </div>
        <button
          onClick={handleSignIn}
          className="text-lg px-8 py-2 rounded-md bg-[#22272B] hover:translate-y-[1px] transition-transform text-[#A1ACB5] hover:bg-[#101204] font-[500]"
        >
          Login
        </button>
        <button
          onClick={handleSignIn}
          className="text-lg px-8 py-2 rounded-md bg-[#22272B] hover:translate-y-[1px] transition-transform text-[#A1ACB5] hover:bg-[#101204] font-[500]"
        >
          Sign up
        </button>
      </div>
    </div>

  );
};

export default SignUp;
