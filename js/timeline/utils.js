// ==========================================================
// StageCue Timeline Utilities
// ==========================================================

export default class Utils {

    /**
     * Clamp a value between min and max.
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Linear interpolation.
     */
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Convert seconds to pixels.
     */
    static secondsToPixels(seconds, pixelsPerSecond, scroll = 0) {
        return seconds * pixelsPerSecond - scroll;
    }

    /**
     * Convert pixels to seconds.
     */
    static pixelsToSeconds(px, pixelsPerSecond, scroll = 0) {
        return (px + scroll) / pixelsPerSecond;
    }

    /**
     * Snap to interval.
     */
    static snap(value, interval) {
        if (!interval || interval <= 0) return value;
        return Math.round(value / interval) * interval;
    }

    /**
     * Keep a value inside range.
     */
    static wrap(value, min, max) {
        const range = max - min;

        if (range === 0) return min;

        return ((((value - min) % range) + range) % range) + min;
    }

    /**
     * Map one range into another.
     */
    static map(value, inMin, inMax, outMin, outMax) {
        return (
            ((value - inMin) / (inMax - inMin)) *
                (outMax - outMin) +
            outMin
        );
    }

    /**
     * Format time as HH:MM:SS.mmm
     */
    static formatTime(seconds) {

        if (!Number.isFinite(seconds))
            seconds = 0;

        const h = Math.floor(seconds / 3600);

        const m = Math.floor((seconds % 3600) / 60);

        const s = Math.floor(seconds % 60);

        const ms = Math.floor((seconds % 1) * 1000);

        const hh = String(h).padStart(2, "0");

        const mm = String(m).padStart(2, "0");

        const ss = String(s).padStart(2, "0");

        const mmm = String(ms).padStart(3, "0");

        return `${hh}:${mm}:${ss}.${mmm}`;
    }

    /**
     * Format ruler labels.
     *
     * 00
     * 00:30
     * 01:00
     * 12:32
     */
    static formatRuler(seconds) {

        const h = Math.floor(seconds / 3600);

        const m = Math.floor((seconds % 3600) / 60);

        const s = Math.floor(seconds % 60);

        if (h > 0) {

            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

        }

        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    }

    /**
     * SMPTE Timecode
     */
    static formatSMPTE(seconds, fps = 30) {

        const totalFrames = Math.floor(seconds * fps);

        const frames = totalFrames % fps;

        const totalSeconds = Math.floor(totalFrames / fps);

        const h = Math.floor(totalSeconds / 3600);

        const m = Math.floor((totalSeconds % 3600) / 60);

        const s = totalSeconds % 60;

        return [
            h,
            m,
            s,
            frames
        ]
            .map(v => String(v).padStart(2, "0"))
            .join(":");

    }

    /**
     * Device Pixel Ratio
     */
    static dpi() {

        return window.devicePixelRatio || 1;

    }

    /**
     * Resize a canvas for Retina displays.
     */
    static resizeCanvas(canvas) {

        const dpr = Utils.dpi();

        const rect = canvas.getBoundingClientRect();

        canvas.width = Math.round(rect.width * dpr);

        canvas.height = Math.round(rect.height * dpr);

        const ctx = canvas.getContext("2d");

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        return ctx;

    }

    /**
     * Distance between two points.
     */
    static distance(x1, y1, x2, y2) {

        return Math.hypot(x2 - x1, y2 - y1);

    }

    /**
     * UUID for markers/projects.
     */
    static uuid() {

        if (crypto.randomUUID)
            return crypto.randomUUID();

        return "id-" + Math.random().toString(36).slice(2);

    }

    /**
     * Throttle calls.
     */
    static throttle(fn, delay) {

        let waiting = false;

        return (...args) => {

            if (waiting)
                return;

            waiting = true;

            fn(...args);

            setTimeout(() => {

                waiting = false;

            }, delay);

        };

    }

    /**
     * Debounce calls.
     */
    static debounce(fn, delay) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(() => {

                fn(...args);

            }, delay);

        };

    }

    /**
     * Animation frame helper.
     */
    static raf(callback) {

        let running = true;

        function frame(time) {

            if (!running)
                return;

            callback(time);

            requestAnimationFrame(frame);

        }

        requestAnimationFrame(frame);

        return {

            stop() {

                running = false;

            }

        };

    }

}
