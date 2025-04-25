import axios from "axios";

const API_URL = "http://localhost:8070/api/sparepart";

export const getSpareParts = async () =>
  await axios.get(`${API_URL}/get-spareparts`);

export const deleteSparePart = async (id) =>
  await axios.delete(`${API_URL}/delete/${id}`);

export const createSparePart = async (sparePartData) =>
  await axios.post(`${API_URL}/create`, sparePartData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const updateSparePart = async (id, sparePartData) =>
  await axios.put(`${API_URL}/update/${id}`, sparePartData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const getSparePartById = async (id) =>
  await axios.get(`${API_URL}/get-sparepart/${id}`);
