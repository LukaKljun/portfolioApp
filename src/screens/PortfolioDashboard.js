import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function PortfolioDashboard() {
  const {
    transactions,
    monthlyTarget,
    yearlyTarget,
    updateMonthlyTarget,
    updateYearlyTarget,
    getPortfolioValue,
    getTotalSpent,
    getMonthlySpending,
    getYearlySpending,
    getAssetBreakdown,
  } = usePortfolio();

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [tempMonthlyTarget, setTempMonthlyTarget] = useState(monthlyTarget.toString());
  const [tempYearlyTarget, setTempYearlyTarget] = useState(yearlyTarget.toString());

  const portfolioValue = getPortfolioValue();
  const totalSpent = getTotalSpent();
  const monthlySpending = getMonthlySpending();
  const yearlySpending = getYearlySpending();
  const assetBreakdown = getAssetBreakdown();

  // Generate chart data from transactions
  const getChartData = () => {
    if (transactions.length === 0) {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0],
        }],
      };
    }

    // Group transactions by month
    const monthlyData = {};
    let runningTotal = 0;

    transactions
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (transaction.type === 'buy') {
          runningTotal += transaction.amount * transaction.price;
        }
        monthlyData[monthKey] = runningTotal;
      });

    const labels = Object.keys(monthlyData).slice(-6);
    const data = Object.values(monthlyData).slice(-6);

    // Ensure we always have at least 2 data points
    if (data.length === 0) {
      return {
        labels: ['Now'],
        datasets: [{ data: [0] }],
      };
    }
    if (data.length === 1) {
      return {
        labels: ['Start', 'Now'],
        datasets: [{ data: [0, data[0]] }],
      };
    }

    return {
      labels,
      datasets: [{ data }],
    };
  };

  const chartData = getChartData();

  const handleSaveTargets = () => {
    const monthly = parseFloat(tempMonthlyTarget) || 0;
    const yearly = parseFloat(tempYearlyTarget) || 0;
    updateMonthlyTarget(monthly);
    updateYearlyTarget(yearly);
    setShowTargetModal(false);
  };

  const calculateProgress = (current, target) => {
    return target > 0 ? (current / target) * 100 : 0;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
        <Text style={styles.summaryValue}>${portfolioValue.toFixed(2)}</Text>
        <Text style={styles.summarySubtext}>Total Invested: ${totalSpent.toFixed(2)}</Text>
      </View>

      {/* Portfolio Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Portfolio Growth</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: darkTheme.surface,
            backgroundGradientFrom: darkTheme.surface,
            backgroundGradientTo: darkTheme.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(187, 134, 252, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: darkTheme.primary,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Asset Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Asset Breakdown</Text>
        {Object.keys(assetBreakdown).length > 0 ? (
          Object.entries(assetBreakdown).map(([type, value]) => (
            <View key={type} style={styles.assetRow}>
              <View style={styles.assetInfo}>
                <View style={[styles.assetDot, { backgroundColor: getAssetColor(type) }]} />
                <Text style={styles.assetType}>{type.toUpperCase()}</Text>
              </View>
              <Text style={styles.assetValue}>${value.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No assets yet. Add your first transaction!</Text>
        )}
      </View>

      {/* Targets */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Investment Targets</Text>
          <TouchableOpacity onPress={() => setShowTargetModal(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Target */}
        <View style={styles.targetSection}>
          <Text style={styles.targetLabel}>Monthly Target</Text>
          <View style={styles.targetBar}>
            <View
              style={[
                styles.targetProgress,
                { width: `${Math.min(calculateProgress(monthlySpending, monthlyTarget), 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.targetText}>
            ${monthlySpending.toFixed(0)} / ${monthlyTarget.toFixed(0)}
          </Text>
        </View>

        {/* Yearly Target */}
        <View style={styles.targetSection}>
          <Text style={styles.targetLabel}>Yearly Target</Text>
          <View style={styles.targetBar}>
            <View
              style={[
                styles.targetProgress,
                { width: `${Math.min(calculateProgress(yearlySpending, yearlyTarget), 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.targetText}>
            ${yearlySpending.toFixed(0)} / ${yearlyTarget.toFixed(0)}
          </Text>
        </View>
      </View>

      {/* Target Settings Modal */}
      <Modal
        visible={showTargetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTargetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Investment Targets</Text>

            <Text style={styles.inputLabel}>Monthly Target ($)</Text>
            <TextInput
              style={styles.input}
              value={tempMonthlyTarget}
              onChangeText={setTempMonthlyTarget}
              keyboardType="numeric"
              placeholder="Enter monthly target"
              placeholderTextColor={darkTheme.textSecondary}
            />

            <Text style={styles.inputLabel}>Yearly Target ($)</Text>
            <TextInput
              style={styles.input}
              value={tempYearlyTarget}
              onChangeText={setTempYearlyTarget}
              keyboardType="numeric"
              placeholder="Enter yearly target"
              placeholderTextColor={darkTheme.textSecondary}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTargetModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveTargets}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getAssetColor = (type) => {
  const colors = {
    stock: '#BB86FC',
    etf: '#03DAC6',
    crypto: '#00BFA5',
  };
  return colors[type.toLowerCase()] || darkTheme.primary;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  summaryCard: {
    backgroundColor: darkTheme.primary,
    margin: 20,
    padding: 24,
    borderRadius: 16,
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
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  chartCard: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  card: {
    backgroundColor: darkTheme.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    ...darkTheme.shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 16,
  },
  editButton: {
    color: darkTheme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  assetType: {
    fontSize: 16,
    color: darkTheme.text,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 8,
  },
  targetBar: {
    height: 8,
    backgroundColor: darkTheme.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  targetProgress: {
    height: '100%',
    backgroundColor: darkTheme.primary,
  },
  targetText: {
    fontSize: 14,
    color: darkTheme.text,
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
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    marginTop: 12,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
  saveButton: {
    backgroundColor: darkTheme.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
  },
});
