import axios from "axios";

const API_URL = "http://localhost:8070/api/sparepart";

export const getSpareParts = async () => await axios.get(`${API_URL}/get-spareparts`);