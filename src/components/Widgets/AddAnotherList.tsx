// "use client"
// import { addNewCard } from '@/app/redux/slice'
// import React, { useEffect, useRef, useState } from 'react'
// import { FaPlus } from 'react-icons/fa'
// import { useDispatch } from 'react-redux'

// const AddAnotherList = () => {
//   const [input, setInput] = useState<string>("");
//   const [InpuField, setInpuField] = useState(false)
//   const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
//   const dispatch = useDispatch()
//   const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring


//   const submitInput = () => {
//     if (input.trim() == '') {
//       setShowInputError(true)
//     }
//     else {
//       setInput("")
//       setInpuField(false)
//       dispatch(addNewCard(input))
//     }
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       if (input.trim() == '') {
//         setShowInputError(true)
//       }
//       else {
//         console.log("On Enter : ", input)
//         setInput('')
//         setInpuField(false)
//         dispatch(addNewCard(input))
//       }
//     }
//   };

//   // const handleCross = () => {
//   //   setInput('')
//   //   setInpuField(false)
//   // }

//   useEffect(() => {
//     if (InpuField && inputRef.current) {
//       inputRef.current.focus(); // Focus the input when InpuField becomes true
//     }
//   }, [InpuField]);

//   return (
//     < div className='flex items-center gap-x-1 -rounded-2xl'>
//       {/* Input Field */}
//       <input
//         type='text'
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => handleKeyDown(e)} // Handle pressing "Enter" key
//         ref={inputRef} // Attach ref to the input
//         placeholder='Enter list..'
//         className={`py-[8px] px-[12px] w-[180px] md:w-auto rounded-xl bg-[#E5E7EB] text-black cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
//       />
//       {/* Button */}
//       < div className='cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB]  text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
//         {/* Add Card Button */}
//         < div
//           className='flex flex-row items-center gap-x-[8px] text-black '
//           onClick={submitInput} // Show new input field when clicked
//         >
//           <FaPlus className='text-[12px]' />
//           <span className='text-[16px] font-[500]'>Add List</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddAnotherList



"use client";
import { addNewCard } from "@/app/redux/slice";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";

const AddAnotherList = () => {
  const [input, setInput] = useState<string>("");
  const [inputField, setInputField] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const dispatch = useDispatch();
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // State to disable input field

  const submitInput = () => {
    if (input.trim() === "") {
      setShowInputError(true);
    } else {
      setIsDisabled(true); // Disable input field
      setInput(""); // Reset input value
      setInputField(false); // Hide input field
      dispatch(addNewCard(input)); // Dispatch action
      setTimeout(() => setIsDisabled(false), 1000); // Re-enable input after 1 second
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim() === "") {
        setShowInputError(true);
      } else {
        setIsDisabled(true); // Disable input field
        console.log("On Enter: ", input);
        setInput("");
        setInputField(false);
        dispatch(addNewCard(input));
        setTimeout(() => setIsDisabled(false), 1000); // Re-enable input after 1 second
      }
    }
  };

  useEffect(() => {
    if (inputField && inputRef.current) {
      inputRef.current.focus(); // Focus the input when inputField becomes true
    }
  }, [inputField]);

  return (
    <div className="flex items-center gap-x-1 -rounded-2xl">
      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)} // Handle pressing "Enter" key
        ref={inputRef} // Attach ref to the input
        placeholder="Enter list..."
        disabled={isDisabled} // Disable the input field when `isDisabled` is true
        className={`py-[8px] px-[12px] w-[180px] md:w-auto rounded-xl bg-[#E5E7EB] text-black cursor-text hover:ring-1 ring-black ${
          showInputError ? "ring-red-500" : ""
        }`}
      />
      {/* Button */}
      <div className="cursor-pointer flex flex-row px-3 py-2 bg-[#E5E7EB] text-[#F4F4F4] hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center">
        {/* Add Card Button */}
        <div
          className="flex flex-row items-center gap-x-[8px] text-black"
          onClick={submitInput} // Show new input field when clicked
        >
          <FaPlus className="text-[12px]" />
          <span className="text-[16px] font-[500]">Add List</span>
        </div>
      </div>
    </div>
  );
};

export default AddAnotherList;
