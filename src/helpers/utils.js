import config from '../config';

class Deferred {
    constructor() {
        this.resolve = null;
        this.reject = null;

        this.promise = new Promise((...args) => [this.resolve, this.reject] = args);
    }
}

const utils = {
    scaleToCover({
                     target,
                     width = 0,
                     height = 0,
                     safeWidth = 0,
                     safeHeight = 0,
                     originWidth = 0,
                     originHeight = 0
    }) {
        const bounds = target.getLocalBounds();

        const safeScale = Math.min(width / safeWidth, height / safeHeight);
        const baseScaleX = width / Math.min(width, originWidth ?? bounds.width);
        const baseScaleY = height / Math.min(height, originHeight ?? bounds.height);
        const baseScale = Math.max(baseScaleX, baseScaleY);

        target.scale.set(Math.min(safeScale, baseScale));
    },
    scaleToFit(target, width = 0, height = 0) {
        const bounds = target.getLocalBounds();
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        const scale = Math.min(scaleX, scaleY);
        target.scale.set(scale);
    },
    centralize(target, width = 0, height = 0) {
        const bounds = target.getLocalBounds();
        target.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        target.position.set(width / 2, height / 2);
    },
    positionTopRight(target, width = 0, height = 0) {
        const xOffset = 1; // fix 1px between side and target
        target.x = Math.max((target.parent.width - width) / 2 / target.parent.scale.x - xOffset, 0);
        target.y = Math.max((target.parent.height - height) / 2 / target.parent.scale.y, 0);
    },
    wait(time = 0) {
        return new Promise(res => gsap.delayedCall(time, res));
    },
    deferred() {
        return new Deferred();
    },
};

export default utils;