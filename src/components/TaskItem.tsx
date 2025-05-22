
import { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/pages/Index';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    work: 'bg-blue-500',
    personal: 'bg-green-500',
    shopping: 'bg-purple-500',
    health: 'bg-red-500',
    other: 'bg-gray-500',
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  };

  const priorityIcons = {
    low: '●',
    medium: '●●',
    high: '●●●',
  };

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date();
  const isDueSoon = task.dueDate && !task.completed && 
    task.dueDate > new Date() && 
    task.dueDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000; // Due within 24 hours

  return (
    <div
      className={cn(
        "p-6 transition-all duration-200 hover:bg-gray-50/50",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h4>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-3",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[task.category]}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{task.category}</span>
                </div>
                
                {/* Priority */}
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                  priorityColors[task.priority]
                )}>
                  <Flag className="w-3 h-3" />
                  <span className="capitalize">{task.priority}</span>
                </div>
                
                {/* Due Date */}
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    isOverdue && "text-red-600 font-medium",
                    isDueSoon && !isOverdue && "text-orange-600 font-medium",
                    !isOverdue && !isDueSoon && "text-gray-600"
                  )}>
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {isOverdue && "Overdue: "}
                      {isDueSoon && !isOverdue && "Due soon: "}
                      {format(task.dueDate, "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
