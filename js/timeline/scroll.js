// ==========================================================
// StageCue Timeline Scroll
// Professional horizontal scrolling
// ==========================================================

export default class Scroll {

    constructor(timeline) {

        this.timeline = timeline;

        this.x = 0;

        this.velocity = 0;

        this.maxScroll = 0;

        this.followPlayhead = true;

        this.margin = 150;

        this.friction = 0.90;

        this.enabled = true;

    }

    //--------------------------------------------------------
    // Update every frame
    //--------------------------------------------------------

    update() {

        if (!this.enabled)
            return;

        if (Math.abs(this.velocity) > 0.1) {

            this.x += this.velocity;

            this.velocity *= this.friction;

            this.clamp();

        }

        if (
            this.followPlayhead &&
            !this.timeline.playhead.dragging &&
            !this.timeline.video.paused
        ) {

            this.keepPlayheadVisible();

        }

    }

    //--------------------------------------------------------
    // Keep playhead inside viewport
    //--------------------------------------------------------

    keepPlayheadVisible() {

        const playheadX =
            this.timeline.playhead.time *
            this.timeline.zoom.pixelsPerSecond;

        const width =
            this.timeline.root.clientWidth;

        if (
            playheadX - this.x >
            width - this.margin
        ) {

            this.x =
                playheadX -
                width +
                this.margin;

        }

        if (
            playheadX - this.x <
            this.margin
        ) {

            this.x =
                playheadX -
                this.margin;

        }

        this.clamp();

    }

    //--------------------------------------------------------
    // Scroll by pixels
    //--------------------------------------------------------

    scroll(dx) {

        this.x += dx;

        this.clamp();

    }

    //--------------------------------------------------------
    // Smooth scroll
    //--------------------------------------------------------

    fling(speed) {

        this.velocity += speed;

    }

    //--------------------------------------------------------
    // Center playhead
    //--------------------------------------------------------

    centerOnPlayhead() {

        const playheadX =
            this.timeline.playhead.time *
            this.timeline.zoom.pixelsPerSecond;

        const width =
            this.timeline.root.clientWidth;

        this.x =
            playheadX -
            width / 2;

        this.clamp();

    }

    //--------------------------------------------------------
    // Go to time
    //--------------------------------------------------------

    centerOnTime(seconds) {

        const width =
            this.timeline.root.clientWidth;

        this.x =
            seconds *
            this.timeline.zoom.pixelsPerSecond -
            width / 2;

        this.clamp();

    }

    //--------------------------------------------------------
    // Jump
    //--------------------------------------------------------

    toStart() {

        this.x = 0;

    }

    toEnd() {

        this.computeMax();

        this.x = this.maxScroll;

    }

    //--------------------------------------------------------
    // Calculate maximum scroll
    //--------------------------------------------------------

    computeMax() {

        const duration =
            this.timeline.video.duration || 0;

        const width =
            this.timeline.root.clientWidth;

        this.maxScroll = Math.max(
            0,
            duration *
            this.timeline.zoom.pixelsPerSecond -
            width
        );

    }

    //--------------------------------------------------------
    // Clamp
    //--------------------------------------------------------

    clamp() {

        this.computeMax();

        if (this.x < 0)
            this.x = 0;

        if (this.x > this.maxScroll)
            this.x = this.maxScroll;

    }

    //--------------------------------------------------------
    // Toggle follow mode
    //--------------------------------------------------------

    enableFollow(state = true) {

        this.followPlayhead = state;

    }

    //--------------------------------------------------------
    // Zoom callback
    //--------------------------------------------------------

    onZoomChanged() {

        this.computeMax();

        if (this.followPlayhead) {

            this.centerOnPlayhead();

        } else {

            this.clamp();

        }

    }

}
