"use client"
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";
import { addCardInput, deleteCard, deleteCardInput, editTitle, reorderCardItems, reorderCards, updateCardInput } from "@/app/redux/slice";
import { useDispatch } from "react-redux";
import { Draggable, DragStart, DragUpdate, Droppable, DropResult } from "react-beautiful-dnd";
import { DndContext } from "@/components/context/Dndcontext";
import { RootState } from "@/components/shared/types";
import { subscribeToUserData } from "@/components/shared/fetchFirestoreData";
import { useUserAuth } from "../context/AuthContext";
import { isEmpty } from "lodash"
// import { useDndMonitor } from "@dnd-kit/core";

interface CardData {
    id: string;
    title: string;
    inputs: Array<{ id: string; value: string }>; // Adjust based on the structure of your data
}
const HeroD = () => {
    const data = useSelector((state: RootState) => state.cardsArray || []);
    const [newInput, setNewInput] = useState(''); // State for new input
    const [editingIndex, setEditingIndex] = useState<string | null>(null); // Track which input is being edited
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);
    const [addingCardIndex, setaddingCardIndex] = useState<string | null>(null); // Track which input is being edited
    const inputRef = useRef<HTMLInputElement>(null); // Add a ref for the input field
    const [titleIndex, setTitleIndex] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentTodo, setCurrentTodo] = useState<string>("");
    const [showInputError, setShowInputError] = useState<boolean>(false); // State to manage input error ring
    // const [showAddCardError, setShowAddCardError] = useState<boolean>(false); // State to manage input error ring
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = useState(false);
    const { user } = useUserAuth(); // To get the logged-in user
    const [cardsArray, setCardsArray] = useState<CardData[]>([]); // Define type of cardsArray

    useEffect(() => {
        if (user) {
            const unsubscribe = subscribeToUserData(user.uid, setCardsArray);
            return () => unsubscribe(); // Unsubscribe when the component unmounts
        }
    }, [user]);
    console.log("Firestore data: ", cardsArray, " User ID: ", user?.uid);

    const handleAddNewInput = () => {
        if (newInput) {
            console.log("New Input : ", newInput)
            setNewInput(''); // Clear the input field
            setIsAddingNewCard(false); // Hide the new input field after adding
        }
    };

    const handleEditClick = (id: string, todo: string) => {
        setEditingIndex(id); // Set the index of the input being edited
        setCurrentTodo(todo)
        console.log("Editing Index : ", id)
    };

    const handleDeleteInput = (id: string) => {
        dispatch(deleteCardInput(id))
    }

    const handleDeleteCard = (id: string) => {
        dispatch(deleteCard(id))
    }

    const handleAddingNewCardInput = (id: string) => {
        setaddingCardIndex(id); // Set the index of the input being edited
        setIsAddingNewCard(true)
        setNewInput('');
        console.log("Adding New Input Index : ", id)
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            if (newInput.trim() === '') {
                // setShowAddCardError(true)
                console.log("No input")
            }
            else {
                // setShowAddCardError(false)
                dispatch(addCardInput({ id, input: newInput }))
                setNewInput('')
                setIsAddingNewCard(false)
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const newTodo = e.target.value
        setCurrentTodo(newTodo)
        dispatch(updateCardInput({ id, input: newTodo }));
        console.log("ID : ", id, "New Todo : ", newTodo)
    };

    const handleKeyDownTitle = (ekey: React.KeyboardEvent<HTMLInputElement>) => {
        if (ekey.key === 'Enter') { // and this
            if (currentTitle.trim() === '') {
                setShowInputError(true)
                console.log("No input")
            }
            else {
                setTitleIndex(null) // old only this
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


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const newTitle = e.target.value
        setCurrentTitle(newTitle);
        // dispatch(editTitle({ id, title: newTitle }));
        console.log("ID : ", id, "New Todo : ", newTitle)
    };

    const handleKeyDownWhenEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setNewInput('')
            setEditingIndex(null)
            setIsAddingNewCard(false)
        }
    };

    // DND
    interface PH {
        clientHeight: number;
        clientWidth: number;
        clientY: number;
        clientX: number;
    }

    const [placeholderProps, setPlaceholderProps] = useState<PH>()
    //     clientHeight: 0,
    //     clientWidth: 0,
    //     clientY: 0,
    //     clientX: 0,
    // });
    const queryAttr = "data-rbd-drag-handle-draggable-id";

    const getDraggedDom = (draggableId: string): HTMLElement | null => {
        const domQuery = `[${queryAttr}='${draggableId}']`;
        const draggedDOM = document.querySelector(domQuery) as HTMLElement | null;
        return draggedDOM;
    };

    const onDragStart = (result: DragStart) => {
        const { draggableId } = result // old
        const sourceIndex = parseFloat(result.source.droppableId)
        if (draggableId.includes("card-")) { // old
            setIsDragging(true);  //old
            const draggedDOM = getDraggedDom(result.draggableId);
            if (!draggedDOM) {
                return;
            }
            const { clientHeight, clientWidth } = draggedDOM;
            console.log("C H : ", clientHeight, " C W : ", clientWidth)
            const parentNode = draggedDOM.parentNode;
            if (parentNode instanceof Element) { // Ensure parentNode is an Element
                const clientz = parseFloat(window.getComputedStyle(parentNode).paddingTop) +
                    [...parentNode.children]
                        .slice(0, sourceIndex)
                        .reduce((total, curr) => {
                            const style = window.getComputedStyle(curr);
                            const marginBottom = parseFloat(style.marginBottom);
                            
                            return total + curr.clientHeight + marginBottom;
                        }, 0);

                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY: parseFloat(
                        window.getComputedStyle(parentNode).paddingLeft
                    ),
                    clientX: clientz
                });
                console.log("PropPL : ", placeholderProps)

                // }
                // else {
                //     console.warn("The parent node is not an Element.");
                // }

            } else {
                setIsDragging(false);
            }
        };
    }
    useEffect(() => {
        console.log("Updated Placeholder Props:", placeholderProps);
    }, [placeholderProps]);

    const onDragUpdate = (event: DragUpdate) => {
        if (!event.destination) {
            return;
        }

        const draggedDOM = getDraggedDom(event.draggableId);

        if (!draggedDOM) {
            return;
        }

        const { clientHeight, clientWidth } = draggedDOM;
        const destinationIndex = event.destination.index;
        const sourceIndex = event.source.index;

        const parentNode = draggedDOM.parentNode; // change

        if (parentNode instanceof Element) {
            const childrenArray = [...parentNode.children];
            const movedItem = childrenArray[sourceIndex];
            childrenArray.splice(sourceIndex, 1);

            const updatedArray = [
                ...childrenArray.slice(0, destinationIndex),
                movedItem,
                ...childrenArray.slice(destinationIndex + 1),
            ];

            const clientz =
                parseFloat(window.getComputedStyle(parentNode).paddingTop) +
                updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
                    const style = window.getComputedStyle(curr);
                    const marginBottom = parseFloat(style.marginBottom);
                    return total + curr.clientHeight + marginBottom;
                }, 0);

            setPlaceholderProps({
                clientHeight,
                clientWidth,
                clientY: parseFloat(
                    window.getComputedStyle(parentNode).paddingLeft
                ),
                clientX: clientz
            });

            // setPlaceholderProps({
            //     clientHeight,
            //     clientWidth,
            //     clientY,
            //     clientX: parseFloat(
            //         window.getComputedStyle(parentNode).paddingLeft
            //     ),
            // });
        }
    };


    const onDragEnd = (result: DropResult) => {
        setPlaceholderProps({
            clientHeight: 0,
            clientWidth: 0,
            clientY: 0,
            clientX: 0,
        });

        console.log("On DnD Func")
        setIsDragging(false);
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

    useEffect(() => {
        if (isAddingNewCard && inputRef.current || editingIndex && inputRef.current || titleIndex && inputRef.current) {
            inputRef.current.focus(); // Focus the input when InpuField becomes true
        }
    }, [isAddingNewCard, editingIndex, titleIndex]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node) && titleIndex) {
                // Dispatch action to save the title change on outside click
                if (currentTitle.trim() === '') {
                    setShowInputError(true)
                    console.log("No input")
                }
                else {
                    dispatch(editTitle({ id: titleIndex, title: currentTitle }));
                    setTitleIndex(null); // Reset edit mode
                    setShowInputError(false)
                    setCurrentTitle('')
                }
            }
            else if (inputRef.current && !inputRef.current.contains(event.target as Node) && editingIndex) {
                // Dispatch action to save the title change on outside click
                dispatch(updateCardInput({ id: editingIndex, input: currentTodo }));
                setEditingIndex(null); // Reset edit mode
            }
            else if (inputRef.current && !inputRef.current.contains(event.target as Node) && isAddingNewCard && addingCardIndex) {
                // Dispatch action to save the title change on outside click
                if (newInput.trim() === '') {
                    // setShowAddCardError(true)
                    console.log("No input")
                    setaddingCardIndex(null); // Reset edit mode
                    setEditingIndex(null); // Reset edit mode

                }
                else {
                    // setShowAddCardError(false)
                    dispatch(addCardInput({ id: addingCardIndex, input: newInput }))
                    setaddingCardIndex(null); // Reset edit mode
                    setNewInput('')
                    setIsAddingNewCard(false)
                    setEditingIndex(null); // Reset edit mode
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [titleIndex, currentTitle, dispatch, editingIndex, currentTodo, isAddingNewCard, addingCardIndex, newInput]);


    return (
        <DndContext
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragUpdate={onDragUpdate}
        >
            <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
                {
                    (provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className='bg-red-300 w-[857px] relative flex items-baseline justify-start pt-4 ml-[16px] gap-x-[8px] md:gap-x-[16px]'>
                            {
                                cardsArray.map((item, index) => (
                                    <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                // key={index}
                                                className='bg-[#101204] p-[8px] min-w-[275px] max-w-[272px] rounded-2xl'
                                            >

                                                {/* Render placeholder overlay when dragging */}
                                                {/* {snapshot.isDragging ? (
                                                    <div
                                                        style={{
                                                            height: placeholderProps?.clientHeight,
                                                            width: placeholderProps?.clientWidth,
                                                        }}
                                                        className="p-[8px] bg-white rounded-2xl opacity-50"
                                                    />
                                                ) : ( */}
                                                {/* <> */}
                                                {/* Heading and icons */}
                                                <div className='flex flex-row sticky top-0 z-10 justify-between items-start mt-[4px] ml-[8px]'>
                                                    <div className="w-2/3">
                                                        {titleIndex === item.id ? (
                                                            <input
                                                                type='text'
                                                                value={currentTitle}
                                                                ref={inputRef} // Attach ref to the input
                                                                onChange={(e) => handleTitleChange(e, item.id)}
                                                                className={`pl-[13px] w-auto rounded-xl bg-[#101204] text-[#A1ACB5] hover:ring-2 ring-white cursor-text ${showInputError ? 'ring-2 ring-red-500' : ''}`}
                                                                onKeyDown={(e) => handleKeyDownTitle(e)}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                                className='font-[700] tracking-wider break-word pl-[13px] max-w-[176px] max-h-[100px] overflow-hidden pt-1 w-full rounded-xl bg-[#101204] text-[#A1ACB5]'>

                                                                {item.title}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className=" flex gap-x-[8px] top-1/2 right-[5px]">
                                                        <div className='hover:translate-y-[1px] bg-[#22272B] rounded-full p-2 transition-transform cursor-pointer'>
                                                            <FiEdit2
                                                                // onClick={() => handleEditTitle(item.id)}
                                                                onClick={() => handleEditTitleClick(item.id, item.title)}
                                                                className='text-white text-[18px]'
                                                            />
                                                        </div>
                                                        <div className='hover:translate-y-[1px] bg-[#22272B] rounded-full p-2 transition-transform cursor-pointer'>
                                                            <FiTrash
                                                                onClick={() => handleDeleteCard(item.id)}
                                                                className='text-white text-[18px]'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Mapped Input Fields */}
                                                <Droppable key={item.id} droppableId={`droppable${item.id}`} type="ITEM">
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps} ref={provided.innerRef}
                                                            //max-w-[250px]
                                                            className='mt-[12px] p-2 flex flex-col gap-y-[8px] max-h-[334px] overflow-y-auto'>
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
                                                                                    className='relative'>
                                                                                    {editingIndex === item.id ? (
                                                                                        <input
                                                                                            type='text'
                                                                                            value={item.value}
                                                                                            ref={inputRef} // Attach ref to the input
                                                                                            onChange={(e) => handleInputChange(e, item.id)}
                                                                                            className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
                                                                                            onKeyDown={(e) => handleKeyDownWhenEdit(e)}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            //max-w-[230px]
                                                                                            className='hover:ring-2 break-words ring-white pl-[13px] pr-[17px] pb-[13px] pt-[17px] rounded-xl bg-[#22272B] text-[#A1ACB5]'>
                                                                                            {item.value}
                                                                                        </div>
                                                                                    )}
                                                                                    {/* Pencil Icon */}
                                                                                    <div className="absolute flex gap-x-[4px] top-1/2 right-[5px]">
                                                                                        <div className=' text-[#A1ACB5] hover:text-white bg-[#101204] hover:opacity-90 rounded-full p-[6px] cursor-pointer transition-transform -translate-y-1/2'>
                                                                                            <FiEdit2
                                                                                                className=''
                                                                                                onClick={() => handleEditClick(item.id, item.value)} // Enable input editing on click
                                                                                            />
                                                                                        </div>
                                                                                        <div className=' text-[#A1ACB5] hover:text-white bg-[#101204] hover:opacity-90 rounded-full p-[6px] cursor-pointer transition-transform -translate-y-1/2'>
                                                                                            <FiTrash
                                                                                                onClick={() => handleDeleteInput(item.id)}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </Draggable>
                                                                ))}

                                                            {/* Conditionally Show New Input Field */}
                                                            {addingCardIndex === item.id && isAddingNewCard && (
                                                                <div className='relative mt-4'>
                                                                    <input
                                                                        type='text'
                                                                        value={newInput}
                                                                        onChange={(e) => setNewInput(e.target.value)}
                                                                        onKeyDown={(e) => handleKeyDown(e, item.id)} // Handle pressing "Enter" key
                                                                        ref={inputRef} // Attach ref to the input
                                                                        placeholder=''
                                                                        className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5]  cursor-text hover:ring-2 ring-white'
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
                                                < div className='sticky hover:translate-y-[1px] transition-transform bottom-0 z-10 items-baseline' >
                                                    {/* Add Card Button */}
                                                    < div
                                                        className='flex flex-row items-center gap-x-[11px] mt-[20px] mb-[15px] hover:bg-gray-800 rounded-md p-2 text-[#7B868E] cursor-pointer'
                                                        onClick={() => handleAddingNewCardInput(item.id)} // Show new input field when clicked
                                                    >
                                                        <FaPlus />
                                                        <span className='text-[14px] font-[400]'>Add a card</span>
                                                    </div>

                                                </div>
                                                {/* </> */}
                                                {/* )} */}
                                                {/* {provided.placeholder} Keep the provided placeholder for layout */}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {/* {provided.placeholder} */}
                            {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
                                <div
                                    className="placeholder"
                                    style={{
                                        top: placeholderProps.clientY,
                                        left: placeholderProps.clientX,
                                        height: placeholderProps.clientHeight,
                                        width: placeholderProps.clientWidth,
                                    }}
                                />
                            )}

                            {/* Old */}
                            {/* {snapshot.isDraggingOver && (
                                <div className="p-[8px] w-[275px] rounded-2xl opacity-50 bg-white"></div>
                            )} */}
                            {/* {provided.placeholder} */}
                        </div>
                    )}
            </Droppable>
        </DndContext >
    )
}

export default HeroD