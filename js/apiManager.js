import {Mocker} from "./mocker.js";

export class ApiManager {
    apiUrl = 'https://laptop.local';
    clientUrl = 'http://192.168.0.104:3000';

    mocker;
    constructor(mockValues = false) {
        this.mocker = new Mocker();
        this.mockValues = mockValues;
        this.header = null;
    }

    async createRequest(url, data = {}) {
        if (this.mockValues === true) {
            return this.mocker.getMock(url);
        }

        return fetch(url, data)
            .then(res => res.json());
    }

    async clientCall(url) {
        try {
            return await this.createRequest(`${this.clientUrl}/${url}`);
        } catch (exception) {
            console.log('Node.js with client is not running!');
        }

        return null;
    }

    async apiCall(url, data = {}) {
        try {
            data.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.header}`,
            }
            return await this.createRequest(`${this.apiUrl}/${url}`, data);
        } catch (exception) {

        }

        return null;
    }

    async riotCall(clientVersion) {
        if (this.mockValues === true) {
            return this.mocker.getMock(`http://ddragon.leagueoflegends.com/cdn/data/en_US/champion.json`);
        }

        return this.createRequest(`http://ddragon.leagueoflegends.com/cdn/${clientVersion}.1/data/en_US/champion.json`);
    }

    async getChampionSelectPlayers() {
       return this.clientCall('participants')
    }

    async saveGame() {
        return this.apiCall('game/save')
    }

    async getChampionSelectData(participants) {
        return this.apiCall('summoners/championSelect',{
                method: 'POST',
                body: JSON.stringify(participants)
            })
    }

    getLastGameData() {
        return this.apiCall('game/last')
    }

    async saveGameData(data) {
        return this.apiCall('game/save-result',{
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async getHistory(puuid, limit, start, lastTimestamp) {
        return this.apiCall(`game/history/${limit}/${start}/${lastTimestamp}`);
    }

    async saveGameByMatchId(matchId) {
        return this.apiCall(`game/save/${matchId}`);
    }

    async getGamesWithSummoner(summonerName) {
        return this.apiCall(`/summoner/${summonerName}`);
    }

    async getChampions(clientVersion) {
        return this.riotCall(clientVersion)
    }

    async getSummoner(summonerId) {
        return this.apiCall(`summoner/${summonerId}`);
    }

    async getActiveGame(puuid) {
        return this.apiCall(`game/active/${puuid}`);
    }

    async getAdditionalData(puuid) {
        return this.apiCall(`game/active-data/${puuid}`)
    }

    async login(data) {
        return this.apiCall(`login`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getGameByPuuId(puuId) {
        return this.apiCall(`game/by-puuid/${puuId}`);
    }

    async getNodeServerStatus() {
        return this.clientCall(`status`);
    }

    async getServerStatus() {
        return this.apiCall(`status`);
    }
}