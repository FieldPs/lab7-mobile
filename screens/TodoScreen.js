import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, RefreshControl, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

// Detect Platform for API URL
// '10.85.143.166' is the machine's local IP. Use this for physical devices and emulators.
const API_URL = 'http://10.85.143.166:3000/todos';

export default function TodoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Monitor Network State
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        syncTasks(); // Auto-sync when online
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Tasks on Start
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todo_tasks');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
  };

  const saveTasks = async (newTodos) => {
    try {
      await AsyncStorage.setItem('todo_tasks', JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  };

  // 3. Add Task (Offline First)
  const addTask = () => {
    if (!task.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: task,
      completed: false,
      status: 'pending' // Default status
    };

    const updatedTodos = [newTodo, ...todos];
    saveTasks(updatedTodos);
    setTask('');

    // Try to sync immediately if online
    if (isConnected) {
      syncOneTask(newTodo);
    }
  };

  // 4. Fetch from Server (Pull)
  const fetchFromServer = async () => {
    try {
      console.log("[Sync] Pulling data from server...");
      const response = await axios.get(API_URL);
      const serverTodos = response.data;

      // Get current local pending tasks (ones that haven't been uploaded yet)
      const storedTodos = JSON.parse(await AsyncStorage.getItem('todo_tasks')) || [];
      const stillPending = storedTodos.filter(t => t.status === 'pending');

      // Map server todos to our local format
      const syncedTodos = serverTodos.map(st => ({
        id: st._id, // Use MongoDB _id as primary id
        _id: st._id,
        title: st.title,
        completed: st.completed || false,
        status: 'synced'
      }));

      // Combine: Pending first, then Synced from server
      const finalTodos = [...stillPending, ...syncedTodos];
      saveTasks(finalTodos);
      console.log(`[Sync] Pulled ${syncedTodos.length} tasks from server, ${stillPending.length} still pending locally.`);
    } catch (e) {
      console.error("[Sync] Failed to fetch from server", e);
    }
  };

  // 5. Push Pending Tasks to Server
  const pushPendingTasks = async () => {
    const storedTodos = JSON.parse(await AsyncStorage.getItem('todo_tasks')) || [];
    const pendingTasks = storedTodos.filter(t => t.status === 'pending');

    if (pendingTasks.length === 0) {
      console.log("[Sync] No pending tasks to push.");
      return;
    }

    console.log(`[Sync] Pushing ${pendingTasks.length} pending tasks...`);

    for (const todo of pendingTasks) {
      try {
        const response = await axios.post(API_URL, {
          title: todo.title,
          completed: todo.completed || false
        });
        
        // Update local task with server _id and mark as synced
        const current = JSON.parse(await AsyncStorage.getItem('todo_tasks')) || [];
        const updated = current.map(t => {
          if (t.id === todo.id) {
            return {
              ...t,
              id: response.data._id,
              _id: response.data._id,
              status: 'synced'
            };
          }
          return t;
        });
        await AsyncStorage.setItem('todo_tasks', JSON.stringify(updated));
        setTodos(updated);
        
      } catch (error) {
        console.error(`[Sync] Failed to push task ${todo.id}`, error.message);
      }
    }
  };

  // 6. Full Sync = Push + Pull
  const syncTasks = async () => {
    await pushPendingTasks();
    await fetchFromServer();
  };

  const syncOneTask = async (todo) => {
    try {
      const response = await axios.post(API_URL, {
        title: todo.title,
        completed: todo.completed || false
      });

      // Update this specific task with server _id and mark as synced
      const storedTodos = JSON.parse(await AsyncStorage.getItem('todo_tasks')) || [];
      const updatedList = storedTodos.map(t => {
        if (t.id === todo.id) {
          return {
            ...t,
            id: response.data._id,
            _id: response.data._id,
            status: 'synced'
          };
        }
        return t;
      });
      saveTasks(updatedList);
    } catch (e) {
      console.log("Immediate sync failed, will retry later.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await syncTasks();
    setRefreshing(false);
  };

  const toggleTask = async (item) => {
    const newCompleted = !item.completed;

    // 1. Optimistic Update (Local)
    const updatedTodos = todos.map(t =>
      t.id === item.id ? { ...t, completed: newCompleted } : t
    );
    saveTasks(updatedTodos);

    // 2. Sync to Backend if Online and task has a server _id
    if (isConnected && item._id) {
      try {
        await axios.put(`${API_URL}/${item._id}`, {
          completed: newCompleted
        });
        console.log(`[Sync] Updated task ${item._id} completed=${newCompleted}`);
      } catch (e) {
        console.error("Failed to update task on server", e.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusHeader, { backgroundColor: isConnected ? '#10B981' : '#6B7280' }]}>
        <Text style={styles.statusText}>
            {isConnected ? "Online 🟢" : "Offline 🔴"}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="New Task..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.todoItem} 
            onPress={() => toggleTask(item)}
          >
            <Text style={[
                styles.todoText, 
                item.completed && styles.completedText
            ]}>
                {item.title}
            </Text>
            <View style={styles.badgeContainer}>
                {item.status === 'synced' ? (
                    <Text style={styles.syncedBadge}>Synced ☁️</Text>
                ) : (
                    <Text style={styles.pendingBadge}>Local Only 📱</Text>
                )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusHeader: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  badgeContainer: {
    marginLeft: 10,
  },
  syncedBadge: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    backgroundColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
