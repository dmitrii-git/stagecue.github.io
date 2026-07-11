// ==========================================================
// StageCue Spectrum Analyzer
// Real-time FFT visualizer
// ==========================================================

export default class Spectrum {

    constructor(timeline) {

        this.timeline = timeline;
        this.video = timeline.video;

        this.context = null;
        this.source = null;
        this.analyser = null;

        this.connected = false;

        this.mode = "bars"; // bars | waveform

        this.barWidth = 3;
        this.barGap = 1;

        this.smoothing = 0.82;
        this.fftSize = 2048;

        this.data = null;
        this.wave = null;

    }

    //---------------------------------------------------------
    // Initialize
    //---------------------------------------------------------

    async connect() {

        if (this.connected)
            return;

        this.context = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

        this.analyser =
            this.context.createAnalyser();

        this.analyser.fftSize =
            this.fftSize;

        this.analyser.smoothingTimeConstant =
            this.smoothing;

        this.source =
            this.context.createMediaElementSource(
                this.video
            );

        this.source.connect(this.analyser);

        this.analyser.connect(
            this.context.destination
        );

        this.data =
            new Uint8Array(
                this.analyser.frequencyBinCount
            );

        this.wave =
            new Uint8Array(
                this.analyser.fftSize
            );

        this.connected = true;

    }

    //---------------------------------------------------------
    // Draw
    //---------------------------------------------------------

    draw(ctx) {

        if (!this.connected)
            return;

        if (this.context.state === "suspended")
            return;

        if (this.mode === "bars")
            this.drawBars(ctx);
        else
            this.drawWave(ctx);

    }

    //---------------------------------------------------------
    // Frequency bars
    //---------------------------------------------------------

    drawBars(ctx) {

        this.analyser.getByteFrequencyData(
            this.data
        );

        const w = ctx.canvas.clientWidth;
        const h = ctx.canvas.clientHeight;

        ctx.clearRect(0, 0, w, h);

        let x = 0;

        for (
            let i = 0;
            i < this.data.length;
            i += 2
        ) {

            const value =
                this.data[i] / 255;

            const barHeight =
                value * h;

            ctx.fillStyle =
                `hsl(${220 - value * 90},80%,60%)`;

            ctx.fillRect(
                x,
                h - barHeight,
                this.barWidth,
                barHeight
            );

            x +=
                this.barWidth +
                this.barGap;

            if (x > w)
                break;

        }

    }

    //---------------------------------------------------------
    // Oscilloscope
    //---------------------------------------------------------

    drawWave(ctx) {

        this.analyser.getByteTimeDomainData(
            this.wave
        );

        const w = ctx.canvas.clientWidth;
        const h = ctx.canvas.clientHeight;

        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();

        ctx.strokeStyle = "#5ba7ff";

        const slice =
            w / this.wave.length;

        let x = 0;

        for (
            let i = 0;
            i < this.wave.length;
            i++
        ) {

            const y =
                (this.wave[i] / 255) * h;

            if (i === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);

            x += slice;

        }

        ctx.stroke();

    }

    //---------------------------------------------------------
    // Resume after user gesture
    //---------------------------------------------------------

    async resume() {

        if (!this.context)
            return;

        if (
            this.context.state ===
            "suspended"
        ) {

            await this.context.resume();

        }

    }

    //---------------------------------------------------------
    // Change mode
    //---------------------------------------------------------

    setMode(mode) {

        this.mode = mode;

    }

    //---------------------------------------------------------
    // Destroy
    //---------------------------------------------------------

    destroy() {

        if (this.source)
            this.source.disconnect();

        if (this.analyser)
            this.analyser.disconnect();

        this.connected = false;

    }

}
