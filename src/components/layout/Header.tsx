"use client"
import React, { useState } from 'react'
import { addNewInput } from '@/app/redux/slice'
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux';
import { RootState } from '../shared/types';
import { useUserAuth } from '../context/AuthContext';

const Header =  () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>(''); // Input field
  const [category, setCategory] = useState<string>('todo'); // Dropdown selection
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const { logOut } = useUserAuth();
  
  const handleSignOut = () => {
    console.log("first")
    try {
       logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const titles = data.map((item) => (item.title))
  console.log("Titles : ", titles)

  const handleAdd = () => {
    console.log("Title in Header : ", category)
    dispatch(addNewInput({ category, value: input }));
    setInput(''); // Clear input after adding
  };

  return (
    <div className='flex md:flex-row flex-col gap-y-[8px] md:gap-y-0  items-center md:justify-evenly py-[8px] px-[40px] bg-primary z-40 top-0 sticky'>
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
            className="bg-[#22272B] text-[#A1ACB5] p-2 rounded-md"
            placeholder="Enter task..."
          />

          {/* Dropdown Menu */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#22272B] text-[#A1ACB5] p-2 rounded-md mx-2 font-[500]"
          >
            {
              titles.map((item, index) => (
                <option
                  key={index}
                  value={item}
                  className='bg-[#22272B] text-[#A1ACB5]'>
                  {item.length > 7 ? `${item.slice(0, 6)}...` : item}
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
        <button onClick={handleSignOut} className="bg-[#22272B] hover:translate-y-[1px] transition-transform text-[#A1ACB5] hover:bg-[#101204]  p-2 rounded-md font-[500]">
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Header;
