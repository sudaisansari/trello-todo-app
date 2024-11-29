import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import { isEmpty } from "lodash";
import { Cards, Item, PH } from "@/types/types";

interface DroppableAreaProps {
  data: Cards[];
  placeholderProps: PH | undefined;
  handleInputClick: (item: Item) => void;
}

const DroppableCard: React.FC<DroppableAreaProps> = ({ data, placeholderProps, handleInputClick }) => (
  <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
    {(provided, snapshot) => (
      <div 
        {...provided.droppableProps}
        ref={provided.innerRef}
        className={`overflow-x-auto h-[362px] md:h-[392px] lg:h-[434px] relative flex items-start justify-start pt-4`}
      >
        {data.map((item, index) => (
          <DraggableCard handleInputClick={handleInputClick} key={item.id} item={item} index={index} />
        ))}
        {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
          <div
            className="absolute rounded-xl bg-black opacity-20"
            style={{
              top: 16,
              left: placeholderProps.clientX,
              height: placeholderProps.clientHeight,
              width: placeholderProps.clientWidth,
            }}
          />
        )}
      </div>
    )}
  </Droppable>
);

export default DroppableCard;
