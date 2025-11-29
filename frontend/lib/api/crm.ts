import api from '@/utils/api';

// Leads
export const getLeads = () => api.get('/crm/leads/');
export const getLead = (id: string | number) => api.get(`/crm/leads/${id}/`);
export const createLead = (data: any) => api.post('/crm/leads/', data);
export const updateLead = (id: string | number, data: any) => api.put(`/crm/leads/${id}/`, data);
export const deleteLead = (id: string | number) => api.delete(`/crm/leads/${id}/`);

// Opportunities
export const getOpportunities = () => api.get('/crm/opportunitys/');
export const getOpportunity = (id: string | number) => api.get(`/crm/opportunitys/${id}/`);
export const createOpportunity = (data: any) => api.post('/crm/opportunitys/', data);
export const updateOpportunity = (id: string | number, data: any) => api.put(`/crm/opportunitys/${id}/`, data);
export const deleteOpportunity = (id: string | number) => api.delete(`/crm/opportunitys/${id}/`);

// Activities
export const getActivities = () => api.get('/crm/activitys/');
export const getActivity = (id: string | number) => api.get(`/crm/activitys/${id}/`);
export const createActivity = (data: any) => api.post('/crm/activitys/', data);
export const updateActivity = (id: string | number, data: any) => api.put(`/crm/activitys/${id}/`, data);
export const deleteActivity = (id: string | number) => api.delete(`/crm/activitys/${id}/`);

// Helper functions
export const getContacts = () => api.get('/contacts/');
export const getUsers = () => api.get('/companies/active/users/'); // For assignment dropdowns
