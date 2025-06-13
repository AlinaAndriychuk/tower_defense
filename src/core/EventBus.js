import { EventEmitter } from 'pixi.js';

class EventBus extends EventEmitter {
    constructor() {
        super();
        this._listeners = new Map(); // eventName => Set of { original, bound, context }
    }

    on(eventName, callback, context = null) {
        const bound = context ? callback.bind(context) : callback;

        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, new Set());
        }

        this._listeners.get(eventName).add({ original: callback, bound, context });

        return super.on(eventName, bound);
    }

    off(eventName, callback, context = null) {
        const listeners = this._listeners.get(eventName);
        if (!listeners) return;

        for (const listener of listeners) {
            if (listener.original === callback && listener.context === context) {
                super.off(eventName, listener.bound);
                listeners.delete(listener);
                break;
            }
        }

        if (listeners.size === 0) {
            this._listeners.delete(eventName);
        }
    }

    removeAll(eventName) {
        const listeners = this._listeners.get(eventName);
        if (!listeners) return;

        for (const { bound } of listeners) {
            super.off(eventName, bound);
        }

        this._listeners.delete(eventName);
    }

    removeAllByContext(context) {
        for (const [eventName, listeners] of this._listeners.entries()) {
            for (const listener of [...listeners]) {
                if (listener.context === context) {
                    super.off(eventName, listener.bound);
                    listeners.delete(listener);
                }
            }
            if (listeners.size === 0) {
                this._listeners.delete(eventName);
            }
        }
    }
}

const eventBus = new EventBus();
export default eventBus;