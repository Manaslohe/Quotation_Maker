import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import Layout from './components/Layout';
import SavedQuotations from './components/SavedQuotations';
import QuotePreview from './components/QuotePreview';
import ClientInfoForm from './components/ClientInfoForm';
import PageChargesForm from './components/PageChargesForm';
import FreeItemsForm from './components/FreeItemsForm';

function App() {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [pages, setPages] = useState([
    { id: nanoid(), name: '', charge: 0 }
  ]);
  
  const [freeItems, setFreeItems] = useState([
    { id: nanoid(), description: '' }
  ]);
  
  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({
      ...clientInfo,
      [name]: value
    });
  };
  
  const handlePageChange = (index, field, value) => {
    const updatedPages = [...pages];
    updatedPages[index][field] = value;
    setPages(updatedPages);
  };
  
  const addPage = () => {
    setPages([...pages, { id: nanoid(), name: '', charge: 0 }]);
  };
  
  const removePage = (index) => {
    const updatedPages = [...pages];
    updatedPages.splice(index, 1);
    setPages(updatedPages);
  };
  
  const handleFreeItemChange = (index, value) => {
    const updatedFreeItems = [...freeItems];
    updatedFreeItems[index].description = value;
    setFreeItems(updatedFreeItems);
  };
  
  const addFreeItem = () => {
    setFreeItems([...freeItems, { id: nanoid(), description: '' }]);
  };
  
  const removeFreeItem = (index) => {
    const updatedFreeItems = [...freeItems];
    updatedFreeItems.splice(index, 1);
    setFreeItems(updatedFreeItems);
  };
  
  const calculateTotal = () => {
    return pages.reduce((total, page) => total + Number(page.charge), 0);
  };

  const handleQuotationSelect = (quotation) => {
    setClientInfo(quotation.clientInfo);
    setPages(quotation.pages);
    setFreeItems(quotation.freeItems);
  };

  const handleSaveQuotation = (name) => {
    const quotationData = {
      name,
      clientInfo,
      pages,
      freeItems,
      total: calculateTotal(),
      date: new Date().toISOString()
    };
    dispatch(saveQuotation(quotationData));
  };

  return (
    <Layout onQuotationSelect={handleQuotationSelect}>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
          />
          <FreeItemsForm 
            freeItems={freeItems}
            handleFreeItemChange={handleFreeItemChange}
            addFreeItem={addFreeItem}
            removeFreeItem={removeFreeItem}
            setFreeItems={setFreeItems}
          />
        </div>
        
        <div className="lg:sticky lg:top-6">
          <QuotePreview
            clientInfo={clientInfo}
            pages={pages}
            freeItems={freeItems}
            calculateTotal={calculateTotal}
            onSave={handleSaveQuotation}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
