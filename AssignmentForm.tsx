import React, { useState } from 'react';
import { Assignment } from '../types';

interface AssignmentFormProps {
  assignment?: Assignment | null;
  courseId: string;
  onSubmit: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function AssignmentForm({ assignment, courseId, onSubmit, onCancel }: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    courseId,
    title: assignment?.title || '',
    description: assignment?.description || '',
    type: assignment?.type || 'homework' as const,
    totalPoints: assignment?.totalPoints || 100,
    earnedPoints: assignment?.earnedPoints || null,
    dueDate: assignment?.dueDate || new Date().toISOString().split('T')[0],
    isCompleted: assignment?.isCompleted || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'totalPoints' || name === 'earnedPoints' ? 
          (value === '' ? null : parseFloat(value)) : value
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {assignment ? 'Edit Assignment' : 'Add New Assignment'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Midterm Exam"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Comprehensive exam covering chapters 1-5"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="homework">Homework</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
              <option value="project">Project</option>
              <option value="participation">Participation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Points
            </label>
            <input
              type="number"
              name="totalPoints"
              value={formData.totalPoints}
              onChange={handleChange}
              min="1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark as completed</span>
          </label>

          {formData.isCompleted && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Earned Points:</label>
              <input
                type="number"
                name="earnedPoints"
                value={formData.earnedPoints || ''}
                onChange={handleChange}
                min="0"
                max={formData.totalPoints}
                step="0.1"
                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {assignment ? 'Update' : 'Add'} Assignment
          </button>
        </div>
      </form>
    </div>
  );
}