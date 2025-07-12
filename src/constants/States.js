import Menu from '../states/Menu';
import LevelSelect from '../states/LevelSelect';
import Level from '../states/Level';

const States = {
    MENU: 'menu',
    LEVEL_SELECT: 'level_select',
    LEVEL: 'level',
    LEVEL_RESTART: 'level_restart',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
};

export const StateViews = {
    [States.MENU]: Menu,
    [States.LEVEL_SELECT]: LevelSelect,
    [States.LEVEL]: Level
}

export default States;