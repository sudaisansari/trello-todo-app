"use client"
import { RxActivityLog, RxCross1 } from "react-icons/rx";
import { useState, useEffect, useRef } from "react";
import { addDescription, deleteActivity, updateCardInput } from "@/app/redux/slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../shared/types";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck, FaTable } from "react-icons/fa";
import { ImParagraphLeft } from "react-icons/im";
import { useUserAuth } from "../context/AuthContext";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import RichText from "./Richtext";

interface Item {
  id: string;
  value: string;
  description?: string;
  dateTime?: string;
  // Stores HTML content as a string
  activity?: {
    id: string; // Unique identifier for each activity entry
    content: string; // Stores rich text as HTML string
    dateTime: string; // Timestamp for activity
  }[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  Item: Item | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, Item }) => {
  const dispatch = useDispatch();
  const [editingTitle, setEditingTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const [isWatching, setIsWatching] = useState(false)
  const { user } = useUserAuth()
  const [isDesRichText, setIsDesRichText] = useState(false)
  const [isRichTextComp, setIsRichTextComp] = useState(false)
  const [isEditActivity, setIsEditActivity] = useState<string | null>(null);

  const closeUpdateRichText = () => {
    setIsEditActivity(null)
  }

  const handleEditActivity = (id: string, content: string) => {
    setIsEditActivity(id)
    console.log("Edit Activity", id, content)
    return { id, content }
  }

  const handldDeleteActivity = (id: string) => {
    dispatch(deleteActivity(id))
  }

  const enableRichTextActivity = () => {
    setIsRichTextComp(true)
  }

  const closeRichTextComp = () => {
    setIsRichTextComp(false)
  }

  // Rich Text Description
  const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });
  const [content, setContent] = useState<string | undefined>('');


  const handleEditorChange = (newContent: string) => {
    console.log("s", newContent)
    const cont = newContent.concat(" ")
    setContent(cont);
    //setContent("sudais")
  };

  const handleCancel = () => {
    setIsDesRichText(false); // Hide the rich text editor
  };

  const enableRichText = (desc: string | undefined) => {
    console.log("Rich Text Area")
    setContent(desc)
    setIsDesRichText(true); // Toggle between true and false
  };

  const handleSubmit = () => {
    const desc = content
    const id = Item?.id
    console.log("Desc ", desc, id)
    dispatch(addDescription({ id: id, description: desc }))
    setContent('');
    setIsDesRichText(false);
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

  //
  const email = user?.email;
  const emailName = email?.split("@")[0].split(".")[0];
  const initialCharacter = emailName ? emailName.charAt(0).toUpperCase() : "";

  const watchingClick = () => {
    setIsWatching(prevState => !prevState); // Toggle between true and false
  };

  const card = data.find(card =>
    card.inputs.some(inputItem => inputItem.id === Item?.id)
  );
  const itemData = card?.inputs.find(inputItem => inputItem.id === Item?.id);
  const [currentTitle, setCurrentTitle] = useState<string | undefined>('');

  const handleTitleClick = (title: string | undefined) => {
    setCurrentTitle(title);
    setEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleKeyDownTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentTitle?.trim() === '') {
        setEditingTitle(false);
      } else {
        setEditingTitle(false);
        setCurrentTitle('');
        if (Item) {
          dispatch(updateCardInput({ id: Item.id, input: currentTitle }));
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && editingTitle) {
        if (currentTitle?.trim() === '') {
          console.log("No input")
          setEditingTitle(false)
        }
        else {
          dispatch(updateCardInput({ id: Item?.id, input: currentTitle }));
          setEditingTitle(false); // Reset edit mode
          setCurrentTitle('')
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [Item?.id, currentTitle, dispatch, editingTitle])

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTitle]);
  // Sync currentTitle with the latest Item value whenever Item changes
  // useEffect(() => {
  //   if (Item) {
  //     setCurrentTitle(Item.value);
  //   }
  // }, [Item]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal if the click is on the overlay
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div onClick={handleOverlayClick} className="absolute inset-0 bg-black opacity-50" />

      {/* Modal Content */}
      {/* Task title, List name, and Close Button */}
      <div className="bg-[#E5E7EB] h-[500px] overflow-y-auto my-[42px] w-[768px] p-5 rounded-xl z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-x-3">
            <div>
              <FaTable className="text-[16px]" />
            </div>
            <div className="">
              <div>
                {editingTitle ? (
                  <input
                    type="text"
                    ref={inputRef}
                    value={currentTitle}
                    onChange={handleTitleChange}
                    className={`pl-[2px] pr-[6px] text-[24px] tracking-wider font-[600] break-word w-[90%] rounded-xl bg-[#E5E7EB] text-black hover:ring-2 ring-white cursor-text`}
                    onKeyDown={handleKeyDownTitle}
                  />
                ) : (
                  <div
                    onClick={() => handleTitleClick(itemData?.value)}
                    className='font-[600] text-[24px] tracking-wider break-word pl-[2px] max-w-[176px] max-h-[100px] overflow-hidden py-[2px] w-full rounded-xl bg-[#E5E7EB] text-black'>
                    {itemData?.value}
                  </div>
                )}
              </div>
              <div className="text-[16px]">
                in list  <span className="font-[700]">{card?.title && card.title.length > 10 ? `${card.title.slice(0, 9)}..` : card?.title || ""}</span>
              </div>
            </div>
          </div>
          {/* Close Button */}
          <div onClick={onClose} className="cursor-pointer">
            <RxCross1 className="text-[24px]" />
          </div>
        </div>

        {/* Notification */}
        <div className="ml-[28px] mt-[32px]">
          <h2 className="font-[500] text-[12px]">Notifications</h2>
          <div
            onClick={watchingClick}
            className='cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
            {/* Add Card Button */}
            < div
              className='flex flex-row items-center gap-x-[8px] text-black '
            //onClick={submitInput} // Show new input field when clicked
            >
              <MdOutlineRemoveRedEye className='text-[18px]' />
              <span className='text-[16px] font-[500]'>Add List</span>
              {isWatching &&
                <FaCheck />
              }
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-[26px]">
          <div className="flex items-center gap-x-3">
            <ImParagraphLeft className="text-[16px]" />
            <h2 className="text-[16px] font-[700]">Description</h2>
          </div>

          {!isDesRichText ? (
            <div
              onClick={() => enableRichText(itemData?.description)}
              className="h-[60px] ml-[28px] w-[512px] mt-[12px] rounded-md text-[16px] p-2 cursor-pointer hover:bg-[#747972] bg-[#6E776B]"
              dangerouslySetInnerHTML={{
                __html: itemData?.description || "Add a more detailed description..."
              }}
            ></div>
          ) : (
            <div className="ml-[28px] mt-[12px]">
              <div
                className=" w-[508px] rounded-md mt-[12px]"
              >
                <QuillEditor
                  value={content}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className=" bg-[#6E776B]"
                />
              </div>
              <div className="flex gap-x-2 mt-3">
                <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded-md">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Activity */}
        <div className="mt-[26px]">
          <div className="flex items-center gap-x-3 ">
            <div>
              <RxActivityLog className="text-[16px] text-black" />
            </div>
            <h2 className="text-[16px] font-[700]">Activity</h2>
          </div>
          <div className="mt-[12px]">
            <div className="flex items-start gap-x-2">
              <div className="bg-[#FF991F] flex items-center justify-center rounded-full p-4 w-5 h-5">
                <span className="text-black ">
                  {initialCharacter ? initialCharacter : "A"}
                </span>
              </div>
              {!isRichTextComp ? (
                <div
                  onClick={enableRichTextActivity}
                  className="h-[36px] w-[502px] rounded-md text-[16px] pl-2 pt-1 font-[500] cursor-pointer hover:bg-[#747972] bg-[#6E776B]">
                  Write a comment...
                </div>
              ) : (
                <div>
                  <div>
                    <RichText handleClose={closeRichTextComp} Id={Item?.id} />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-[12px]">
              {itemData?.activity.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start gap-x-2">
                    <div className="bg-[#FF991F] flex items-center justify-center rounded-full p-4 w-5 h-5">
                      <span className="text-black ">
                        {initialCharacter ? initialCharacter : "A"}
                      </span>
                    </div>
                    <div>
                      <div className="text-[14px] font-[500]">
                        <span className="text-[16px] font-[500]">{emailName}</span>  {item.dateTime}
                      </div>
                      {isEditActivity === item.id ? (
                        <RichText
                          handleClose={closeUpdateRichText}
                          Id={item.id}
                          initialContent={item.content}
                          handleEditActivity={handleEditActivity}
                        //  handleSaveEditActivity(id, updatedContent)                          
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.content,
                          }}
                          className="min-h-[36px] w-[502px] rounded-md text-[16px] pl-2 pt-1 hover:bg-[#747972] bg-[#6E776B]"
                        ></div>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex ml-[48px] gap-x-2">
                    <button
                      onClick={() => handleEditActivity(item.id, item.content)}
                      className="text-[12px] font-[500] hover:underline">Edit</button>
                    <button className="text-[12px] font-[500] hover:underline">Delete</button>
                  </div> */}
                  {isEditActivity === item.id ? (
                    <div></div>
                  ) : (
                    <div className="flex ml-[48px] gap-x-2">
                      <button
                        onClick={() => handleEditActivity(item.id, item.content)}
                        className="text-[12px] font-[500] hover:underline">Edit</button>
                      <button
                        onClick={() => handldDeleteActivity(item.id)}
                        className="text-[12px] font-[500] hover:underline">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Added User */}
        <div className="mt-[12px]">
          <div className="flex items-start gap-x-2">
            <div className="bg-[#FF991F] flex items-center justify-center rounded-full p-4 w-5 h-5">
              <span className="text-black ">
                {initialCharacter ? initialCharacter : "A"}
              </span>
            </div>
            <div>
              <div className="text-[14px] font-[500]">
                <span className="text-[16px] font-[500]">{emailName}</span> added this card to {card?.title && card.title.length > 10 ? `${card.title.slice(0, 9)}..` : card?.title || ""}
              </div>
              <div className="text-[14px] font-[500]">
                {itemData?.dateTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Modal;
