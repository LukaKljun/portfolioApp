import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';

export default function AddTransaction() {
  const { addTransaction, transactions, deleteTransaction, getTotalSpent } = usePortfolio();

  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const assetTypes = [
    { id: 'stock', label: 'Stock', icon: '📈' },
    { id: 'etf', label: 'ETF', icon: '📊' },
    { id: 'crypto', label: 'Crypto', icon: '₿' },
  ];

  const handleAddTransaction = async () => {
    if (!assetName.trim()) {
      Alert.alert('Error', 'Please enter asset name');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter valid price');
      return;
    }

    const transaction = {
      assetName: assetName.trim(),
      assetType,
      amount: parseFloat(amount),
      price: parseFloat(price),
      type: 'buy',
    };

    await addTransaction(transaction);

    // Reset form
    setAssetName('');
    setAmount('');
    setPrice('');

    Alert.alert('Success', 'Transaction added successfully!');
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const renderTransaction = ({ item }) => {
    const totalValue = item.amount * item.price;
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.assetName}>{item.assetName}</Text>
            <Text style={styles.assetTypeBadge}>{item.assetType.toUpperCase()}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteTransaction(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{item.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total:</Text>
            <Text style={[styles.detailValue, styles.totalValue]}>
              ${totalValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    );
  };

  const totalSpent = getTotalSpent();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Add Transaction Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add New Transaction</Text>

          <Text style={styles.label}>Asset Type</Text>
          <View style={styles.assetTypeContainer}>
            {assetTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.assetTypeButton,
                  assetType === type.id && styles.assetTypeButtonActive,
                ]}
                onPress={() => setAssetType(type.id)}
              >
                <Text style={styles.assetTypeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.assetTypeLabel,
                    assetType === type.id && styles.assetTypeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Asset Name</Text>
          <TextInput
            style={styles.input}
            value={assetName}
            onChangeText={setAssetName}
            placeholder="e.g., AAPL, BTC, VOO"
            placeholderTextColor={darkTheme.textSecondary}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="decimal-pad"
                placeholderTextColor={darkTheme.textSecondary}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={darkTheme.textSecondary}
              />
            </View>
          </View>

          {amount && price && (
            <View style={styles.totalPreview}>
              <Text style={styles.totalPreviewLabel}>Total Investment:</Text>
              <Text style={styles.totalPreviewValue}>
                ${(parseFloat(amount) * parseFloat(price)).toFixed(2)}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        {/* Spending Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Spending</Text>
          <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.summarySubtext}>
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Transaction History */}
        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length > 0 ? (
            transactions
              .slice()
              .reverse()
              .map((item) => (
                <View key={item.id}>{renderTransaction({ item })}</View>
              ))
          ) : (
            <Text style={styles.emptyText}>
              No transactions yet. Add your first investment above!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  assetTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  assetTypeButton: {
    flex: 1,
    backgroundColor: darkTheme.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: darkTheme.card,
  },
  assetTypeButtonActive: {
    borderColor: darkTheme.primary,
    backgroundColor: darkTheme.surface,
  },
  assetTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  assetTypeLabel: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    fontWeight: '600',
  },
  assetTypeLabelActive: {
    color: darkTheme.primary,
  },
  input: {
    backgroundColor: darkTheme.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: darkTheme.text,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  totalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkTheme.card,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  totalPreviewLabel: {
    fontSize: 16,
    color: darkTheme.textSecondary,
  },
  totalPreviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  addButton: {
    backgroundColor: darkTheme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    ...darkTheme.shadow,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  summaryCard: {
    backgroundColor: darkTheme.secondary,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...darkTheme.shadow,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.7,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#000',
    opacity: 0.6,
  },
  historyCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
    marginBottom: 40,
  },
  transactionCard: {
    backgroundColor: darkTheme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: darkTheme.primary,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 4,
  },
  assetTypeBadge: {
    fontSize: 10,
    color: darkTheme.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: darkTheme.error,
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: darkTheme.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: darkTheme.text,
    fontWeight: '600',
  },
  totalValue: {
    color: darkTheme.primary,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
