import States from './States';

const Transitions = {
    [States.MENU]: [
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.LEVELS]: [
        States.MAIN_GAME,
        States.GAME_OVER
    ],
    [States.MAIN_GAME]: [
        States.RESTART_GAME,
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.RESTART_GAME]: [
        [States.MAIN_GAME]
    ],
    [States.COMPLETE_GAME]: [
        States.LEVELS,
        States.GAME_OVER
    ],
    [States.GAME_OVER]: [
        States.MENU
    ],
};

export default Transitions;
