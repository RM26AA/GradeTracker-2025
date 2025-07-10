import React, { useState } from 'react';
import { Course, Assignment } from '../types';
import { Plus, Edit2, Trash2, FileText, Calendar, CheckCircle2, Circle } from 'lucide-react';
import AssignmentForm from './AssignmentForm';

interface AssignmentListProps {
  course: Course;
  assignments: Assignment[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment: (id: string, assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onDeleteAssignment: (id: string) => void;
  onBack: () => void;
}

export default function AssignmentList({ 
  course, 
  assignments, 
  onAddAssignment, 
  onUpdateAssignment, 
  onDeleteAssignment, 
  onBack 
}: AssignmentListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const handleSubmit = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    if (editingAssignment) {
      onUpdateAssignment(editingAssignment.id, assignmentData);
    } else {
      onAddAssignment(assignmentData);
    }
    setShowForm(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = (assignment: Assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      onDeleteAssignment(assignment.id);
    }
  };

  const handleToggleComplete = (assignment: Assignment) => {
    const isCompleting = !assignment.isCompleted;
    const updatedAssignment = {
      ...assignment,
      isCompleted: isCompleting,
      earnedPoints: isCompleting && assignment.earnedPoints === null ? assignment.totalPoints : assignment.earnedPoints
    };
    
    onUpdateAssignment(assignment.id, updatedAssignment);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'quiz': return '❓';
      case 'homework': return '📚';
      case 'project': return '🚀';
      case 'participation': return '🙋';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800';
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'homework': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'participation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string, isCompleted: boolean) => {
    return !isCompleted && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Courses
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-gray-600">{course.code} • {course.instructor}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Assignment
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          courseId={course.id}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
        />
      )}

      <div className="space-y-4">
        {assignments.map(assignment => {
          const percentage = assignment.earnedPoints !== null ? 
            (assignment.earnedPoints / assignment.totalPoints) * 100 : null;
          
          return (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleComplete(assignment)}
                    className={`p-1 rounded-full transition-colors ${
                      assignment.isCompleted 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {assignment.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getTypeIcon(assignment.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(assignment)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assignment)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                    {assignment.type}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className={isOverdue(assignment.dueDate, assignment.isCompleted) ? 'text-red-600' : ''}>
                      Due {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{assignment.totalPoints}</span> points
                  </div>
                  {assignment.isCompleted && percentage !== null && (
                    <div className="text-sm">
                      <span className="text-gray-600">Grade: </span>
                      <span className={`font-medium ${
                        percentage >= 90 ? 'text-green-600' : 
                        percentage >= 80 ? 'text-blue-600' : 
                        percentage >= 70 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {assignment.earnedPoints}/{assignment.totalPoints} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-500 mb-4">Add your first assignment to start tracking grades</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Assignment
          </button>
        </div>
      )}
    </div>
  );
}