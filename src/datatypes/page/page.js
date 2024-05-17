export class Page {
    constructor(name, displayName,  path, icon) {
        this.id = null;
        this.name = name;
        this.path = path;
        this.icon = icon;
        this.displayName = displayName;
    }

    equals(other) {
        return this.path === other.path
    }
}