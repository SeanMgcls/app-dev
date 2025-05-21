import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TaskDetails({ route }) {
  const navigation = useNavigation();
  const task = route.params?.task; // Safely access the task

  if (!task) {
    return (
      <View className="flex-1 bg-gray-300 p-5 justify-center items-center">
        <Text className="text-xl font-bold text-red-500">Task not found!</Text>
      </View>
    );
  }

  const [taskStatus, setTaskStatus] = useState(task.status);

  // Mark task as completed
  const completeTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        let tasks = JSON.parse(storedTasks);
        tasks = tasks.map(t => (t.name === task.name ? { ...t, status: 'completed' } : t));
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        setTaskStatus('completed');
        navigation.goBack(); // Navigate back to refresh HomeScreen
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const deleteTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks).filter(t => t.name !== task.name);
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-300 p-5 justify-center items-center">
      <View className="bg-white p-10 rounded-lg shadow-lg min-w-[300px]">
        <Text className="text-xl font-bold mb-3">{task.name}</Text>
        <View className={`p-3 rounded-lg ${taskStatus === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
          <Text className="text-white text-center font-bold">{taskStatus.toUpperCase()}</Text>
        </View>
        <Text className="text-gray-600 mt-5">{task.description}</Text>

        {/* Complete Button */}
        {taskStatus !== 'completed' && (
          <TouchableOpacity className="bg-green-500 p-4 mt-5 rounded-lg" onPress={completeTask}>
            <Text className="text-white text-center font-bold">Mark as Completed</Text>
          </TouchableOpacity>
        )}

        {/* Delete Button */}
        <TouchableOpacity className="bg-red-500 p-4 mt-3 rounded-lg" onPress={deleteTask}>
          <Text className="text-white text-center font-bold">Delete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}