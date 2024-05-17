import {ScaleCalculatorProject} from "@/datatypes/scale_calculator/scale_calculator_project";

export default class ScaleCaltulatorProjectRegistry {
    constructor(projectList) {
        this.projectList = projectList ? projectList : [];
    }

    static from(object) {
        return new ScaleCaltulatorProjectRegistry(object.projectList.map(project => ScaleCalculatorProject.from(project)));
    }

    getSerializableObject() {
        return new ScaleCaltulatorProjectRegistry(this.projectList.map(project => project.getSerializableObject()));
    }

    static deserializeFromObject(object) {
        return new ScaleCaltulatorProjectRegistry(object.projectList.map(project => ScaleCalculatorProject.deserializeFromObject(project)));
    }

    /**
     *
     * @param project : ScaleCalculatorProject
     */
    add(project) {
        this.projectList.push(project);
    }

    /**
     *
     * @param project : ScaleCalculatorProject
     * @return {boolean}
     */
    update(project) {
        for(let i = 0; i < this.projectList.length; i++) {
            if(this.projectList[i].uuid === project.uuid) {
                this.projectList[i] = project;
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param uuid
     * @return {null, ScaleCalculatorProject}
     */
    get(uuid) {
        for(let i = 0; i < this.projectList.length; i++) {
            if(this.projectList[i].uuid === uuid) {
                return this.projectList[i];
            }
        }
        return null;
    }
}