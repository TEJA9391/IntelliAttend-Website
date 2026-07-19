export interface KPIData {
  title: string;
  value: number;
  change: number;
  sparkline: number[];
  icon: string;
  color: string;
  gradient: string;
}

export interface WeeklyData {
  day: string;
  present: number;
  absent: number;
  late: number;
}

export interface AttendanceDistribution {
  name: string;
  value: number;
  color: string;
}

export interface DepartmentData {
  name: string;
  percentage: number;
  color: string;
  students: number;
}

export interface ClassSchedule {
  time: string;
  subject: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface FacultyData {
  name: string;
  department: string;
  attendance: number;
  classes: number;
  avatar: string;
}

export interface ActivityEntry {
  id: number;
  student: string;
  subject: string;
  faculty: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  time: string;
  avatar: string;
}
