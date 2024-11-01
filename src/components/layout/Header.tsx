"use client"
import React, { useEffect, useState } from 'react'
import { addNewInput } from '@/app/redux/slice'
import { useDispatch } from "react-redux"
// import { useSelector } from 'react-redux';
// import { RootState } from '../shared/types';
import { useUserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { subscribeToUserData } from '../shared/fetchFirestoreData';

interface CardData {
  id: string;
  title: string;
  inputs: Array<{ id: string; value: string }>; // Adjust based on the structure of your data
}

const Header = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>(''); // Input field
  const [category, setCategory] = useState<string>('todo'); // Dropdown selection
  // const data = useSelector((state: RootState) => state.cardsArray || []);
  const { logOut } = useUserAuth();
  const router = useRouter()
  const { user } = useUserAuth(); // To get the logged-in user
  const [cardsArray, setCardsArray] = useState<CardData[]>([]); // Define type of cardsArray
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserData(user.uid, setCardsArray);
      return () => unsubscribe(); // Unsubscribe when the component unmounts
    }
  }, [user]);
  console.log("Firestore data: ", cardsArray, " User ID: ", user?.uid);

  const handleSignOut = () => {
    try {
      logOut();
      router.push("/Signup")
    } catch (error) {
      console.log(error);
    }
  };

  const titles = cardsArray.map((item) => (item.title))
  // console.log("Titles : ", titles)

  const handleAdd = () => {
    if (input.trim() === '') {
      setShowInputError(true); // Show ring if input is empty
      return;
    }
    setShowInputError(false); // Remove ring if input is valid
    dispatch(addNewInput({ category, value: input }));
    setInput(''); // Clear input after adding
  };

  return (
    <div className='flex md:flex-row flex-col gap-y-[8px] md:gap-y-0  items-center md:justify-evenly py-[8px] px-[40px] bg-prima bg-[#6C2F4C] z-40 top-0 sticky'>
      {/* Logo */}
      <div>
        <h1 className='font-[700] text-[20px] lg:text-[1.82291666667vw] text-white md:leading-[1.66666666667vw]'>My Trello board</h1>
      </div>

      {/* Input (Center on mobile) */}
      <div className="flex flex-col md:flex-row justify-between md:justify-between">
        {/* Input Section */}
        <div className="flex justify-center my-1 md:my-0">
          {/* Input Field */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`bg-[#22272B] text-[#A1ACB5] p-2 rounded-md ${showInputError ? 'ring-2 ring-red-500' : ''}`} // Conditional ring
            placeholder="Enter task..."
          />

          {/* Dropdown Menu */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#22272B] text-[#A1ACB5] min-w-[72px] p-2 rounded-md text-center mx-2 font-[500]"
          >
            {
              titles.map((item, index) => (
                <option
                  key={index}
                  value={item}
                  className='bg-[#22272B] text-[#A1ACB5] text-start'>
                  {item.length > 7 ? `${item.slice(0, 6)}..` : item}
                </option>
              ))
            }
          </select>

          {/* Add Button */}
          <button onClick={handleAdd} className="bg-[#22272B] hover:translate-y-[1px] transition-transform text-[#A1ACB5] hover:bg-[#101204]  p-2 rounded-md font-[500]">
            Add
          </button>
        </div>
      </div>
      <div>
        <button onClick={handleSignOut} className="bg-[#22272B] hover:translate-y-[1px] transition-transform text-[#A1ACB5] hover:bg-red-800  p-2 rounded-md font-[500]">
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Header;
