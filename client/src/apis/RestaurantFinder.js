import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:4006/api/v1/restaurants"
});