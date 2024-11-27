import { deleteInputFromFirestore } from "@/config/firebase";
import { useUserAuth } from "@/context/AuthContext";
import { updateCardInput } from "@/store/slice";
import { Item } from "@/types/types";
import { useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FiTrash } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface InputFieldProps {
  inputItem: Item;
  index: number;
  handleInputClick: (item: Item) => void;
}

const InputField: React.FC<InputFieldProps> = ({ inputItem, index, handleInputClick }) => {
  const dispatch = useDispatch()
  const [editingIndex, setEditingIndex] = useState<string | null>(null); // Track which input is being edited
  const [currentTodo, setCurrentTodo] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null); 
  const cardDeleted = () => toast("Card Deleted");
  const { user } = useUserAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newTodo = e.target.value
    setCurrentTodo(newTodo)
    console.log("ID : ", id, "New Todo : ", newTodo)
  };


  const handleKeyDownWhenEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentTodo.trim() === '') {
        setEditingIndex(null)
        console.log("No input")
      }
      else {
        setEditingIndex(null)
        dispatch(updateCardInput({ id: editingIndex, input: currentTodo }));
        setCurrentTodo('')
      }
    }
  };

  const handleDeleteInput = async (id: string) => {
    const uid = user?.uid
    try {
      if (uid) {
        await deleteInputFromFirestore(uid, id)
      }
      //dispatch(deleteCardInput(id))
      cardDeleted()
    } catch (error) {
      console.log("Ereor Del card Input", error)
    }
  }

  return (
    <Draggable draggableId={inputItem.id} index={index}>
      {
        (provided) => (
          <div
            key={index}
            draggable
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            className='relative'>
            {editingIndex === inputItem.id ? (
              <input
                type='text'
                value={currentTodo}
                ref={inputRef} 
                onChange={(e) => handleInputChange(e, inputItem.id)}
                className='py-[8px] pl-[12px] pr-[56px] tracking-wide w-full rounded-xl bg-[#6E776B] text-[#F4F4F4] hover:ring-2 ring-white cursor-text'
                onKeyDown={(e) => handleKeyDownWhenEdit(e)}
              />
            ) : (
              <div>
                <div
                  onClick={() => handleInputClick(inputItem)} 
                  className='hover:ring-2 tracking-wide break-words ring-black py-[8px] px-[12px] rounded-xl bg-[#6E776B] text-[#F4F4F4]'>
                  {inputItem.value}
                  <span>
                    {inputItem.watching && ( 
                      <div>
                        <MdOutlineRemoveRedEye className="text-black" />
                      </div>
                    )}
                  </span>
                </div>
              </div>
            )}
            {/* Pencil Icon */}
            <div className="absolute flex gap-x-[px] top-1/2 right-[5px]">
              <button
                onClick={() => handleDeleteInput(inputItem.id)}
                className=' text-black bg-[#6E776B] hover:opacity-90 rounded-full p-[3px] cursor-pointer transition-transform -translate-y-1/2'>
                <FiTrash
                  className="text-[18px]"
                />
              </button>
            </div>
          </div>
        )}
    </Draggable>
  )
};

export default InputField;
