import { apiRequest } from '@/lib/api';
import { createContext, useContext, useEffect, useState } from 'react';

const AssociateContext = createContext();

export function AssociateProvider({ children }) {
  const [associate, setAssociate] = useState(null);
  const [loadingAssociate, setLoadingAssociate] = useState(true);

  useEffect(() => {
    const savedAssociate = localStorage.getItem("associate");
    if (savedAssociate) {
      setAssociate(JSON.parse(savedAssociate));
    }
    setLoadingAssociate(false);
  }, []);

  const saveAssociate = (data) => {
    setAssociate(data);
    localStorage.setItem('associate', JSON.stringify(data));
  }

  const removeAssociate = () => {
    setAssociate(null);
    localStorage.removeItem('associate');
  }

  return (
    <AssociateContext.Provider value={{ associate, setAssociate, loadingAssociate, saveAssociate, removeAssociate }}>
      {children}
    </AssociateContext.Provider>
  );
}

export function useAssociate() {
  try {
    return useContext(AssociateContext);
  } catch (err) {
    throw new Error('useAssociate precisa estar envolto por AssociateProvider');
  }
}
