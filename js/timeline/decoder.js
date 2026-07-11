// ==========================================================
// StageCue Audio Decoder
// ==========================================================

import { getAudioContext } from "./audio-context.js";

export default class Decoder {

    constructor() {

        this.context = getAudioContext();

    }

    //---------------------------------------------------------
    // Decode
    //---------------------------------------------------------

    async decode(source) {

        if (!source)
            throw new Error("No media source.");

        let buffer;

        //-------------------------------------------------
        // File / Blob
        //-------------------------------------------------

        if (
            source instanceof File ||
            source instanceof Blob
        ) {

            buffer = await source.arrayBuffer();

        }

        //-------------------------------------------------
        // Remote URL only
        //-------------------------------------------------

        else if (typeof source === "string") {

            if (source.startsWith("blob:")) {

                throw new Error(

                    "Decoder received a Blob URL. Pass the original File instead."

                );

            }

            const response = await fetch(source);

            if (!response.ok) {

                throw new Error(

                    `Unable to fetch ${source}`

                );

            }

            buffer =
                await response.arrayBuffer();

        }

        else {

            throw new Error(

                "Unsupported source."

            );

        }

        return await this.context.decodeAudioData(

            buffer.slice(0)

        );

    }

    //---------------------------------------------------------

    async tryDecode(source) {

        try {

            return await this.decode(source);

        }

        catch (err) {

            console.error(err);

            return null;

        }

    }

    //---------------------------------------------------------

    async resume() {

        if (this.context.state === "suspended") {

            await this.context.resume();

        }

    }

    //---------------------------------------------------------

    async suspend() {

        if (this.context.state === "running") {

            await this.context.suspend();

        }

    }

}
