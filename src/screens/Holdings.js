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

export default function Holdings() {
  const { transactions } = usePortfolio();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    calculateHoldings();
  }, [transactions]);

  const calculateHoldings = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Group transactions by asset
      const holdingsMap = {};
      
      transactions.forEach(transaction => {
        const key = `${transaction.assetName}-${transaction.assetType}`;
        
        if (!holdingsMap[key]) {
          holdingsMap[key] = {
            assetName: transaction.assetName,
            assetType: transaction.assetType,
            shares: 0,
            totalCost: 0,
            coinId: transaction.coinId, // For crypto
          };
        }
        
        if (transaction.type === 'buy') {
          holdingsMap[key].shares += transaction.amount;
          holdingsMap[key].totalCost += transaction.amount * transaction.price;
        }
      });

      // Convert to array and fetch current prices
      const holdingsArray = await Promise.all(
        Object.values(holdingsMap)
          .filter(h => h.shares > 0)
          .map(async (holding) => {
            try {
              const currentPrice = await getAssetPrice(
                holding.assetName,
                holding.assetType,
                holding.coinId
              );
              
              const avgCost = holding.totalCost / holding.shares;
              const currentValue = currentPrice ? holding.shares * currentPrice : holding.totalCost;
              const gain = currentValue - holding.totalCost;
              const gainPercent = holding.totalCost > 0 ? (gain / holding.totalCost) * 100 : 0;

              return {
                ...holding,
                currentPrice: currentPrice || avgCost,
                avgCost,
                currentValue,
                gain,
                gainPercent,
                priceLoaded: !!currentPrice,
              };
            } catch (error) {
              console.error(`Error fetching price for ${holding.assetName}:`, error);
              const avgCost = holding.totalCost / holding.shares;
              return {
                ...holding,
                currentPrice: avgCost,
                avgCost,
                currentValue: holding.totalCost,
                gain: 0,
                gainPercent: 0,
                priceLoaded: false,
              };
            }
          })
      );

      // Sort by current value descending
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

  const renderHolding = (holding) => {
    const isPositive = holding.gain >= 0;

    return (
      <View key={`${holding.assetName}-${holding.assetType}`} style={styles.holdingCard}>
        <View style={styles.holdingHeader}>
          <View style={styles.holdingInfo}>
            <Text style={styles.assetName}>{holding.assetName}</Text>
            <View style={styles.assetMeta}>
              <Text style={styles.assetTypeBadge}>{holding.assetType.toUpperCase()}</Text>
              <Text style={styles.sharesText}>{holding.shares.toFixed(4)} shares</Text>
            </View>
          </View>
          {!holding.priceLoaded && (
            <Text style={styles.estimatedBadge}>EST</Text>
          )}
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Current Price:</Text>
            <Text style={styles.priceValue}>${holding.currentPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Avg Cost:</Text>
            <Text style={styles.priceValue}>${holding.avgCost.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.valueSection}>
          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Current Value:</Text>
            <Text style={styles.currentValue}>${holding.currentValue.toFixed(2)}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Total Cost:</Text>
            <Text style={styles.totalCost}>${holding.totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.gainSection}>
          <View style={[styles.gainCard, isPositive ? styles.gainPositive : styles.gainNegative]}>
            <Text style={styles.gainLabel}>Total Gain/Loss</Text>
            <Text style={[styles.gainValue, isPositive ? styles.gainValuePositive : styles.gainValueNegative]}>
              {isPositive ? '+' : ''}${holding.gain.toFixed(2)}
            </Text>
            <Text style={[styles.gainPercent, isPositive ? styles.gainValuePositive : styles.gainValueNegative]}>
              {isPositive ? '+' : ''}{holding.gainPercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = totalCurrentValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const isPositive = totalGain >= 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={darkTheme.primary} />
        <Text style={styles.loadingText}>Loading holdings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkTheme.primary} />
      }
    >
      {/* Summary Card */}
      {holdings.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Holdings Value</Text>
          <Text style={styles.summaryValue}>${totalCurrentValue.toFixed(2)}</Text>
          <View style={[styles.summaryGain, isPositive ? styles.gainPositive : styles.gainNegative]}>
            <Text style={[styles.summaryGainText, isPositive ? styles.gainValuePositive : styles.gainValueNegative]}>
              {isPositive ? '+' : ''}${totalGain.toFixed(2)} ({isPositive ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </Text>
          </View>
          <Text style={styles.summarySubtext}>Total Cost: ${totalCost.toFixed(2)}</Text>
        </View>
      )}

      {/* Holdings List */}
      <View style={styles.holdingsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
          <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
            <Text style={styles.refreshText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>

        {holdings.length > 0 ? (
          holdings.map(renderHolding)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No holdings yet</Text>
            <Text style={styles.emptySubtext}>Add your first transaction to see your holdings here</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Pull down to refresh prices</Text>
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
  },
  loadingText: {
    color: darkTheme.textSecondary,
    marginTop: 16,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: darkTheme.primary,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    ...darkTheme.shadow,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryGain: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryGainText: {
    fontSize: 18,
    fontWeight: '600',
  },
  summarySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  refreshText: {
    fontSize: 14,
    color: darkTheme.primary,
    fontWeight: '600',
  },
  holdingCard: {
    backgroundColor: darkTheme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...darkTheme.shadow,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 6,
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetTypeBadge: {
    fontSize: 10,
    color: darkTheme.primary,
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: 12,
  },
  sharesText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  estimatedBadge: {
    fontSize: 10,
    color: darkTheme.textSecondary,
    backgroundColor: darkTheme.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: darkTheme.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: darkTheme.text,
    fontWeight: '600',
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
    fontSize: 14,
    color: darkTheme.textSecondary,
  },
  currentValue: {
    fontSize: 16,
    color: darkTheme.text,
    fontWeight: 'bold',
  },
  totalCost: {
    fontSize: 14,
    color: darkTheme.text,
    fontWeight: '600',
  },
  gainSection: {
    marginTop: 12,
  },
  gainCard: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  gainPositive: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  gainNegative: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  gainLabel: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 4,
  },
  gainValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gainPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  gainValuePositive: {
    color: '#00C853',
  },
  gainValueNegative: {
    color: '#FF5252',
  },
  emptyContainer: {
    backgroundColor: darkTheme.surface,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: darkTheme.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
});
