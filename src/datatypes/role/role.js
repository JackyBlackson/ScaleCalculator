import {Page} from "@/datatypes/page/page";
import {pages} from "next/dist/build/templates/app-page";

export class Role {
    /**
     *
     * @param name : String
     * @param displayName : String
     * @param pages : List<Page>
     */
    constructor(name, displayName, pages) {
        this.name = name;
        this.displayName = displayName;
        this.accessiblePages = pages || [];
    }

    static ofAdmin() {
        return new Role("admin", "超级管理员", ["*"]);
    }

    static ofAnonymous() {
        return new Role("anonymous", "未登录用户", ["/login", "/register"]);
    }

    static ofDefault() {
        return new Role("default", "默认新用户", ["/login", "/register", "/me"])
    }

    /**
     * 检查给定的URL是否可以访问
     * @param url {String} - 要检查的URL
     * @returns {boolean} - 如果可访问返回true，否则返回false
     */
    checkAccessibility(url) {
        if(this.name === "anonymous")
        // 遍历每个页面
        for (let i = 0; i < this.accessiblePages.length; i++) {
            const page = this.accessiblePages[i];
            // 检查页面路径是否与给定的URL匹配
            if (page.path === url) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param other : Role
     * @return {boolean}
     */
    equals(other) {
        return this.name === other.name;
    }
}