"use client"
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useDispatch } from 'react-redux';
import { addActivity, updateActivity } from '@/redux/slice';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

interface ModalProps {
  handleClose: () => void;
  Id: string | undefined;
  handleEditActivity?: (id: string, activity: string) => void;
  initialContent?: string;
}

const RichText: React.FC<ModalProps> = ({ handleClose, Id, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSaveActivity = () => {
    console.log("Activit", content?.trim())  
    if (content?.trim()) {
      if (initialContent?.trim()) {
        console.log("Updating activity:", content);
        dispatch(updateActivity({ id: Id, activity: content }));
      } else {
        console.log("Adding new activity:", content);
        dispatch(addActivity({ id: Id, activity: content }));
      }
    } else {
      console.log("No content to save");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleSaveActivity();
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [Id, content, dispatch, handleClose, initialContent]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSaveAndSubmit = () => {
    handleSaveActivity();
    handleClose();
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <div ref={wrapperRef} className="">
      <div className="md:w-[508px] w-full mt-[12px]">
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
          onClick={handleSaveAndSubmit}
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

export default RichText;

