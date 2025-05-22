import React from 'react';

const ClientInfoForm = ({ clientInfo, handleClientInfoChange }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Project Information</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Project Name:
        </label>
        <input
          type="text"
          name="name"
          value={clientInfo.name}
          onChange={handleClientInfoChange}
          placeholder="Enter project name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date:
        </label>
        <input
          type="date"
          name="date"
          value={clientInfo.date}
          onChange={handleClientInfoChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
        />
      </div>
    </section>
  );
};

export default ClientInfoForm;
