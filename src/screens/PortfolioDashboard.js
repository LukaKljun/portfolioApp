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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
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
  },
  statChangeSuccess: {
    fontSize: 14,
    color: darkTheme.success,
    fontWeight: '600',
  },
  statChangeError: {
    fontSize: 14,
    color: darkTheme.error,
    fontWeight: '600',
  },
});
