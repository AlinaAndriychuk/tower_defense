import {Application} from 'pixi.js';
import {i18n} from './i18n';
import StateMachine from './StateMachine';
import config from '../config';


export default class App {
    constructor() {
        this._app = null;
    }

    async start(states = {}) {
        await this._createApplication();
        this._createStateMachine(states);
        i18n.setLang(config.lang);

        this._addListeners();
    }

    async _createApplication() {
        this._app = new Application();
        await this._app.init(config.app);
        document.getElementById('game-container').appendChild(this._app.canvas);
    }

    _createStateMachine(states = {}) {
        const stateMachine = new StateMachine();
        Object.keys(states).forEach((name) => {
            stateMachine.addState(name, states[name]);
        })
        stateMachine.changeState(config.entryState);
    }

    _addListeners() {
        window.addEventListener('resize', () => this._onResize());
    }

    _onResize() {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    get width() {
        return this._app.renderer.width;
    }

    get height() {
        return this._app.renderer.height;
    }

    get stage() {
        return this._app.stage;
    }
}