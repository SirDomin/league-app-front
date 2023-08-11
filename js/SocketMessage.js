export class SocketMessage {
    static GET_STATE_TYPE = 'get_state';
    static GET_SUMMONER_TYPE = 'get_summoner';
    static GET_CHAMPION_SELECT_LOBBY = 'get_champion_select_lobby';
    static GET_CHAMPION_SELECT_LOBBY_DATA = 'get_champion_select_lobby_data';
    static ACCEPT_TYPE = 'accept';
    static TEST = 'test';
    static BAN_CHAMPION = 'ban_champion';
    static PICK_CHAMPION = 'pick_champion';
    static GET_AVAILABLE_CHESTS = 'get_available_chests';
    static GET_AVAILABLE_CHESTS_DATA = 'get_available_chests_data';
    static SAVE_CONFIG = 'save_config';
    static GET_AVAILABLE_QUEUES = 'get_available_queues';
    static GET_CLIENT_VERSION = 'get_client_version';
    static GET_CLIENT_DATA = 'get_client_data';

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
