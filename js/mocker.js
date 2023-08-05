export class Mocker {
    constructor() {
        this.mocks = [
            {
                url: 'http://ddragon.leagueoflegends.com/cdn/data/en_US/champion.json',
                body: {},
                json: '/league-front/js/mocks/dragon.json'
            },
            {
                url: 'http://192.168.0.106:3000/game-state',
                body: {},
                json: '/league-front/js/mocks/state.json'
            },
            {
                url: 'http://192.168.0.106:3000/participants',
                body: {},
                json: '/league-front/js/mocks/participants.json'
            },
            {
                url: 'https://laptop.local/summoners/championSelect',
                body: {},
                json: '/league-front/js/mocks/championSelect.json'
            },
            {
                url: 'https://laptop.local/summoner/300',
                body: {},
                json: '/league-front/js/mocks/summonerGames.json'
            },
            {
                url: 'https://laptop.local/game/by-puuid/MatchID',
                body: {},
                json: '/league-front/js/mocks/match.json'
            },
            {
                url: 'https://laptop.local/game/save',
                body: {},
                json: '/league-front/js/mocks/save.json'
            },
            {
                url: 'https://laptop.local/game/last',
                body: {},
                json: '/league-front/js/mocks/last.json'
            },
            {
                url: 'https://laptop.local/game/save-result',
                body: {},
                json: '/league-front/js/mocks/last.json'
            },
            {
                url: 'https://laptop.local/game/active/SirDomin',
                body: {},
                json: '/league-front/js/mocks/active.json'
            },
            {
                url: 'http://192.168.0.104:3000/game-state',
                body: {},
                json: '/league-front/js/mocks/game-state.json'
            },
            {
                url: 'http://192.168.0.104:3000/status',
                body: {},
                json: '/league-front/js/mocks/status.json'
            },
            {
                url: 'https://laptop.local/status',
                body: {},
                json: '/league-front/js/mocks/status.json'
            },
            {
                url: 'https://laptop.local/game/active-data/SirDomin',
                body: {},
                json: '/league-front/js/mocks/opgg.json'
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