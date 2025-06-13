import Menu from '../states/Menu';
import Levels from '../states/Levels';
import MainGame from '../states/MainGame';

const States = {
    MENU: 'menu',
    LEVELS: 'levels',
    MAIN_GAME: 'main_game',
    RESTART_GAME: 'restart_game',
    COMPLETE_GAME: 'complete_game',
    GAME_OVER: 'game_over',
};

export const StateViews = {
    [States.MENU]: Menu,
    [States.LEVELS]: Levels,
    [States.MAIN_GAME]: MainGame
}

export default States;