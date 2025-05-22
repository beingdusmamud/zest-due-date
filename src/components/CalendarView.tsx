
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function CalendarView({ tasks, onUpdateTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const categoryColors = {
    work: 'bg-blue-500',
    personal: 'bg-green-500',
    shopping: 'bg-purple-500',
    health: 'bg-red-500',
    other: 'bg-gray-500',
  };

  const priorityColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="text-sm font-medium"
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dayTasks = getTasksForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={cn(
                        "relative p-3 h-20 text-left border border-gray-100 rounded-lg transition-all duration-200 hover:bg-gray-50",
                        isSelected && "bg-blue-50 border-blue-200",
                        isToday(day) && "bg-blue-100 border-blue-300",
                        !isCurrentMonth && "opacity-40"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isToday(day) && "text-blue-700",
                        !isCurrentMonth && "text-gray-400"
                      )}>
                        {format(day, 'd')}
                      </span>
                      
                      {/* Task indicators */}
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                          {dayTasks.slice(0, 3).map((task, index) => (
                            <div
                              key={task.id}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                categoryColors[task.category]
                              )}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-600 font-medium">
                              +{dayTasks.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Panel */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
            </div>
            
            <div className="p-6">
              {selectedDate ? (
                selectedDateTasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "p-4 rounded-lg border-l-4 bg-gray-50/50",
                          priorityColors[task.priority]
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-medium text-gray-900 mb-1",
                              task.completed && "line-through text-gray-500"
                            )}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${categoryColors[task.category]}`}></div>
                                <span className="text-xs text-gray-600 capitalize">{task.category}</span>
                              </div>
                              <span className={cn(
                                "text-xs font-medium capitalize",
                                task.priority === 'high' && "text-red-600",
                                task.priority === 'medium' && "text-yellow-600",
                                task.priority === 'low' && "text-green-600"
                              )}>
                                {task.priority} priority
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                            className={cn(
                              "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                              task.completed 
                                ? "bg-green-600 border-green-600 text-white" 
                                : "border-gray-300 hover:border-green-500"
                            )}
                          >
                            {task.completed && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No tasks for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Click on a date to view tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
            <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
            <div className="space-y-2">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
