import React, { useState, useRef } from 'react';

const FreeItemsForm = ({ freeItems, handleFreeItemChange, addFreeItem, removeFreeItem, setFreeItems }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const containerRef = useRef(null);
  
  const handleDragStart = (e, index) => {
    // Only allow drag from handle element
    if (!e.target.closest('.drag-handle')) {
      e.preventDefault();
      return;
    }
    
    setDraggedItem(index);
    // Add styling during drag
    e.currentTarget.classList.add('opacity-75', 'border-green-400', 'shadow-lg');
  };

  const handleDragEnter = (e, index) => {
    setDraggedOverItem(index);
    // Add visual indication of drop target
    e.currentTarget.classList.add('border-green-400', 'bg-green-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-green-400', 'bg-green-50');
  };

  const handleDragEnd = (e) => {
    // Remove styling
    e.currentTarget.classList.remove('opacity-75', 'border-green-400', 'shadow-lg');
    
    // Reorder if needed
    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      const reorderedItems = [...freeItems];
      const draggedItemContent = reorderedItems[draggedItem];
      
      // Remove from original position
      reorderedItems.splice(draggedItem, 1);
      
      // Insert at new position
      reorderedItems.splice(draggedOverItem, 0, draggedItemContent);
      
      // Update state
      setFreeItems(reorderedItems);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDraggedOverItem(null);
    
    // Clean up any remaining styling
    if (containerRef.current) {
      containerRef.current.querySelectorAll('.free-item').forEach(item => {
        item.classList.remove('border-green-400', 'bg-green-50', 'opacity-75', 'shadow-lg');
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Free Items
      </h2>
      
      <div className="space-y-3" ref={containerRef}>
        {freeItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 bg-white p-4 rounded-lg border border-gray-200 free-item shadow-sm hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDragEnd}
          >
            <div className="cursor-grab p-2 rounded-md bg-green-50 hover:bg-green-100 text-green-600 drag-handle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Description of free item"
                value={item.description}
                onChange={(e) => handleFreeItemChange(index, e.target.value)}
                className="shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            <button 
              type="button" 
              className="bg-red-500 hover:bg-red-600 text-white rounded-full h-9 w-9 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-colors"
              onClick={() => removeFreeItem(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md transition-all flex items-center justify-center"
        onClick={addFreeItem}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Free Item
      </button>

      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Pro Tip</h3>
            <div className="mt-1 text-sm text-green-700">
              <p>Adding free items can make your quote more attractive to clients.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeItemsForm;
