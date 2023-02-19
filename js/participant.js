class Participant {
    constructor(summonerName, gamesPlayed, championName, opggUrl, teamId, summonerId, id, comment) {
        this.summonerName = summonerName;
        this.gamesPlayed = gamesPlayed;
        this.championName = championName;
        this.opggUrl = opggUrl;
        this.teamId = teamId;
        this.summonerId = summonerId;
        this.id = id;
        this.comment = comment;
    }

    getCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('clickable');
        card.classList.add(`team-${this.teamId ? this.teamId : 'unknown'}`);
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
        label2.textContent = `${this.championName}`;

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
                contentManager.getGamesAsHTML(this.summonerId, gamesContainer, label4);
            } else {
                label4.classList.remove('active');

            }

        })
        card.appendChild(gamesContainer);

        return card;
    }

    getCommentCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(`team-${this.teamId}`);
        card.style.border = '1px solid black';
        card.style.padding = '10px';
        card.style.margin = '10px';

        const label1 = document.createElement('label');
        label1.textContent = `${this.championName}`;
        card.appendChild(label1);

        const label2 = document.createElement('label');

        const a = document.createElement('a');
        a.setAttribute('href', this.opggUrl);
        a.innerHTML = this.summonerName;
        label2.appendChild(a);
        card.appendChild(label2);

        const label3 = document.createElement('label');
        label3.textContent = `Comment:`;
        card.appendChild(label3);

        const input = document.createElement('textarea');
        input.name = 'comment';
        input.value = `${this.comment}`;
        input.setAttribute('data-id', this.id);
        card.appendChild(input);

        return card;
    }

    getDetailedCard(participant) {
        const cardContainer = document.createElement('div');

        cardContainer.classList.add('detailed-card');
        cardContainer.classList.add(`team-${participant.team_id}`);

        const label1 = document.createElement('label');
        label1.textContent = `${participant.champion_name} ( ${participant.kills}/${participant.deaths}/${participant.assists} ) - `;
        const a = document.createElement('a');
        a.setAttribute('href', `https://www.op.gg/summoners/eune/${participant.summoner_name}`);
        a.innerHTML = participant.summoner_name;
        label1.appendChild(a);
        cardContainer.appendChild(label1);

        const label2 = document.createElement('label');
        label2.textContent = `Comment: ${participant.comment}`;
        cardContainer.appendChild(label2);
        const label3 = document.createElement('label');
        label3.textContent = `Position: ${participant.team_position} | Solo kills: ${participant.challenge.solo_kills} | Invade: ${participant.challenge.takedowns_before_jungle_minion_spawn > 0 ? 'Yes' : 'No'} `
        cardContainer.appendChild(label3);


        const label4 = document.createElement('label');
        label4.textContent = `FB assist: ${participant.first_blood_assist ? 'Yes' : 'No'}, Counter Jungle: ${Math.floor(participant.challenge.enemy_jungle_monster_kills)}, Early ganks: ${participant.challenge.kills_on_other_lanes_early_jungle_as_laner}`;
        cardContainer.appendChild(label4);

        const label5 = document.createElement('label');
        label5.textContent = `KP: ${Math.floor(participant.challenge.kill_participation * 100)}%, DPM: ${Math.floor(participant.challenge.damage_per_minute)} (${Math.floor(participant.challenge.team_damage_percentage * 100)}%), Stealth Kills: ${participant.challenge.kill_after_hidden_with_ally}, Tower Dives: ${participant.challenge.kills_near_enemy_turret}`;
        cardContainer.appendChild(label5);


        return cardContainer;
    }
}