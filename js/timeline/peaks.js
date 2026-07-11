// ==========================================================
// StageCue Waveform Peak Generator
// Generates multi-resolution min/max peaks
// ==========================================================

export default class Peaks {

    constructor() {

        // Samples represented by one peak.
        // Each level doubles the resolution.
        this.levels = [
            64,
            128,
            256,
            512,
            1024,
            2048,
            4096,
            8192
        ];

    }

    //---------------------------------------------------------
    // Generate all resolutions
    //---------------------------------------------------------

    generate(audioBuffer) {

        const channels = [];

        for (
            let c = 0;
            c < audioBuffer.numberOfChannels;
            c++
        ) {

            channels.push(
                this.generateChannel(
                    audioBuffer.getChannelData(c)
                )
            );

        }

        return {

            duration: audioBuffer.duration,

            sampleRate: audioBuffer.sampleRate,

            channels,

            levels: this.levels

        };

    }

    //---------------------------------------------------------
    // One channel
    //---------------------------------------------------------

    generateChannel(samples) {

        const result = {};

        for (const blockSize of this.levels) {

            result[blockSize] =
                this.buildLevel(
                    samples,
                    blockSize
                );

        }

        return result;

    }

    //---------------------------------------------------------
    // Build one LOD
    //---------------------------------------------------------

    buildLevel(samples, blockSize) {

        const length =
            Math.ceil(
                samples.length /
                blockSize
            );

        const peaks =
            new Float32Array(length * 2);

        let index = 0;

        for (
            let i = 0;
            i < samples.length;
            i += blockSize
        ) {

            let min = 1;
            let max = -1;

            const end =
                Math.min(
                    i + blockSize,
                    samples.length
                );

            for (
                let j = i;
                j < end;
                j++
            ) {

                const value = samples[j];

                if (value > max)
                    max = value;

                if (value < min)
                    min = value;

            }

            peaks[index++] = min;
            peaks[index++] = max;

        }

        return peaks;

    }

    //---------------------------------------------------------
    // Best resolution for zoom
    //---------------------------------------------------------

    getLevel(waveform, pixelsPerSecond) {

        const duration =
            waveform.duration;

        const pixels =
            duration *
            pixelsPerSecond;

        const samples =
            waveform.sampleRate *
            duration;

        const spp =
            samples /
            pixels;

        for (const level of waveform.levels) {

            if (level >= spp)
                return level;

        }

        return waveform.levels[
            waveform.levels.length - 1
        ];

    }

    //---------------------------------------------------------
    // Channel helper
    //---------------------------------------------------------

    getChannel(
        waveform,
        index = 0
    ) {

        return waveform.channels[index];

    }

    //---------------------------------------------------------
    // Peak helper
    //---------------------------------------------------------

    getPeaks(
        waveform,
        pixelsPerSecond,
        channel = 0
    ) {

        const level =
            this.getLevel(
                waveform,
                pixelsPerSecond
            );

        return waveform.channels[channel][level];

    }

}
