import React, { useState } from 'react';
import { Course, Assignment } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import AssignmentList from './components/AssignmentList';

function App() {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleAddCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, courseData: Omit<Course, 'id' | 'createdAt'>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    ));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setAssignments(assignments.filter(assignment => assignment.courseId !== id));
  };

  const handleAddAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleUpdateAssignment = (id: string, assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, ...assignmentData } : assignment
    ));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  const renderContent = () => {
    if (selectedCourse) {
      const courseAssignments = assignments.filter(a => a.courseId === selectedCourse.id);
      return (
        <AssignmentList
          course={selectedCourse}
          assignments={courseAssignments}
          onAddAssignment={handleAddAssignment}
          onUpdateAssignment={handleUpdateAssignment}
          onDeleteAssignment={handleDeleteAssignment}
          onBack={handleBackToCourses}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard courses={courses} assignments={assignments} />;
      case 'courses':
        return (
          <CourseList
            courses={courses}
            assignments={assignments}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onSelectCourse={handleSelectCourse}
          />
        );
      default:
        return <Dashboard courses={courses} assignments={assignments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;