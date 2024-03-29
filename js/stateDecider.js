export class StateDecider {
    static LOBBY = 'Lobby';
    static NONE = 'None';
    static MATCHMAKING = 'Matchmaking';
    static READY_CHECK = 'ReadyCheck';
    static CHAMPION_SELECT = 'ChampSelect';
    static IN_PROGRESS = 'InProgress';
    static WAITING_FOR_STATS = 'WaitingForStats';
    static PRE_END_OF_GAME = 'PreEndOfGame';
    static END_OF_GAME = 'EndOfGame';
    static ANY = 'Any';
    static FORCED = 'Forced';

    constructor() {
        this.gameState = null;
        this.handlers = [];
        this.refreshRate = 1000;
        this.forced = false;
        this.updateGameState();
    }

    updateGameState(state) {
        if (this.gameState !== state) {
            this.gameState = state;
            this.stateChanged(state);
        }
        if (state === StateDecider.READY_CHECK) {
            this.gameState = state;
            this.stateChanged(state);
        }
    }

    onStateChange(previousState, newState, callback) {
        if (typeof previousState === 'object' && typeof newState === 'object') {

            previousState.forEach(state => {
                newState.forEach(nState => {
                    this.handlers.push({
                        previousState: state,
                        newState: nState,
                        callback: callback,
                    });
                })
            });

            return;
        }

        if (typeof previousState === 'object' && previousState !== null) {
            previousState.forEach(state => {
                this.handlers.push({
                    previousState: state,
                    newState: newState,
                    callback: callback,
                });
            });

            return;
        }

        if (typeof newState === 'object' && newState !== null) {
            newState.forEach(state => {
                this.handlers.push({
                    previousState: previousState,
                    newState: state,
                    callback: callback,
                });
            });

            return;
        }

        this.handlers.push({
            previousState: previousState,
            newState: newState,
            callback: callback,
        });
    }

    forceState() {
        if (this.forced) {
            this.stateChanged(this.gameState);
        }
        this.forced = !this.forced;
    }

    stateChanged(newGameState) {
        console.log('State change: ',this.gameState, '=>', newGameState);

        this.handlers.filter((handler) => {
            return (handler.previousState === this.gameState || handler.previousState === StateDecider.ANY) && (handler.newState === newGameState || handler.newState === StateDecider.ANY)
        }).forEach(handler => {
            handler.callback();

            console.log(`Handler for | ${handler.previousState} => ${handler.newState} | dispatched`);
        });
    }
}