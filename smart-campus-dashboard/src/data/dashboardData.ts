import type { KPIData, WeeklyData, AttendanceDistribution, DepartmentData, ClassSchedule, FacultyData, ActivityEntry } from '../types/dashboard';

export const kpiData: KPIData[] = [
  {
    title: 'Total Students',
    value: 2847,
    change: 5.2,
    sparkline: [2100, 2200, 2350, 2500, 2600, 2750, 2847],
    icon: 'users',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Present Today',
    value: 2413,
    change: 2.8,
    sparkline: [1900, 2000, 2100, 2200, 2250, 2350, 2413],
    icon: 'check-circle',
    color: '#22C55E',
    gradient: 'from-green-500 to-green-600',
  },
  {
    title: 'Absent Today',
    value: 287,
    change: -3.1,
    sparkline: [400, 380, 350, 320, 300, 290, 287],
    icon: 'x-circle',
    color: '#F97316',
    gradient: 'from-orange-400 to-orange-500',
  },
  {
    title: 'Overall Attendance',
    value: 84.7,
    change: 1.5,
    sparkline: [80.2, 81.0, 81.8, 82.5, 83.1, 84.0, 84.7],
    icon: 'trending-up',
    color: '#14D8C4',
    gradient: 'from-teal-400 to-teal-500',
  },
];

export const weeklyData: WeeklyData[] = [
  { day: 'Mon', present: 2200, absent: 350, late: 120 },
  { day: 'Tue', present: 2350, absent: 280, late: 95 },
  { day: 'Wed', present: 2100, absent: 400, late: 150 },
  { day: 'Thu', present: 2413, absent: 287, late: 87 },
  { day: 'Fri', present: 2300, absent: 310, late: 105 },
  { day: 'Sat', present: 1800, absent: 500, late: 80 },
];

export const attendanceDistribution: AttendanceDistribution[] = [
  { name: 'Present', value: 68, color: '#22C55E' },
  { name: 'Absent', value: 12, color: '#EF4444' },
  { name: 'Late', value: 10, color: '#F97316' },
  { name: 'Leave', value: 10, color: '#A855F7' },
];

export const departmentData: DepartmentData[] = [
  { name: 'Computer Science', percentage: 89, color: '#3B82F6', students: 620 },
  { name: 'AI & ML', percentage: 86, color: '#14D8C4', students: 480 },
  { name: 'ECE', percentage: 82, color: '#A855F7', students: 510 },
  { name: 'EEE', percentage: 78, color: '#F97316', students: 440 },
  { name: 'MBA', percentage: 91, color: '#22C55E', students: 350 },
];

export const todayClasses: ClassSchedule[] = [
  { time: '09:00', subject: 'Artificial Intelligence', room: 'Room 301', type: 'lecture' },
  { time: '10:30', subject: 'Java Programming', room: 'Room 205', type: 'lecture' },
  { time: '13:30', subject: 'Database Systems', room: 'Room 412', type: 'lecture' },
  { time: '15:00', subject: 'Machine Learning Lab', room: 'Lab 102', type: 'lab' },
];

export const facultyPerformance: FacultyData[] = [
  { name: 'Dr. Priya Sharma', department: 'Computer Science', attendance: 94, classes: 24, avatar: 'PS' },
  { name: 'Prof. Rajesh Kumar', department: 'AI & ML', attendance: 91, classes: 20, avatar: 'RK' },
  { name: 'Dr. Meera Patel', department: 'ECE', attendance: 88, classes: 18, avatar: 'MP' },
  { name: 'Prof. Anil Reddy', department: 'EEE', attendance: 86, classes: 22, avatar: 'AR' },
];

export const recentActivity: ActivityEntry[] = [
  { id: 1, student: 'Aarav Mehta', subject: 'Artificial Intelligence', faculty: 'Dr. Priya Sharma', status: 'present', time: '09:05 AM', avatar: 'AM' },
  { id: 2, student: 'Sneha Reddy', subject: 'Java Programming', faculty: 'Prof. Rajesh Kumar', status: 'late', time: '10:42 AM', avatar: 'SR' },
  { id: 3, student: 'Vikram Singh', subject: 'Database Systems', faculty: 'Dr. Meera Patel', status: 'absent', time: '1:30 PM', avatar: 'VS' },
  { id: 4, student: 'Priyanka Nair', subject: 'Machine Learning Lab', faculty: 'Prof. Anil Reddy', status: 'present', time: '3:02 PM', avatar: 'PN' },
  { id: 5, student: 'Rahul Verma', subject: 'Artificial Intelligence', faculty: 'Dr. Priya Sharma', status: 'leave', time: '09:00 AM', avatar: 'RV' },
  { id: 6, student: 'Kavya Iyer', subject: 'Java Programming', faculty: 'Prof. Rajesh Kumar', status: 'present', time: '10:31 AM', avatar: 'KI' },
];

export const navItems = [
  { icon: 'LayoutDashboard', label: 'Dashboard', active: true },
  { icon: 'BookOpen', label: 'Courses' },
  { icon: 'GraduationCap', label: 'Faculty' },
  { icon: 'Users', label: 'Students' },
  { icon: 'CalendarCheck', label: 'Attendance' },
  { icon: 'BarChart3', label: 'Reports' },
  { icon: 'Megaphone', label: 'Announcements' },
  { icon: 'Bell', label: 'Notifications' },
  { icon: 'Settings', label: 'Settings' },
  { icon: 'User', label: 'Profile' },
];
