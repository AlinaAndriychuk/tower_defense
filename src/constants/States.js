import MenuState from '../states/MenuState';
import LevelSelectState from '../states/LevelSelectState';
import LevelState from '../states/LevelState';

const States = {
    MENU: 'menu',
    LEVEL_SELECT: 'level_select',
    LEVEL: 'level',
    LEVEL_RESTART: 'level_restart',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
};

export const StateViews = {
    [States.MENU]: MenuState,
    [States.LEVEL_SELECT]: LevelSelectState,
    [States.LEVEL]: LevelState
}

export default States;