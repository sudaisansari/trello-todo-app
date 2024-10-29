"use client"
import React, { useState } from 'react'
import { LiaSuperpowers } from "react-icons/lia";
import { MdElectricBolt } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { RiUserSharedLine } from "react-icons/ri";
import { addNewInput } from '@/app/redux/slice'
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux';
import { RootState } from '../shared/types';

const Header = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>(''); // Input field
  const [category, setCategory] = useState<string>('todo'); // Dropdown selection
  const data = useSelector((state: RootState) => state.cardsArray || []);

  const titles = data.map((item) => (item.title))
  console.log("Titles : ", titles)

  const handleAdd = () => {
    console.log("Title in Header : ", category)
    dispatch(addNewInput({ category, value: input }));
    setInput(''); // Clear input after adding
  };

  return (
    <div className='bg-primary z-10 top-0 sticky'>
      <div className='flex flex-col gap-y-1 md:gap-y-0 md:flex-row justify-between items-center md:justify-between'>

        {/* Left Side */}
          {/* Logo */}
          <div>
            <h1 className='font-[700] text-[20px] md:text-[1.5vw] text-white md:leading-[1.66666666667vw]'>My Trello board</h1>
          </div>          

        {/* Input (Center on mobile) */}
        <div className="">
          <div className="flex flex-col md:flex-row justify-between md:justify-between">

            {/* Input Section */}
            <div className="flex justify-center my-1 md:my-0">
              {/* Input Field */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-white p-2 rounded-md"
                placeholder="Enter task..."
              />

              {/* Dropdown Menu */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white p-2 rounded-md mx-2 font-[500]"
              >
                {
                  titles.map((item, index) => (
                    <option
                      key={index}
                      value={item}
                      className=''>
                      {item.length > 7 ? `${item.slice(0, 6)}...` : item}
                    </option>
                  ))
                }
              </select>

              {/* Add Button */}
              <button onClick={handleAdd} className="bg-[#DCDFE4] p-2 rounded-md font-[500]">
                Add
              </button>
            </div>
          </div>
        </div>


        {/* Right Side */}
        <div className='md:p-[0.83333333333vw] p-[8px] flex flex-row items-center gap-x-2 md:gap-x-[1.04166666667vw] justify-end'>
          {/* Power up */}
          <div>
            <LiaSuperpowers className='text-white text-[20px] md:text-[1.04166666667vw]' />
          </div>
          {/* Electric Icon */}
          <div>
            <MdElectricBolt className='text-white text-[20px] md:text-[1.04166666667vw]' />
          </div>
          {/* Filters */}
          <div className='md:p-[0.41666666666vw] flex flex-row items-center text-white gap-x-[3px] md:gap-x-[0.20833333333vw]'>
            <IoFilterSharp className='text-white text-[20px] md:text-[1.04166666667vw]' />
            <span className='text-[20px] font-[400]'>Filter</span>
          </div>
          {/* User Icon */}
          <div>
            <FaUserCircle className='text-white text-[20px] md:text-[1.04166666667vw]' />
          </div>
          {/* Share */}
          <div className='bg-[#DCDFE4] rounded-sm cursor-pointer flex flex-row items-center px-[4px] md:px-[0.20833333333vw]'>
            <RiUserSharedLine className='text-black text-[16px] md:text-[1.04166666667vw]' />
            <span className='p-[0.41666666666vw] font-[400] text-[16px] md:text-[0.83333333333vw] text-black'>Share</span>
          </div>
          {/* Dots */}
          <div>
            <BsThreeDots className='text-white text-[20px] md:text-[1.04166666667vw]' />
          </div>
        </div>
      </div>
    </div >
  )
}

export default Header;
