import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Drivers
export const getDrivers = (params?: any) => api.get('/delivery/drivers/', { params });
export const getDriver = (id: string) => api.get(`/delivery/drivers/${id}/`);
export const createDriver = (data: any) => api.post('/delivery/drivers/', data);
export const updateDriver = (id: string, data: any) => api.put(`/delivery/drivers/${id}/`, data);
export const deleteDriver = (id: string) => api.delete(`/delivery/drivers/${id}/`);
export const getAvailableDrivers = (companyId?: string) => {
    const params = companyId ? { company: companyId } : {};
    return api.get('/delivery/drivers/available/', { params });
};

// Deliveries
export const getDeliveries = (params?: any) => api.get('/delivery/deliveries/', { params });
export const getDelivery = (id: string) => api.get(`/delivery/deliveries/${id}/`);
export const createDelivery = (data: any) => api.post('/delivery/deliveries/', data);
export const updateDelivery = (id: string, data: any) => api.put(`/delivery/deliveries/${id}/`, data);
export const deleteDelivery = (id: string) => api.delete(`/delivery/deliveries/${id}/`);
export const getPendingDeliveries = (companyId?: string) => {
    const params = companyId ? { company: companyId } : {};
    return api.get('/delivery/deliveries/pending/', { params });
};
export const getInTransitDeliveries = (companyId?: string) => {
    const params = companyId ? { company: companyId } : {};
    return api.get('/delivery/deliveries/in_transit/', { params });
};
export const assignDriver = (deliveryId: string, driverId: string) =>
    api.post(`/delivery/deliveries/${deliveryId}/assign_driver/`, { driver_id: driverId });
export const updateDeliveryStatus = (deliveryId: string, status: string) =>
    api.post(`/delivery/deliveries/${deliveryId}/update_status/`, { status });

// Delivery Items
export const getDeliveryItems = (params?: any) => api.get('/delivery/delivery-items/', { params });
export const getDeliveryItem = (id: string) => api.get(`/delivery/delivery-items/${id}/`);
export const createDeliveryItem = (data: any) => api.post('/delivery/delivery-items/', data);
export const updateDeliveryItem = (id: string, data: any) => api.put(`/delivery/delivery-items/${id}/`, data);
export const deleteDeliveryItem = (id: string) => api.delete(`/delivery/delivery-items/${id}/`);

// Delivery Routes
export const getDeliveryRoutes = (params?: any) => api.get('/delivery/routes/', { params });
export const getDeliveryRoute = (id: string) => api.get(`/delivery/routes/${id}/`);
export const createDeliveryRoute = (data: any) => api.post('/delivery/routes/', data);
export const updateDeliveryRoute = (id: string, data: any) => api.put(`/delivery/routes/${id}/`, data);
export const deleteDeliveryRoute = (id: string) => api.delete(`/delivery/routes/${id}/`);
export const addDeliveryToRoute = (routeId: string, deliveryId: string, sequence?: number) =>
    api.post(`/delivery/routes/${routeId}/add_delivery/`, { delivery_id: deliveryId, sequence });
export const startRoute = (routeId: string) => api.post(`/delivery/routes/${routeId}/start_route/`);
export const completeRoute = (routeId: string) => api.post(`/delivery/routes/${routeId}/complete_route/`);

// Route Deliveries
export const getRouteDeliveries = (params?: any) => api.get('/delivery/route-deliveries/', { params });
export const getRouteDelivery = (id: string) => api.get(`/delivery/route-deliveries/${id}/`);
export const createRouteDelivery = (data: any) => api.post('/delivery/route-deliveries/', data);
export const updateRouteDelivery = (id: string, data: any) => api.put(`/delivery/route-deliveries/${id}/`, data);
export const deleteRouteDelivery = (id: string) => api.delete(`/delivery/route-deliveries/${id}/`);
