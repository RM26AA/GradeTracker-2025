import React from 'react';
import { Course, Assignment, GradeStats } from '../types';
import { BookOpen, TrendingUp, Calendar, Target } from 'lucide-react';
import { calculateGPA, calculateCourseGrade, getLetterGrade } from '../utils/gradeCalculations';

interface DashboardProps {
  courses: Course[];
  assignments: Assignment[];
}

export default function Dashboard({ courses, assignments }: DashboardProps) {
  const stats: GradeStats = {
    totalAssignments: assignments.length,
    completedAssignments: assignments.filter(a => a.isCompleted).length,
    averageGrade: assignments.length > 0 ? 
      assignments.filter(a => a.isCompleted).reduce((sum, a) => sum + ((a.earnedPoints || 0) / a.totalPoints * 100), 0) / 
      assignments.filter(a => a.isCompleted).length : 0,
    gpa: calculateGPA(courses, assignments),
    letterGrade: getLetterGrade(calculateGPA(courses, assignments) * 25) // Convert GPA to percentage for letter grade
  };

  const upcomingAssignments = assignments
    .filter(a => !a.isCompleted && new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentGrades = assignments
    .filter(a => a.isCompleted && a.earnedPoints !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current GPA</p>
              <p className="text-2xl font-bold text-gray-900">{stats.gpa.toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedAssignments}/{stats.totalAssignments}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => {
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
            const completedAssignments = courseAssignments.filter(a => a.isCompleted);
            const currentGrade = calculateCourseGrade(completedAssignments);
            
            return (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
                  <span className="text-sm font-medium text-gray-500">{course.code}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {completedAssignments.length}/{courseAssignments.length} assignments
                  </span>
                  <span className={`text-sm font-medium ${currentGrade >= 90 ? 'text-green-600' : currentGrade >= 80 ? 'text-blue-600' : currentGrade >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {completedAssignments.length > 0 ? `${currentGrade.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Assignments and Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h2>
          <div className="space-y-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming assignments</p>
            ) : (
              upcomingAssignments.map(assignment => {
                const course = courses.find(c => c.id === assignment.courseId);
                const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{assignment.totalPoints} pts</p>
                      <p className={`text-xs ${daysUntilDue <= 1 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {daysUntilDue === 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `Due in ${daysUntilDue} days`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h2>
          <div className="space-y-3">
            {recentGrades.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent grades</p>
            ) : (
              recentGrades.map(assignment => {
                const course = courses.find(c => c.id === assignment.courseId);
                const percentage = (assignment.earnedPoints! / assignment.totalPoints) * 100;
                
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {assignment.earnedPoints}/{assignment.totalPoints}
                      </p>
                      <p className={`text-xs font-medium ${percentage >= 90 ? 'text-green-600' : percentage >= 80 ? 'text-blue-600' : percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}