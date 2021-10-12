import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/access/';

class UserService {
    getUsersList() {
        return axios.get(API_URL + "users");
    }

    getDeliveryUsersList() {
        return axios.get(API_URL + "users/delivery");
    }

    updateUser(id, username, email, roles) {
        return axios.put(API_URL + "users/" + id, {
            username,
            email,
            roles
        });
    }

    deleteUser(id) {
        return axios.delete(API_URL + "users/" + id);
    }

    getAddUsers() {
        return axios.get(API_URL + 'users/add', { headers: authHeader() });
    }

    getUserReports() {
        return axios.get(API_URL + 'users/reports', { headers: authHeader() });
    }

    getAddCrusts() {
        return axios.get(API_URL + 'crusts/add', { headers: authHeader() });
    }

    getCrustsReports() {
        return axios.get(API_URL + 'crusts/reports', { headers: authHeader() });
    }
    
    getAddTopping() {
        return axios.get(API_URL + 'toppings/add', { headers: authHeader() });
    }

    getToppingsReports() {
        return axios.get(API_URL + 'toppings/reports', { headers: authHeader() });
    }
        
    getAddOrders() {
        return axios.get(API_URL + 'orders/add', { headers: authHeader() });
    }

    getOrdersReports() {
        return axios.get(API_URL + 'orders/reports', { headers: authHeader() });
    }

    getAddDelivery() {
        return axios.get(API_URL + 'delivery/add', { headers: authHeader() });
    }

    getDeliveryReports() {
        return axios.get(API_URL + 'delivery/reports', { headers: authHeader() });
    }
}

export default new UserService();