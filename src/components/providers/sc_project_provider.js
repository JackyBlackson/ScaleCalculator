import React, {createContext, useEffect, useState} from "react";
import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";

export const SCProjectContext = createContext(new ScaleCalculatorProject());

export const SCProjectProvider = ({ children }) => {
    // const [user, setUser] = useState(() => {
    //     // Try to load user data from local storage
    //     const storedUser = localStorage.getItem('user');
    //     return storedUser ? JSON.parse(storedUser) : new User();
    // });
    const [scProject, setProject] = useState(new ScaleCalculatorProject());

    const setSCProject = (projectData) => {
        const project = ScaleCalculatorProject.from(projectData)
        setProject(project);
        // Save user data to local storage
        localStorage.setItem('scaleCalculatorProject', JSON.stringify(project.getSerializableObject()));
    };

    useEffect(() => {
        // Load user data from local storage on component mount
        const storedProjectJson = localStorage.getItem('scaleCalculatorProject');
        console.log("storedProjectJson", storedProjectJson);
        if (storedProjectJson) {
            const storedProjectObject = JSON.parse(storedProjectJson);
            console.log("storedProjectObject", storedProjectObject);
            const updateProjectClass = ScaleCalculatorProject.deserializeFromObject(storedProjectObject)
            console.log("updateProjectClass", updateProjectClass);
            setProject(updateProjectClass);
        }
    }, []); // Empty dependency array ensures this effect only runs once on component mount

    return (
        <SCProjectContext.Provider value={{ scProject, setSCProject }}>
            {children}
        </SCProjectContext.Provider>
    );
};