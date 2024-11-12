"use client"
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";
import { addCardInput, deleteCard, deleteCardInput, editTitle, reorderCardItems, reorderCards, setCardsData, updateCardInput } from "@/app/redux/slice";
import { useDispatch } from "react-redux";
import { Draggable, DragStart, DragUpdate, Droppable, DropResult } from "react-beautiful-dnd";
import { DndContext } from "@/components/context/Dndcontext";
import { RootState } from "@/components/shared/types";
import { subscribeToUserData } from "@/components/shared/fetchFirestoreData";
import { useUserAuth } from "../context/AuthContext";
import { isEmpty } from "lodash"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const dispatch = useDispatch();
    const { user } = useUserAuth(); // To get the logged-in user
    const [cardsArray, setCardsArray] = useState<CardData[]>([]); // Define type of cardsArray
    const cardDeleted = () => toast("Card Deleted");
    const listDeleted = () => toast("List Deleted");
    const [isDragging, setIsDragging] = useState(false)


    // Dnd
    interface PH {
        clientHeight: number;
        clientWidth: number;
        clientY: number;
        clientX: number;
    }
    const [placeholderProps, setPlaceholderProps] = useState<PH>()
    const queryAttr = "data-rbd-drag-handle-draggable-id";
    const [pl, setPl] = useState<number>()


    // useEffect(() => {
    //     if (user) {
    //         const unsubscribe = subscribeToUserData(user.uid, setCardsArray);
    //         return () => unsubscribe(); // Unsubscribe when the component unmounts
    //     }
    // }, [user]);
    useEffect(() => {
        if (user) {
            const unsubscribe = subscribeToUserData(user.uid, (cardsArray) => {
                setCardsArray(cardsArray); // Update local state if needed
                dispatch(setCardsData(cardsArray)); // Update Redux state
            });
            return () => unsubscribe(); // Clean up listener on unmount
        }
    }, [user, dispatch]);
    console.log("Firestore data: ", cardsArray, " User ID: ", user?.uid);
    console.log("Redux Data : ", data)

    const handleEditClick = (id: string, todo: string) => {
        setEditingIndex(id); // Set the index of the input being edited
        setCurrentTodo(todo)
        console.log("Editing Index : ", id)
    };

    const handleDeleteInput = (id: string) => {
        cardDeleted()
        dispatch(deleteCardInput(id))
    }

    const handleDeleteCard = (id: string) => {
        listDeleted()
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
        // dispatch(updateCardInput({ id, input: newTodo }));
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
            if (currentTodo.trim() === '') {
                // setShowInputError(true)
                setEditingIndex(null)
                console.log("No input")
            }
            else {
                setEditingIndex(null) // old only this
                setShowInputError(false)
                dispatch(updateCardInput({ id: editingIndex, input: currentTodo }));
                setCurrentTodo('')
                setIsAddingNewCard(false)
            }
        }
    };

    // DND
    const getDraggedDom = (draggableId: string): HTMLElement | null => {
        const domQuery = `[${queryAttr}='${draggableId}']`;
        const draggedDOM = document.querySelector(domQuery) as HTMLElement | null;
        return draggedDOM;
    };

    const onDragStart = (result: DragStart) => {
        const { draggableId } = result // old
        const sourceIndex = result.source.index
        console.log("S I : ", sourceIndex)
        if (draggableId.includes("card-")) { // old
            setIsDragging(true);  //old
            console.log("On Drag Start", isDragging)
            const draggedDOM = getDraggedDom(result.draggableId);
            if (!draggedDOM) {
                return;
            }
            const { clientHeight, clientWidth } = draggedDOM;
            const parentNode = draggedDOM.parentNode;
            console.log("Parent N : ", parentNode)
            if (parentNode instanceof Element) { // Ensure parentNode is an Element
                if (sourceIndex === 0) {
                    const clientX = 16;
                    setPl(clientX)
                    setPlaceholderProps({
                        clientHeight,
                        clientWidth,
                        clientY: parseFloat(
                            window.getComputedStyle(parentNode).paddingLeft
                        ),
                        clientX: clientX
                    });
                }
                else if (sourceIndex === 1) {
                    const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                        [...parentNode.children]
                            .slice(0, sourceIndex)
                            .reduce((total, curr) => {
                                const style = window.getComputedStyle(curr);
                                const marginRight = parseFloat(style.marginRight); // Use marginRight for horizontal space
                                const additionalGap = sourceIndex * 16 // Add gap except after the last element
                                return total + curr.clientWidth + marginRight + 16 + additionalGap;
                            }, 0);
                    setPl(clientX)
                    setPlaceholderProps({
                        clientHeight,
                        clientWidth,
                        clientY: parseFloat(
                            window.getComputedStyle(parentNode).paddingLeft
                        ),
                        clientX: clientX
                    });
                } else if (sourceIndex > 1) {
                    const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                        [...parentNode.children]
                            .slice(0, sourceIndex)
                            .reduce((total, curr) => {
                                const style = window.getComputedStyle(curr);
                                const marginRight = parseFloat(style.marginRight); // Use marginRight for horizontal space
                                const additionalGap = sourceIndex * 16 + 16 // Add gap except after the last element
                                const gapToAdd = additionalGap / sourceIndex
                                return total + curr.clientWidth + marginRight + gapToAdd;
                            }, 0);
                    setPl(clientX)
                    setPlaceholderProps({
                        clientHeight,
                        clientWidth,
                        clientY: parseFloat(
                            window.getComputedStyle(parentNode).paddingLeft
                        ),
                        clientX: clientX
                    });
                }

            }
        };
    }
    useEffect(() => {
        console.log("Updated Placeholder Props:", placeholderProps);
        console.log("P L : ", pl)
    }, [placeholderProps, pl]);

    const onDragUpdate = (event: DragUpdate) => {
        console.log("On Drag Update", isDragging)
        const draggedDOM = getDraggedDom(event.draggableId);
        if (!event.destination) {
            return;
        }
        if (!draggedDOM) {
            return;
        }
        const { clientHeight, clientWidth } = draggedDOM;
        const destinationIndex = event.destination.index;
        const sourceIndex = event.source.index;
        const parentNode = draggedDOM.parentNode; // change
        if (parentNode instanceof Element) {
            const childrenArray = [...parentNode.children];
            childrenArray.splice(sourceIndex, 1);
            if (destinationIndex === 0) {
                const clientX = 16;
                setPl(clientX);
                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY: parseFloat(window.getComputedStyle(parentNode).paddingTop), // Use paddingTop if needed
                    clientX: clientX
                });
            } else if (destinationIndex === 1) {
                const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                    [...parentNode.children]
                        .slice(0, destinationIndex) // Or `sourceIndex` in case of `dragStart`
                        .reduce((total, curr) => {
                            const style = window.getComputedStyle(curr);
                            const marginRight = parseFloat(style.marginRight);
                            return total + curr.clientWidth + marginRight + 16 + 16; // 16px gap added here
                        }, 0);

                // Set placeholder properties for positioning
                setPl(clientX);
                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY: parseFloat(window.getComputedStyle(parentNode).paddingTop), // Use paddingTop if needed
                    clientX: clientX
                });
            }
            else if (destinationIndex > 1 && childrenArray.length) {
                const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                    [...parentNode.children]
                        .slice(0, destinationIndex) // Or `sourceIndex` in case of `dragStart`
                        .reduce((total, curr) => {
                            const style = window.getComputedStyle(curr);
                            const marginRight = parseFloat(style.marginRight);
                            const additionalGap = destinationIndex * 16 + 16 // Add gap except after the last element
                            const gapToAdd = additionalGap / destinationIndex
                            return total + curr.clientWidth + marginRight + gapToAdd; // 16px gap added here
                        }, 0);

                // Set placeholder properties for positioning
                setPl(clientX);
                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY: parseFloat(window.getComputedStyle(parentNode).paddingTop), // Use paddingTop if needed
                    clientX: clientX
                });
            }

        }
    };


    const onDragEnd = (result: DropResult) => {
        setPlaceholderProps({
            clientHeight: 0,
            clientWidth: 0,
            clientY: 0,
            clientX: 0,
        });

        setIsDragging(false);  //old
        console.log("On Drag End", isDragging)
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
                    //setShowInputError(false)
                    console.log("No input")
                    setTitleIndex(null)
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
                if (currentTodo.trim() === '') {
                    console.log("No todo")
                    setEditingIndex(null)
                } else {
                    dispatch(updateCardInput({ id: editingIndex, input: currentTodo }));
                    setEditingIndex(null); // Reset edit mode
                    setCurrentTodo('')
                    setIsAddingNewCard(false)
                }
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
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
                {
                    (provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`relative  flex items-start justify-start pt-4`}>
                            {
                                data.map((item, index) => (
                                    <Draggable key={item.id} draggableId={`card-${item.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                // key={index}
                                                className='bg-[#E5E7EB] ml-[16px] p-[4px] min-w-[275px] max-w-[272px] rounded-2xl'
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
                                                                onChange={(e) => handleTitleChange(e, item.id)}
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
                                                        <div
                                                            onClick={() => handleEditTitleClick(item.id, item.title)}
                                                            className='hover:translate-y-[1px] transition-transform cursor-pointer'>
                                                            <FiEdit2
                                                                className='text-black text-[20px]'
                                                            />
                                                        </div>
                                                        <div
                                                            onClick={() => handleDeleteCard(item.id)}
                                                            className='hover:translate-y-[1px] transition-transform cursor-pointer'>
                                                            <FiTrash
                                                                className='text-black text-[20px]'
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
                                                            className='px-2 pb-2 pt-1 flex flex-col gap-y-[8px] max-h-[120px] md:max-h-[180px] lg:max-h-[230px] overflow-y-auto'>
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
                                                                                            value={currentTodo}
                                                                                            ref={inputRef} // Attach ref to the input
                                                                                            onChange={(e) => handleInputChange(e, item.id)}
                                                                                            className='py-[8px] pl-[12px] pr-[56px] tracking-wide w-full rounded-xl bg-[#6E776B] text-[#F4F4F4] hover:ring-2 ring-white cursor-text'
                                                                                            onKeyDown={(e) => handleKeyDownWhenEdit(e)}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            //max-w-[230px]
                                                                                            className='hover:ring-2 tracking-wide break-words ring-black py-[8px] px-[12px] rounded-xl bg-[#6E776B] text-[#F4F4F4]'>
                                                                                            {item.value}
                                                                                        </div>
                                                                                    )}
                                                                                    {/* Pencil Icon */}
                                                                                    <div className="absolute flex gap-x-[px] top-1/2 right-[5px]">
                                                                                        <div
                                                                                            onClick={() => handleEditClick(item.id, item.value)} // Enable input editing on click
                                                                                            className=' text-black bg-[#6E776B] hover:opacity-90 rounded-full p-[3px] cursor-pointer transition-transform -translate-y-1/2'>
                                                                                            <FiEdit2
                                                                                                className="text-[18px]"
                                                                                            />
                                                                                        </div>
                                                                                        <div
                                                                                            onClick={() => handleDeleteInput(item.id)}
                                                                                            className=' text-black bg-[#6E776B] hover:opacity-90 rounded-full p-[3px] cursor-pointer transition-transform -translate-y-1/2'>
                                                                                            <FiTrash
                                                                                                className="text-[18px]"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </Draggable>
                                                                ))}

                                                            {/* Conditionally Show New Input Field */}
                                                            {addingCardIndex === item.id && isAddingNewCard && (
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
                                                < div className=' hover:translate-y-[1px] px-2 transition-transform bottom-0 z- items-baseline' >
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
                                ))}
                            {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
                                <div
                                    className="absolute rounded-xl bg-black opacity-20"
                                    style={{
                                        // position: 'absolute',
                                        top: 16,
                                        left: placeholderProps.clientX,
                                        height: placeholderProps.clientHeight,
                                        width: placeholderProps.clientWidth,
                                    }}
                                />
                            )}
                            {/* {snapshot.isDraggingOver && (
                                <div className="p-[8px] mr-[16px] bg-slate-400 w-[275px] rounded-2xl opacity-50"></div>
                            )} */}

                            {/* {provided.placeholder} */}
                        </div>
                    )}
            </Droppable>
        </DndContext >
    )
}

export default HeroD