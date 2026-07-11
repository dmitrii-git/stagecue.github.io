// ==========================================================
// StageCue Cue Markers
// ==========================================================

import Utils from "./utils.js";

export default class Markers {

    constructor(timeline) {

        this.timeline = timeline;

        this.items = [];

        this.selected = null;

        this.dragging = false;

        this.radius = 7;

    }

    //---------------------------------------------------------
    // Create
    //---------------------------------------------------------

    add(time, name = "Cue", color = "#ffd43b") {

        const marker = {

            id: Utils.uuid(),

            time,

            name,

            color,

            locked: false

        };

        this.items.push(marker);

        this.sort();

        return marker;

    }

    addAtPixel(x) {

        const sec = Utils.pixelsToSeconds(
            x,
            this.timeline.zoom.pixelsPerSecond,
            this.timeline.scroll.x
        );

        return this.add(sec);

    }

    //---------------------------------------------------------
    // Remove
    //---------------------------------------------------------

    remove(id) {

        this.items =
            this.items.filter(m => m.id !== id);

        if (
            this.selected &&
            this.selected.id === id
        ) {

            this.selected = null;

        }

    }

    clear() {

        this.items = [];

        this.selected = null;

    }

    //---------------------------------------------------------
    // Sort
    //---------------------------------------------------------

    sort() {

        this.items.sort(
            (a, b) => a.time - b.time
        );

    }

    //---------------------------------------------------------
    // Find
    //---------------------------------------------------------

    markerAtPixel(x) {

        for (const marker of this.items) {

            const mx = Utils.secondsToPixels(
                marker.time,
                this.timeline.zoom.pixelsPerSecond,
                this.timeline.scroll.x
            );

            if (
                Math.abs(mx - x) <= this.radius + 4
            ) {

                return marker;

            }

        }

        return null;

    }

    //---------------------------------------------------------
    // Selection
    //---------------------------------------------------------

    select(marker) {

        this.selected = marker;

    }

    deselect() {

        this.selected = null;

    }

    //---------------------------------------------------------
    // Dragging
    //---------------------------------------------------------

    beginDrag(marker) {

        if (!marker || marker.locked)
            return;

        this.dragging = true;

        this.selected = marker;

    }

    drag(pixel) {

        if (
            !this.dragging ||
            !this.selected
        ) {

            return;

        }

        let sec =
            Utils.pixelsToSeconds(
                pixel,
                this.timeline.zoom.pixelsPerSecond,
                this.timeline.scroll.x
            );

        if (
            this.timeline.playhead.snap
        ) {

            sec = Utils.snap(
                sec,
                this.timeline.playhead.snapInterval
            );

        }

        sec = Utils.clamp(
            sec,
            0,
            this.timeline.video.duration
        );

        this.selected.time = sec;

        this.sort();

    }

    endDrag() {

        this.dragging = false;

    }

    //---------------------------------------------------------
    // Rename
    //---------------------------------------------------------

    rename(id, text) {

        const marker =
            this.items.find(
                m => m.id === id
            );

        if (!marker)
            return;

        marker.name = text;

    }

    //---------------------------------------------------------
    // Color
    //---------------------------------------------------------

    recolor(id, color) {

        const marker =
            this.items.find(
                m => m.id === id
            );

        if (!marker)
            return;

        marker.color = color;

    }

    //---------------------------------------------------------
    // Jump
    //---------------------------------------------------------

    jumpTo(marker) {

        if (!marker)
            return;

        this.timeline.playhead.seek(
            marker.time
        );

    }

    //---------------------------------------------------------
    // Drawing
    //---------------------------------------------------------

    draw(ctx) {

        const h =
            ctx.canvas.clientHeight;

        ctx.save();

        ctx.font = "12px sans-serif";

        for (const marker of this.items) {

            const x =
                Utils.secondsToPixels(
                    marker.time,
                    this.timeline.zoom.pixelsPerSecond,
                    this.timeline.scroll.x
                );

            // Vertical line

            ctx.strokeStyle = marker.color;

            ctx.beginPath();

            ctx.moveTo(x + .5, 0);

            ctx.lineTo(x + .5, h);

            ctx.stroke();

            // Diamond

            ctx.save();

            ctx.translate(x, 8);

            ctx.rotate(Math.PI / 4);

            ctx.fillStyle = marker.color;

            ctx.fillRect(
                -5,
                -5,
                10,
                10
            );

            ctx.restore();

            // Selected

            if (
                this.selected &&
                this.selected.id === marker.id
            ) {

                ctx.beginPath();

                ctx.strokeStyle = "#ffffff";

                ctx.arc(
                    x,
                    8,
                    9,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();

            }

            // Label

            ctx.fillStyle = "#ddd";

            ctx.fillText(
                marker.name,
                x + 8,
                18
            );

        }

        ctx.restore();

    }

    //---------------------------------------------------------
    // Export
    //---------------------------------------------------------

    toJSON() {

        return [...this.items];

    }

    fromJSON(data = []) {

        this.items = data;

        this.sort();

    }

}
