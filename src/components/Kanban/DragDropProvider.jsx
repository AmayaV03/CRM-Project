import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

export const DragDropProvider = ({ children, onDragEnd }) => {
  const handleDragStart = (start, provided) => {
    console.log('Drag started:', start);
  };

  const handleDragUpdate = (update, provided) => {
    console.log('Drag update:', update);
  };

  const handleDragEnd = (result, provided) => {
    console.log('Drag end:', result);
    
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) {
      console.log('Dropped outside the list');
      return;
    }
    
    // No change in status
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      console.log('No change in position');
      return;
    }
    
    try {
      onDragEnd(result);
    } catch (error) {
      console.error('Error in drag end handler:', error);
    }
  };

  return (
    <DragDropContext 
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropContext>
  );
};
