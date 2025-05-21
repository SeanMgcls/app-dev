import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const [allLoadedTasks, setAllLoadedTasks] = useState([]); // <--- NEW STATE FOR ALL TASKS
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const navigation = useNavigation();

  // useFocusEffect to load tasks whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadTaskCounts = async () => {
        try {
          const storedTasks = await AsyncStorage.getItem('tasks');
          const tasks = storedTasks ? JSON.parse(storedTasks) : [];
          setAllLoadedTasks(tasks); // <--- Store all tasks in state

          // Filter out archived tasks for these counts, unless you want to include them in "All Tasks"
          const activeTasks = tasks.filter(task => task.status !== 'archived');

          setTotalTasks(activeTasks.length);
          setPendingTasks(activeTasks.filter(task => task.status === 'pending').length);
          setCompletedTasks(activeTasks.filter(task => task.status === 'completed').length);

        } catch (error) {
          console.error('Error loading task counts:', error);
        }
      };

      loadTaskCounts();
      // No cleanup needed for this effect, but include an empty dependency array
      // to re-run only when the screen gains focus.
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Dashboard</Text>

      <View style={styles.statsGrid}>

        {/* Total Tasks */}
        <TouchableOpacity
          style={[styles.statCard, styles.totalCard]}
          onPress={() => navigation.navigate('View All Tasks')}
        >
          <Ionicons name="documents-outline" size={30} color="#fff" />
          <Text style={styles.statCount}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total Active Tasks</Text>
        </TouchableOpacity>

        {/* Pending Tasks */}
        <TouchableOpacity
          style={[styles.statCard, styles.pendingCard]}
          onPress={() => navigation.navigate('View All Tasks', { filter: 'pending' })}
        >
          <Ionicons name=" hourglass-outline" size={30} color="#fff" />
          <Text style={styles.statCount}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </TouchableOpacity>

        {/* Completed Tasks */}
        <TouchableOpacity
          style={[styles.statCard, styles.completedCard]}
          onPress={() => navigation.navigate('View All Tasks', { filter: 'completed' })}
        >
          <Ionicons name="checkmark-done-circle-outline" size={30} color="#fff" />
          <Text style={styles.statCount}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </TouchableOpacity>

        {/* Archived Tasks - Added for completeness, if you want a quick link */}
        <TouchableOpacity
          style={[styles.statCard, styles.archivedCard]}
          onPress={() => navigation.navigate('Archived Tasks')}
        >
          <Ionicons name="archive-outline" size={30} color="#fff" />
          <Text style={styles.statCount}>
            {allLoadedTasks.filter(task => task.status === 'archived').length} {/* <--- Use allLoadedTasks here */}
          </Text>
          <Text style={styles.statLabel}>Archived Tasks</Text>
        </TouchableOpacity>

      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Add New Task')}
        >
          <Ionicons name="add-circle-outline" size={24} color="blue" />
          <Text style={styles.actionButtonText}>Add New Task</Text>
        </TouchableOpacity>

        {/* You could add more quick action buttons here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light gray background
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    marginTop: 50, // Give some space from the top
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    width: '45%', // Approx half width, accounting for spacing
    height: 150,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  totalCard: {
    backgroundColor: '#6200EE', // Deep purple
  },
  pendingCard: {
    backgroundColor: '#FF6F00', // Orange
  },
  completedCard: {
    backgroundColor: '#00C853', // Green
  },
  archivedCard: {
    backgroundColor: '#757575', // Gray
  },
  statCount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  quickActions: {
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
});