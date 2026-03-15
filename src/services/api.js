import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Vite ke liye
});

export default API;


// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://ambulance-booking-backend-lafq.onrender.com/api"
// });

// export default API;