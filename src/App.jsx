import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuotation, clearSelectedQuotation } from './store/quotationsSlice';
import Layout from './components/Layout';
import ClientInfoForm from './components/ClientInfoForm';
import PageChargesForm from './components/PageChargesForm';
import FreeItemsForm from './components/FreeItemsForm';
import QuotePreview from './components/QuotePreview';

const App = () => {
  const dispatch = useDispatch();
  const selectedQuotation = useSelector(state => state.quotations.selectedQuotation);
  
  // State for client info
  const [clientInfo, setClientInfo] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // State for pages
  const [pages, setPages] = useState([{
    id: Date.now(),
    name: '',
    charge: 0
  }]);
  
  // State for free items
  const [freeItems, setFreeItems] = useState([{
    id: Date.now(),
    description: ''
  }]);
  
  // State for terms
  const [terms, setTerms] = useState([]);
  
  // Current quotation ID being edited, if any
  const [currentQuotationId, setCurrentQuotationId] = useState(null);

  // Load a quotation for editing when selected
  useEffect(() => {
    if (selectedQuotation) {
      // Set client info
      setClientInfo(selectedQuotation.clientInfo || {
        name: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Set pages
      if (selectedQuotation.pages && selectedQuotation.pages.length > 0) {
        setPages(selectedQuotation.pages);
      } else {
        setPages([{ id: Date.now(), name: '', charge: 0 }]);
      }
      
      // Set free items
      if (selectedQuotation.freeItems && selectedQuotation.freeItems.length > 0) {
        setFreeItems(selectedQuotation.freeItems);
      } else {
        setFreeItems([{ id: Date.now(), description: '' }]);
      }
      
      // Set terms
      if (selectedQuotation.terms && selectedQuotation.terms.length > 0) {
        setTerms(selectedQuotation.terms);
      }
      
      // Set current quotation ID
      setCurrentQuotationId(selectedQuotation.id);
    }
  }, [selectedQuotation]);

  // Handler for client info changes
  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If editing an existing quotation, update it
    if (currentQuotationId) {
      handleQuotationUpdate();
    }
  };
  
  // Handler for page changes
  const handlePageChange = (index, field, value) => {
    const newPages = [...pages];
    newPages[index][field] = value;
    setPages(newPages);
    
    // If editing an existing quotation, update it
    if (currentQuotationId) {
      handleQuotationUpdate();
    }
  };
  
  // Add a new page
  const addPage = () => {
    setPages(prev => [...prev, { id: Date.now(), name: '', charge: 0 }]);
  };
  
  // Remove a page
  const removePage = (index) => {
    setPages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handler for free item changes
  const handleFreeItemChange = (index, value) => {
    const newItems = [...freeItems];
    newItems[index].description = value;
    setFreeItems(newItems);
    
    // If editing an existing quotation, update it
    if (currentQuotationId) {
      handleQuotationUpdate();
    }
  };
  
  // Add a new free item
  const addFreeItem = () => {
    setFreeItems(prev => [...prev, { id: Date.now(), description: '' }]);
  };
  
  // Remove a free item
  const removeFreeItem = (index) => {
    setFreeItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Calculate total
  const calculateTotal = () => {
    return pages.reduce((sum, page) => sum + (Number(page.charge) || 0), 0);
  };
  
  // Update the current quotation when changes are made
  const handleQuotationUpdate = () => {
    if (!currentQuotationId) return;
    
    // Using setTimeout to ensure state updates have completed
    setTimeout(() => {
      dispatch(updateQuotation({
        id: currentQuotationId,
        name: clientInfo.name || 'Untitled Quotation',
        clientInfo,
        pages,
        freeItems,
        terms,
        total: calculateTotal(),
        date: new Date().toISOString()
      }));
    }, 0);
  };
  
  // Handle selecting a quotation
  const handleQuotationSelect = (quotation) => {
    dispatch(clearSelectedQuotation());
    setTimeout(() => {
      dispatch({ type: 'quotations/setSelectedQuotation', payload: quotation });
    }, 0);
  };

  // Create FreeItemsForm component instance
  const freeItemsFormComponent = (
    <FreeItemsForm
      freeItems={freeItems}
      handleFreeItemChange={handleFreeItemChange}
      addFreeItem={addFreeItem}
      removeFreeItem={removeFreeItem}
      setFreeItems={setFreeItems}
    />
  );

  // Reset form when creating a new quotation
  const handleNewQuotation = () => {
    setClientInfo({
      name: '',
      date: new Date().toISOString().split('T')[0]
    });
    setPages([{ id: Date.now(), name: '', charge: 0 }]);
    setFreeItems([{ id: Date.now(), description: '' }]);
    setTerms([]);
    setCurrentQuotationId(null);
    dispatch(clearSelectedQuotation());
  };

  return (
    <Layout onQuotationSelect={handleQuotationSelect}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-8">
          {currentQuotationId && (
            <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-indigo-800">
                  Editing: {selectedQuotation?.name || 'Untitled Quotation'}
                </h2>
                <p className="text-sm text-indigo-600">
                  Created: {new Date(selectedQuotation?.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleNewQuotation}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Create New Quote
              </button>
            </div>
          )}
          
          <ClientInfoForm 
            clientInfo={clientInfo}
            handleClientInfoChange={handleClientInfoChange}
          />
          
          <PageChargesForm
            pages={pages}
            handlePageChange={handlePageChange}
            addPage={addPage}
            removePage={removePage}
            setPages={setPages}
            terms={terms}
            setTerms={setTerms}
            freeItemsForm={freeItemsFormComponent}
          />
        </div>
        
        <div>
          <QuotePreview
            clientInfo={clientInfo}
            pages={pages}
            freeItems={freeItems}
            calculateTotal={calculateTotal}
            terms={terms}
          />
        </div>
      </div>
    </Layout>
  );
};

export default App;
