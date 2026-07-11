// ==========================================================
// StageCue Waveform Renderer
// Draws waveform peaks efficiently
// ==========================================================

export default class WaveformRenderer {

    constructor(timeline) {

        this.timeline = timeline;

        this.waveColor = "#5ba7ff";
        this.waveFill = "#2f7dd6";
        this.centerLine = "#333";

        this.lineWidth = 1;

    }

    //---------------------------------------------------------
    // Draw waveform
    //---------------------------------------------------------

    draw(
        ctx,
        waveform,
        width,
        height,
        pixelsPerSecond,
        scroll
    ) {

        if (!waveform)
            return;

        const peaks =
            this.timeline.waveform.peaks.getPeaks(
                waveform,
                pixelsPerSecond
            );

        if (!peaks)
            return;

        const level =
            this.timeline.waveform.peaks.getLevel(
                waveform,
                pixelsPerSecond
            );

        const samplesPerPeak = level;

        const pixelsPerPeak =
            (samplesPerPeak / waveform.sampleRate) *
            pixelsPerSecond;

        //---------------------------------------------
        // Visible peak range
        //---------------------------------------------

        const firstPeak = Math.max(
            0,
            Math.floor(scroll / pixelsPerPeak)
        );

        const lastPeak = Math.min(
            peaks.length / 2,
            Math.ceil(
                (scroll + width) /
                pixelsPerPeak
            )
        );

        //---------------------------------------------
        // Background center line
        //---------------------------------------------

        const mid = height / 2;

        ctx.save();

        ctx.strokeStyle = this.centerLine;

        ctx.beginPath();

        ctx.moveTo(0, mid);

        ctx.lineTo(width, mid);

        ctx.stroke();

        //---------------------------------------------
        // Waveform
        //---------------------------------------------

        ctx.strokeStyle = this.waveColor;
        ctx.fillStyle = this.waveFill;
        ctx.lineWidth = this.lineWidth;

        ctx.beginPath();

        for (
            let i = firstPeak;
            i < lastPeak;
            i++
        ) {

            const x =
                i * pixelsPerPeak - scroll;

            const min =
                peaks[i * 2];

            const max =
                peaks[i * 2 + 1];

            const y1 =
                mid - max * (mid - 2);

            const y2 =
                mid - min * (mid - 2);

            ctx.moveTo(x + 0.5, y1);

            ctx.lineTo(x + 0.5, y2);

        }

        ctx.stroke();

        ctx.restore();

    }

}
