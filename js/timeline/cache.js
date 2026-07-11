// ==========================================================
// StageCue Waveform Cache
// IndexedDB storage for waveform peaks
// ==========================================================

export default class Cache {

    constructor() {

        this.db = null;

        this.dbName = "StageCue";

        this.store = "waveforms";

        this.version = 1;

    }

    //---------------------------------------------------------
    // Open database
    //---------------------------------------------------------

    async open() {

        if (this.db)
            return this.db;

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(
                this.dbName,
                this.version
            );

            request.onupgradeneeded = () => {

                const db = request.result;

                if (
                    !db.objectStoreNames.contains(
                        this.store
                    )
                ) {

                    db.createObjectStore(
                        this.store,
                        {
                            keyPath: "id"
                        }
                    );

                }

            };

            request.onsuccess = () => {

                this.db = request.result;

                resolve(this.db);

            };

            request.onerror = () => {

                reject(request.error);

            };

        });

    }

    //---------------------------------------------------------
    // Stable ID
    //---------------------------------------------------------

    async hash(source) {

        let text;

        if (typeof source === "string") {

            text = source;

        }

        else if (source instanceof File) {

            text = [
                source.name,
                source.size,
                source.lastModified
            ].join("|");

        }

        else {

            text = String(source);

        }

        const bytes =
            new TextEncoder().encode(text);

        const digest =
            await crypto.subtle.digest(
                "SHA-256",
                bytes
            );

        return [...new Uint8Array(digest)]
            .map(v => v.toString(16).padStart(2, "0"))
            .join("");

    }

    //---------------------------------------------------------
    // Load
    //---------------------------------------------------------

    async load(source) {

        const db = await this.open();

        const id =
            await this.hash(source);

        return new Promise(resolve => {

            const tx =
                db.transaction(
                    this.store,
                    "readonly"
                );

            const request =
                tx.objectStore(this.store)
                    .get(id);

            request.onsuccess = () => {

                resolve(
                    request.result
                        ? request.result.waveform
                        : null
                );

            };

            request.onerror = () => {

                resolve(null);

            };

        });

    }

    //---------------------------------------------------------
    // Save
    //---------------------------------------------------------

    async save(source, waveform) {

        const db =
            await this.open();

        const id =
            await this.hash(source);

        return new Promise((resolve, reject) => {

            const tx =
                db.transaction(
                    this.store,
                    "readwrite"
                );

            tx.objectStore(this.store)
                .put({

                    id,

                    created: Date.now(),

                    waveform

                });

            tx.oncomplete = () => resolve();

            tx.onerror = () => reject(tx.error);

        });

    }

    //---------------------------------------------------------
    // Remove one
    //---------------------------------------------------------

    async remove(source) {

        const db =
            await this.open();

        const id =
            await this.hash(source);

        return new Promise(resolve => {

            const tx =
                db.transaction(
                    this.store,
                    "readwrite"
                );

            tx.objectStore(this.store)
                .delete(id);

            tx.oncomplete = resolve;

        });

    }

    //---------------------------------------------------------
    // Clear cache
    //---------------------------------------------------------

    async clear() {

        const db =
            await this.open();

        return new Promise(resolve => {

            const tx =
                db.transaction(
                    this.store,
                    "readwrite"
                );

            tx.objectStore(this.store)
                .clear();

            tx.oncomplete = resolve;

        });

    }

    //---------------------------------------------------------
    // Statistics
    //---------------------------------------------------------

    async count() {

        const db =
            await this.open();

        return new Promise(resolve => {

            const tx =
                db.transaction(
                    this.store,
                    "readonly"
                );

            const request =
                tx.objectStore(this.store)
                    .count();

            request.onsuccess = () => {

                resolve(request.result);

            };

        });

    }

}
