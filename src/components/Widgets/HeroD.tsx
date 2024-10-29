"use client"
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";
import { addCardInput, reorderCardItems, reorderCards, updateCardInput } from "@/app/redux/slice";
import { useDispatch } from "react-redux";
import { Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { DndContext } from "@/components/context/Dndcontext";
import { RootState } from "@/components/shared/types";

const HeroD = () => {
    const data = useSelector((state: RootState) => state.cardsArray || []);
    const [newInput, setNewInput] = useState(''); // State for new input
    const [editingIndex, setEditingIndex] = useState<string | null>(null); // Track which input is being edited
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);
    const [addingCardIndex, setaddingCardIndex] = useState<string | null>(null); // Track which input is being edited
    const dispatch = useDispatch();

    const handleAddNewInput = () => {
        if (newInput) {
            console.log("New Input : ", newInput)
            setNewInput(''); // Clear the input field
            setIsAddingNewCard(false); // Hide the new input field after adding
        }
    };

    const handleEditClick = (id: string) => {
        setEditingIndex(id); // Set the index of the input being edited
        console.log("Editing Index : ", id)
    };

    const handleAddingNewCardInput = (id: string) => {
        setaddingCardIndex(id); // Set the index of the input being edited
        setIsAddingNewCard(true)
        setNewInput('');
        console.log("Adding New Input Index : ", id)
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            console.log("On Enter : ", id, newInput)
            dispatch(addCardInput({ id, input: newInput }))
            setNewInput('')
            setIsAddingNewCard(false)
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const newTodo = e.target.value
        dispatch(updateCardInput({ id, input: newTodo }));
        console.log("ID : ", id, "New Todo : ", newTodo)
    };

    const handleKeyDownWhenEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setNewInput('')
            setEditingIndex(null)
            setIsAddingNewCard(false)
        }
    };

    const onDragEnd = (result: DropResult) => {
        console.log("On DnD Func")

        const { source, destination, draggableId } = result;
        console.log("Result : ", result);
        console.log("Source : ", source);
        console.log("Destination : ", destination);
        console.log("Draggable ID : ", draggableId);

        // Replacing Card from Eachother
        if (draggableId.includes("card-") && source.index !== destination?.index) {
            const sourceIndex = source.index;
            const destinationIndex = destination?.index;

            if (destinationIndex !== undefined) {
                console.log("Source Index : ", sourceIndex);
                console.log("Destination Index : ", destinationIndex);

                dispatch(reorderCards({ destinationIndex, sourceIndex }));
            } else {
                console.error("Destination index is undefined");
            }
            return;
        }

        // If there's no destination (dropped outside a droppable), exit function
        if (!destination) return;

        // If the item is dropped in the same position, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Deep copy of data with new references
        const updatedCards = data.map(card => ({
            ...card,
            inputs: [...card.inputs]
        }));
        console.log("Deep Copy : ", updatedCards)

        const sourceCardIndex = updatedCards.findIndex(card => `droppable${card.id}` === source.droppableId);
        const destCardIndex = updatedCards.findIndex(card => `droppable${card.id}` === destination.droppableId);
        console.log("Source Card Index : ", sourceCardIndex)
        console.log("Destination Card Index : ", destCardIndex)

        if (sourceCardIndex !== -1 && destCardIndex !== -1) {
            const [movedItem] = updatedCards[sourceCardIndex].inputs.splice(source.index, 1);
            console.log("Moved Item : ", " Brackets : ", [movedItem])
            updatedCards[destCardIndex].inputs.splice(destination.index, 0, movedItem);
            console.log("Updated Cards : ", updatedCards)

            const destCardId = updatedCards[destCardIndex].id;

            // Dispatch the reordered array to update the Redux store
            dispatch(reorderCardItems({
                sourceCardId: updatedCards[sourceCardIndex].id,
                destinationCardId: destCardId,
                sourceIndex: source.index,
                destinationIndex: destination.index
            }));
        }
    };


    return (
        <DndContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
                {
                    (provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className='flex items-baseline justify-start pt-4 ml-3 gap-[8px] md:gap-[16px]'>
                            {
                                data.map((item, index) => (
                                    <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                // key={index}
                                                className='bg-[#101204] p-[8px] min-w-[275px] max-w-[300px] rounded-2xl'>
                                                {/* Heading and icons */}
                                                <div className='flex flex-row sticky top-0 z-10 justify-between items-center mt-[4px] mx-[8px]'>
                                                    <h2 className='text-[14px] font-[700] text-[#A1ACB5]'>
                                                        {item.title.length > 7 ? `${item.title.slice(0, 6)}...` : item.title}
                                                    </h2>
                                                    <div className=''>
                                                        <FiTrash className='text-white text-[18px]' />
                                                    </div>
                                                </div>
                                                {/* Mapped Input Fields */}
                                                <Droppable key={item.id} droppableId={`droppable${item.id}`} type="ITEM">
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps} ref={provided.innerRef}
                                                            className='mt-[20px] p-2 flex flex-col gap-y-[7px] max-h-[380px] overflow-y-auto'>
                                                            {
                                                                item.inputs.map((item, index) => (
                                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                        {
                                                                            (provided) => (
                                                                                <div
                                                                                    key={index}
                                                                                    draggable
                                                                                    {...provided.dragHandleProps}
                                                                                    {...provided.draggableProps}
                                                                                    ref={provided.innerRef}
                                                                                    className='relative w-[254px]'>
                                                                                    {editingIndex === item.id ? (
                                                                                        <input
                                                                                            type='text'
                                                                                            value={item.value}
                                                                                            onChange={(e) => handleInputChange(e, item.id)}
                                                                                            className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
                                                                                            onKeyDown={(e) => handleKeyDownWhenEdit(e)}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            className='hover:ring-2 break-words ring-white pl-[13px] pr-[17px] pb-[13px] pt-[17px] w-[256px] rounded-xl bg-[#22272B] text-[#A1ACB5]'>
                                                                                            {item.value}
                                                                                        </div>
                                                                                    )}
                                                                                    {/* Pencil Icon */}
                                                                                    <div className="absolute flex gap-x-[4px] top-1/2 right-[5px]">
                                                                                        <div className=' text-[#A1ACB5] hover:text-white bg-[#101204] hover:opacity-90 rounded-full p-[6px] cursor-pointer transform -translate-y-1/2'>
                                                                                            <FiEdit2
                                                                                                className=''
                                                                                                onClick={() => handleEditClick(item.id)} // Enable input editing on click
                                                                                            />
                                                                                        </div>
                                                                                        <div className=' text-[#A1ACB5] hover:text-white bg-[#101204] hover:opacity-90 rounded-full p-[6px] cursor-pointer transform -translate-y-1/2'>
                                                                                            <FiTrash />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </Draggable>
                                                                ))}

                                                            {/* Conditionally Show New Input Field */}
                                                            {addingCardIndex === item.id && isAddingNewCard && (
                                                                <div className='relative w-[254px] mt-4'>
                                                                    <input
                                                                        type='text'
                                                                        value={newInput}
                                                                        onChange={(e) => setNewInput(e.target.value)}
                                                                        onKeyDown={(e) => handleKeyDown(e, item.id)} // Handle pressing "Enter" key
                                                                        placeholder=''
                                                                        className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
                                                                    />
                                                                    {/* Pencil Icon */}
                                                                    <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
                                                                        <FiEdit2
                                                                            className='text-[#A1ACB5] hover:text-white cursor-pointer'
                                                                            onClick={handleAddNewInput} // Add new input to data array
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                                {/* Bottom */}
                                                < div className='sticky bottom-0 z-10 items-baseline' >
                                                    {/* Add Card Button */}
                                                    < div
                                                        className='flex flex-row items-center gap-x-[11px] mt-[20px] mb-[15px] hover:bg-gray-800 rounded-md p-2 text-[#7B868E] cursor-pointer'
                                                        onClick={() => handleAddingNewCardInput(item.id)} // Show new input field when clicked
                                                    >
                                                        <FaPlus />
                                                        <span className='text-[14px] font-[400]'>Add a card</span>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {/* {provided.placeholder} */}
                        </div>
                    )}
            </Droppable>
        </DndContext >
    )
}

export default HeroD