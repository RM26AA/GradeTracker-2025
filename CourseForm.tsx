import React, { useState } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const courseColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
];

export default function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: course?.name || '',
    code: course?.code || '',
    credits: course?.credits || 3,
    color: course?.color || courseColors[0],
    instructor: course?.instructor || '',
    semester: course?.semester || '',
  });
  const [customCredits, setCustomCredits] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.code.trim() && formData.instructor.trim() && formData.semester.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseFloat(value) : value
    }));
  };

  const handleCreditsChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setCustomCredits(true);
      setFormData(prev => ({ ...prev, credits: 1 }));
    } else {
      setCustomCredits(false);
      setFormData(prev => ({ ...prev, credits: parseFloat(value) }));
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {course ? 'Edit Course' : 'Add New Course'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduction to Computer Science"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CS101"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Smith"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fall 2024"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credits
            </label>
            <div className="space-y-2">
              {!customCredits ? (
                <select
                  name="credits"
                  value={formData.credits}
                  onChange={handleCreditsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(credit => (
                    <option key={credit} value={credit}>{credit} {credit === 1 ? 'credit' : 'credits'}</option>
                  ))}
                  <option value="custom">Custom amount...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="0.5"
                    max="100"
                    step="0.5"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter credits"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomCredits(false);
                      setFormData(prev => ({ ...prev, credits: 3 }));
                    }}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md transition-colors"
                    title="Back to dropdown"
                  >
                    ↩
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {courseColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                />
              ))}
            </div>
          </div>
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
            {course ? 'Update' : 'Add'} Course
          </button>
        </div>
      </form>
    </div>
  );
}