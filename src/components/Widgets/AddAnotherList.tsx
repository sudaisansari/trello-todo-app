"use client"
import { addNewCard } from '@/app/redux/slice'
import React, { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

const AddAnotherList = () => {
  const [input, setInput] = useState<string>("");
  const [InpuField, setInpuField] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const dispatch = useDispatch()
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring


  const submitInput = () => {
    if (input.trim() == '') {
      setShowInputError(true)
    }
    else {
      setInput("")
      setInpuField(false)
      dispatch(addNewCard(input))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim() == '') {
        setShowInputError(true)
      }
      else {
        console.log("On Enter : ", input)
        setInput('')
        setInpuField(false)
        dispatch(addNewCard(input))
      }
    }
  };

  // const handleCross = () => {
  //   setInput('')
  //   setInpuField(false)
  // }

  useEffect(() => {
    if (InpuField && inputRef.current) {
      inputRef.current.focus(); // Focus the input when InpuField becomes true
    }
  }, [InpuField]);

  return (
    // <div className='flex flex-row items-center justify-center gap-x-2 my-[8px] md:mx-[16px] '>
    //   {/* Add Another list Button */}
    //     <div
    //       onClick={() => (setInpuField(true))}
    //       className='flex flex-row hover:translate-y-[1px] transition-transform w-[272px] items-center justify-start gap-x-[11px] mt-[20px] mb-[15px] bg-[#22272B] text-[#F4F4F4] hover:bg-[#101204] rounded-2xl p-2  cursor-pointer'>
    //       <FaPlus className='' />
    //       <span className='text-[16px] font-[700] '>Add another list</span>
    //     </div>
    //   {
    //     InpuField && (
    //       < div className='bg-[#101204] p-[16px] min-w-[275px] rounded-2xl'>
    //         {/* Input Field */}
    //         <input
    //           type='text'
    //           value={input}
    //           onChange={(e) => setInput(e.target.value)}
    //           onKeyDown={(e) => handleKeyDown(e)} // Handle pressing "Enter" key
    //           ref={inputRef} // Attach ref to the input
    //           placeholder='Enter list name...'
    //           className={`py-[8px] px-[12px] w-full rounded-xl bg-[#22272B] text-[#F4F4F4]  cursor-text ${showInputError ? 'ring-2 ring-red-500' : 'hover:ring-2 ring-blue-300'}`}
    //         />
    //         {/* Button */}
    //         <div className='flex items-center justify-start mt-[16px] gap-x-[8px]'>
    //           <div className='flex flex-row bg-[#DCDFE4] hover:translate-y-[1px] transition-transform w-[100px] rounded-md items-center justify-center '>
    //             <button
    //               onClick={submitInput}
    //               className='p-2 text-[16px] font-[700] text-black'>Add list</button>
    //           </div>
    //           <div
    //             onClick={handleCross}
    //             className=' p-1 rounded-md hover:bg-gray-800 cursor-pointer'>
    //             <RxCross2 className='text-[28px] font-[600] text-white' />
    //           </div>
    //         </div>
    //       </div>
    //     )}
    // </div >
    < div className='flex items-center gap-x-1 -rounded-2xl'>
      {/* Input Field */}
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)} // Handle pressing "Enter" key
        ref={inputRef} // Attach ref to the input
        placeholder='Enter list..'
        className={`py-[8px] px-[12px] w-[180px] md:w-auto rounded-xl bg-[#E5E7EB] text-black cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
      />
      {/* Button */}
      {/* <div className='flex flex-row bg-[#22272B] text-[#F4F4F4] hover:bg-[#101204] hover:translate-y-[1px] transition-transform w-[100px] rounded-xl items-center justify-center '>
        <button
          onClick={submitInput}
          className='p-2 text-[16px] font-[700]'>
          Add List
        </button>
      </div> */}
      < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
        {/* Add Card Button */}
        < div
          className='flex flex-row items-center gap-x-[8px] text-black '
          onClick={submitInput} // Show new input field when clicked
        >
          <FaPlus className='text-[12px]' />
          <span className='text-[16px] font-[500]'>Add List</span>
        </div>
      </div>
    </div>
  )
}

export default AddAnotherList