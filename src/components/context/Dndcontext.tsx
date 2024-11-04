"use client";

import { DragDropContext, DragStart, DropResult } from 'react-beautiful-dnd';


export const DndContext = ({ children, onDragEnd, onDragStart }: {
    children: React.ReactNode,
    onDragEnd: (result: DropResult) => void
    onDragStart?: (result: DragStart) => void
}) => {

    return <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {children}
    </DragDropContext>
}


