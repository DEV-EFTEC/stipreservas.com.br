// hooks/useDynamicList.js
import { useState } from 'react';

export function useDynamicList(initialList = []) {
  const [list, setList] = useState(initialList);

  const updateItem = (index, field, value) => {
    setList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItem = (item) => {
    setList(prev => [...prev, item]);
  };

  const removeItem = (index) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const resetList = (newList) => {
    setList(newList);
  };

  return {
    list,
    updateItem,
    addItem,
    removeItem,
    resetList,
  };
}
