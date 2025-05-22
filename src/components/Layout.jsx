import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Layout = ({ children, onQuotationSelect }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQuotations, setShowQuotations] = useState(false);
  const quotations = useSelector(state => state.quotations.items);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">Quotation Maker</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => setShowQuotations(!showQuotations)}
              className="flex items-center w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <span className="mr-3">📋</span> 
              Saved Quotes ({quotations.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Saved Quotations Drawer */}
      {showQuotations && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowQuotations(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-xl ml-64">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Saved Quotations</h2>
              <button onClick={() => setShowQuotations(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {quotations.map((quote) => (
                <div
                  key={quote.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onQuotationSelect(quote);
                    setShowQuotations(false);
                  }}
                >
                  <h3 className="font-medium">{quote.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(quote.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-indigo-600">
                    ₹{new Intl.NumberFormat('en-IN').format(quote.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-md">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
