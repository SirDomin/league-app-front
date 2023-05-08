class ApiManager {
    apiUrl = 'https://laptop.local';
    clientUrl = 'http://192.168.0.104:3000';

    mocker;
    constructor(mocker, mockValues = false) {
        this.mocker = mocker;
        this.mockValues = mockValues;
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
            return this.createRequest(`${this.apiUrl}/${url}`, data)
        } catch (exception) {
            alert('token expired');
            console.log('refresh token');
        }

        return null;
    }

    async riotCall() {
        return this.createRequest('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json');
    }

    async acceptMatch() {
        return this.clientCall('accept')
    }

    async getGameState() {
        return this.clientCall('game-state')
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    async getGamesWithSummoner(summonerName) {
        return this.apiCall(`/summoner/${summonerName}`);
    }

    async getChampions() {
        return this.riotCall()
    }

    async getSummoner(summonerId) {
        return this.apiCall(`summoner/${summonerId}`);
    }

    async getActiveGame(summonerName) {
        return this.apiCall(`game/active/${summonerName}`);
    }

    async getAdditionalData() {
        return this.apiCall(`game/active-data/SirDomin`)
    }

    async getGameByPuuId(puuId) {
        return this.apiCall(`game/by-puuid/${puuId}`);
    }
}