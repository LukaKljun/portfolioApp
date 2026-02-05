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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: darkTheme.primary,
  },
  tabText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  col: {
    flex: 1,
  },
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
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  },
});
