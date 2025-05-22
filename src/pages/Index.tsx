
import { useState } from 'react';
import { Calendar, List, Plus } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TaskList } from '@/components/TaskList';
import { CalendarView } from '@/components/CalendarView';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: Date | null;
  completed: boolean;
  createdAt: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the new product landing page',
      category: 'work',
      priority: 'high',
      dueDate: new Date(2025, 4, 25),
      completed: false,
      createdAt: new Date(2025, 4, 20),
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Get ingredients for dinner this week',
      category: 'shopping',
      priority: 'medium',
      dueDate: new Date(2025, 4, 23),
      completed: false,
      createdAt: new Date(2025, 4, 21),
    },
    {
      id: '3',
      title: 'Morning workout',
      description: '30 minutes cardio and strength training',
      category: 'health',
      priority: 'low',
      dueDate: new Date(2025, 4, 22),
      completed: true,
      createdAt: new Date(2025, 4, 22),
    },
  ]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, task]);
    setIsTaskFormOpen(false);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
          />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {currentView === 'list' ? 'My Tasks' : 'Calendar'}
                  </h1>
                  <p className="text-gray-600">
                    {currentView === 'list' 
                      ? 'Organize and track your daily tasks' 
                      : 'View your tasks by date'
                    }
                  </p>
                </div>
                <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <TaskForm onSubmit={addTask} />
                  </DialogContent>
                </Dialog>
              </div>

              {currentView === 'list' ? (
                <TaskList 
                  tasks={tasks} 
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              ) : (
                <CalendarView 
                  tasks={tasks}
                  onUpdateTask={updateTask}
                />
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
