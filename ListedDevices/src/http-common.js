import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3003/api",
    // headers: {
       
    //     "Content-Type":  "multipart/form-data"
    //     // "Content-Type": "application/json" // Fixed content type
    // }
});