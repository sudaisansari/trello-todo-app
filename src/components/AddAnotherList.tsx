"use client";
import { addNewCard } from "@/store/slice";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Button from "./Button";

const AddAnotherList = () => {
  const [input, setInput] = useState<string>("");
  const [inputField, setInputField] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const dispatch = useDispatch();
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring

  const submitInput = () => {
    if (input.trim() === "") {
      setShowInputError(true);
    } else {
      dispatch(addNewCard(input)); // Dispatch action      
      setInputField(false); // Hide input field      
      setInput(""); // Reset input value
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim() === "") {
        setShowInputError(true);
      } else {
        dispatch(addNewCard(input));
        setInputField(false);
        console.log("In Fi", inputField)
        setInput("");
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
        placeholder="Enter list.."
        //disabled={isDisabled} // Disable the input field when `isDisabled` is true
        className={`py-[8px] px-[12px] w-[180px] md:w-auto rounded-xl bg-[#E5E7EB] text-black cursor-text hover:ring-1 ring-black ${
          showInputError ? "ring-red-500" : ""
        }`}
      />
      {/* Button */}      
      <Button name="Add List" icon={<FaPlus />} bgColor="bg-[#E5E7EB]" action={submitInput} />
    </div>
  );
};

export default AddAnotherList;
