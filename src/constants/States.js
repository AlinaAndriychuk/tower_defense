import Menu from '../states/Menu';
import Levels from '../states/Levels';
import StartGame from '../states/StartGame';

const States = {
    MENU: 'menu',
    LEVELS: 'levels',
    START_GAME: 'start_game',
    WAVE: 'wave',
    COMPLETE_GAME: 'complete_game',
    GAME_OVER: 'game_over',
};

export const StateViews = {
    [States.MENU]: Menu,
    [States.LEVELS]: Levels,
    [States.START_GAME]: StartGame
}

export default States;