import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(1000);
  const [yearlyTarget, setYearlyTarget] = useState(12000);
  const [cashBalance, setCashBalance] = useState(0);
  const [cashTransactions, setCashTransactions] = useState([]);
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
      const storedCashBalance = await AsyncStorage.getItem('cashBalance');
      const storedCashTransactions = await AsyncStorage.getItem('cashTransactions');

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedMonthlyTarget) {
        setMonthlyTarget(parseFloat(storedMonthlyTarget));
      }
      if (storedYearlyTarget) {
        setYearlyTarget(parseFloat(storedYearlyTarget));
      }
      if (storedCashBalance) {
        setCashBalance(parseFloat(storedCashBalance));
      }
      if (storedCashTransactions) {
        setCashTransactions(JSON.parse(storedCashTransactions));
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

  // Alias for getPortfolioValue - currently identical, but kept separate for future
  // differentiation when sell transactions or actual market values are implemented
  const getTotalSpent = () => {
    return getPortfolioValue();
  };

  const getMonthlySpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transaction.type === 'buy' &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        return total + (transaction.amount * transaction.price);
      }
      return total;
    }, 0);
  };

  const getYearlySpending = () => {
    const currentYear = new Date().getFullYear();
    
    return transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transaction.type === 'buy' &&
        transactionDate.getFullYear() === currentYear
      ) {
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

  const updateCashBalance = async (amount) => {
    try {
      const newBalance = cashBalance + amount;
      // Prevent negative balance
      if (newBalance < 0) {
        console.warn('Cannot set negative cash balance');
        return;
      }
      
      // Record cash transaction for history
      const cashTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: amount,
        balance: newBalance,
        type: amount > 0 ? 'deposit' : 'withdraw',
      };
      const updatedCashTransactions = [...cashTransactions, cashTransaction];
      
      await AsyncStorage.setItem('cashBalance', newBalance.toString());
      await AsyncStorage.setItem('cashTransactions', JSON.stringify(updatedCashTransactions));
      setCashBalance(newBalance);
      setCashTransactions(updatedCashTransactions);
    } catch (error) {
      console.error('Error updating cash balance:', error);
    }
  };

  const setCashBalanceDirect = async (amount) => {
    try {
      // Prevent negative balance
      if (amount < 0) {
        console.warn('Cannot set negative cash balance');
        return;
      }
      
      // Record cash transaction for history
      const cashTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: amount - cashBalance,
        balance: amount,
        type: 'set_balance',
      };
      const updatedCashTransactions = [...cashTransactions, cashTransaction];
      
      await AsyncStorage.setItem('cashBalance', amount.toString());
      await AsyncStorage.setItem('cashTransactions', JSON.stringify(updatedCashTransactions));
      setCashBalance(amount);
      setCashTransactions(updatedCashTransactions);
    } catch (error) {
      console.error('Error setting cash balance:', error);
    }
  };

  const getTotalPortfolioValue = () => {
    return getPortfolioValue() + cashBalance;
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
        getMonthlySpending,
        getYearlySpending,
        getAssetBreakdown,
        cashBalance,
        cashTransactions,
        updateCashBalance,
        setCashBalanceDirect,
        getTotalPortfolioValue,
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
