import './styles.scss';
import {States} from './constants/States';
import App from './core/App';
import Menu from './states/Menu';

const app = window.app = new App();

const states = {
    [States.MENU]: Menu
}

app.start(states);
