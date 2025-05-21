// ArchivedTasksScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ArchivedTasksScreen() { // Changed component name
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

  // New function to unarchive a task
 const unarchiveTask = async (taskId) => {
  Alert.alert(
    "Unarchive Task",
    "Are you sure you want to unarchive this task?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Unarchive",
        onPress: async () => {
          try {
            const updatedTasks = tasks.map(task =>
              task.id === taskId ? { ...task, status: 'pending' } : task // Change status back to 'pending'
            );
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks); // Update local state
            await loadTasks(); // Reload to reflect changes (and filter out unarchived tasks from this view)
          } catch (error) {
            console.error('Error unarchiving task:', error);
          }
        }
      }
    ]
  );
};
  // Filter tasks to display ONLY archived tasks on this screen
  const archivedTasks = tasks.filter(task => task.status === 'archived');

  return (
    <View className="flex-1 bg-gray-300 p-5">
      <Text className="text-xl font-bold text-center mb-5">Archived Tasks</Text> {/* Changed title */}

      {archivedTasks.length === 0 ? (
        <Text className="text-center text-gray-600">No archived tasks yet.</Text>
      ) : (
        <FlatList
          data={archivedTasks} // Display only archived tasks
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View className="bg-white p-5 mb-4 rounded-lg shadow-lg flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-1"
                onPress={() => navigation.navigate('TaskDetails', { task: item })}
              >
                <Text className="text-lg font-bold">{item.name}</Text>
                {/* Display original status or just "Archived" if preferred */}
                <View className={`p-2 mt-2 rounded-lg ${item.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}>
                  <Text className="text-white text-center text-sm font-bold">{item.status.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => unarchiveTask(item.id)} // Call unarchive function
                className="ml-4 p-3 bg-gray-200 rounded-full"
              >
                <Ionicons name="archive-outline" size={24} color="green" /> {/* Green icon for unarchive */}
              </TouchableOpacity>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}