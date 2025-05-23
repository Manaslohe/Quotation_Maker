import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Layout = ({ children, onQuotationSelect }) => {
  // Sidebar visible by default for better UX
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQuotations, setShowQuotations] = useState(false);
  const quotations = useSelector(state => state.quotations.items);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - improved styling */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
            <h1 className="text-xl font-bold text-white">Quotation Maker</h1>
            <p className="text-indigo-200 text-sm mt-1">Create professional quotes</p>
          </div>
          <nav className="flex-1 p-4 space-y-3">
            <button 
              onClick={() => setShowQuotations(!showQuotations)}
              className="flex items-center w-full px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium"
            >
              <span className="mr-3 bg-indigo-100 p-2 rounded-lg text-indigo-600">📋</span> 
              <div>
                <span className="block">Saved Quotes</span>
                <span className="text-xs text-gray-500">{quotations.length} available</span>
              </div>
            </button>
          </nav>
          <div className="p-4 border-t text-center text-xs text-gray-500">
            &copy; 2023 Quotation Maker
          </div>
        </div>
      </div>

      {/* Saved Quotations Drawer - improved styling and usability */}
      {showQuotations && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowQuotations(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-xl ml-64 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-indigo-800">Saved Quotations</h2>
              <button onClick={() => setShowQuotations(false)} className="text-gray-500 hover:text-gray-700 bg-white p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {quotations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">No saved quotations yet</p>
                </div>
              ) : (
                quotations.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors duration-200 bg-white shadow-sm"
                    onClick={() => {
                      onQuotationSelect(quote);
                      setShowQuotations(false);
                    }}
                  >
                    <h3 className="font-medium text-indigo-700">{quote.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(quote.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-indigo-600 mt-2 bg-indigo-50 py-1 px-2 rounded inline-block">
                      ₹{new Intl.NumberFormat('en-IN').format(quote.total)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-semibold text-indigo-700">Create New Quotation</h2>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
