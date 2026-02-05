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
    // Only calculate holdings on mount
    calculateHoldings();
  }, []); // Empty dependency array - only run on mount

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

      // Convert to array and fetch current prices with rate limiting
      const holdingsArray = [];
      const filteredHoldings = Object.values(holdingsMap).filter(h => h.shares > 0);
      
      for (let i = 0; i < filteredHoldings.length; i++) {
        const holding = filteredHoldings[i];
        
        try {
          // Add delay between requests to avoid rate limits (60/min = 1 per second)
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1100));
          }
          
          const currentPrice = await getAssetPrice(
            holding.assetName,
            holding.assetType,
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
        <ActivityIndicator size="large" color={darkTheme.primaryLight} />
        <Text style={styles.loadingText}>Loading holdings...</Text>
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
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetTypeBadge: {
    fontSize: 10,
    color: darkTheme.primaryLight,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginRight: 12,
  },
  sharesText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    fontWeight: '500',
  },
  estimatedBadge: {
    fontSize: 10,
    color: darkTheme.textMuted,
    backgroundColor: darkTheme.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  },
});
