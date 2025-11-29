export type EmploymentType = 'full_time' | 'part_time' | 'contract';
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';
export type LeaveType = 'annual' | 'sick' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Department {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Employee {
    id: number;
    company?: number;
    user?: number | null;
    employee_number: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    department?: number | null;
    position: string;
    hire_date: string;
    salary: number | string; // DecimalField often comes as string, but DRF might coerce. Safe to allow string.
    employment_type: EmploymentType;
    status: EmployeeStatus;
    address?: string | null;
    national_id?: string | null;
    birth_date?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Attendance {
    id: number;
    employee: number;
    date: string;
    check_in?: string | null;
    check_out?: string | null;
    status: AttendanceStatus;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Leave {
    id: number;
    employee: number;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    approved_by?: number | null;
    created_at?: string;
    updated_at?: string;
}
