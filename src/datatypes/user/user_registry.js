import {User} from "@/datatypes/user/user";
import {generateUUID} from "@/utilities/uuid_utilities";

export class UserRegistry {
    /**
     * Construct with no initial user
     */
    constructor() {
        this.users = [];
        let initUser = new User();
        initUser.username = "admin";
        initUser.password = "cdf9988423";
        initUser.email = "admin@admin.com";
        initUser.phoneNumber = "11451419198";
        initUser.displayName = "原初管理员"
        this.add(initUser);
    }

    /**
     * 检查用户名是否重复
     * @param username : String
     * @return {boolean}
     */
    checkUsername(username) {
        return !this.users.some(user => user.username === username);
    }

    /**
     *
     * @param user : User
     * @return User
     */
    add(user) {
        user.id = generateUUID();
        this.users.push(user);
        return user;
    }

    /**
     *
     * @param updateUser : User
     * @return {null, User}
     */
    update(updateUser) {
        const userIndex = this.users.findIndex(user => user.id === updateUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = updateUser;
            return this.users[userIndex];
        } else {
            return null; // 用户不存在，返回 null
        }
    }


    /**
     *
     * @param username : String
     * @param password : String
     * @return {User, null}
     */
    verify(username, password) {
        console.log("originalUsername", username);
        console.log("originalPassword", password);
        let resultUser = null;
        this.users.forEach(user => {
            // console.log("user.username", user.username);
            // console.log("user.password", user.password);
            // console.log("user.username === username", user.username === username)
            // console.log("user.password === password", user.password === password)
            // console.log("user.username === username && user.password === password", user.username === username && user.password === password)
            if (user.username === username && user.password === password) {
                resultUser = user;
                return user;
            }
        })
        return resultUser;
    }

    remove(user) {

    }
}