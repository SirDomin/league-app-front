class Game {
    constructor(info, metadata) {
        this.info = info;
        this.metadata = metadata;
    }

    getGameCard() {
        const participant = this.info.participants[0];

        const fieldsToDisplay = [
            'championName',
            'individualPosition',
            'summonerName',
            'pentaKills',
            'visionScore',
            'wardsPlaced',
            'comment'
        ];

        const div = document.createElement('div');
        div.classList.add('game');

        let dateItem = document.createElement('div');
        const date = new Date(parseInt(this.info.gameCreation));
        dateItem.textContent = `Date: ${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;

        let modeItem = document.createElement('div');
        modeItem.textContent = `Mode: ${this.info.gameMode}`;

        div.appendChild(dateItem);
        div.appendChild(modeItem);

        fieldsToDisplay.forEach(field => {
            let gridItem = document.createElement('div');
            gridItem.textContent = `${field}: ` + participant[`${field}`];

            div.appendChild(gridItem);
        })

        let gridItem = document.createElement('div');
        gridItem.textContent = `K/D/A: ${participant.kills} / ${participant.deaths} / ${participant.assists}`;

        div.appendChild(gridItem);

        const labelRedirect = document.createElement('div');
        labelRedirect.classList.add('small-button-container-grid');
        const gameId = document.createElement('button');
        gameId.classList.add('button-default');
        gameId.classList.add('small');
        gameId.textContent = `Display ( ${this.metadata.matchId} )`;
        gameId.addEventListener('click', () => {
            contentManager.showGame(this.metadata.matchId);
        });
        labelRedirect.appendChild(gameId);
        div.appendChild(labelRedirect);

        return div;
    }
}