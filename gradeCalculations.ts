import { Assignment, Course } from '../types';

export function calculateGPA(courses: Course[], assignments: Assignment[]): number {
  if (courses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    const courseAssignments = assignments.filter(a => a.courseId === course.id && a.isCompleted);
    if (courseAssignments.length > 0) {
      const courseGrade = calculateCourseGrade(courseAssignments);
      totalPoints += getGradePoint(courseGrade) * course.credits;
      totalCredits += course.credits;
    }
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function calculateCourseGrade(assignments: Assignment[]): number {
  if (assignments.length === 0) return 0;
  
  const totalEarned = assignments.reduce((sum, a) => sum + (a.earnedPoints || 0), 0);
  const totalPossible = assignments.reduce((sum, a) => sum + a.totalPoints, 0);
  
  return totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
}

export function getLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

export function getGradePoint(percentage: number): number {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 63) return 1.0;
  if (percentage >= 60) return 0.7;
  return 0.0;
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-blue-600';
  if (percentage >= 70) return 'text-yellow-600';
  if (percentage >= 60) return 'text-orange-600';
  return 'text-red-600';
}