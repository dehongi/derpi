import api from '@/utils/api';

// Sales Orders
export const getSalesOrders = () => api.get('/sales/sales-orders/');
export const getSalesOrder = (id: string | number) => api.get(`/sales/sales-orders/${id}/`);
export const createSalesOrder = (data: any) => api.post('/sales/sales-orders/', data);
export const updateSalesOrder = (id: string | number, data: any) => api.put(`/sales/sales-orders/${id}/`, data);
export const deleteSalesOrder = (id: string | number) => api.delete(`/sales/sales-orders/${id}/`);
export const createSalesOrderItem = (data: any) => api.post('/sales/sales-order-items/', data);

// Quotations
export const getQuotations = () => api.get('/sales/quotations/');
export const getQuotation = (id: string | number) => api.get(`/sales/quotations/${id}/`);
export const createQuotation = (data: any) => api.post('/sales/quotations/', data);
export const updateQuotation = (id: string | number, data: any) => api.put(`/sales/quotations/${id}/`, data);
export const deleteQuotation = (id: string | number) => api.delete(`/sales/quotations/${id}/`);
export const createQuotationItem = (data: any) => api.post('/sales/quotation-items/', data);

// Invoices
export const getInvoices = () => api.get('/sales/invoices/');
export const getInvoice = (id: string | number) => api.get(`/sales/invoices/${id}/`);
export const createInvoice = (data: any) => api.post('/sales/invoices/', data);
export const updateInvoice = (id: string | number, data: any) => api.put(`/sales/invoices/${id}/`, data);
export const deleteInvoice = (id: string | number) => api.delete(`/sales/invoices/${id}/`);
export const createInvoiceItem = (data: any) => api.post('/sales/invoice-items/', data);

// Payments
export const getPayments = () => api.get('/sales/payments/');
export const getPayment = (id: string | number) => api.get(`/sales/payments/${id}/`);
export const createPayment = (data: any) => api.post('/sales/payments/', data);
export const updatePayment = (id: string | number, data: any) => api.put(`/sales/payments/${id}/`, data);
export const deletePayment = (id: string | number) => api.delete(`/sales/payments/${id}/`);

// Helpers (assuming these endpoints exist based on standard conventions)
export const getCustomers = () => api.get('/contacts/'); // Verified: /contacts/
export const getItems = () => api.get('/inventory/items/'); // Verified: /inventory/items/
