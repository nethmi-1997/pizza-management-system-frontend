import axios from 'axios';
const API_URL = 'http://localhost:8080/api/access/';

//Crust Service
class CrustService {
    getCrustsList() {
        return axios.get(API_URL + "crusts");
    }

    getCrustStats(fromTimestamp, toTimestamp) {
        return axios.post(API_URL + "crusts/stats", {
            fromTimestamp,
            toTimestamp
        });
    }

    addCrust(name, smallPrice, veg) {

        let vegan = veg === "veg" ? true : false;

        return axios.post(API_URL + "crusts", {
            name,
            smallPrice,
            vegan
        });
    }

    updateCrust(id, name, smallPrice, veg) {

        let vegan = veg === "veg" ? true : false;

        return axios.put(API_URL + "crusts/" + id, {
            name,
            smallPrice,
            vegan
        });
    }

    deleteCrust(id) {
        return axios.delete(API_URL + "crusts/" + id);
    }
}

export default new CrustService();