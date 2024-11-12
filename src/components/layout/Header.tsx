"use client"
import React, { useEffect, useRef, useState } from 'react'
import { addNewInput, setCardsData } from '@/app/redux/slice'
import { useDispatch } from "react-redux"
// import { useSelector } from 'react-redux';
// import { RootState } from '../shared/types';
import { useUserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { subscribeToUserData } from '../shared/fetchFirestoreData';
import { RootState } from '../shared/types';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Logo from "@/components/assets/trelloo.png"


interface CardData {
  id: string;
  title: string;
  inputs: Array<{ id: string; value: string }>; // Adjust based on the structure of your data
}

const Header = () => {
  const [cardsArray, setCardsArray] = useState<CardData[]>([]); // Define type of cardsArray
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>(''); // Input field
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const { logOut } = useUserAuth();
  const router = useRouter()
  const { user } = useUserAuth(); // To get the logged-in user
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring
  // const titles = cardsArray.map((item) => (item.title))
  const titles = data.map((item) => (item.title))
  const [category, setCategory] = useState<string>(titles[0] || ''); // Dropdown selection
  console.log("Cat : ", category)

  const popupRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const email = user?.email
  const emailName = email?.split("@")[0].split(".")[0];
  console.log("Email Name : ", emailName)
  const userName = user?.displayName;
  const firstName = userName?.split(" ")[0];
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserOpen && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserOpen]); // Depend only on isUserOpen

  const togglePopup = () => {
    setIsUserOpen((prev) => !prev);
  };


  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserData(user.uid, setCardsArray);
      return () => unsubscribe(); // Unsubscribe when the component unmounts
    }
  }, [user]);
  console.log("Firestore data: ", cardsArray, " User ID: ", user?.uid);

  useEffect(() => {
    if (category === '' && titles.length > 0) {
      setCategory(titles[0]); // Set to the first title when available
    }
  }, [titles, category]);

  const handleSignOut = () => {
    try {
      console.log("Logging Out")
      logOut();
      dispatch(setCardsData([]))
      console.log("Redux Data after logout : ", data)
      router.push("/Signup")
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    if (input.trim() === '') {
      setShowInputError(true); // Show ring if input is empty
      return;
    }
    setShowInputError(false); // Remove ring if input is valid
    console.log("Categ : ", category, " Input : ", input)
    dispatch(addNewInput({ category, value: input }));
    setInput(''); // Clear input after adding
  };

  return (
    <div>
      <div className='lg:block hidden'>
        <div className='flex md:flex-row flex-col gap-y-[8px] md:gap-y-0  items-center md:justify-evenly py-[8px] px-[40px] bg-prima bg-[#8D6ABF] [#7D857A] z-40 top-0 sticky'>
          {/* Logo */}
          <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
            <Image src={Logo} alt='Trello' width={25} height={25} />
            <h1 className='font-[700] text-[20px] md:text-[30px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
          </div>

          {/* Input (Center on mobile) */}
          <div className="flex flex-col md:flex-row justify-between md:justify-between">
            {/* Input Section */}
            <div className="flex justify-center my-1 md:my-0">
              {/* Input Field */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)} //bg-[#22272B] text-[#F4F4F4]
                className={`py-[8px] px-[12px] rounded-xl bg-[#E5E7EB] text-black  cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
                placeholder="Enter task.."
              />

              {/* Dropdown Menu */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
              >
                {
                  titles.map((item, index) => (
                    <option
                      key={index}
                      value={item}
                      className='bg-white text-[16px] text-black  text-start'>
                      {item.length > 7 ? `${item.slice(0, 6)}..` : item}
                    </option>
                  ))
                }
              </select>
              {/* Add Button */}
              < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                <button
                  onClick={handleAdd}
                  className='text-[16px] text-black font-[500]'>
                  Add Task
                </button>
              </div>
            </div>
          </div>
          <div
            ref={popupRef}
            className="relative">
            {/* Main Button */}
            < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
              <button onClick={togglePopup} className="text-black text-[16px] font-[500]">
                Hey {firstName ? firstName : emailName}
              </button>
            </div>
            {/* Popup */}
            {isUserOpen && (
              <div
                className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg px-4 py-2 z-20 transition-all duration-500 ease-in-out transform opacity-100"
              // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
              >
                <p className="text-md font-semibold">{email || "No email available"}</p>
                <button
                  onClick={handleSignOut}
                  className="text-md font-semibold hover:translate-y-[1px] transition-transform"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Tablet */}
      <div className='md:block lg:hidden hidden'>
        <div className='flex flex-col gap-y-[12px] items-center md:justify-evenly py-[8px] px-[40px] bg-prima bg-[#8D6ABF] [#7D857A] z-40 top-0 sticky'>
          <div className='flex justify-evenly items-center w-full'>
            {/* Logo */}
            <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
              <Image src={Logo} alt='Trello' width={25} height={25} />
              <h1 className='font-[700] text-[20px] md:text-[30px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
            </div>
            <div
              ref={popupRef}
              className="relative">
              {/* Main Button */}
              < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                <button onClick={togglePopup} className="text-black text-[16px] font-[500]">
                  Hey {firstName ? firstName : emailName}
                </button>
              </div>
              {/* Popup */}
              {isUserOpen && (
                <div
                  className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg px-4 py-2 z-20 transition-all duration-500 ease-in-out transform opacity-100"
                // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
                >
                  <p className="text-md font-semibold">{email || "No email available"}</p>
                  <button
                    onClick={handleSignOut}
                    className="text-md font-semibold hover:translate-y-[1px] transition-transform"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Input (Center on mobile) */}
          <div className="flex flex-col md:flex-row justify-between md:justify-between">
            {/* Input Section */}
            <div className="flex justify-center my-1 md:my-0">
              {/* Input Field */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)} //bg-[#22272B] text-[#F4F4F4]
                className={`py-[8px] px-[12px] rounded-xl bg-[#E5E7EB] text-black  cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
                placeholder="Enter task.."
              />

              {/* Dropdown Menu */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
              >
                {
                  titles.map((item, index) => (
                    <option
                      key={index}
                      value={item}
                      className='bg-white text-[16px] text-black  text-start'>
                      {item.length > 7 ? `${item.slice(0, 6)}..` : item}
                    </option>
                  ))
                }
              </select>
              {/* Add Button */}
              < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                <button
                  onClick={handleAdd}
                  className='text-[16px] text-black font-[500]'>
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile  */}
      <div className='md:hidden flex flex-col gap-y-[8px] items-center md:justify-evenly py-[8px] px-[40px] bg-prima bg-[#8D6ABF] [#7D857A] z-40 top-0 sticky'>
        <div className='flex justify-evenly items-center gap-x-1 w-full'>
          {/* Logo */}
          <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
            <Image src={Logo} alt='Trello' width={25} height={25} />
            <h1 className='font-[700] text-[20px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
          </div>
          <div
            ref={popupRef}
            className="relative">
            {/* Main Button */}
            < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-ce' >
              <button onClick={togglePopup} className="text-black text-[14px] font-[500]">
                Hey {firstName ? firstName : emailName}
              </button>
            </div>
            {/* Popup */}
            {isUserOpen && (
              <div
                className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg px-4 py-2 z-20 transition-all duration-500 ease-in-out transform opacity-100"
              // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
              >
                <p className="text-md font-semibold">{email || "No email available"}</p>
                <button
                  onClick={handleSignOut}
                  className="text-md font-semibold hover:translate-y-[1px] transition-transform"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Input (Center on mobile) */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Input Section */}
          <div className="flex justify-center my-1">
            {/* Input Field */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)} //bg-[#22272B] text-[#F4F4F4]
              className={`py-[4px] px-[8px] w-[100px] rounded-xl bg-[#E5E7EB] text-black  cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
              placeholder="Enter task.."
            />

            {/* Dropdown Menu */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
            >
              {
                titles.map((item, index) => (
                  <option
                    key={index}
                    value={item}
                    className='bg-white text-[14px] text-black  text-start'>
                    {item.length > 7 ? `${item.slice(0, 6)}..` : item}
                  </option>
                ))
              }
            </select>
            
            {/* Add Button */}
            < div className='cursor-pointer px-2 py-1  bg-[#E5E7EB] hover:translate-y-[1px] transition-transform rounded-xl w-max' >
              <button
                onClick={handleAdd}
                className='text-[14px] text-black font-[500]'>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
