import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';
import Card from '../components/Card';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function PortfolioDashboard() {
  const { transactions, getTotalPortfolioValue } = usePortfolio();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const totalValue = getTotalPortfolioValue();
  
  // Calculate history from transactions for the chart
  const getChartData = () => {
    if (transactions.length === 0) {
      return {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ data: [0, 0, 0] }]
      };
    }

    // Simple simulation of history based on transactions
    // In a real app, you'd track historical values or fetch historical prices
    let runningBalance = 0;
    const dataPoints = [];
    const labels = [];
    
    // Sort by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach((t) => {
       if (t.type === 'buy') {
         runningBalance += t.amount * t.price;
       } else {
         runningBalance -= t.amount * t.price;
       }
       dataPoints.push(runningBalance);
       const date = new Date(t.date);
       labels.push(`${date.getMonth()+1}/${date.getDate()}`);
    });

    // Take last 6 points max for cleaner chart
    const recentData = dataPoints.slice(-6);
    const recentLabels = labels.slice(-6);
    
    if (recentData.length < 2) {
       // Pad with 0 or current value if not enough data
       return {
         labels: ['Start', 'Now'],
         datasets: [{ data: [0, totalValue > 0 ? totalValue : 100] }]
       };
    }

    return {
      labels: recentLabels,
      datasets: [{ data: recentData }]
    };
  };

  const chartDataRaw = getChartData();
  const history = chartDataRaw.datasets[0].data;
  const isPositive = history.length > 1 ? history[history.length - 1] >= history[0] : true;
  
  const chartData = {
    labels: chartDataRaw.labels,
    datasets: [
      {
        data: history,
        color: (opacity = 1) => isPositive ? `rgba(0, 192, 135, ${opacity})` : `rgba(246, 70, 93, ${opacity})`,
        strokeWidth: 2, 
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkTheme.primary} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Total Balance</Text>
          <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
        </View>
        <View style={[styles.percentageBadge, isPositive ? styles.badgeSuccess : styles.badgeError]}>
           <Text style={styles.percentageText}>{isPositive ? '+' : '-'}2.4% (24h)</Text>
        </View>
      </View>

      <Card style={styles.chartCard} variant="default">
        <Text style={styles.chartTitle}>Performance (30D)</Text>
        <LineChart
<<<<<<< HEAD
            data={chartData}
            width={width - 48} // Card padding
            height={220}
            chartConfig={{
              backgroundColor: darkTheme.surface,
              backgroundGradientFrom: darkTheme.surface,
              backgroundGradientTo: darkTheme.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => darkTheme.textSecondary,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '0', // Hide dots for cleaner look
              },
              propsForBackgroundLines: {
                stroke: darkTheme.border,
                strokeDasharray: '', // Solid grid lines
              }
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
          />
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Market Overview</Text>
=======
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: darkTheme.surface,
            backgroundGradientFrom: darkTheme.surface,
            backgroundGradientTo: darkTheme.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(46, 125, 154, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: darkTheme.primaryLight,
              fill: darkTheme.primary,
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: darkTheme.border,
              strokeWidth: 1,
            },
          }}
          bezier
          style={styles.chart}
        />
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
      </View>

      <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
             <Text style={styles.statLabel}>Top Gainer</Text>
             <Text style={styles.statValue}>BTC</Text>
             <Text style={styles.statChangeSuccess}>+5.2%</Text>
          </Card>
          <Card style={styles.statCard}>
             <Text style={styles.statLabel}>Top Loser</Text>
             <Text style={styles.statValue}>SOL</Text>
             <Text style={styles.statChangeError}>-1.2%</Text>
          </Card>
      </View>

    </ScrollView>
  );
}

<<<<<<< HEAD
=======
const getAssetColor = (type) => {
  const colors = {
    stock: '#48A9C5',      // Light blue for stocks
    etf: '#06D6A0',        // Teal for ETFs
    crypto: '#F4A261',     // Golden for crypto
  };
  return colors[type.toLowerCase()] || darkTheme.primary;
};

>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
<<<<<<< HEAD
  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
  headerTitle: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
=======
  summaryCard: {
    backgroundColor: darkTheme.primary,
    margin: 20,
    padding: 28,
    borderRadius: 20,
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
    marginBottom: 8,
    letterSpacing: -1,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  summaryBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.75,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: darkTheme.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primaryLight,
    ...darkTheme.shadowSmall,
  },
  filterButtonText: {
    fontSize: 11,
    color: darkTheme.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeSuccess: {
     backgroundColor: 'rgba(0, 192, 135, 0.15)',
  },
  badgeError: {
     backgroundColor: 'rgba(246, 70, 93, 0.15)',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkTheme.success,
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    color: darkTheme.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 0, 
  },
<<<<<<< HEAD
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 4,
=======
  card: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    ...darkTheme.shadow,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  editButton: {
    color: darkTheme.secondary,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
    backgroundColor: 'transparent',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  assetType: {
    fontSize: 16,
    color: darkTheme.text,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  assetValue: {
    fontSize: 17,
    fontWeight: '700',
    color: darkTheme.text,
  },
  emptyText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  targetSection: {
    marginBottom: 20,
  },
  targetLabel: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    marginBottom: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  targetBar: {
    height: 10,
    backgroundColor: darkTheme.card,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  targetProgress: {
    height: '100%',
    backgroundColor: darkTheme.success,
  },
  targetText: {
    fontSize: 15,
    color: darkTheme.text,
    fontWeight: '600',
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
    width: width - 40,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: darkTheme.border,
    ...darkTheme.shadow,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 24,
    letterSpacing: -0.5,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
  statChangeSuccess: {
    fontSize: 14,
<<<<<<< HEAD
    color: darkTheme.success,
    fontWeight: '600',
  },
  statChangeError: {
    fontSize: 14,
    color: darkTheme.error,
    fontWeight: '600',
=======
    color: darkTheme.textSecondary,
    marginBottom: 8,
    marginTop: 12,
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
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
  saveButton: {
    backgroundColor: darkTheme.primary,
    ...darkTheme.shadowSmall,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: darkTheme.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
>>>>>>> d374d3737045f6c7df66bc043c40fc4103075061
  },
});
