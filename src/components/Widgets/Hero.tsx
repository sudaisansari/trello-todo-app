// "use client";

// import React, { useState } from 'react';
// import { FaPlus, FaIdCard } from "react-icons/fa6";
// import { FiEdit2 } from "react-icons/fi";
// import { Draggable, Droppable, } from "react-beautiful-dnd";
// import { DndContext } from '../context/Dndcontext';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { AddDoing, AddDone, AddTodo, updateDoing, updateDone, updateTodo } from '@/app/redux/slice';
// import HeadingandIcons from '../shared/Extra/HeadingandIcons';

// const Hero = () => {
//   //First Card
//   const [newInput, setNewInput] = useState(''); // State for new input
//   const [editingIndex, setEditingIndex] = useState<string | null>(null); // Track which input is being edited
//   const [isAddingNewCard, setIsAddingNewCard] = useState(false);

//   type Todo = {
//     id: string;
//     todo: string;
//   };

//   type cardsArray = {
//     id: string,
//     title: string,
//     inputs: {
//         id: string,
//         value: string
//     }
//   }

//   type RootState = {
//     todos: Todo[];
//     doing: Todo[];
//     done: Todo[];
//     cards: cardsArray[]
//   };

//   // Way to Display the array of cards
//   // const cards = useSelector((state:RootState) => state.cards)
//   // console.log("Cards : ", cards)
//   // cards.map((item)=>(item.title, item.inputs.value))

//   const dispatch = useDispatch()
//   const todoData = useSelector((state: RootState) => state.todos);
//   const doingData = useSelector((state: RootState) => state.doing);
//   const doneData = useSelector((state: RootState) => state.done);

//   const handleAddNewInput = () => {
//     if (newInput) {
//       console.log("New Input : ", newInput)
//       setNewInput(''); // Clear the input field
//       setIsAddingNewCard(false); // Hide the new input field after adding
//     }
//   };

//   const addTodoDispatcher = () => {
//     console.log("Added new Input : ", newInput)
//     dispatch(AddTodo(newInput))
//   }

//   const handleEditClick = (index: string) => {
//     setEditingIndex(index); // Set the index of the input being edited
//     console.log("Editing Index : ", index)
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
//     const newTodo = e.target.value
//     dispatch(updateTodo({ id, newTodo }));
//     console.log("ID : ", id, "New Todo : ", newTodo)
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       addTodoDispatcher()
//       setNewInput('')
//       setIsAddingNewCard(false)
//     }
//   };

//   const handleKeyDownWhenEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       setNewInput('')
//       setIsAddingNewCard(false)
//     }
//   };

//   //Second Card
//   const [newInput2, setNewInput2] = useState(''); // State for new input
//   const [editingIndex2, setEditingIndex2] = useState<string | null>(null); // Track which input is being edited
//   const [isAddingNewCard2, setIsAddingNewCard2] = useState(false); // Track whether to show new input field

//   const handleAddNewInput2 = () => {
//     if (newInput2) {
//       console.log("New Input : ", newInput2)
//       setNewInput2(''); // Clear the input field
//       setIsAddingNewCard2(false); // Hide the new input field after adding
//     }
//   };

//   const addDoingDispatcher2 = () => {
//     console.log("Added new Input : ", newInput2)
//     dispatch(AddDoing(newInput2))
//   }

//   const handleEditClick2 = (index: string) => {
//     setEditingIndex2(index); // Set the index of the input being edited
//     console.log("Editing Index : ", index)
//   };

//   const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
//     const newTodo = e.target.value
//     dispatch(updateDoing({ id, newTodo }));
//     console.log("ID : ", id, "New Todo : ", newTodo)
//   };

//   const handleKeyDown2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       addDoingDispatcher2()
//       setNewInput2('')
//       setIsAddingNewCard2(false)
//     }
//   };

//   const handleKeyDownWhenEdit2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       setNewInput2('')
//       setIsAddingNewCard2(false)
//     }
//   };

//   // Third Card
//   const [newInput3, setNewInput3] = useState(''); // State for new input
//   const [editingIndex3, setEditingIndex3] = useState<string | null>(null); // Track which input is being edited
//   const [isAddingNewCard3, setIsAddingNewCard3] = useState(false); // Track whether to show new input field 

//   const handleAddNewInput3 = () => {
//     if (newInput3) {
//       console.log("New Input : ", newInput3)
//       setNewInput3(''); // Clear the input field
//       setIsAddingNewCard3(false); // Hide the new input field after adding
//     }
//   };

//   const addDoingDispatcher3 = () => {
//     console.log("Added new Input : ", newInput3)
//     dispatch(AddDone(newInput3))
//   }

//   const handleEditClick3 = (index: string) => {
//     setEditingIndex3(index); // Set the index of the input being edited
//     console.log("Editing Index : ", index)
//   };

//   const handleInputChange3 = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
//     const newTodo = e.target.value
//     dispatch(updateDone({ id, newTodo }));
//     console.log("ID : ", id, "New Todo : ", newTodo)
//   };

//   const handleKeyDown3 = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       addDoingDispatcher3()
//       setNewInput3('')
//       setIsAddingNewCard3(false)
//     }
//   };

//   const handleKeyDownWhenEdit3 = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       setNewInput3('')
//       setIsAddingNewCard3(false)
//     }
//   };

//   // DRAGE AND DROP
//   const onDragEnd = () => { }
//   //   const { source, destination } = result;

//   //   // If no destination, return early
//   //   if (!destination) return;

//   //   // Define columns based on droppableId
//   //   const columns = {
//   //     'todo-column': { data: data, setData: setData },
//   //     'doing-column': { data: data2, setData: setData2 },
//   //     'done-column': { data: data3, setData: setData3 }
//   //   };

//   //   const sourceColumn = columns[source.droppableId];
//   //   const destinationColumn = columns[destination.droppableId];

//   //   // If dragging and dropping within the same column
//   //   if (source.droppableId === destination.droppableId) {
//   //     const updatedColumnData = [...sourceColumn.data];
//   //     const [movedItem] = updatedColumnData.splice(source.index, 1);
//   //     updatedColumnData.splice(destination.index, 0, movedItem);
//   //     sourceColumn.setData(updatedColumnData); // Update the column
//   //   } else {
//   //     // If dragging between different columns
//   //     const sourceDataCopy = [...sourceColumn.data];
//   //     const destinationDataCopy = [...destinationColumn.data];

//   //     const [movedItem] = sourceDataCopy.splice(source.index, 1); // Remove item from source
//   //     destinationDataCopy.splice(destination.index, 0, movedItem); // Add to destination

//   //     // Update both source and destination columns
//   //     sourceColumn.setData(sourceDataCopy);
//   //     destinationColumn.setData(destinationDataCopy);
//   //   }
//   // };

//   return (
//     <DndContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
//         {(provided) => (
//           <div
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//             className='flex lg:flex-row flex-wrap items-center md:items-baseline justify-center pt-4 md:gap-[16px]'>
//             {/* FIRST CARD */}
//             <Droppable key={4} droppableId={"todo-column"} type="ITEM">
//               {(provided) => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   className='bg-[#101204] w-[272px] p-[8px] rounded-2xl'>
//                   {/* Heading and icons */}
//                   <HeadingandIcons heading='To do' />
//                   {/* Mapped Input Fields */}
//                   <div className='mt-[20px] flex flex-col gap-y-[7px]'>
//                     {todoData.map((item, index) => (
//                       <Draggable key={index} draggableId={`draggable-column-${index}`} index={index}>
//                         {(provided) => (
//                           <div
//                             {...provided.dragHandleProps}
//                             {...provided.draggableProps}
//                             ref={provided.innerRef}
//                             className='relative w-[254px]'>
//                             {editingIndex === item.id ? (
//                               <input
//                                 type='text'
//                                 value={item.todo}
//                                 onChange={(e) => handleInputChange(e, index)}
//                                 className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                                 onKeyDown={(e) => handleKeyDownWhenEdit(e)}
//                               />
//                             ) : (
//                               <div className='hover:ring-2 ring-white pl-[13px] pr-[17px] pb-[13px] pt-[17px] w-[254px] rounded-xl bg-[#22272B] text-[#A1ACB5]'>
//                                 {item.todo}
//                               </div>
//                             )}
//                             {/* Pencil Icon */}
//                             <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                               <FiEdit2
//                                 className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                                 onClick={() => handleEditClick(item.id)} // Enable input editing on click
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}

//                     {/* Conditionally Show New Input Field */}
//                     {isAddingNewCard && (
//                       <div className='relative w-[254px] mt-4'>
//                         <input
//                           type='text'
//                           value={newInput}
//                           onChange={(e) => setNewInput(e.target.value)}
//                           onKeyDown={handleKeyDown} // Handle pressing "Enter" key
//                           placeholder=''
//                           className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                         />
//                         {/* Pencil Icon */}
//                         <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                           <FiEdit2
//                             className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                             onClick={handleAddNewInput} // Add new input to data array
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Bottom */}
//                   < div className='flex flex-row justify-between items-baseline' >
//                     {/* Add Card Button */}
//                     < div
//                       className='flex flex-row items-center gap-x-[11px] mt-[20px] mb-[15px] hover:bg-gray-800 rounded-md p-2 text-[#7B868E] cursor-pointer'
//                       onClick={() => setIsAddingNewCard(true)} // Show new input field when clicked
//                     >
//                       <FaPlus />
//                       <span className='text-[14px] font-[400]'>Add a card</span>
//                     </div>
//                     {/* Template Icon */}
//                     <div className='mr-[15px]'>
//                       <FaIdCard className='text-white' />
//                     </div>
//                   </div>
//                   {/* <Bottom setIsAddingNewCard={setIsAddingNewCard(true)} /> */}
//                 </div>
//               )}
//             </Droppable>

//             {/* SECOND CARD */}
//             <Droppable key={4} droppableId={"doing-column"} type="ITEM">
//               {(provided) => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   className='bg-[#101204] md:mt-[60px] mt-[20px] w-[272px] p-[8px] rounded-2xl'>
//                   {/* Heading and icons */}
//                   <HeadingandIcons heading='Doing' />
//                   {/* Mapped Input Fields */}
//                   <div className='mt-[20px] flex flex-col gap-y-[7px]'>
//                     {doingData.map((item, index) => (
//                       <Draggable key={index} draggableId={`draggable-column-${index}`} index={index}>
//                         {(provided) => (
//                           <div
//                             className="relative w-[254px]"
//                             {...provided.dragHandleProps}
//                             {...provided.draggableProps}
//                           >
//                             {editingIndex2 === item.id ? (
//                               <input
//                                 type='text'
//                                 value={item.todo}
//                                 onChange={(e) => handleInputChange2(e, index)}
//                                 className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                                 onKeyDown={(e) => handleKeyDownWhenEdit2(e)}
//                               />
//                             ) : (
//                               <div className='hover:ring-2 ring-white pl-[13px] pr-[17px] pb-[13px] pt-[17px] w-[254px] rounded-xl bg-[#22272B] text-[#A1ACB5]'>
//                                 {item.todo}
//                               </div>
//                             )}
//                             {/* Pencil Icon */}
//                             <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                               <FiEdit2
//                                 className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                                 onClick={() => handleEditClick2(item.id)} // Enable input editing on click
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}

//                     {/* Conditionally Show New Input Field */}
//                     {isAddingNewCard2 && (
//                       <div className='relative w-[254px] mt-4'>
//                         <input
//                           type='text'
//                           value={newInput2}
//                           onChange={(e) => setNewInput2(e.target.value)}
//                           onKeyDown={handleKeyDown2} // Handle pressing "Enter" key
//                           placeholder='Enter a title or paste a link'
//                           className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                         />
//                         {/* Pencil Icon */}
//                         <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                           <FiEdit2
//                             className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                             onClick={handleAddNewInput2} // Add new input to data array
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Bottom */}
//                   < div className='flex flex-row justify-between items-baseline' >
//                     {/* Add Card Button */}
//                     < div
//                       className='flex flex-row items-center gap-x-[11px] mt-[20px] mb-[15px] hover:bg-gray-800 rounded-md p-2 text-[#7B868E] cursor-pointer'
//                       onClick={() => setIsAddingNewCard2(true)} // Show new input field when clicked
//                     >
//                       <FaPlus />
//                       <span className='text-[14px] font-[400]'>Add a card</span>
//                     </div>
//                     {/* Template Icon */}
//                     <div className='mr-[15px]'>
//                       <FaIdCard className='text-white' />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Droppable>

//             {/* THIRD CARD */}
//             <Droppable key={4} droppableId={"done-column"} type="ITEM">
//               {(provided) => (
//                 <div
//                   {...provided.droppableProps} ref={provided.innerRef}
//                   className='bg-[#101204] md:mt-[60px] mt-[20px] w-[272px] p-[8px] rounded-2xl'>
//                   {/* Heading and icons */}
//                   <HeadingandIcons heading='Done' />
//                   {/* Mapped Input Fields */}
//                   <div className='mt-[20px] flex flex-col gap-y-[7px]'>
//                     {doneData.map((item, index) => (
//                       <Draggable key={index} draggableId={`draggable-column-${index}`} index={index}>
//                         {(provided) => (
//                           <div
//                             {...provided.dragHandleProps}
//                             {...provided.draggableProps}
//                             className='relative w-[254px]'>
//                             {editingIndex3 === item.id ? (
//                               <input
//                                 type='text'
//                                 value={item.todo}
//                                 onChange={(e) => handleInputChange3(e, index)}
//                                 className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                                 onKeyDown={(e) => handleKeyDownWhenEdit3(e)}
//                               />
//                             ) : (
//                               <div className='hover:ring-2 ring-white pl-[13px] pr-[17px] pb-[13px] pt-[17px] w-[254px] rounded-xl bg-[#22272B] text-[#A1ACB5]'>
//                                 {item.todo}
//                               </div>
//                             )}
//                             {/* Pencil Icon */}
//                             <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                               <FiEdit2
//                                 className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                                 onClick={() => handleEditClick3(item.id)} // Enable input editing on click
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}

//                     {/* Conditionally Show New Input Field */}
//                     {isAddingNewCard3 && (
//                       <div className='relative w-[254px] mt-4'>
//                         <input
//                           type='text'
//                           value={newInput3}
//                           onChange={(e) => setNewInput3(e.target.value)}
//                           onKeyDown={handleKeyDown3} // Handle pressing "Enter" key
//                           placeholder='Enter a title or paste a link'
//                           className='pl-[13px] pr-[40px] pb-[13px] pt-[17px] w-full rounded-xl bg-[#22272B] text-[#A1ACB5] hover:ring-2 ring-white cursor-text'
//                         />
//                         {/* Pencil Icon */}
//                         <div className='absolute top-1/2 right-[10px] transform -translate-y-1/2'>
//                           <FiEdit2
//                             className='text-[#A1ACB5] hover:text-white cursor-pointer'
//                             onClick={handleAddNewInput3} // Add new input to data array
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Bottom */}
//                   < div className='flex flex-row justify-between items-baseline' >
//                     {/* Add Card Button */}
//                     < div
//                       className='flex flex-row items-center gap-x-[11px] mt-[20px] mb-[15px] hover:bg-gray-800 rounded-md p-2 text-[#7B868E] cursor-pointer'
//                       onClick={() => setIsAddingNewCard3(true)} // Show new input field when clicked
//                     >
//                       <FaPlus />
//                       <span className='text-[14px] font-[400]'>Add a card</span>
//                     </div>
//                     {/* Template Icon */}
//                     <div className='mr-[15px]'>
//                       <FaIdCard className='text-white' />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Droppable>
//           </div>
//         )
//         }
//       </Droppable >
//     </DndContext>

//   );
// };

// export default Hero;

