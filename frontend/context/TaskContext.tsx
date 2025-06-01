// frontend/context/TaskContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { get } from '../api/api';
import { useAuth } from './AuthContext';

export type Task = {
  id: number;
  name: string;
  description?: string;
  due: string;
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  submitTask: (id: number) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token } = useAuth();  // 👈 Use token from AuthContext

  const fetchTasks = async () => {
    if (!token) {
      console.log('⚠️ No token available — skipping fetchTasks.');
      setTasks([]);  // Clear tasks when no token
      return;
    }
    try {
      const data = await get('/tasks');  // 👈 Pass token to API call
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);  // 👈 Refetch only when token changes

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const submitTask = (id: number) => {
    console.log(`Submitted task ${id} for verification`);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, submitTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
