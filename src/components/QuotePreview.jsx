import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDispatch } from 'react-redux';
import { saveQuotation } from '../store/quotationsSlice';

const QuotePreview = ({ clientInfo, pages, freeItems, calculateTotal }) => {
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const contentRef = useRef(null);

  const getSafePreview = () => {
    const clone = contentRef.current.cloneNode(true);
    clone.querySelectorAll('*').forEach(el => {
      el.className = '';
      el.style.background = '#fff';
      el.style.backgroundColor = '#fff';
      el.style.color = '#222';
      el.style.borderColor = '#e5e7eb';
      el.style.boxShadow = 'none';
    });
    clone.style.background = '#fff';
    clone.style.color = '#222';
    clone.style.padding = '32px';
    clone.style.border = '1px solid #e5e7eb';
    clone.style.borderRadius = '12px';
    clone.style.width = '800px';
    return clone;
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);
    try {
      // Create a temporary container with exact styles
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px'; // Fixed width for better quality
      container.innerHTML = contentRef.current.innerHTML;
      
      // Copy computed styles from the original elements to the cloned ones
      const sourceElements = contentRef.current.getElementsByTagName('*');
      const targetElements = container.getElementsByTagName('*');
      for (let i = 0; i < sourceElements.length; i++) {
        const computedStyle = window.getComputedStyle(sourceElements[i]);
        const target = targetElements[i];
        for (const property of computedStyle) {
          target.style[property] = computedStyle[property];
        }
      }

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        onclone: (document) => {
          // Additional style fixes in the cloned document
          const elements = document.getElementsByTagName('*');
          for (let el of elements) {
            if (el.style.transform) el.style.transform = 'none';
            if (el.style.transition) el.style.transition = 'none';
            // Ensure text remains crisp
            el.style.textRendering = 'geometricPrecision';
          }
        }
      });

      document.body.removeChild(container);

      // Use A4 dimensions for better quality
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      // Add image, handling multiple pages if content is long
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Quotation-${clientInfo.name || 'Project'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const captureAndShare = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff'
      });

      canvas.toBlob(async (blob) => {
        try {
          const file = new File([blob], `Quotation-${clientInfo.name || 'Project'}.png`, { type: 'image/png' });

          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Quotation',
              files: [file],
            });
          } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Quotation-${clientInfo.name || 'Project'}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error("Error sharing:", error);
          alert("Could not share or download the image.");
        }
      }, 'image/png');
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert("Could not capture screenshot.");
    }
  };

  const handleSaveQuotation = () => {
    setShowSaveDialog(true);
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
      date: new Date().toISOString()
    };
    
    dispatch(saveQuotation(quotationData));
    setQuoteName('');
    setShowSaveDialog(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-700">Quote Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveQuotation}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
            </svg>
            Save Quote
          </button>

          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            View Full Screen
          </button>

          <button
            onClick={captureAndShare}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Share
          </button>
          
          <button
            onClick={generatePDF}
            disabled={isExporting}
            className={`${isExporting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              shadow-md transition-all flex items-center`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8.343a2 2 0 00-.586-1.414l-2.343-2.343A2 2 0 0013.657 4H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Export as PDF
              </>
            )}
          </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Save Quotation</h3>
            <input
              type="text"
              value={quoteName}
              onChange={(e) => setQuoteName(e.target.value)}
              placeholder="Enter quotation name"
              className="w-full border rounded-lg p-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={contentRef}
        id="quote-pdf-content"
        className="bg-white border rounded-lg shadow-lg p-8 transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b-2 border-indigo-600 pb-4 mb-6 gap-2">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600">QUOTATION</h2>
          </div>
          <div className="text-right">
            <div className="text-gray-600 text-lg font-medium">Date: {clientInfo.date}</div>
        
          </div>
        </div>

        <div className="mb-8">
          <div className="text-gray-800 text-xl font-medium mb-4">
            Project Name: <span className="font-bold">{clientInfo.name || 'N/A'}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Page Details</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-indigo-700 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-indigo-700 uppercase tracking-wider">
                    Charge
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {page.name || 'Unnamed Page'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                      ₹{new Intl.NumberFormat('en-IN').format(page.charge || 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-100 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-indigo-900 text-lg">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-900 text-lg">
                    ₹{new Intl.NumberFormat('en-IN').format(calculateTotal())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {freeItems.some(item => item.description) && (
          <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Free Items Included</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {freeItems.map((item, index) => (
                item.description && <li key={index} className="pl-2">{item.description}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 text-sm text-gray-600 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Terms & Conditions:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Scope of Work:</strong> The quotation is based on a general understanding of the client's requirements: complete redesign, new backend architecture, AI feature integration, and admin panel.<br />
              Any feature not currently present on the website (other than AI and admin panel) will be considered as add-on and charged additionally.<br />
              Final design and features must be finalized before development begins. Significant changes during development may affect the timeline and cost.
            </li>
            <li>
              <strong>AI Features:</strong> The cost covers standard AI integrations as discussed. Any advanced AI models, third-party API subscriptions, or cloud hosting requirements will be billed separately after discussion.<br />
              AI functionality will be limited to the features agreed upon (e.g., chatbot, recommendations, content generation, etc.).
            </li>
            <li>
              <strong>Timeline:</strong> Estimated delivery timeline will be shared post finalization of features and UI/UX design.
            </li>
            <li>
              <strong>Payment Terms:</strong> 30% advance payment before the commencement of work.<br />
              Payments are non-refundable once a milestone is completed and approved.<br />
              Delay in client feedback or asset submission (e.g., content, images) may result in timeline extension.
            </li>
          </ul>
        </div>

        <div className="text-center text-gray-700 italic mt-8 pt-6 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-medium text-indigo-700">Thank you for the opportunity to work together!</p>
          <p className="text-sm text-gray-600 mt-1">Looking forward to creating something amazing with you.</p>
        </div>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full max-w-6xl max-h-screen overflow-y-auto rounded-lg shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-800">Quotation Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={captureAndShare}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto bg-white border rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b-2 border-indigo-600 pb-4 mb-6 gap-2">
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

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Page Details</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-indigo-700 uppercase tracking-wider">Page</th>
                          <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-indigo-700 uppercase tracking-wider">Charge</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{page.name || 'Unnamed Page'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                              ₹{new Intl.NumberFormat('en-IN').format(page.charge || 0)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-indigo-100 font-bold">
                          <td className="px-6 py-4 whitespace-nowrap text-indigo-900 text-lg">Total</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-indigo-900 text-lg">
                            ₹{new Intl.NumberFormat('en-IN').format(calculateTotal())}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {freeItems.some(item => item.description) && (
                  <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-xl font-semibold text-green-700 mb-3">Free Items Included</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {freeItems.map((item, index) => (
                        item.description && <li key={index} className="pl-2">{item.description}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-8 text-sm text-gray-600 border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Terms & Conditions:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Scope of Work:</strong> The quotation is based on a general understanding of the client's requirements: complete redesign, new backend architecture, AI feature integration, and admin panel.<br />
                      Any feature not currently present on the website (other than AI and admin panel) will be considered as add-on and charged additionally.<br />
                      Final design and features must be finalized before development begins. Significant changes during development may affect the timeline and cost.
                    </li>
                    <li>
                      <strong>AI Features:</strong> The cost covers standard AI integrations as discussed. Any advanced AI models, third-party API subscriptions, or cloud hosting requirements will be billed separately after discussion.<br />
                      AI functionality will be limited to the features agreed upon (e.g., chatbot, recommendations, content generation, etc.).
                    </li>
                    <li>
                      <strong>Timeline:</strong> Estimated delivery timeline will be shared post finalization of features and UI/UX design.
                    </li>
                    <li>
                      <strong>Payment Terms:</strong> 30% advance payment before the commencement of work.<br />
                  
                      Payments are non-refundable once a milestone is completed and approved.<br />
                      Delay in client feedback or asset submission (e.g., content, images) may result in timeline extension.
                    </li>
                  </ul>
                </div>

                <div className="text-center text-gray-700 italic mt-8 pt-6 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-indigo-700">Thank you for the opportunity to work together!</p>
                  <p className="text-sm text-gray-600 mt-1">Looking forward to creating something amazing with you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default QuotePreview;
