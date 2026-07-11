// ==============================================
// StageCue Player Engine
// ==============================================

import Timeline from "./timeline/timeline.js";

export class Player {

    constructor() {

        // Preview video
        this.video =
            document.getElementById("preview");

        // Timeline root
        this.timelineRoot =
            document.getElementById("timeline");

        // UI
        this.seek =
            document.getElementById("seek");

        this.currentLabel =
            document.getElementById("current");

        this.durationLabel =
            document.getElementById("duration");

        this.overlay =
            document.getElementById("previewOverlay");

        // Data
        this.currentClip = null;

        // External output window
        this.output = null;

        // Timeline
        this.timeline = null;

        if (this.timelineRoot) {

            this.timeline = new Timeline({

                root: this.timelineRoot,

                video: this.video,

                fps: 30

            });

        }

        this.bindEvents();

    }

    // =====================================================
    // Events
    // =====================================================

    bindEvents() {

        //----------------------------------------
        // Metadata
        //----------------------------------------

        this.video.addEventListener(
            "loadedmetadata",
            async () => {

                this.updateDuration();

                if (
                    this.timeline &&
                    this.currentClip
                ) {

                    try {

                        await this.timeline.load(

                            this.currentClip.file ||
                            this.currentClip.url

                        );

                    }

                    catch (err) {

                        console.error(err);

                    }

                }

            }
        );

        //----------------------------------------
        // Time
        //----------------------------------------

        this.video.addEventListener(
            "timeupdate",
            () => this.updateTime()
        );

        //----------------------------------------
        // Playback
        //----------------------------------------

        this.video.addEventListener(
            "play",
            () => this.syncOutput()
        );

        this.video.addEventListener(
            "pause",
            () => this.syncOutput()
        );

        this.video.addEventListener(
            "seeked",
            () => this.syncOutput()
        );

        this.video.addEventListener(
            "ratechange",
            () => {

                if (!this.output)
                    return;

                this.output.playbackRate =
                    this.video.playbackRate;

            }
        );

        this.video.addEventListener(
            "volumechange",
            () => {

                if (!this.output)
                    return;

                this.output.volume =
                    this.video.volume;

                this.output.muted =
                    this.video.muted;

            }
        );

        //----------------------------------------
        // Ended
        //----------------------------------------

        this.video.addEventListener(
            "ended",
            () => {

                document.dispatchEvent(

                    new CustomEvent(
                        "stagecue:ended"
                    )

                );

            }
        );

        //----------------------------------------
        // Seek bar
        //----------------------------------------

        this.seek.addEventListener(
            "input",
            () => {

                if (!this.video.duration)
                    return;

                this.seekTo(

                    (this.seek.value / 100) *
                    this.video.duration

                );

            }
        );

    }

    // =====================================================
    // Media
    // =====================================================

    load(clip) {

        if (!clip)
            return;

        this.stop();

        this.currentClip = clip;

        this.video.src = clip.url;

        this.overlay.style.display = "none";

        this.video.load();

    }

    unload() {

        this.stop();

        this.video.removeAttribute("src");

        this.video.load();

        this.currentClip = null;

        if (this.timeline) {

            this.timeline.waveform.clear();

            this.timeline.clearMarkers();

            this.timeline.clearSelection();

        }

    }

    // =====================================================
    // Playback
    // =====================================================

    async play() {

        try {

            await this.video.play();

        }

        catch (err) {

            console.warn(err);

        }

    }

    pause() {

        this.video.pause();

    }

    stop() {

        this.video.pause();

        this.video.currentTime = 0;

        if (this.output) {

            this.output.pause();

            this.output.currentTime = 0;

        }

    }

    toggle() {

        if (this.video.paused)

            this.play();

        else

            this.pause();

    }

    // =====================================================
    // Volume
    // =====================================================

    setVolume(value) {

        this.video.volume = value;

    }

    // =====================================================
    // Seek
    // =====================================================

    seekTo(seconds) {

        if (!this.video.duration)
            return;

        seconds = Math.max(

            0,

            Math.min(

                seconds,

                this.video.duration

            )

        );

        this.video.currentTime = seconds;

    }

    // =====================================================
    // UI
    // =====================================================

    updateTime() {

        this.currentLabel.textContent =
            this.format(
                this.video.currentTime
            );

        if (this.video.duration) {

            this.seek.value =

                (

                    this.video.currentTime /

                    this.video.duration

                ) * 100;

        }

        if (this.output) {

            this.output.currentTime =
                this.video.currentTime;

        }

    }

    updateDuration() {

        this.durationLabel.textContent =
            this.format(
                this.video.duration
            );

    }

    // =====================================================
    // Formatting
    // =====================================================

    format(seconds) {

        if (isNaN(seconds))
            return "00:00";

        const h =
            Math.floor(seconds / 3600);

        const m =
            Math.floor(
                (seconds % 3600) / 60
            );

        const s =
            Math.floor(
                seconds % 60
            );

        if (h > 0) {

            return (

                String(h).padStart(2, "0") +

                ":" +

                String(m).padStart(2, "0") +

                ":" +

                String(s).padStart(2, "0")

            );

        }

        return (

            String(m).padStart(2, "0") +

            ":" +

            String(s).padStart(2, "0")

        );

    }

    // =====================================================
    // Output Window
    // =====================================================

    syncOutput() {

        if (!this.output)
            return;

        if (
            this.output.src !==
            this.video.src
        ) {

            this.output.src =
                this.video.src;

        }

        this.output.currentTime =
            this.video.currentTime;

        this.output.playbackRate =
            this.video.playbackRate;

        this.output.volume =
            this.video.volume;

        this.output.muted =
            this.video.muted;

        if (this.video.paused) {

            this.output.pause();

        }

        else {

            this.output.play()
                .catch(() => {});

        }

    }

    attachOutput(videoElement) {

        this.output = videoElement;

        if (this.currentClip) {

            this.output.src =
                this.currentClip.url;

        }

        this.output.volume =
            this.video.volume;

        this.output.playbackRate =
            this.video.playbackRate;

        this.syncOutput();

    }

    // =====================================================
    // Timeline API
    // =====================================================

    addCue(

        name = "Cue",

        color = "#ff9800"

    ) {

        if (!this.timeline)
            return;

        return this.timeline.addMarker(

            this.video.currentTime,

            name,

            color

        );

    }

    zoomIn() {

        this.timeline?.zoomIn();

    }

    zoomOut() {

        this.timeline?.zoomOut();

    }

    fitTimeline() {

        this.timeline?.fit();

    }

    // =====================================================
    // Getters
    // =====================================================

    get currentTime() {

        return this.video.currentTime;

    }

    get duration() {

        return this.video.duration || 0;

    }

    get paused() {

        return this.video.paused;

    }

    // =====================================================
    // Cleanup
    // =====================================================

    destroy() {

        this.timeline?.destroy();

        this.stop();

    }

}
