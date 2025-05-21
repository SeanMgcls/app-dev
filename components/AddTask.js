import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, Alert } from 'react-native'; // Added Alert for better user feedback
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values'; // <--- IMPORTANT: Needed for uuid to work in React Native
import { v4 as uuidv4 } from 'uuid'; // <--- IMPORTANT: Import v4 as uuidv4 for unique IDs


export default function AddTask() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const navigation = useNavigation();


  const saveTask = async () => {
    if (taskName.trim() === '') { // Add basic validation
      Alert.alert('Error', 'Task name cannot be empty!');
      return;
    }

    try {
      const newTask = {
        id: uuidv4(), // <--- THIS IS THE CRUCIAL CHANGE: Generate a unique ID for each task
        name: taskName.toUpperCase(),
        description: taskDescription,
        status: 'pending', // Initial status
        createdAt: new Date().toISOString(), // Good for tracking creation time
      };

      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

      Alert.alert('Success', `${newTask.name} is now added!`); // Use Alert for consistent feedback
      setTaskName('');
      setTaskDescription('');

      // Navigate back to HomeScreen, which should trigger useFocusEffect in ProfileScreen/HomeStack
      navigation.navigate('Home'); // Assuming 'Home' is the tab that leads to ProfileScreen
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to add task.'); // Provide error feedback
    }
  };


  return (
    <View className="flex-1 bg-gray-300 p-5 justify-center items-center">
      <View className="bg-gray-500 p-10 py-12 container min-h-[280px] max-h-[780px] rounded-xl justify-center">
        {/* Task Name */}
        <TextInput
          className="bg-white p-3 mb-4 rounded-lg p-5"
          placeholder="Task Name"
          value={taskName.toUpperCase()} // Displaying uppercase, but storing original case if needed
          onChangeText={setTaskName}
        />

        {/* Task Description */}
        <TextInput
          className="bg-white p-5 mb-4 rounded-lg h-24"
          placeholder="Task Description"
          multiline={true}
          value={taskDescription}
          onChangeText={setTaskDescription}
          textAlignVertical="top" // Ensure text starts from top on Android for multiline
        />

        <TouchableOpacity className="bg-red-500 p-5 rounded mt-10 rounded-lg" onPress={saveTask}>
          <Text className="text-white text-center font-bold">Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}