class Mocker {
    constructor() {
        this.mocks = [
            {
                url: 'http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json',
                body: {},
                json: '/league-app-front/js/mocks/dragon.json'
            },
            {
                url: 'http://192.168.0.106:3000/game-state',
                body: {},
                json: '/league-app-front/js/mocks/state.json'
            },
            {
                url: 'http://192.168.0.106:3000/participants',
                body: {},
                json: '/league-app-front/js/mocks/participants.json'
            },
            {
                url: 'https://laptop.local/summoners/championSelect',
                body: {},
                json: '/league-app-front/js/mocks/championSelect.json'
            },
            {
                url: 'https://laptop.local/summoner/300',
                body: {},
                json: '/league-app-front/js/mocks/summonerGames.json'
            },
            {
                url: 'https://laptop.local/game/by-puuid/MatchID',
                body: {},
                json: '/league-app-front/js/mocks/match.json'
            }
        ];
    }

    async getMock(url) {
        const data = this.mocks.filter(mock => {
            return mock.url === url
        });

        if (data.length < 1) {
            throw `data with url ${url} not found.`;
        }

        console.log(`using mock for ${url}`);

        return fetch(data[0].json).then(data => data.json())
    }
}