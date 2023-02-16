class ApiManager {
    apiUrl = 'https://laptop.local';
    clientUrl = 'http://192.168.0.106:3000';

    mocker;
    constructor(mocker = null) {
        this.mocker = mocker;
    }

    async createRequest(url, data = {}) {
        if (this.mocker) {

            return this.mocker.getMock(url);
        }

        return fetch(url, data);
    }
    async clientCall(url) {
        return this.createRequest(`${this.clientUrl}/${url}`)
    }

    async apiCall(url, data = {}) {
        return this.createRequest(`${apiUrl}/${url}`, data)

    }

    async riotCall() {
        return this.createRequest('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json');
    }

    async acceptMatch() {
        return this.clientCall('accept')
            .then(res => res.json())
    }

    async getGameState() {
        return this.clientCall('game-state')
            .then(res => res.json())
    }

    async getChampionSelectPlayers() {
       return this.clientCall('participants')
            .then(res => res.json())
    }

    async saveGame() {
        return this.apiCall('game/save')
            .then(res => res.json())
    }

    async getChampionSelectData(participants) {
        return this.apiCall('summoners/championSelect',{
                method: 'POST',
                body: JSON.stringify(participants)
            })
            .then(res => res.json())
    }

    getLastGameData() {
        return this.apiCall('game/last')
            .then(res => res.json())
    }

    saveGameData(data) {
        this.apiCall('game/save-result',{
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
    }

    async getChampions() {
        return this.riotCall()
    }

    async getSummoner(summonerId) {
        return this.apiCall(`summoner/${summonerId}`)
            .then(res => res.json())
    }

    async getActiveGame(summonerName) {
        return this.apiCall(`game/active/${summonerName}`)
            .then(res => res.json())
    }

    async getGameByPuuId(puuId) {
        return this.apiCall(`game/by-puuid/${puuId}`)
            .then(res => res.json())
    }
}