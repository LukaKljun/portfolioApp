import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { darkTheme } from '../utils/theme';
import Card from '../components/Card';

export default function GoalsScreen() {
  const { goals, addGoal, removeGoal, updateGoalProgress } = usePortfolio(); // Ensure removeGoal is available in context or use deleteGoal
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) {
      Alert.alert('Error', 'Please enter a title and target amount');
      return;
    }

    addGoal({
      title: newGoalTitle,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      icon: '🎯',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6).toISOString(),
    });
    setNewGoalTitle('');
    setNewGoalTarget('');
  };

  const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
           <Text style={styles.headerTitle}>Financial Goals</Text>
        </View>

        {/* Add Goal Form */}
        <Card style={styles.formCard}>
           <Text style={styles.cardTitle}>Set New Goal</Text>
           <View style={styles.row}>
             <View style={styles.col}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                   style={styles.input}
                   placeholder="New Car"
                   placeholderTextColor={darkTheme.textSecondary}
                   value={newGoalTitle}
                   onChangeText={setNewGoalTitle}
                />
             </View>
             <View style={styles.col}>
                <Text style={styles.label}>Target ($)</Text>
                <TextInput
                   style={styles.input}
                   placeholder="10000"
                   placeholderTextColor={darkTheme.textSecondary}
                   keyboardType="numeric"
                   value={newGoalTarget}
                   onChangeText={setNewGoalTarget}
                />
             </View>
           </View>
           <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
             <Text style={styles.addButtonText}>Create Goal</Text>
           </TouchableOpacity>
        </Card>
        
        {/* Goals List */}
        <View style={styles.list}>
          {goals.map((goal) => (
             <Card key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                   <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalStats}>
                        ${goal.currentAmount?.toLocaleString() || '0'} / ${goal.targetAmount?.toLocaleString() || '0'}
                      </Text>
                   </View>
                   <TouchableOpacity onPress={() => removeGoal ? removeGoal(goal.id) : Alert.alert('Notice', 'Remove function missing in context')}> 
                      <Text style={styles.removeText}>Remove</Text>
                   </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBg}>
                   <View 
                      style={[
                        styles.progressFill, 
                        { width: `${calculateProgress(goal.currentAmount || 0, goal.targetAmount || 1)}%` }
                      ]} 
                   />
                </View>
                <View style={styles.progressLabelRow}>
                   <Text style={styles.progressLabel}>
                      {calculateProgress(goal.currentAmount || 0, goal.targetAmount || 1).toFixed(0)}% Completed
                   </Text>
                </View>
             </Card>
          ))}

          {goals.length === 0 && (
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No goals yet. Start saving!</Text>
            </View>
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
  content: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: darkTheme.background,
    borderWidth: 1,
    borderColor: darkTheme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: darkTheme.text,
  },
  addButton: {
    backgroundColor: darkTheme.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    gap: 16,
  },
  goalCard: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 4,
  },
  goalStats: {
    fontSize: 14,
    color: darkTheme.textSecondary,
  },
  removeText: {
    fontSize: 12,
    color: darkTheme.error,
  },
  progressBg: {
    height: 8,
    backgroundColor: darkTheme.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: darkTheme.success,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  progressLabel: {
    fontSize: 12,
    color: darkTheme.success,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: darkTheme.textSecondary,
  },
});
