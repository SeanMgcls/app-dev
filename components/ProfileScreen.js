import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native'; // Added Alert for confirmation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for archive icon

export default function ProfileScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // New function to archive a task
  const archiveTask = async (taskId) => {
    Alert.alert(
      "Archive Task",
      "Are you sure you want to archive this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Archive",
          onPress: async () => {
            try {
              const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, status: 'archived' } : task
              );
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
              setTasks(updatedTasks); // Update local state
              await loadTasks(); // Reload to reflect changes (and filter out archived tasks)
            } catch (error) {
              console.error('Error archiving task:', error);
            }
          }
        }
      ]
    );
  };

  // Filter out archived tasks for display in this screen
  const activeTasks = tasks.filter(task => task.status !== 'archived');

  return (
    <View className="flex-1 bg-gray-300 p-5">
      <Text className="text-xl font-bold text-center mb-5">Active Tasks</Text> {/* Changed title */}

      {activeTasks.length === 0 ? (
        <Text className="text-center text-gray-600">No active tasks yet.</Text>
      ) : (
        <FlatList
          data={activeTasks} // Display only active tasks
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Use a unique ID for key, if available
          renderItem={({ item }) => (
            <View className="bg-white p-5 mb-4 rounded-lg shadow-lg flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-1" // Make TouchableOpacity take available space for text
                onPress={() => navigation.navigate('TaskDetails', { task: item })}
              >
                <Text className="text-lg font-bold">{item.name}</Text>
                <View className={`p-2 mt-2 rounded-lg ${item.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  <Text className="text-white text-center text-sm font-bold">{item.status.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => archiveTask(item.id)} // Pass task ID to archive function
                className="ml-4 p-3 bg-gray-200 rounded-full" // Style for the archive button
              >
                <Ionicons name="archive-outline" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}