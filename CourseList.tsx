import React, { useState } from 'react';
import { Course, Assignment } from '../types';
import { Plus, Edit2, Trash2, BookOpen, Users, Calendar } from 'lucide-react';
import { calculateCourseGrade } from '../utils/gradeCalculations';
import CourseForm from './CourseForm';

interface CourseListProps {
  courses: Course[];
  assignments: Assignment[];
  onAddCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  onUpdateCourse: (id: string, course: Omit<Course, 'id' | 'createdAt'>) => void;
  onDeleteCourse: (id: string) => void;
  onSelectCourse: (course: Course) => void;
}

export default function CourseList({ 
  courses, 
  assignments, 
  onAddCourse, 
  onUpdateCourse, 
  onDeleteCourse, 
  onSelectCourse 
}: CourseListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleSubmit = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    if (editingCourse) {
      onUpdateCourse(editingCourse.id, courseData);
    } else {
      onAddCourse(courseData);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (course: Course) => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"? This will also delete all associated assignments.`)) {
      onDeleteCourse(course.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const courseAssignments = assignments.filter(a => a.courseId === course.id);
          const completedAssignments = courseAssignments.filter(a => a.isCompleted);
          const currentGrade = calculateCourseGrade(completedAssignments);
          
          return (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-2 ${course.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{course.semester}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{course.credits} credits</span>
                    <span className="text-gray-600">
                      {completedAssignments.length}/{courseAssignments.length} assignments
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Current Grade: </span>
                    <span className={`font-medium ${currentGrade >= 90 ? 'text-green-600' : currentGrade >= 80 ? 'text-blue-600' : currentGrade >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {completedAssignments.length > 0 ? `${currentGrade.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first course</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Course
          </button>
        </div>
      )}
    </div>
  );
}