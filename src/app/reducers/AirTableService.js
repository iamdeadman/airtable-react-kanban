import axios from 'axios';

export default {

    addCardData(window, payload) {
        const API_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/card";
        return axios.post(API_URL, payload);
    },

    updateCardData(window, payload) {
        const API_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/card";
        return axios.put(API_URL, payload);
    },

    deleteCardData(window, payload) {
        const API_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api/card";
        return axios.delete(API_URL + "/" + payload.cardId);
    }

};