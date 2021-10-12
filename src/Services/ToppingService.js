import axios from 'axios';

//TOPPING SERVICE MODIFICATIONS DONE
const API_URL = 'http://localhost:8080/api/access/';

class ToppingService {
    getToppingsList() {
        return axios.get(API_URL + "toppings");
    }

    getToppingStats(fromTimestamp, toTimestamp) {
        return axios.post(API_URL + "toppings/stats", {
            fromTimestamp,
            toTimestamp
        });
    }

    addTopping(name, smallPrice, veg) {

        let vegan = veg === "veg" ? true : false;

        return axios.post(API_URL + "toppings", {
            name,
            smallPrice,
            vegan
        });
    }

    updateTopping(id, name, smallPrice, veg) {

        let vegan = veg === "veg" ? true : false;

        return axios.put(API_URL + "toppings/" + id, {
            name,
            smallPrice,
            vegan
        });
    }

    deleteTopping(id) {
        return axios.delete(API_URL + "toppings/" + id);
    }
}

export default new ToppingService();