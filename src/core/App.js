import {Application, Assets} from 'pixi.js';
import i18n from '../helpers/i18n';
import config from '../config';
import manifest from '../manifest';
import eventBus from './EventBus';
import Events from '../constants/Events';
import StateMachine from './StateMachine';
import State from './State';


export default class App {
    constructor() {
        this._app = null;
        this._currentState = null;
    }

    async start(states = {}) {
        i18n.setLang(config.lang);
        await this._createApplication();
        await this._loadAssets();
        this._createStateMachine(states);

        this._addListeners();
    }

    async _createApplication() {
        this._app = new Application();
        await this._app.init(config.app);
        document.getElementById('game-container').appendChild(this._app.canvas);
    }

    async _loadAssets() {
        await Assets.init({ manifest });
        const bundleNames = manifest.bundles.map(b => b.name);

        for (const name of bundleNames) {
            await Assets.loadBundle(name);
        }
    }

    _createStateMachine(states = {}) {
        const stateMachine = new StateMachine();
        Object.keys(states).forEach((name) => {
            stateMachine.addState(name, states[name]);
        });
        eventBus.emit(Events.CHANGE_STATE, {name: config.entryState});
    }

    _addListeners() {
        window.addEventListener('resize', () => this._resize());
    }

    _resize() {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
        eventBus.emit(Events.RESIZE, this.width, this.height);
    }

    _clear() {
        this._currentState = null;
    }

    get currentState() { // todo remove if is not used
        return this._currentState;
    }

    set currentState(state) {
        if (!(state instanceof State)) {
            console.error(`Can not set  ${state} as currentState. ${state} is not instanceof ${State}`);
            return;
        }

        this._currentState = state;
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