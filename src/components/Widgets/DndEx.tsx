"use client"

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

const cardsData = [
    {
      id: 0,
      title: "Component Librarys",
      components: [
        {
          id: 100,
          name: "material ui"
        },
        {
          id: 200,
          name: "bootstrap"
        },
      ]
    },
    {
      id: 1,
      title: "Javascript Librarys",
      components: [
        {
          id: 300,
          name: "react"
        },
        {
          id: 400,
          name: "node"
        },
      ]
    },
    {
      id: 2,
      title: "react helping Librarys",
      components: [
        {
          id: 500,
          name: "redux"
        },
        {
          id: 600,
          name: "recoil"
        },
      ]
    }
  
  
  ]
  
  
  

interface Cards {
    id: number;
    title: string;
    components: {
        id: number;
        name: string;
    }[];
}
const DndEx = () => {
    const [data, setData] = useState<Cards[]>([]);
  
    const onDragEnd = (result: DropResult) => {
      const { source, destination, type } = result;
  
      // If no destination, return
      if (!destination) return;
  
      if (type === "COLUMN") {
        // Handle column reordering
        const newData = [...data];
        const [movedColumn] = newData.splice(source.index, 1);
        newData.splice(destination.index, 0, movedColumn);
        setData(newData);
      } else {
        // Handle items within columns
        const newData = [...data];
        const sourceColumnIndex = newData.findIndex(
          (col) => col.id.toString() === source.droppableId.split("droppable")[1]
        );
        const destinationColumnIndex = newData.findIndex(
          (col) => col.id.toString() === destination.droppableId.split("droppable")[1]
        );
  
        // Handle moving item from source column
        const [movedItem] = newData[sourceColumnIndex].components.splice(source.index, 1);
  
        // Handle adding item to the destination column
        newData[destinationColumnIndex].components.splice(destination.index, 0, movedItem);
  
        setData(newData);
      }
    };
  
    useEffect(() => {
      setData(cardsData); // Initialize data
    }, []);

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <h1 className="text-center mt-8 mb-3 font-bold text-[25px]">Drag and Drop Application</h1>
        <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 bg-red-800 justify-between my-20 mx-4 flex-col lg:flex-row"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((val, index) => (
                <Draggable key={val.id} draggableId={`draggable-column-${val.id}`} index={index}>
                  {(provided) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="p-5 lg:w-1/3 w-full bg-white border-gray-400 border border-dashed"
                    >
                      <Droppable key={index} droppableId={`droppable${val.id}`} type="ITEM">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            <h2 className="text-center font-bold mb-6 text-black">{val.title}</h2>
                            {val.components.length > 0 ? (
                              val.components.map((component, index) => (
                                <Draggable key={component.id} draggableId={`item-${component.id}`} index={index}>
                                  {(provided) => (
                                    <div
                                      className="bg-green-400 mx-1 px-4 py-3 my-3"
                                      {...provided.dragHandleProps}
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                    >
                                      {component.name}
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : (
                                <div className="text-center text-gray-500">
                                    <h2 className="invisible">No items</h2>
                                    </div> // use this div because empty column does not work 
                              )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  
export default DndEx;
