import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveQuotation } from '../store/quotationsSlice';

const DEFAULT_TERMS = [
  `Scope of Work: The quotation is based on a general understanding of the client's requirements: complete redesign, new backend architecture, AI feature integration, and admin panel.
Any feature not currently present on the website (other than AI and admin panel) will be considered as add-on and charged additionally.
Final design and features must be finalized before development begins. Significant changes during development may affect the timeline and cost.`,
  `Timeline: Estimated delivery timeline will be shared post finalization of features and UI/UX design.`,
  `Payment Terms: 30% advance payment before the commencement of work.
Payments are non-refundable once a milestone is completed and approved.
Delay in client feedback or asset submission (e.g., content, images) may result in timeline extension.`
];

const QuotePreview = ({ clientInfo, pages, freeItems, calculateTotal, terms }) => {
  const dispatch = useDispatch();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const contentRef = useRef(null);

  const handleSaveQuotation = () => {
    setShowSaveDialog(true);
    setQuoteName(clientInfo?.name || '');
  };

  const handleSave = () => {
    if (!quoteName.trim()) {
      alert('Please enter a name for the quotation');
      return;
    }
    const quotationData = {
      name: quoteName,
      clientInfo,
      pages,
      freeItems,
      total: calculateTotal(),
      terms, // Save terms with the quotation
      date: new Date().toISOString()
    };
    dispatch(saveQuotation(quotationData));
    setQuoteName('');
    setShowSaveDialog(false);
  };

  // --- Improved preview layout ---
  const PreviewContent = (
    <div
      ref={contentRef}
      id="quote-pdf-content"
      className="bg-white border border-gray-300 rounded-lg shadow-lg p-10 mx-auto"
      style={{
        width: 900,
        minHeight: 900,
        margin: '0 auto',
        fontSize: 18,
        boxSizing: 'border-box',
      }}
    >
      <div className="flex justify-between items-center border-b-2 border-indigo-600 pb-5 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600">QUOTATION</h2>
        </div>
        <div className="text-right">
          <div className="text-gray-600 text-lg font-medium">Date: {clientInfo.date}</div>
          <div className="text-gray-800 text-lg font-medium">
            Project Name: <span className="font-bold">{clientInfo.name || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-5 pb-2 border-b border-gray-200">Page Details</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-indigo-700 uppercase tracking-wider">Page</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-indigo-700 uppercase tracking-wider">Charge</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-gray-900">{page.name || 'Unnamed Page'}</td>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">
                    ₹{new Intl.NumberFormat('en-IN').format(page.charge || 0)}
                  </td>
                </tr>
              ))}
              <tr className="bg-indigo-100 font-bold">
                <td className="px-6 py-4 text-indigo-900 text-lg">Total</td>
                <td className="px-6 py-4 text-right text-indigo-900 text-lg">
                  ₹{new Intl.NumberFormat('en-IN').format(calculateTotal())}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {freeItems.some(item => item.description) && (
        <div className="mb-10 bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Free Items Included</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {freeItems.map((item, index) => (
              item.description && <li key={index} className="pl-2">{item.description}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8 text-sm text-gray-600 border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-3">Terms & Conditions:</h4>
        <ul className="list-disc pl-5 space-y-3">
          {(terms && terms.length ? terms : DEFAULT_TERMS).map((t, idx) => (
            <li key={idx} style={{ whiteSpace: 'pre-line' }} className="text-gray-700">{t}</li>
          ))}
        </ul>
      </div>

      <div className="text-center text-gray-700 italic mt-10 pt-6 border-t border-gray-200 bg-gray-50 p-6 rounded-lg shadow-inner">
        <p className="text-lg font-medium text-indigo-700">Thank you for the opportunity to work together!</p>
        <p className="text-sm text-gray-600 mt-1">Looking forward to creating something amazing with you.</p>
      </div>
    </div>
  );

  return (
    <div className="relative" style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <div className="flex justify-between items-center mb-6 gap-2" style={{ width: 900, margin: '0 auto' }}>
        <h2 className="text-2xl font-semibold text-gray-700">Quote Preview</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveQuotation}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
            </svg>
            Save Quote
          </button>
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 002 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            View Full Screen
          </button>
        </div>
      </div>

      {/* Improved Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 shadow-xl">
            <h3 className="text-xl font-medium mb-6 text-gray-800">Save Quotation</h3>
            <input
              type="text"
              value={quoteName}
              onChange={(e) => setQuoteName(e.target.value)}
              placeholder="Enter quotation name"
              className="w-full border-2 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Preview */}
      <div className="mb-16" style={{ width: 900, margin: '0 auto' }}>
        {PreviewContent}
      </div>

      {/* Improved Fullscreen Preview */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white w-auto h-auto max-w-full max-h-full overflow-y-auto rounded-lg shadow-2xl flex flex-col" style={{ padding: 32 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Quotation Preview</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
            <div className="overflow-y-auto">
              {PreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotePreview;
