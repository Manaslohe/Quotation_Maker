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
        state.items[index] = action.payload;
        saveQuotations(state.items);
      }
    },
    deleteQuotation: (state, action) => {
      state.items = state.items.filter(q => q.id !== action.payload);
      saveQuotations(state.items);
    },
    setSelectedQuotation: (state, action) => {
      state.selectedQuotation = action.payload;
    }
  }
});

export const { saveQuotation, updateQuotation, deleteQuotation, setSelectedQuotation } = quotationsSlice.actions;
export default quotationsSlice.reducer;
