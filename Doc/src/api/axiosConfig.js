import axios from "axios";

const API = axios.create({
  baseURL: "https://appointmentsystems.onrender.com"
});

export default API;