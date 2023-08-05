export class LocalStorage {
    constructor() {
        this.prefix = 'lol-app-';
    }

    save(key, data) {
        window.localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(data));
    }

    get(key) {
        return JSON.parse(window.localStorage.getItem(`${this.prefix}${key}`));
    }

    clear() {
    }
}
