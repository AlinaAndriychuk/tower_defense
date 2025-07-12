import States from './States';

const Transitions = {
    [States.MENU]: [
        States.LEVEL_SELECT,
        States.GAME_OVER
    ],
    [States.LEVEL_SELECT]: [
        States.LEVEL,
        States.GAME_OVER
    ],
    [States.LEVEL]: [
        States.LEVEL_RESTART,
        States.LEVEL_SELECT,
        States.GAME_OVER
    ],
    [States.LEVEL_RESTART]: [
        [States.LEVEL]
    ],
    [States.LEVEL_COMPLETE]: [
        States.LEVEL_SELECT,
        States.GAME_OVER
    ],
    [States.GAME_OVER]: [
        States.MENU
    ],
};

export default Transitions;
