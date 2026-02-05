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
    backgroundColor: darkTheme.success,
    margin: 20,
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    ...darkTheme.shadow,
    borderLeftWidth: 4,
    borderLeftColor: '#FFFFFF',
  },
  balanceTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1.5,
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    ...darkTheme.shadowSmall,
  },
  depositButton: {
    backgroundColor: darkTheme.success,
  },
  withdrawButton: {
    backgroundColor: darkTheme.accent,
  },
  setBalanceButton: {
    backgroundColor: darkTheme.primary,
  },
  actionButtonIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  infoCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 10,
    lineHeight: 21,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: darkTheme.surface,
    borderRadius: 24,
    padding: 28,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: darkTheme.border,
    ...darkTheme.shadow,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalDescription: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 24,
    fontWeight: '500',
  },
  input: {
    backgroundColor: darkTheme.card,
    borderRadius: 12,
    padding: 18,
    fontSize: 20,
    color: darkTheme.text,
    borderWidth: 2,
    borderColor: darkTheme.border,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: darkTheme.card,
    borderWidth: 2,
    borderColor: darkTheme.border,
  },
  confirmButton: {
    backgroundColor: darkTheme.primary,
    ...darkTheme.shadowSmall,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: darkTheme.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
