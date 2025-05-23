import React from 'react';

const ClientInfoForm = ({ clientInfo, handleClientInfoChange }) => {
  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Project Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Project Name:
          </label>
          <input
            type="text"
            name="name"
            value={clientInfo.name}
            onChange={handleClientInfoChange}
            placeholder="Enter project name"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <p className="mt-1 text-xs text-gray-500">This name will appear on your quotation</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Date:
          </label>
          <input
            type="date"
            name="date"
            value={clientInfo.date}
            onChange={handleClientInfoChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-indigo-800">Quick Start</h3>
            <div className="mt-1 text-sm text-indigo-700">
              <p>Fill in project details to generate your quotation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientInfoForm;
