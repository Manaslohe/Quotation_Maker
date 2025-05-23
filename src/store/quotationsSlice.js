import { createSlice } from '@reduxjs/toolkit';

const loadQuotations = () => {
  try {
    const saved = localStorage.getItem('savedQuotations');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading quotations:', error);
    return [];
  }
};

const saveQuotations = (quotations) => {
  try {
    localStorage.setItem('savedQuotations', JSON.stringify(quotations));
  } catch (error) {
    console.error('Error saving quotations:', error);
  }
};

export const quotationsSlice = createSlice({
  name: 'quotations',
  initialState: {
    items: loadQuotations(),
    selectedQuotation: null
  },
  reducers: {
    saveQuotation: (state, action) => {
      const newQuotation = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...action.payload
      };
      state.items.push(newQuotation);
      saveQuotations(state.items);
    },
    updateQuotation: (state, action) => {
      const index = state.items.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        // Make sure we preserve the ID when updating
        const updatedQuotation = {
          ...action.payload,
          id: state.items[index].id
        };
        state.items[index] = updatedQuotation;
        saveQuotations(state.items);
      }
    },
    deleteQuotation: (state, action) => {
      state.items = state.items.filter(q => q.id !== action.payload);
      saveQuotations(state.items);
      
      // If the deleted quotation was selected, clear the selection
      if (state.selectedQuotation && state.selectedQuotation.id === action.payload) {
        state.selectedQuotation = null;
      }
    },
    setSelectedQuotation: (state, action) => {
      state.selectedQuotation = action.payload;
    },
    clearSelectedQuotation: (state) => {
      state.selectedQuotation = null;
    }
  }
});

export const { 
  saveQuotation, 
  updateQuotation, 
  deleteQuotation, 
  setSelectedQuotation,
  clearSelectedQuotation 
} = quotationsSlice.actions;

export default quotationsSlice.reducer;
