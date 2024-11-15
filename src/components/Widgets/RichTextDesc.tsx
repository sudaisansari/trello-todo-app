"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useDispatch } from "react-redux";
import { addDescription, updateDescription } from "@/app/redux/slice";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface ModalProps {
  handleClose: () => void;
  Id: string | undefined;
  initialContent?: string;
}

const RichTextDesc: React.FC<ModalProps> = ({ handleClose, Id, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Consolidated save logic for both adding and updating descriptions
  const handleSaveDescription = () => {
    // Normalize content to remove Quill's empty or whitespace-only structures
    const normalizedContent = (content?.trim() || '');
    const isEmptyContent =
      normalizedContent === "<p><br></p>" || 
      /^<p>\s*<\/p>$/.test(normalizedContent); // Matches <p> </p> with any spaces between
  
    if (!isEmptyContent && normalizedContent) {
      if (initialContent?.trim()) {
        console.log("Updating description:", normalizedContent);
        dispatch(updateDescription({ id: Id, description: normalizedContent }));
      } else {
        console.log("Adding new description:", normalizedContent);
        dispatch(addDescription({ id: Id, description: normalizedContent }));
      }
    } else {
      console.log("No valid content to save.");
      handleClose(); // Close the modal if no valid content
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleSaveDescription();
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [Id, content, dispatch, handleClose, initialContent]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div ref={wrapperRef} className="ml-[36px]">
      <div className="md:w-[508px]  w-full mt-[12px]">
        <QuillEditor
          value={content}
          onChange={handleEditorChange}
          modules={quillModules}
          formats={quillFormats}
          className="rounded-lg bg-[#6E776B]"
        />
      </div>
      <div className="flex gap-x-2">
        <div
          onClick={() => {
            handleSaveDescription();
            handleClose();
          }}
          className="cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#579DFF] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center"
        >
          Save
        </div>
        <div
          onClick={handleClose}
          className="cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center"
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default RichTextDesc;

