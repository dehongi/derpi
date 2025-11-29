import api from '@/utils/api';
import { Department, Employee, Attendance, Leave } from '@/lib/types/hr';

// Departments
export const getDepartments = () => api.get<Department[]>('/hr/departments/');
export const getDepartment = (id: number) => api.get<Department>(`/hr/departments/${id}/`);
export const createDepartment = (data: Partial<Department>) => api.post<Department>('/hr/departments/', data);
export const updateDepartment = (id: number, data: Partial<Department>) => api.put<Department>(`/hr/departments/${id}/`, data);
export const deleteDepartment = (id: number) => api.delete(`/hr/departments/${id}/`);

// Employees
export const getEmployees = () => api.get<Employee[]>('/hr/employees/');
export const getEmployee = (id: number) => api.get<Employee>(`/hr/employees/${id}/`);
export const createEmployee = (data: Partial<Employee>) => api.post<Employee>('/hr/employees/', data);
export const updateEmployee = (id: number, data: Partial<Employee>) => api.put<Employee>(`/hr/employees/${id}/`, data);
export const deleteEmployee = (id: number) => api.delete(`/hr/employees/${id}/`);

// Attendance
export const getAttendances = () => api.get<Attendance[]>('/hr/attendances/');
export const getAttendance = (id: number) => api.get<Attendance>(`/hr/attendances/${id}/`);
export const createAttendance = (data: Partial<Attendance>) => api.post<Attendance>('/hr/attendances/', data);
export const updateAttendance = (id: number, data: Partial<Attendance>) => api.put<Attendance>(`/hr/attendances/${id}/`, data);
export const deleteAttendance = (id: number) => api.delete(`/hr/attendances/${id}/`);

// Leaves
export const getLeaves = () => api.get<Leave[]>('/hr/leaves/');
export const getLeave = (id: number) => api.get<Leave>(`/hr/leaves/${id}/`);
export const createLeave = (data: Partial<Leave>) => api.post<Leave>('/hr/leaves/', data);
export const updateLeave = (id: number, data: Partial<Leave>) => api.put<Leave>(`/hr/leaves/${id}/`, data);
export const deleteLeave = (id: number) => api.delete(`/hr/leaves/${id}/`);
