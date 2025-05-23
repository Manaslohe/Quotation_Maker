import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_TERMS = [
  `Scope of Work: The quotation is based on a general understanding of the client's requirements: complete redesign, new backend architecture, AI feature integration, and admin panel.
Any feature not currently present on the website (other than AI and admin panel) will be considered as add-on and charged additionally.
Final design and features must be finalized before development begins. Significant changes during development may affect the timeline and cost.`,
  `Timeline: Estimated delivery timeline will be shared post finalization of features and UI/UX design.`,
  `Payment Terms: 30% advance payment before the commencement of work.
Payments are non-refundable once a milestone is completed and approved.
Delay in client feedback or asset submission (e.g., content, images) may result in timeline extension.`
];

const PageChargesForm = ({
  pages,
  handlePageChange,
  addPage,
  removePage,
  setPages,
  terms: propTerms,
  setTerms: propSetTerms,
  freeItemsForm // <-- expect FreeItemsForm JSX here
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const containerRef = useRef(null);

  // Local state fallback for terms if not provided by parent
  const [localTerms, setLocalTerms] = useState(() =>
    propTerms && propTerms.length ? propTerms : DEFAULT_TERMS
  );

  // Use prop if provided, else local state
  const terms = propTerms !== undefined ? propTerms : localTerms;
  const setTerms = propSetTerms !== undefined ? propSetTerms : setLocalTerms;

  // Initialize terms if not set
  useEffect(() => {
    if (!terms || !terms.length) {
      setTerms(DEFAULT_TERMS);
    }
    // eslint-disable-next-line
  }, []);

  const handleDragStart = (e, index) => {
    // Only allow drag from handle element
    if (!e.target.closest('.drag-handle')) {
      e.preventDefault();
      return;
    }
    setDraggedItem(index);
    e.currentTarget.classList.add('opacity-75', 'border-blue-400', 'shadow-lg');
  };

  const handleDragEnter = (e, index) => {
    setDraggedOverItem(index);
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-75', 'border-blue-400', 'shadow-lg');

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
        item.classList.remove('border-blue-400', 'bg-blue-50', 'opacity-75', 'shadow-lg');
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Page Charges
      </h2>
      <div className="space-y-3" ref={containerRef}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="flex items-center space-x-2 bg-white p-4 rounded-lg border border-gray-200 page-item shadow-sm hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDragEnd}
          >
            <div
              className="cursor-grab p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 drag-handle"
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
                className="shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="w-1/4 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                ₹
              </span>
              <input
                type="number"
                placeholder="Charge"
                value={page.charge}
                onChange={(e) => handlePageChange(index, 'charge', e.target.value)}
                className="shadow-sm appearance-none border rounded-lg w-full py-2.5 pl-8 pr-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {pages.length > 1 && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white rounded-full h-9 w-9 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-colors"
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
        className="mt-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all flex items-center justify-center"
        onClick={addPage}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Page
      </button>

      {/* Free Items Form - moved above Terms & Conditions */}
      <div className="mt-8">
        {freeItemsForm}
      </div>

      {/* Terms & Conditions Input - improved styling */}
      <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <label className="block text-gray-800 font-medium mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Terms & Conditions
        </label>
        <p className="text-sm text-gray-500 mb-3">Separate each section with a blank line</p>
        <textarea
          value={(terms || []).join('\n\n')}
          onChange={e =>
            setTerms(
              e.target.value
                .split(/\n\s*\n/)
                .map(s => s.trim())
                .filter(Boolean)
            )
          }
          rows={8}
          className="w-full border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter terms and conditions, separate each section by a blank line."
        />
      </div>
    </section>
  );
};

export default PageChargesForm;
