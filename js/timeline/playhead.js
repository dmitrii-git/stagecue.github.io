// ==========================================================
// StageCue Playhead
// Keeps video, timeline and mouse synchronized
// ==========================================================

import Utils from "./utils.js";

export default class Playhead {

    constructor(timeline) {

        this.timeline = timeline;

        this.video = timeline.video;

        this.dragging = false;

        this.x = 0;

        this.time = 0;

        this.snap = false;

        this.snapInterval = 1 / (timeline.fps || 30);

    }

    //--------------------------------------------------------
    // Update from video
    //--------------------------------------------------------

    update() {

        if (this.dragging)
            return;

        this.time = this.video.currentTime || 0;

        this.x = Utils.secondsToPixels(
            this.time,
            this.timeline.zoom.pixelsPerSecond,
            this.timeline.scroll.x
        );

    }

    //--------------------------------------------------------
    // Draw
    //--------------------------------------------------------

    draw(ctx) {

        this.update();

        const height = ctx.canvas.clientHeight;

        ctx.save();

        // vertical line
        ctx.strokeStyle = "#ff4d4d";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(this.x + .5, 0);

        ctx.lineTo(this.x + .5, height);

        ctx.stroke();

        // top diamond

        ctx.translate(this.x, 8);

        ctx.rotate(Math.PI / 4);

        ctx.fillStyle = "#ff4d4d";

        ctx.fillRect(-6, -6, 12, 12);

        ctx.restore();

    }

    //--------------------------------------------------------
    // Seek
    //--------------------------------------------------------

    seek(seconds) {

        seconds = Utils.clamp(
            seconds,
            0,
            this.video.duration || 0
        );

        if (this.snap) {

            seconds = Utils.snap(
                seconds,
                this.snapInterval
            );

        }

        this.time = seconds;

        this.video.currentTime = seconds;

    }

    //--------------------------------------------------------
    // Seek from pixel
    //--------------------------------------------------------

    seekFromX(x) {

        const sec = Utils.pixelsToSeconds(
            x,
            this.timeline.zoom.pixelsPerSecond,
            this.timeline.scroll.x
        );

        this.seek(sec);

    }

    //--------------------------------------------------------
    // Drag
    //--------------------------------------------------------

    startDrag() {

        this.dragging = true;

    }

    drag(x) {

        this.seekFromX(x);

    }

    endDrag() {

        this.dragging = false;

    }

    //--------------------------------------------------------
    // Jump
    //--------------------------------------------------------

    jumpForward(sec = 5) {

        this.seek(this.time + sec);

    }

    jumpBackward(sec = 5) {

        this.seek(this.time - sec);

    }

    //--------------------------------------------------------
    // Frame stepping
    //--------------------------------------------------------

    nextFrame() {

        this.seek(
            this.time +
            this.snapInterval
        );

    }

    previousFrame() {

        this.seek(
            this.time -
            this.snapInterval
        );

    }

    //--------------------------------------------------------
    // Center view
    //--------------------------------------------------------

    center() {

        const width =
            this.timeline.root.clientWidth;

        this.timeline.scroll.x = Math.max(
            0,
            this.x - width / 2
        );

    }

    //--------------------------------------------------------
    // Enable snapping
    //--------------------------------------------------------

    enableSnap(state = true) {

        this.snap = state;

    }

}
