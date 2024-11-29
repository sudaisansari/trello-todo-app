"use client"
import { RxActivityLog } from "react-icons/rx";
import { useState } from "react";
import { addWatchingState, deleteActivity, updateCardInput } from "@/store/slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Item, RootState } from "../types/types";
import { ImParagraphLeft } from "react-icons/im";
import { useUserAuth } from "../context/AuthContext";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import RichText from "./RichtextActivity";
import RichTextDesc from "./RichTextDesc";
import CardAddedUser from "./Modal/CardAddedUser";
import Notification from "./Modal/Notification";
import TitleWithClose from "./Modal/TitleClose";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  Item: Item | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, Item }) => {
  console.log("Selected Item : ", Item?.id)
  const dispatch = useDispatch();
  const [editingTitle, setEditingTitle] = useState(false);
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const [isWatching, setIsWatching] = useState(false)
  const { user } = useUserAuth()
  const [isDesRichText, setIsDesRichText] = useState(false)
  const [isRichTextComp, setIsRichTextComp] = useState(false)
  const [isEditActivity, setIsEditActivity] = useState<string | null>(null);
  const [deletePopup, setDeletePopup] = useState<null | string>(null); // Track which activity's delete popup is active

  const watchingClick = () => {
    setIsWatching(prevState => !prevState); // Toggle between true and false
    dispatch(addWatchingState({ id: Item?.id, watching: isWatching }))
  };

  const openDeletePopup = (id: string) => setDeletePopup(id);
  const closeDeletePopup = () => setDeletePopup(null);

  const confirmDelete = (id: string) => {
    handldDeleteActivity(id); // Call the delete handler
    setDeletePopup(null); // Close the popup
  };


  const enableRichTextDesc = () => {
    setIsDesRichText(true)
  }

  const closeRichTextDesc = () => {
    setIsDesRichText(false)
  }

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

  const email = user?.email;
  const emailName = email?.split("@")[0].split(".")[0];
  const initialCharacter = emailName ? emailName.charAt(0).toUpperCase() : "";

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
      <div className="bg-[#E5E7EB] h-[500px] w-full lg:w-[768px] overflow-y-auto my-[42px] lg:mx-0 mx-2 md:mx-8 px-2 md:px-5 rounded-xl z-10">
        <div className="bg-[#E5E7EB] sticky top-0 h-2 md:h-5"></div>

        {/* Task title, List name, and Close Button */}
        <TitleWithClose
          cardTitle={card?.title}
          value={itemData?.value}
          editingTitle={editingTitle}
          currentTitle={currentTitle}
          onClose={onClose}
          handleTitleClick={handleTitleClick}
          handleTitleChange={handleTitleChange}
          handleKeyDownTitle={handleKeyDownTitle}
          setEditingTitle={setEditingTitle}
          setCurrentTitle={setCurrentTitle}
          itemId={Item?.id}
        />

        {/* Notification */}
        <Notification watchingClick={watchingClick} itemWatching={itemData?.watching} />

        {/* Description */}
        <div className="mt-[26px]">
          <div className="flex justify-between w-auto md:w-[512px]">
            <div className="flex items-center gap-x-3">
              <ImParagraphLeft className="text-[16px]" />
              <h2 className="text-[16px] font-[700]">Description</h2>
            </div>
            {!isDesRichText ? (
              <button
                onClick={enableRichTextDesc}
                //className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                className='cursor-pointer text-[16px] font-[500] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                Edit
              </button>
            ) : (
              <div></div>
            )}
          </div>

          {!isDesRichText ? (
            <div
              onClick={enableRichTextDesc}
              className="h-[60px] ml-[28px] w-auto md:w-[512px] mt-[12px] rounded-md text-[16px] p-2 cursor-pointer hover:bg-[#747972] bg-[#6E776B]"
              dangerouslySetInnerHTML={{
                __html: itemData?.description || "Add a more detailed description..."
              }}
            ></div>
          ) : (
            <RichTextDesc Id={itemData?.id} handleClose={closeRichTextDesc} initialContent={itemData?.description} />
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
                  className="h-[36px] w-full md:w-[502px] rounded-md text-[16px] pl-2 pt-1 font-[500] cursor-pointer hover:bg-[#747972] bg-[#6E776B]">
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
                          className="min-h-[36px] w-full md:w-[502px] rounded-md text-[16px] pl-2 pt-1 hover:bg-[#747972] bg-[#6E776B]"
                        ></div>
                      )}
                    </div>
                  </div>
                  {isEditActivity === item.id ? (
                    <div></div>
                  ) : (
                    <div className="flex ml-[48px] gap-x-2">
                      <button
                        onClick={() => handleEditActivity(item.id, item.content)}
                        className="text-[12px] font-[500] hover:underline">Edit</button>
                      <button
                        //onClick={() => handldDeleteActivity(item.id)}
                        onClick={() => openDeletePopup(item.id)}
                        className="text-[12px] font-[500] hover:underline">Delete</button>
                    </div>
                  )}
                  {/* Delete Confirmation Popup */}
                  {deletePopup === item.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-4 rounded-md shadow-md w-[300px]">
                        <p className="text-[14px] font-[500] text-center">
                          Are you sure you want to delete this activity?
                        </p>
                        <div className="flex justify-center mt-4 gap-x-2">
                          <button
                            onClick={() => confirmDelete(item.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                            Delete
                          </button>
                          <button
                            onClick={closeDeletePopup}
                            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Added User */}
        <div className="mt-[12px]">
          <CardAddedUser emailName={emailName} initialCharacter={initialCharacter} cardTitle={card?.title} dateTime={itemData?.dateTime} />
        </div>
        <div className="bg-[#E5E7EB] sticky bottom-0 h-2 md:h-5"></div>
      </div>
    </div >
  );
};

export default Modal;
