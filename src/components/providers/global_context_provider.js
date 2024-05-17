"use client"

import {SCProjectProvider} from "@/components/providers/sc_project_provider";
import {SCProjectRegistryProvider} from "@/components/providers/sc_project_registry_provider";

export const GlobalContextProvider = ({children} ) => {

    return (
        <SCProjectRegistryProvider>
            <SCProjectProvider>
                {children}
            </SCProjectProvider>
        </SCProjectRegistryProvider>
    );
};