import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedQuotation, deleteQuotation } from '../store/quotationsSlice';

const SavedQuotations = ({ onQuotationSelect }) => {
  const quotations = useSelector(state => state.quotations.items);
  const dispatch = useDispatch();

  const handleSelect = (quotation) => {
    dispatch(setSelectedQuotation(quotation));
    onQuotationSelect(quotation);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Saved Quotations</h2>
      {quotations.length === 0 ? (
        <p className="text-gray-500">No saved quotations yet.</p>
      ) : (
        <div className="space-y-4">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{quotation.clientInfo.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(quotation.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Total: ₹{new Intl.NumberFormat('en-IN').format(quotation.total)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelect(quotation)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteQuotation(quotation.id))}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedQuotations;
