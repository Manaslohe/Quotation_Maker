import React, { useState, useRef } from 'react';

const PageChargesForm = ({ pages, handlePageChange, addPage, removePage, setPages }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const containerRef = useRef(null);

  const handleDragStart = (e, index) => {
    // Prevent drag if target is an input
    if (e.target.tagName.toLowerCase() === 'input') {
      e.preventDefault();
      return;
    }
    setDraggedItem(index);
    e.currentTarget.classList.add('opacity-50', 'border-blue-400', 'shadow-lg');
  };

  const handleDragEnter = (e, index) => {
    setDraggedOverItem(index);
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'border-blue-400', 'shadow-lg');

    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      const reorderedPages = [...pages];
      const draggedItemContent = reorderedPages[draggedItem];

      reorderedPages.splice(draggedItem, 1);
      reorderedPages.splice(draggedOverItem, 0, draggedItemContent);

      setPages(reorderedPages);
    }

    setDraggedItem(null);
    setDraggedOverItem(null);

    if (containerRef.current) {
      containerRef.current.querySelectorAll('.page-item').forEach(item => {
        item.classList.remove('border-blue-400', 'bg-blue-50', 'opacity-50', 'shadow-lg');
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Page Charges</h2>

      <div className="space-y-3" ref={containerRef}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 page-item shadow-sm hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDragEnd}
          >
            <div
              className="cursor-grab p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
              onMouseDown={(e) => {
                if (e.target.closest('.cursor-grab')) {
                  e.currentTarget.parentElement.draggable = true;
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.parentElement.draggable = false;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Page name or description"
                value={page.name}
                onChange={(e) => handlePageChange(index, 'name', e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onMouseDown={(e) => {
                  e.currentTarget.parentElement.parentElement.draggable = false;
                }}
              />
            </div>
            <div className="w-1/4 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                ₹
              </span>
              <input
                type="number"
                placeholder="Charge"
                value={page.charge}
                onChange={(e) => handlePageChange(index, 'charge', e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onMouseDown={(e) => {
                  e.currentTarget.parentElement.parentElement.draggable = false;
                }}
              />
            </div>
            {pages.length > 1 && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => removePage(index)}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all flex items-center justify-center"
        onClick={addPage}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Page
      </button>
    </section>
  );
};

export default PageChargesForm;
