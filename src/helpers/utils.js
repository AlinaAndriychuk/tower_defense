const utils = {
    scaleToCover(target, maxWidth, maxHeight, safeWidth = 0, safeHeight = 0) {
        const bounds = target.getLocalBounds();

        const safeScale = Math.min(maxWidth / safeWidth, maxHeight / safeHeight);
        const baseScaleX = maxWidth / Math.min(maxWidth, bounds.width);
        const baseScaleY = maxHeight / Math.min(maxHeight, bounds.height);
        const baseScale = Math.max(baseScaleX, baseScaleY);

        target.scale.set(Math.min(safeScale, baseScale));
    },
    scaleToFit(target, width, height) {
        const bounds = target.getLocalBounds();
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        const scale = Math.min(scaleX, scaleY);
        target.scale.set(scale);
    },
    centralize(target, width, height) {
        const bounds = target.getLocalBounds();
        target.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        target.position.set(width / 2, height / 2);
    }
};

export default utils;