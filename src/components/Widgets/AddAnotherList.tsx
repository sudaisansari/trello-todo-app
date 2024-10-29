"use client"
import { addNewCard } from '@/app/redux/slice'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch } from 'react-redux'

const AddAnotherList = () => {
  const [input, setInput] = useState<string>("");
  const [InpuField, setInpuField] = useState(false)
  const dispatch = useDispatch()

  const submitInput = () => {
    console.log(input)
    setInput("")
    setInpuField(false)
    dispatch(addNewCard(input))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log("On Enter : ", input)
      setInput('')
      setInpuField(false)
      dispatch(addNewCard(input))
    }
  };

  const handleCross = () => {
    setInput('')
    setInpuField(false)    
  }

  return (
    <div className='w-[272px] mx-[8px] md:mx-[16px] '>
      {/* Add Another list Button */}
      <div
        onClick={() => (setInpuField(true))}
        className='flex flex-row w-[272px] items-center hover:opacity-80 justify-start gap-x-[11px] mt-[20px] mb-[15px] bg-[#EF3B52] rounded-md p-2  cursor-pointer'>
        <FaPlus className='text-white' />
        <span className='text-[16px] font-[700] text-white'>Add another list</span>
      </div>
      {
        InpuField && (
          < div className='bg-[#101204] p-[16px] min-w-[275px] rounded-2xl'>
            {/* Input Field */}
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)} // Handle pressing "Enter" key
              placeholder='Enter list name...'
              className='w-full rounded-md p-[8px] bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-blue-300 cursor-text'
            />
            {/* Button */}
            <div className='flex items-center justify-start'>
              <div className='flex flex-row bg-[#DCDFE4] w-[100px] rounded-md items-center justify-center mt-[12px]'>
                <button
                  onClick={submitInput}
                  className='p-2 text-[16px] font-[600] text-black'>Add list</button>
              </div>
              <div
                onClick={handleCross}
                className='m-2 p-1 rounded-md hover:bg-gray-800 cursor-pointer'>
                <RxCross2 className='text-[28px] font-[600] text-white' />
              </div>
            </div>
          </div>
        )}
    </div >
  )
}

export default AddAnotherList