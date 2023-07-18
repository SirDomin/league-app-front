export class SocketMessage {
    static GET_STATE_TYPE = 'get_state';
    static GET_SUMMONER_TYPE = 'get_summoner';
    static GET_CHAMPION_SELECT_LOBBY = 'get_champion_select_lobby';
    static GET_CHAMPION_SELECT_LOBBY_DATA = 'get_champion_select_lobby_data';
    static ACCEPT_TYPE = 'accept';
    static TEST = 'test';

    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    static fromJSON(json) {
        return new SocketMessage(json.type, json.data);
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }

    toJSON() {
        return {
            type: this.type,
            data: this.data
        };
    }
}
