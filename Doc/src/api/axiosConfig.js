import axios from "axios";

const API = axios.create({
  baseURL: "https://docappsys-ztig.onrender.com"
});

export default API;
