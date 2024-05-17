import {User} from "@/datatypes/user/user";
import {Page} from "@/datatypes/page/page";
import {generateUUID} from "@/utilities/uuid_utilities";

export class PageRegistry {
    /**
     * Construct with no initial user
     */
    constructor() {
        this.pages = [];
        this.loginPage = new Page("login", "登录页面", "/login", "door-open");
        this.registerPage = new Page("register", "注册页面", "/register", "person-plus")
        this.frontPage = new Page("front", "首页", "/", "door-open")
        this.add(initUser);
    }

    /**
     *
     * @param page : Page
     */
    add(page) {
        page.id = generateUUID();
        this.pages.push(page);
        return page;
    }
}