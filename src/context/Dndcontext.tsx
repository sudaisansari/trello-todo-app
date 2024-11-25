"use client";

import { DragDropContext, DragStart, DragUpdate, DropResult } from 'react-beautiful-dnd';


export const DndContext = ({ children, onDragEnd, onDragStart, onDragUpdate }: {
    children: React.ReactNode,
    onDragEnd: (result: DropResult) => void
    onDragStart?: (result: DragStart) => void
    onDragUpdate?: (result: DragUpdate) => void
}) => {

    return <DragDropContext onDragUpdate={onDragUpdate} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {children}
    </DragDropContext>
}


