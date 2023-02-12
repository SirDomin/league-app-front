class Participant {
    constructor(summonerName, gamesPlayed, championName, opggUrl, teamId, summonerId) {
        this.summonerName = summonerName;
        this.gamesPlayed = gamesPlayed;
        this.championName = championName;
        this.opggUrl = opggUrl;
        this.teamId = teamId;
        this.summonerId = summonerId;

        return this.getCard();
    }

    getCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('clickable');
        card.classList.add(`team-${this.teamId}`);
        card.style.border = '1px solid black';
        card.style.padding = '10px';
        card.style.margin = '10px';
        const gamesContainer = document.createElement('div');
        gamesContainer.classList.add('game-container');

        const label1 = document.createElement('label');
        const a = document.createElement('a');
        a.setAttribute('href', `${this.opggUrl}`);
        a.innerHTML = this.summonerName;

        label1.appendChild(a);
        card.appendChild(label1);

        const label2 = document.createElement('label');
        label2.textContent = ``;

        card.appendChild(label2);

        const label3 = document.createElement('label');
        label3.textContent = `Games: ${this.gamesPlayed}`;
        card.appendChild(label3);

        const label4 = document.createElement('label');
        label4.textContent = `SHOW GAMES`;
        label4.classList.add('show-games');
        card.appendChild(label4);

        label4.addEventListener('click', () => {
            gamesContainer.classList.toggle('show')
            gamesContainer.innerHTML = '';
            if (gamesContainer.classList.contains('show')) {
                getGamesAsHTML(this.summonerId, gamesContainer, label4);
            } else {
                label4.classList.remove('active');

            }

        })
        card.appendChild(gamesContainer);

        return card;
    }

}