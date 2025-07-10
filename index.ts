export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  color: string;
  instructor: string;
  semester: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'exam' | 'quiz' | 'homework' | 'project' | 'participation';
  totalPoints: number;
  earnedPoints: number | null;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface GradeStats {
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  gpa: number;
  letterGrade: string;
}