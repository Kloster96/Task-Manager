import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const responde = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(responde.data);
            } catch (error) {
                console.error("Error usuario no autenticado", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        setLoading(false);
    };

    const updateUserData = (updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };
    return (
        <UserContext.Provider value={{ user, loading, updateUser, updateUserData, clearUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;