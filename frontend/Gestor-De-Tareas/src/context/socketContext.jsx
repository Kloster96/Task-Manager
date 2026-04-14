import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_PATHS } from '../utils/apiPaths';

export const SocketContext = createContext();

let socket = null;

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token && !socket) {
            // Connect to socket server
            const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            
            socket = io(socketUrl, {
                auth: { token },
                transports: ['websocket', 'polling']
            });

            socket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
                
                // Get user ID from token and join
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload?.id) {
                        socket.emit('join', payload.id);
                    }
                } catch (e) {
                    console.error('Error parsing token:', e);
                }
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, []);

    const emitEvent = (event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, emitEvent }}>
            {children}
        </SocketContext.Provider>
    );
};

export const getSocket = () => socket;