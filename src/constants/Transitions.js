import {States} from './States';

export const Transitions = {
    [States.MENU]: [
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.LEVELS]: [
        States.START_GAME,
        States.GAME_OVER
    ],
    [States.START_GAME]: [
        States.WAVE,
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.WAVE]: [
        States.WAVE,
        States.LEVELS,
        States.COMPLETE_GAME,
        States.GAME_OVER
    ],
    [States.COMPLETE_GAME]: [
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.GAME_OVER]: [
        States.MENU
    ],
};
