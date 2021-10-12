import axios from 'axios';

const API_URL = 'http://localhost:8080/api/access/';

class OrderService {
    getOrdersList() {
        return axios.get(API_URL + "orders");
    }

    getUndeliveredOrdersList() {
        return axios.get(API_URL + "orders/delivered/false");
    }

    getDeliveredOrdersList() {
        return axios.get(API_URL + "orders/delivered");
    }

    getUndeliveredOrdersListByName(riderName) {
        return axios.get(API_URL + "orders/delivered/false?riderName=" + riderName);
    }

    getDeliveredOrdersListByName(riderName) {
        return axios.get(API_URL + "orders/delivered?riderName=" + riderName);
    }

    addOrder(customerName, address, items, deliveryRider, cashier) {
        return axios.post(API_URL + "orders", {
            customerName,
            address,
            items,
            deliveryRider,
            cashier
        });
    }

    updateOrder(id, customerName, address) {

        // let vegan = veg === "veg" ? true : false;

        return axios.put(API_URL + "orders/" + id, {
            customerName,
            address
            
        });
    }

    deleteOrder(id) {
        return axios.delete(API_URL + "orders/" + id);
    }

    updateOrderDeliveredStatus(id) {
        return axios.put(API_URL + "orders/delivered/" + id);
    }

    updateOrderSetDeliveryAssignedStatusFalse(id) {
        return axios.put(API_URL + "orders/delivery/assigned/false/" + id);
    }
}

export default new OrderService();