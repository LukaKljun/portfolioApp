import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';

export default function CashManager() {
  const { cashBalance, updateCashBalance, setCashBalanceDirect } = usePortfolio();
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSetBalanceModal, setShowSetBalanceModal] = useState(false);
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    updateCashBalance(depositAmount);
    setAmount('');
    setShowDepositModal(false);
    Alert.alert('Success', `Deposited $${depositAmount.toFixed(2)}`);
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > cashBalance) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }
    
    updateCashBalance(-withdrawAmount);
    setAmount('');
    setShowWithdrawModal(false);
    Alert.alert('Success', `Withdrew $${withdrawAmount.toFixed(2)}`);
  };

  const handleSetBalance = () => {
    const newBalance = parseFloat(amount);
    if (isNaN(newBalance) || newBalance < 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    setCashBalanceDirect(newBalance);
    setAmount('');
    setShowSetBalanceModal(false);
    Alert.alert('Success', `Cash balance set to $${newBalance.toFixed(2)}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cash Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Cash Balance</Text>
        <Text style={styles.balanceValue}>${cashBalance.toFixed(2)}</Text>
        <Text style={styles.balanceSubtext}>Available for investing</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Manage Cash</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.depositButton]}
          onPress={() => setShowDepositModal(true)}
        >
          <Text style={styles.actionButtonIcon}>💰</Text>
          <Text style={styles.actionButtonText}>Deposit Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.withdrawButton]}
          onPress={() => setShowWithdrawModal(true)}
        >
          <Text style={styles.actionButtonIcon}>💸</Text>
          <Text style={styles.actionButtonText}>Withdraw Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.setBalanceButton]}
          onPress={() => setShowSetBalanceModal(true)}
        >
          <Text style={styles.actionButtonIcon}>⚙️</Text>
          <Text style={styles.actionButtonText}>Set Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 About Cash Balance</Text>
        <Text style={styles.infoText}>
          Track your available cash separately from your investments. This helps you:
        </Text>
        <Text style={styles.infoText}>• Know how much cash you have ready to invest</Text>
        <Text style={styles.infoText}>• Track deposits and withdrawals</Text>
        <Text style={styles.infoText}>• See your total portfolio value including cash</Text>
      </View>

      {/* Deposit Modal */}
      <Modal
        visible={showDepositModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepositModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit Cash</Text>
            <Text style={styles.modalDescription}>
              Add cash to your available balance
            </Text>

            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              placeholderTextColor={darkTheme.textSecondary}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAmount('');
                  setShowDepositModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeposit}
              >
                <Text style={styles.modalButtonText}>Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Cash</Text>
            <Text style={styles.modalDescription}>
              Current balance: ${cashBalance.toFixed(2)}
            </Text>

            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              placeholderTextColor={darkTheme.textSecondary}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAmount('');
                  setShowWithdrawModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleWithdraw}
              >
                <Text style={styles.modalButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Set Balance Modal */}
      <Modal
        visible={showSetBalanceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSetBalanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Cash Balance</Text>
            <Text style={styles.modalDescription}>
              Set your current cash balance directly
            </Text>

            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              placeholderTextColor={darkTheme.textSecondary}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAmount('');
                  setShowSetBalanceModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSetBalance}
              >
                <Text style={styles.modalButtonText}>Set Balance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  balanceCard: {
    backgroundColor: darkTheme.secondary,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    ...darkTheme.shadow,
  },
  balanceTitle: {
    fontSize: 16,
    color: darkTheme.text,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: darkTheme.text,
    opacity: 0.8,
  },
  actionsCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...darkTheme.shadow,
  },
  depositButton: {
    backgroundColor: darkTheme.success,
  },
  withdrawButton: {
    backgroundColor: darkTheme.error,
  },
  setBalanceButton: {
    backgroundColor: darkTheme.primary,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: darkTheme.surface,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: darkTheme.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: darkTheme.text,
    borderWidth: 1,
    borderColor: darkTheme.border,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: darkTheme.card,
  },
  confirmButton: {
    backgroundColor: darkTheme.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
  },
});
