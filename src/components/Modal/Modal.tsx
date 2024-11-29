"use client"
import { useState } from "react";
import { addWatchingState, deleteActivity, updateCardInput } from "@/store/slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Item, RootState } from "../../types/types";
import { useUserAuth } from "../../context/AuthContext";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import CardAddedUser from "./CardAddedUser";
import Notification from "./Notification";
import TitleWithClose from "./TitleClose";
import ActivitySection from "./Activity";
import Description from "./Description";

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

  const editActivity = () => {
    setIsEditActivity(null)
  }

  const DesRichText = () => {
    setIsDesRichText(true)
  }

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

  const closeRichTextDesc = () => {
    setIsDesRichText(false)
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
      onClose(); 
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div onClick={handleOverlayClick} className="absolute inset-0 bg-black opacity-50" />

      {/* Modal Content */}
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
        <Description
          itemId={itemData?.id}
          description={itemData?.description}
          isDesRichText={isDesRichText}
          closeRichTextDesc={closeRichTextDesc}
          DesRichText={DesRichText}
        />

        {/* Activity */}
        <ActivitySection
          itemData={itemData}
          initialCharacter={initialCharacter}
          emailName={emailName}
          isRichTextComp={isRichTextComp}
          enableRichTextActivity={enableRichTextActivity}
          closeRichTextComp={closeRichTextComp}
          isEditActivity={isEditActivity}
          handleEditActivity={handleEditActivity}
          openDeletePopup={openDeletePopup}
          deletePopup={deletePopup}
          confirmDelete={confirmDelete}
          closeDeletePopup={closeDeletePopup}
          editActivity={editActivity}
        />
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
