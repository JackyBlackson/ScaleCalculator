import {Role} from "@/datatypes/role/role";

export class User {
    constructor() {
        this.id = -1;
        this.username = "";
        this.email = "";
        this.password = "";
        this.phoneNumber = "";
        this.postsCount = -1;
        this.token = "";
        this.displayName = ""
        this.role = Role.ofDefault();
    }

    isLoggedIn() {
        return this.id !== -1;
    }

    logout() {
        this.id = -1;
        this.username = "";
        this.email = "";
        this.password = "";
        this.phoneNumber = "";
        this.postsCount = -1;
        this.token = ""
        this.role = "";
    }

    /**
     *
     * @param u : User
     */
    login(u) {
        console.log("user.login, ", u);
        this.id = u.id;
        this.username = u.username;
        this.email = u.email;
        this.password = u.password;
        this.phoneNumber = u.phoneNumber;
        this.postsCount = u.postsCount;
        this.role = u.role;
    }

    /**
     *
     * @param token : String
     */
    setToken(token) {
        this.token = token;
    }

    getRoleTypeString() {
        if (this.role === 0) {
            return "NO_ROLE"
        } else if (this.role === 1) {
            return "READER"
        } else if (this.role === 2) {
            return "AUTHOR"
        } else if (this.role === 3) {
            return "ADMIN"
        } else {
            return "NO_ROLE"
        }
    }

    getRoleLocalized() {
        if (this.role === 0) {
            return "未登录/默认权限"
        } else if (this.role === 1) {
            return "订阅者"
        } else if (this.role === 2) {
            return "投稿人"
        } else if (this.role === 3) {
            return "管理员"
        } else {
            return "未知角色/默认权限"
        }
    }
}