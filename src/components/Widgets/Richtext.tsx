"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useDispatch } from 'react-redux';
import { addActivity, updateActivity } from '@/app/redux/slice';

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

  const handleSubmit = () => {
    console.log("Activity : ", content);
    dispatch(addActivity({ id: Id, activity: content }));
    setContent('');
  };

  const handleUpdate = () => {
    console.log("Activity Update : ", content)
    dispatch(updateActivity({ id: Id, activity: content }))
  }

  const handleSaveAndSubmit = () => {
    if (initialContent?.trim() === '') {
      handleSubmit(); // Call handleSubmit when closing   
      handleClose();   
    } else {
      handleUpdate()
      handleClose();   // Then call the passed handleClose function
    }
  };

  const handleCancel = () => {
    handleClose(); // Call the passed handleClose function
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

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="">
      <div className="w-[508px]  mt-[12px] ">
        <QuillEditor
          value={content}
          onChange={handleEditorChange}
          modules={quillModules}
          formats={quillFormats}
          className="rounded-lg  bg-[#6E776B]"
        />
      </div>
      <div className='flex gap-x-2'>
        <div
          onClick={handleSaveAndSubmit} // Call combined function on close
          className='cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#579DFF] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
          Save
        </div>
        <div
          onClick={handleCancel} // Call combined function on close
          className='cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
          Cancel
        </div>
      </div>
    </div>
  );
}

export default RichText;



// "use client"
// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css'; // Import Quill styles
// import { useDispatch } from 'react-redux';
// import { addActivity } from '@/app/redux/slice';

// const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

// interface ModalProps {
//   handleClose: () => void;
//   Id?: string;
//   initialContent?: string; // For pre-filling the editor in edit mode
//   handleEditActivity?: (id: string, activity: string) => void; // Callback for edit
// }

// const RichText: React.FC<ModalProps> = ({
//   handleClose,
//   Id,
//   initialContent = '',
//   handleEditActivity,
// }) => {
//   const [content, setContent] = useState(initialContent);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setContent(initialContent); // Set the initial content when component mounts or updates
//   }, [initialContent]);

//   const handleSaveAndSubmit = () => {
//     if (handleEditActivity && Id) {
//       // Editing an existing activity
//       handleEditActivity(Id, content);
//     } else {
//       // Adding a new activity
//       console.log("Activity : ", content);
//       dispatch(addActivity({ id: Id, activity: content }));
//     }
//     setContent('');
//     handleClose(); // Close the editor
//   };

//   const handleCancel = () => {
//     console.log("Close")
//     handleClose(); // Close the editor
//   };

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, 4, 5, false] }],
//       ['bold', 'italic', 'strike'],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       ['link', 'image'],
//     ],
//   };

//   const quillFormats = [
//     'header',
//     'bold',
//     'italic',
//     'strike',
//     'list',
//     'bullet',
//     'link',
//     'image',
//   ];

//   const handleEditorChange = (newContent: string) => {
//     setContent(newContent);
//   };

//   return (
//     <div className="">
//       <div className="w-[508px]  mt-[12px] ">
//         <QuillEditor
//           value={content}
//           onChange={handleEditorChange}
//           modules={quillModules}
//           formats={quillFormats}
//           className="rounded-lg  bg-[#6E776B]"
//         />
//       </div>
//       <div className="flex gap-x-2">
//         <div
//           onClick={handleSaveAndSubmit} // Call combined function on close
//           className="cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#579DFF] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center">
//           Save
//         </div>
//         <div
//           onClick={handleCancel} // Call combined function on close
//           className="cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center">
//           Cancel
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RichText;
