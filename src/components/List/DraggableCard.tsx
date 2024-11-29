import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import InputField from "./InputField";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { addCardInput, editTitle } from "@/store/slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Cards, Item, RootState } from "@/types/types";
import { FaPlus } from "react-icons/fa";
import { deleteCardFromFirestore } from "@/config/firebase";
import { useUserAuth } from "@/context/AuthContext";
import EditDelete from "../EditDelete";

interface DCard {
  item: Cards;
  index: number;
  handleInputClick: (item: Item) => void;
}

const DraggableCard: React.FC<DCard> = ({ item, index, handleInputClick }) => {

  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.cardsArray || []);
  const [titleIndex, setTitleIndex] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
  const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring
  const listDeleted = () => toast("List Deleted");
  const [oneItem, setOneItem] = useState(data.length === 1);
  const [addingCardIndex, setaddingCardIndex] = useState<string | null>(null); // Track which input is being edited
  const [newInput, setNewInput] = useState(''); // State for new input
  const { user } = useUserAuth()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      if (newInput.trim() === '') {
        console.log("No input")
      }
      else {
        dispatch(addCardInput({ id, input: newInput }))
        setNewInput('')
        setaddingCardIndex(null)
      }
    }
  };

  const handleAddingNewCardInput = (id: string) => {
    console.log("Adding New Input Index : ", id)
    setaddingCardIndex(id);
    setNewInput('');
  };

  useEffect(() => {
    setOneItem(data.length === 1)
    console.log("one it ", oneItem)
  }, [data.length]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setCurrentTitle(newTitle);
  };

  const handleKeyDownTitle = (ekey: React.KeyboardEvent<HTMLInputElement>) => {
    if (ekey.key === 'Enter') { 
      if (currentTitle.trim() === '') {
        setShowInputError(true)
        console.log("No input")
      }
      else {
        setTitleIndex(null) 
        setShowInputError(false)
        dispatch(editTitle({ id: titleIndex, title: currentTitle }));
        setCurrentTitle('')
      }
    }
  };

  const handleEditTitleClick = (id: string, title: string) => {
    setTitleIndex(id);
    setCurrentTitle(title);
  };

  const handleDeleteCard = async (id: string) => {
    const uid = user?.uid
    try {
      if (uid) {
        await deleteCardFromFirestore(uid, id)
        listDeleted()
      }
    } catch (error) {
      console.error("Error Deleting Card: ", error);
    }
  };

  useEffect(() => {
    if (addingCardIndex && inputRef.current || titleIndex && inputRef.current) {
      inputRef.current.focus(); 
    }
  }, [addingCardIndex, titleIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && addingCardIndex) {
        if (newInput.trim() === '') {
          console.log("No input")
          setaddingCardIndex(null); 
        }
        else {
          dispatch(addCardInput({ id: addingCardIndex, input: newInput }))
          setaddingCardIndex(null); 
          setNewInput('')
        }
      } else if (inputRef.current && !inputRef.current.contains(event.target as Node) && titleIndex) {
        if (currentTitle.trim() === '') {
          console.log("No input")
          setTitleIndex(null)
        }
        else {
          dispatch(editTitle({ id: titleIndex, title: currentTitle }));
          setTitleIndex(null); 
          setShowInputError(false)
          setCurrentTitle('')
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }
  )


  return (
    <Draggable draggableId={`card-${item.id}`} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-[#E5E7EB] ml-[16px] p-[4px] min-w-[275px] max-w-[272px] rounded-2xl"
        >
          {/* Heading and icons */}
          <div className='flex flex-row top-0 z-10 justify-evenly items-center '>
            <div className="w-2/3">
              {titleIndex === item.id ? (
                <input
                  type='text'
                  value={currentTitle}
                  ref={inputRef} // Attach ref to the input
                  style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                  onChange={(e) => handleTitleChange(e)}
                  className={`pl-[2px] pr-[6px] py-[2px] tracking-wider font-[600] break-word w-[90%] rounded-xl bg-[#E5E7EB] text-black hover:ring-2 ring-white cursor-text ${showInputError ? 'ring-2 ring-red-500' : ''}`}
                  onKeyDown={(e) => handleKeyDownTitle(e)}
                />
              ) : (
                <div
                  style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                  className='font-[600] tracking-wider break-word pl-[2px] max-w-[176px] max-h-[100px] overflow-hidden py-[2px] w-full rounded-xl bg-[#E5E7EB] text-black'>
                  {item.title}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-[8px] top-1/2 pr-[2px]">
              <EditDelete
                icon={<FiEdit2 className="text-black text-[20px]" />}
                onClick={() => handleEditTitleClick(item.id, item.title)}
              />
              <EditDelete
                icon={<FiTrash className="text-black text-[20px]" />}
                onClick={() => handleDeleteCard(item.id)}
              />
            </div>
          </div>

          {/* Input Fields */}
          <Droppable droppableId={`droppable${item.id}`} type="ITEM">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="px-2 pb-2 pt-1 flex flex-col gap-y-[8px] max-h-[120 max-h-[160px] md:max-h-[180 md:max-h-[190px] lg:max-h-[230px] overflow-y-auto"
              >
                {item.inputs.map((inputItem, i) => (
                  <InputField handleInputClick={handleInputClick} key={inputItem.id} inputItem={inputItem} index={i} />
                ))}
                {/* Conditionally Show New Input Field */}
                {addingCardIndex === item.id && (
                  <div className='mt-[4px]'>
                    <input
                      type='text'
                      value={newInput}
                      onChange={(e) => setNewInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)} // Handle pressing "Enter" key
                      ref={inputRef} // Attach ref to the input
                      placeholder=''
                      className='py-[8px] px-[12px] tracking-wide w-full rounded-xl bg-[#6E776B] text-[#F4F4F4] hover:ring-2 ring-white cursor-text'
                    />
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Bottom */}
          <div className=' hover:translate-y-[1px] px-2 transition-transform bottom-0 z- items-baseline' >
            {/* Add Card Button */}
            < div
              className='flex flex-row items-center  gap-x-[11px] my-[8px] hover:bg-[#6E776B] rounded-xl p-2 text-black cursor-pointer'
              onClick={() => handleAddingNewCardInput(item.id)} // Show new input field when clicked
            >
              <FaPlus />
              <span className='text-[14px] font-[500]'>Add a card</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
};

export default DraggableCard;
