
import React from 'react';
import { NotionTask, TaskStatus } from '../types';

interface TaskItemProps {
  task: NotionTask;
  onToggle: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const isDone = task.status === TaskStatus.DONE;

  return (
    <div className="flex items-center group py-3 border-b border-gray-100 last:border-0 ml-4 pr-4">
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isDone 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {isDone && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <div className="ml-3 flex-1">
        <p className={`text-[15px] font-medium transition-all duration-200 ${
          isDone ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'
        }`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className="text-[11px] text-gray-400 mt-0.5">{task.dueDate}</p>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
          task.priority === 'High' ? 'text-red-500 border-red-100 bg-red-50' :
          task.priority === 'Medium' ? 'text-orange-500 border-orange-100 bg-orange-50' :
          'text-blue-500 border-blue-100 bg-blue-50'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};
