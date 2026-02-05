import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';
import { getAssetPrice } from '../utils/api';
import Card from '../components/Card';

export default function Holdings() {
  const { transactions } = usePortfolio();
  const [filter, setFilter] = useState('all'); // all, stock, crypto
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    calculateHoldings();
  }, [filter]);

  const calculateHoldings = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const holdingsMap = {};
      
      transactions.forEach(transaction => {
        const safeAssetType = transaction.assetType || 'stock';

        if (filter !== 'all') {
          if (filter === 'crypto') {
            if (safeAssetType !== 'crypto' && safeAssetType !== 'eth') return;
          } else if (safeAssetType !== filter) {
            return;
          }
        }

        const key = `${transaction.assetName}-${safeAssetType}`;
        
        if (!holdingsMap[key]) {
          holdingsMap[key] = {
            assetName: transaction.assetName,
            assetType: safeAssetType,
            shares: 0,
            totalCost: 0,
            coinId: transaction.coinId, 
          };
        }
        
        if (transaction.type === 'buy') {
          holdingsMap[key].shares += (Number(transaction.amount) || 0);
          holdingsMap[key].totalCost += (Number(transaction.amount) || 0) * (Number(transaction.price) || 0);
        }
      });

      const holdingsArray = [];
      const filteredHoldings = Object.values(holdingsMap).filter(h => h.shares > 0);
      
      for (let i = 0; i < filteredHoldings.length; i++) {
        const holding = filteredHoldings[i];
        
        try {
           const lookupType = holding.assetType === 'eth' ? 'crypto' : holding.assetType;

          if (i > 0) await new Promise(resolve => setTimeout(resolve, 500)); 
          
          const currentPrice = await getAssetPrice(
            holding.assetName,
            lookupType,
            holding.coinId
          );
          
          const avgCost = holding.totalCost / holding.shares;
          const currentValue = currentPrice ? holding.shares * currentPrice : holding.totalCost;
          const gain = currentValue - holding.totalCost;
          const gainPercent = holding.totalCost > 0 ? (gain / holding.totalCost) * 100 : 0;

          holdingsArray.push({
            ...holding,
            currentPrice: currentPrice || avgCost,
            avgCost,
            currentValue,
            gain,
            gainPercent,
            priceLoaded: !!currentPrice,
          });
        } catch (error) {
          console.error(`Error fetching price for ${holding.assetName}:`, error);
          const avgCost = holding.totalCost / holding.shares;
          holdingsArray.push({
            ...holding,
            currentPrice: avgCost,
            avgCost,
            currentValue: holding.totalCost,
            gain: 0,
            gainPercent: 0,
            priceLoaded: false,
          });
        }
      }

      holdingsArray.sort((a, b) => b.currentValue - a.currentValue);
      setHoldings(holdingsArray);
    } catch (error) {
      console.error('Error calculating holdings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    calculateHoldings(true);
  };


  const renderHoldingRow = (holding) => {
    const isPositive = holding.gain >= 0;

    return (
      <TouchableOpacity key={`${holding.assetName}-${holding.assetType}`} activeOpacity={0.7}>
        <View style={styles.tickerRow}>
          <View style={styles.tickerLeft}>
             <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>{holding.assetName.substring(0,2).toUpperCase()}</Text>
             </View>
             <View>
                <Text style={styles.tickerSymbol}>{holding.assetName}</Text>
                <Text style={styles.tickerShares}>{(holding.shares || 0).toFixed(4)} shares</Text>
             </View>
          </View>

          <View style={styles.tickerRight}>
            <Text style={styles.tickerPrice}>${holding.currentPrice.toFixed(2)}</Text>
            <View style={[styles.changeBadge, isPositive ? styles.badgeSuccess : styles.badgeError]}>
              <Text style={[styles.changeText, isPositive ? styles.textSuccess : styles.textError]}>
                 {isPositive ? '+' : ''}{holding.gainPercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
<<<<<<< HEAD
        <ActivityIndicator size="large" color={darkTheme.primary} />
=======
        <ActivityIndicator size="large" color={darkTheme.primaryLight} />
        <Text style={styles.loadingText}>Loading holdings...</Text>
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkTheme.primaryLight} />
      }
    >
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Holdings</Text>
         <Text style={styles.headerSubtitle}>${totalCurrentValue.toFixed(2)}</Text>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
           <Text style={styles.label}>Asset</Text>
           <Text style={styles.label}>Price / 24h</Text>
        </View>
        {holdings.length > 0 ? (
          holdings.map(renderHoldingRow)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No holdings yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: darkTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: darkTheme.text,
=======
  },
  loadingText: {
    color: darkTheme.textSecondary,
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: darkTheme.primary,
    margin: 20,
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    ...darkTheme.shadow,
    borderLeftWidth: 4,
    borderLeftColor: darkTheme.secondary,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -1,
  },
  summaryGain: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryGainText: {
    fontSize: 18,
    fontWeight: '700',
  },
  summarySubtext: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.75,
    fontWeight: '500',
  },
  holdingsContainer: {
    margin: 20,
    marginTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.text,
    letterSpacing: -0.5,
  },
  refreshText: {
    fontSize: 13,
    color: darkTheme.secondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  holdingCard: {
    backgroundColor: darkTheme.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  holdingInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 8,
    letterSpacing: -0.5,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  headerSubtitle: {
    fontSize: 16,
    color: darkTheme.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    textTransform: 'uppercase',
  },
  tickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
    backgroundColor: darkTheme.background,
  },
  tickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
<<<<<<< HEAD
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: darkTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
=======
  assetTypeBadge: {
    fontSize: 10,
    color: darkTheme.primaryLight,
    fontWeight: '700',
    letterSpacing: 1.2,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
    marginRight: 12,
  },
  iconText: {
    color: darkTheme.text,
    fontWeight: 'bold',
  },
  tickerSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  tickerShares: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    fontWeight: '500',
  },
<<<<<<< HEAD
  tickerRight: {
    alignItems: 'flex-end',
  },
  tickerPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 4,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
=======
  estimatedBadge: {
    fontSize: 10,
    color: darkTheme.textMuted,
    backgroundColor: darkTheme.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  badgeSuccess: {
     backgroundColor: 'rgba(0, 192, 135, 0.15)',
  },
  badgeError: {
     backgroundColor: 'rgba(246, 70, 93, 0.15)',
  },
<<<<<<< HEAD
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textSuccess: {
    color: darkTheme.success,
  },
  textError: {
    color: darkTheme.error,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: darkTheme.textSecondary,
=======
  priceLabel: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: darkTheme.text,
    fontWeight: '700',
  },
  valueSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  valueLabel: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    fontWeight: '500',
  },
  currentValue: {
    fontSize: 17,
    color: darkTheme.text,
    fontWeight: '700',
  },
  totalCost: {
    fontSize: 15,
    color: darkTheme.text,
    fontWeight: '600',
  },
  gainSection: {
    marginTop: 12,
  },
  gainCard: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  gainPositive: {
    backgroundColor: 'rgba(6, 214, 160, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 160, 0.3)',
  },
  gainNegative: {
    backgroundColor: 'rgba(239, 71, 111, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 71, 111, 0.3)',
  },
  gainLabel: {
    fontSize: 11,
    color: darkTheme.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  gainValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  gainPercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  gainValuePositive: {
    color: darkTheme.success,
  },
  gainValueNegative: {
    color: darkTheme.error,
  },
  emptyContainer: {
    backgroundColor: darkTheme.surface,
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  emptyText: {
    fontSize: 20,
    color: darkTheme.text,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptySubtext: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: darkTheme.textMuted,
    fontWeight: '500',
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
});
