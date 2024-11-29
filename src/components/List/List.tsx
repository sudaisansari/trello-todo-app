"use client"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loggedInUser, reorderCardItems, reorderCards, setCardsData } from "@/store/slice";
import { useDispatch } from "react-redux";
import { DragStart, DragUpdate, DropResult } from "react-beautiful-dnd";
import { DndContext } from "@/context/Dndcontext";
import { Cards, Item, PH, RootState } from "@/types/types";
import { fetchDataFromFirebase } from "@/config/firebase";
import { useUserAuth } from "@/context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DroppableCard from "./DroppableCard";
import dynamic from "next/dynamic";

const DynamicModal = dynamic(() => import("@/components/Modal/Modal"), { ssr: false })

const List = () => {
    const data = useSelector((state: RootState) => state.cardsArray || []);
    const dispatch = useDispatch();
    const { user } = useUserAuth();
    const [isDragging, setIsDragging] = useState(false)

    const handleLogin = (user: { email: string; id: string }) => {
        dispatch(loggedInUser(user));
    };
    if (user) {
        handleLogin({ email: user.email!, id: user.uid });
    }

    useEffect(() => {
        if (user) {
            const firestoreData = fetchDataFromFirebase(user.uid, (cardsArray: Cards[]) => {
                dispatch(setCardsData(cardsArray));
            });
            return () => firestoreData(); // Clean up listener on unmount
        }
    }, [user]);
    console.log("Redux data : ", data)

    // DND
    const [placeholderProps, setPlaceholderProps] = useState<PH>()
    const queryAttr = "data-rbd-drag-handle-draggable-id";
    const [pl, setPl] = useState<number>()

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
                    const clientX = 16
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
                else if (sourceIndex >= 0) {
                    const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                        [...parentNode.children]
                            .slice(0, sourceIndex)
                            .reduce((total, curr) => {
                                const style = window.getComputedStyle(curr);
                                const marginRight = parseFloat(style.marginRight);
                                const additionalGap = sourceIndex * 16 + 16
                                const gapToAdd = additionalGap / sourceIndex
                                return total + curr.clientWidth + marginRight + gapToAdd;
                            }, 0);
                    console.log("Client X : ", clientX)
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
            } else if (destinationIndex >= 1) {
                const clientX = parseFloat(window.getComputedStyle(parentNode).paddingLeft) +
                    [...parentNode.children]
                        .slice(0, destinationIndex) // Or `sourceIndex` in case of `dragStart`
                        .reduce((total, curr) => {
                            const style = window.getComputedStyle(curr);
                            const marginRight = parseFloat(style.marginRight);
                            // return total + curr.clientWidth + marginRight + 32; // 16px gap added here
                            const additionalGap = destinationIndex * 16 + 16
                            const gapToAdd = additionalGap / destinationIndex
                            return total + curr.clientWidth + marginRight + gapToAdd;
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
    }

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

    // Modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const handleInputClick = (item: Item) => {
        setSelectedItem(item);  // Store the clicked item, if needed
        setModalOpen(true);     // Open the modal
    };
    const closeModal = () => setModalOpen(false);

    return (
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <DroppableCard
                handleInputClick={handleInputClick}
                data={data}
                placeholderProps={placeholderProps}
            />
            <DynamicModal isOpen={isModalOpen} onClose={closeModal} Item={selectedItem} />
        </DndContext>
    )
}

export default List