"use client"
import { useEffect, useRef, useState } from 'react'
import { addNewInput, loggedOutUser, setCardsData } from '@/store/slice'
import { useDispatch } from "react-redux"
import { useUserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'
import { RootState } from '../types/types'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Logo from "@/assets/trelloo.png"
import * as React from 'react'
import 'react-tooltip/dist/react-tooltip.css'

const Header = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>(''); // Input field
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const { logOut } = useUserAuth();
  const router = useRouter()
  const { user } = useUserAuth(); // To get the logged-in user
  const [showInputError, setShowInputError] = useState<boolean>(false); 

  const transformedData = data.map((item) => ({
    id: item.id,
    title: item.title
  }));
  const titles = data.map((item) => (item.id))
  const [category, setCategory] = useState<string>(""); 
  console.log("Cat : ", category)
  if (category === undefined || titles.length === 1) {
    setTimeout(() => {
      setCategory(titles[0]);
      console.log("Category updated:", titles[0]);
    }, 300)
  }

  const email = user?.email
  const emailName = email?.split("@")[0].split(".")[0];

  const [isUserOpen, setIsUserOpen] = useState(false);
  const popupRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const [isUserOpenL, setIsUserOpenL] = useState(false);
  const popupRefL = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const [isUserOpenM, setIsUserOpenM] = useState(false);
  const popupRefM = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const initialCharacter = emailName ? emailName.charAt(0).toUpperCase() : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserOpen && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      } else if (isUserOpenL && popupRefL.current && !popupRefL.current.contains(event.target as Node)) {
        setIsUserOpenL(false);
      } else if (isUserOpenM && popupRefM.current && !popupRefM.current.contains(event.target as Node)) {
        setIsUserOpenM(false);
      } else if (!dropdownOpen && popupRefM.current && !popupRefM.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserOpen, isUserOpenL, isUserOpenM]); // Depend only on isUserOpen

  const togglePopup = () => {
    setIsUserOpen((prev) => !prev);
  };

  const togglePopupL = () => {
    setIsUserOpenL((prev) => !prev);
  };

  const togglePopupM = () => {
    setIsUserOpenM((prev) => !prev);
  };

  const handleSignOut = () => {
    console.log("Called")
    try {
      console.log("Logging Out")
      logOut();
      dispatch(setCardsData([]))
      dispatch(loggedOutUser());
      console.log("Redux Data after logout : ", data)
      router.push("/SignIn")
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    if (input.trim() === '') {
      setShowInputError(true); // Show error for empty input
      return;
    }
    setShowInputError(false); // Clear error

    if (!category) {
      console.error("No category selected");
      return;
    }
    console.log("ID:", category, "Input:", input);
    dispatch(addNewInput({ id: category, value: input }));
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
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px] rounded-xl mx-1 font-[500]"
              >
                {
                  transformedData.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className='bg-white text-[16px] text-black  text-start'>
                      {item.title.length > 7 ? `${item.title.slice(0, 6)}..` : item.title}
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
            ref={popupRefL}
            className="relative">
            {/* Main Button */}
            <div
              onClick={togglePopupL}
              className="bg-[#FF991F] hover:cursor-pointer hover:ring-2 ring-white flex items-center justify-center rounded-full p-4 w-5 h-5">
              <span className="text-black font-[500]">
                {initialCharacter ? initialCharacter : ""}
              </span>
            </div>
            {/* Popup */}
            {isUserOpenL && (
              <div
                className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg  py-1 z-20 transition-all duration-500 ease-in-out transform opacity-100"
              // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
              //onClick={(e) => e.stopPropagation()} // Prevent event bubbling
              >
                <p className="text-md px-3 py-1 hover:bg-[#6E776B] font-semibold">{email || "No email available"}</p>
                {/* <Link href="/SignIn"> */}
                <button
                  onClick={handleSignOut}
                  className="text-md px-3 py-1 hover:bg-[#6E776B] text-red-700 hover:text-black w-full text-start font-semibold hover:translate-y-[1px] transition-transform"
                >
                  Log Out
                </button>
                {/* </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Tablet */}
      <div className='md:block lg:hidden hidden'>
        <div className='flex flex-col gap-y-[12px] items-center md:justify-evenly py-[8px] px-[40px] bg-prima bg-[#8D6ABF] [#7D857A] z-40 top-0 sticky'>
          <div className='flex justify-between items-center w-full'>
            {/* Logo */}
            <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
              <Image src={Logo} alt='Trello' width={25} height={25} />
              <h1 className='font-[700] text-[20px] md:text-[30px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
            </div>
            <div
              ref={popupRefM}
              className="relative">
              {/* Main Button */}
              <div
                onClick={togglePopupM}
                className="bg-[#FF991F] hover:cursor-pointer hover:ring-2 ring-white flex items-center justify-center rounded-full p-4 w-5 h-5">
                <span className="text-black font-[500]">
                  {initialCharacter ? initialCharacter : ""}
                </span>
              </div>
              {/* Popup */}
              {isUserOpenM && (
                <div
                  className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg py-2 z-20 transition-all duration-500 ease-in-out transform opacity-100"
                // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
                >
                  <p className="text-md hover:bg-[#6E776B] py-1 px-3 font-semibold">{email || "No email available"}</p>
                  {/* <Link href="/SignIn"> */}
                  <button
                    onClick={handleSignOut}
                    className="text-md px-3 py-1 hover:bg-[#6E776B] text-red-700 hover:text-black w-full text-start font-semibold hover:translate-y-[1px] transition-transform"
                  >
                    Log Out
                  </button>
                  {/* </Link> */}
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
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setCategory(selectedId);
                }} className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
              >
                {
                  transformedData.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className='bg-white text-[16px] text-black  text-start'>
                      {item.title.length > 7 ? `${item.title.slice(0, 6)}..` : item.title}
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
        <div className='flex justify-between items-center gap-x-1 w-full'>
          {/* Logo */}
          <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
            <Image src={Logo} alt='Trello' width={25} height={25} />
            <h1 className='font-[700] text-[20px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
          </div>
          <div
            ref={popupRef}
            className="relative">
            {/* Main Button */}
            <div
              onClick={togglePopup}
              className="bg-[#FF991F] hover:cursor-pointer hover:ring-2 ring-white flex items-center justify-center rounded-full p-4 w-5 h-5">
              <span className="text-black font-[500]">
                {initialCharacter ? initialCharacter : ""}
              </span>
            </div>
            {/* Popup */}
            {isUserOpen && (
              <div
                className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg py-1 z-20 transition-all duration-500 ease-in-out transform opacity-100"
              // style={{ opacity: isUserOpen ? 1 : 0, transform: isUserOpen ? 'translateY(0)' : 'translateY(-10px)' }}
              >
                <p className="text-sm px-3 font-semibold">{email || "No email available"}</p>
                {/* <Link href="/SignIn"> */}
                <button
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1 hover:bg-[#6E776B] text-red-700 hover:text-black w-full text-start font-semibold hover:translate-y-[1px] transition-transform"
                >
                  Log Out
                </button>
                {/* </Link> */}
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
              onChange={(e) => {
                const selectedId = e.target.value;
                setCategory(selectedId);
              }} className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
            >
              {
                transformedData.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className='bg-white text-[14px] text-black  text-start'>
                    {item.title.length > 7 ? `${item.title.slice(0, 6)}..` : item.title}
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
