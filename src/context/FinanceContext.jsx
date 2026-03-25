import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync transactions from Firestore specific to the logged-in user
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'transactions'), 
      where('userId', '==', currentUser.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side by date descending to avoid Firebase Index requirement
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on unmount or user change
  }, [currentUser]);

  const addTransaction = async (transaction) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.id,
        date: new Date().toISOString(),
        ...transaction
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const getSummary = () => {
    return transactions.reduce((acc, curr) => {
      const amount = parseFloat(curr.amount);
      if (curr.type === 'income') {
        acc.income += amount;
        acc.balance += amount;
      } else {
        acc.expense += amount;
        acc.balance -= amount;
      }
      return acc;
    }, { balance: 0, income: 0, expense: 0 });
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      getSummary,
      loading
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
