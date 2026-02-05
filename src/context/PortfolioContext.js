import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(1000);
  const [yearlyTarget, setYearlyTarget] = useState(12000);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const storedMonthlyTarget = await AsyncStorage.getItem('monthlyTarget');
      const storedYearlyTarget = await AsyncStorage.getItem('yearlyTarget');

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedMonthlyTarget) {
        setMonthlyTarget(parseFloat(storedMonthlyTarget));
      }
      if (storedYearlyTarget) {
        setYearlyTarget(parseFloat(storedYearlyTarget));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    await saveTransactions(updatedTransactions);
  };

  const deleteTransaction = async (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(updatedTransactions);
  };

  const updateMonthlyTarget = async (target) => {
    try {
      await AsyncStorage.setItem('monthlyTarget', target.toString());
      setMonthlyTarget(target);
    } catch (error) {
      console.error('Error updating monthly target:', error);
    }
  };

  const updateYearlyTarget = async (target) => {
    try {
      await AsyncStorage.setItem('yearlyTarget', target.toString());
      setYearlyTarget(target);
    } catch (error) {
      console.error('Error updating yearly target:', error);
    }
  };

  const getPortfolioValue = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'buy') {
        return total + (transaction.amount * transaction.price);
      }
      return total;
    }, 0);
  };

  const getTotalSpent = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'buy') {
        return total + (transaction.amount * transaction.price);
      }
      return total;
    }, 0);
  };

  const getAssetBreakdown = () => {
    const breakdown = {};
    transactions.forEach(transaction => {
      if (transaction.type === 'buy') {
        if (!breakdown[transaction.assetType]) {
          breakdown[transaction.assetType] = 0;
        }
        breakdown[transaction.assetType] += transaction.amount * transaction.price;
      }
    });
    return breakdown;
  };

  return (
    <PortfolioContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        monthlyTarget,
        yearlyTarget,
        updateMonthlyTarget,
        updateYearlyTarget,
        getPortfolioValue,
        getTotalSpent,
        getAssetBreakdown,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};
