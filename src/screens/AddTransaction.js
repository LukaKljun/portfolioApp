import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';
import { getAssetPrice } from '../utils/api';
import Card from '../components/Card';
import SearchInput from '../components/SearchInput';

export default function AddTransaction() {
  const { addTransaction, transactions, deleteTransaction, getTotalSpent } = usePortfolio();

  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Constants
  const assetTypes = [
    { id: 'stock', label: 'STOCKS', icon: '📈' },
    { id: 'crypto', label: 'CRYPTO', icon: '₿' },
  ];

  const handleTypeSelect = (typeId) => {
    setAssetType(typeId);
    // Reset fields when switching type key aspects
    if (assetType !== typeId) {
       setAssetName('');
       setSelectedAsset(null);
       setPrice('');
    }
  };

  const handleAssetSelect = async (asset) => {
    setSelectedAsset(asset);
    setAssetName(asset.symbol || asset.name);
    
    setLoadingPrice(true);
    try {
      // Handle ETH/Crypto logic mapping if needed, but asset.type usually sufficient
      const searchType = assetType === 'eth' ? 'crypto' : assetType;
      
      const currentPrice = await getAssetPrice(
        asset.symbol || asset.name,
        searchType,
        asset.id 
      );
      
      if (currentPrice) {
        setPrice(currentPrice.toString());
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!assetName.trim() || !amount || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const transaction = {
      assetName: assetName.trim().toUpperCase(),
      assetType,
      amount: parseFloat(amount),
      price: parseFloat(price),
      type: 'buy', // Default to buy for simple version
      coinId: selectedAsset?.id, 
      date: new Date().toISOString(),
    };

    await addTransaction(transaction);

    // Reset
    setAssetName('');
    setAmount('');
    setPrice('');
    setSelectedAsset(null);
    Alert.alert('Success', 'Transaction added');
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      'Delete',
      'Remove this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
           <Text style={styles.headerTitle}>Add Transaction</Text>
        </View>

        <Card style={styles.formCard}>
           {/* Asset Type Tabs */}
           <View style={styles.tabContainer}>
              {assetTypes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tab, assetType === t.id && styles.activeTab]}
                  onPress={() => handleTypeSelect(t.id)}
                >
                  <Text style={[styles.tabText, assetType === t.id && styles.activeTabText]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
           </View>

           {/* Asset Name */}
           <Text style={styles.label}>Asset Name</Text>
           <SearchInput
              value={assetName}
              onSelect={handleAssetSelect}
              assetType={assetType}
              placeholder={assetType === 'stock' ? 'Apple, Tesla...' : 'Bitcoin, Ethereum...'}
           />

           <View style={styles.row}>
             <View style={styles.col}>
               <Text style={styles.label}>Amount</Text>
               <TextInput
                 style={styles.input}
                 value={amount}
                 onChangeText={setAmount}
                 placeholder="0.00"
                 keyboardType="numeric"
                 placeholderTextColor={darkTheme.textSecondary}
               />
             </View>
             <View style={styles.col}>
               <Text style={styles.label}>Price</Text>
               <View style={styles.priceContainer}>
                 <TextInput
                   style={[styles.input, styles.priceInput]}
                   value={price}
                   onChangeText={setPrice}
                   placeholder="0.00"
                   keyboardType="numeric"
                   placeholderTextColor={darkTheme.textSecondary}
                 />
                 {loadingPrice && (
                   <View style={styles.loader}>
                      <ActivityIndicator size="small" color={darkTheme.primary} />
                   </View>
                 )}
               </View>
             </View>
           </View>

           <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
             <Text style={styles.addButtonText}>Add Investment</Text>
           </TouchableOpacity>
        </Card>

        {/* History */}
        <Text style={styles.sectionTitle}>Recent History</Text>
        <View style={styles.historyList}>
           {transactions.slice().reverse().slice(0, 5).map((t) => (
             <Card key={t.id} style={styles.historyCard}>
                <View style={styles.historyRow}>
                   <View>
                      <Text style={styles.historySymbol}>{t.assetName}</Text>
                      <Text style={styles.historyDate}>{new Date(t.date).toLocaleDateString()}</Text>
                   </View>
                   <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.historyValue}>
                        ${(t.amount * t.price).toFixed(2)}
                      </Text>
                      <TouchableOpacity onPress={() => handleDeleteTransaction(t.id)}>
                         <Text style={styles.deleteLink}>Delete</Text>
                      </TouchableOpacity>
                   </View>
                </View>
             </Card>
           ))}
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
<<<<<<< HEAD
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  formCard: {
    marginBottom: 32,
    padding: 20,
=======
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    padding: 24,
    borderRadius: 20,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    marginBottom: 10,
    marginTop: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: darkTheme.background,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
<<<<<<< HEAD
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: darkTheme.primary,
  },
  tabText: {
    fontSize: 12,
=======
    backgroundColor: darkTheme.card,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  assetTypeButtonActive: {
    borderColor: darkTheme.primaryLight,
    backgroundColor: darkTheme.surface,
    ...darkTheme.shadowSmall,
  },
  assetTypeIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  assetTypeLabel: {
    fontSize: 11,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
    color: darkTheme.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
<<<<<<< HEAD
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
=======
  assetTypeLabelActive: {
    color: darkTheme.primaryLight,
  },
  input: {
    backgroundColor: darkTheme.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: darkTheme.text,
    borderWidth: 2,
    borderColor: darkTheme.border,
    fontWeight: '500',
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  col: {
    flex: 1,
  },
<<<<<<< HEAD
  input: {
    backgroundColor: darkTheme.background,
    borderWidth: 1,
    borderColor: darkTheme.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: darkTheme.text,
  },
  priceContainer: {
    position: 'relative',
  },
  priceInput: {
    paddingRight: 40,
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  addButton: {
    backgroundColor: darkTheme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
=======
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  refreshButton: {
    width: 48,
    height: 48,
    backgroundColor: darkTheme.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: darkTheme.border,
  },
  refreshButtonText: {
    fontSize: 22,
  },
  totalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkTheme.card,
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: darkTheme.border,
  },
  totalPreviewLabel: {
    fontSize: 15,
    color: darkTheme.textSecondary,
    fontWeight: '600',
  },
  totalPreviewValue: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.primaryLight,
  },
  addButton: {
    backgroundColor: darkTheme.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    ...darkTheme.shadow,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
<<<<<<< HEAD
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    padding: 16,
=======
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryCard: {
    backgroundColor: darkTheme.secondary,
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    ...darkTheme.shadow,
    borderLeftWidth: 4,
    borderLeftColor: darkTheme.accent,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
  },
  summarySubtext: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    ...darkTheme.shadow,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  transactionCard: {
    backgroundColor: darkTheme.card,
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: darkTheme.primaryLight,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
<<<<<<< HEAD
  historySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  historyDate: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
  },
  deleteLink: {
    fontSize: 12,
    color: darkTheme.error,
    marginTop: 4,
=======
  transactionInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 19,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  assetTypeBadge: {
    fontSize: 10,
    color: darkTheme.primaryLight,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  deleteButtonText: {
    fontSize: 18,
    color: darkTheme.accent,
    fontWeight: '700',
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
    fontSize: 13,
    color: darkTheme.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: darkTheme.text,
    fontWeight: '700',
  },
  totalValue: {
    color: darkTheme.primaryLight,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '500',
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
});
