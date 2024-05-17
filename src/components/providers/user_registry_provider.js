"use client"
import React, {createContext, useEffect, useState} from "react";
import {User} from "@/datatypes/user/user";
import {UserRegistry} from "@/datatypes/user/user_registry";

export const UserRegistryContext = createContext(new User());

export const UserRegistryProvider= ({ children }) => {
    // const [user, setUser] = useState(() => {
    //     // Try to load user data from local storage
    //     const storedUser = localStorage.getItem('user');
    //     return storedUser ? JSON.parse(storedUser) : new User();
    // });
    const [userRegistry, setUserRegistry] = useState(new UserRegistry());

    useEffect(() => {
        // Load user data from local storage on component mount
        const storedUserRegistryJson = localStorage.getItem('userRegistry');
        console.log("storedUserRegistryJson", storedUserRegistryJson);
        if (storedUserRegistryJson) {
            const updateUserRegistry = new UserRegistry();
            const storedUserRegistry = JSON.parse(storedUserRegistryJson);
            console.log("storedUser", storedUserRegistry);
            updateUserRegistry.users = storedUserRegistry.users;
            console.log("updateUserRegistry", updateUserRegistry);
            setUserRegistry(updateUserRegistry);
        }
    }, []); // Empty dependency array ensures this effect only runs once on component mount

    return (
        <UserRegistryContext.Provider value={{ userRegistry, setUserRegistry }}>
            {children}
        </UserRegistryContext.Provider>
    );
};