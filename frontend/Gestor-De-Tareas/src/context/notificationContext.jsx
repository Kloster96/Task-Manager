import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { SocketContext } from './socketContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { socket } = useContext(SocketContext);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL);
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('notification', (newNotification) => {
                console.log('New notification received:', newNotification);
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            socket.on('task_updated', (data) => {
                console.log('Task updated:', data);
            });

            return () => {
                socket.off('notification');
                socket.off('task_updated');
            };
        }
    }, [socket]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ(notificationId));
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_ALL_READ);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axiosInstance.delete(API_PATHS.NOTIFICATIONS.DELETE(notificationId));
            const notification = notifications.find(n => n._id === notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};