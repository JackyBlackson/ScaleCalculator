import React, {createContext, useEffect, useState} from "react";
import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";
import ScaleCaltulatorProjectRegistry from "@/datatypes/scale_calculator/scale_calculator_project_registry";
import {SCProjectContext} from "@/components/providers/sc_project_provider";

export const SCProjectRegistryContext = createContext(new ScaleCaltulatorProjectRegistry());

export const SCProjectRegistryProvider = ({ children }) => {
    // const [user, setUser] = useState(() => {
    //     // Try to load user data from local storage
    //     const storedUser = localStorage.getItem('user');
    //     return storedUser ? JSON.parse(storedUser) : new User();
    // });
    const [scProjectRegistry, setProjectRegistry] = useState(new ScaleCaltulatorProjectRegistry());

    const setSCProjectRegistry = (projectData) => {
        const project = ScaleCaltulatorProjectRegistry.from(projectData)
        setProjectRegistry(ScaleCaltulatorProjectRegistry.from(project));
        // Save user data to local storage
        localStorage.setItem('scaleCalculatorProjectRegistry', JSON.stringify(project.getSerializableObject()));
    };

    useEffect(() => {
        // Load user data from local storage on component mount
        const storedProjectJson = localStorage.getItem('scaleCalculatorProjectRegistry');
        console.log("storedProjectRegistryJson", storedProjectJson);
        if (storedProjectJson) {
            const storedProjectObject = JSON.parse(storedProjectJson);
            console.log("storedProjectRegistryObject", storedProjectObject);
            const updateProjectClass = ScaleCaltulatorProjectRegistry.deserializeFromObject(storedProjectObject)
            console.log("updateProjectRegistryClass", updateProjectClass);
            setProjectRegistry(updateProjectClass);
        }
    }, []); // Empty dependency array ensures this effect only runs once on component mount

    return (
        <SCProjectRegistryContext.Provider value={{ scProjectRegistry, setSCProjectRegistry }}>
            {children}
        </SCProjectRegistryContext.Provider>
    );
};