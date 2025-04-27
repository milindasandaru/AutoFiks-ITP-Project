// services/NotificationService.js
import axios from 'axios';

const API_URL = 'http://localhost:8070/api';

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/mark-all-read`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
