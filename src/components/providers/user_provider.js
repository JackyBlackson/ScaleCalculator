'use client'
import React, { createContext, useState, useEffect } from 'react';


import {User} from "@/datatypes/user/user";

export const UserContext = createContext(new User());

export const UserProvider = ({ children }) => {
    // const [user, setUser] = useState(() => {
    //     // Try to load user data from local storage
    //     const storedUser = localStorage.getItem('user');
    //     return storedUser ? JSON.parse(storedUser) : new User();
    // });
    const [user, setUser] = useState(new User());

    const setLoginUser = (userData) => {
        setUser(userData);
        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify(userData));
    };

    useEffect(() => {
        // Load user data from local storage on component mount
        const storedUserJson = localStorage.getItem('user');
        console.log("storedUserJson", storedUserJson);
        if (storedUserJson) {
            const updateUser = new User();
            const storedUser = JSON.parse(storedUserJson);
            console.log("storedUser", storedUser);
            updateUser.login(storedUser);
            updateUser.setToken(storedUser.token);
            console.log("updateUser", updateUser);
            setUser(updateUser);
        }
    }, []); // Empty dependency array ensures this effect only runs once on component mount

    return (
        <UserContext.Provider value={{ user, setLoginUser }}>
            {children}
        </UserContext.Provider>
    );
};

