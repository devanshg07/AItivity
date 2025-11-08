'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Sparkles, Trash2, Clock, Star } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  aiSuggested?: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete project proposal', completed: false, priority: 'high', aiSuggested: true },
    { id: '2', text: 'Schedule team meeting', completed: false, priority: 'medium' },
    { id: '3', text: 'Review code changes', completed: true, priority: 'low' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions] = useState<string[]>([
    'Prepare presentation slides',
    'Follow up with client',
    'Update project documentation',
    'Review budget allocation',
  ]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: 'medium',
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addAISuggestion = (suggestion: string) => {
    const todo: Todo = {
      id: Date.now().toString(),
      text: suggestion,
      completed: false,
      priority: 'medium',
      aiSuggested: true,
    };
    setTodos([...todos, todo]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Todo List</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAISuggestions(!showAISuggestions)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          AI Suggestions
        </motion.button>
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-zinc-900 dark:text-white">AI Suggested Tasks</h3>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addAISuggestion(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex items-center justify-between"
                >
                  <span className="text-zinc-900 dark:text-white">{suggestion}</span>
                  <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTodo}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {sortedTodos.map((todo, idx) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                flex items-center gap-3 p-4 rounded-lg border transition-all
                ${todo.completed
                  ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                }
              `}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTodo(todo.id)}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-green-500'
                  }
                `}
              >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </motion.button>
              <div className="flex-1">
                <div className={`
                  font-medium
                  ${todo.completed
                    ? 'line-through text-zinc-500 dark:text-zinc-500'
                    : 'text-zinc-900 dark:text-white'
                  }
                `}>
                  {todo.text}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                  {todo.aiSuggested && (
                    <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {todo.dueDate}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTodo(todo.id)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm">
        <div className="text-zinc-600 dark:text-zinc-400">
          {todos.filter(t => !t.completed).length} remaining
        </div>
        <div className="text-zinc-600 dark:text-zinc-400">
          {todos.filter(t => t.completed).length} completed
        </div>
      </div>
    </div>
  );
}

