// ==============================================
// StageCue Database
// IndexedDB Wrapper
// ==============================================

const DB_NAME = "StageCue";

const DB_VERSION = 1;

const STORE = "projects";

export class Database {

    constructor(){

        this.db = null;

    }

    async open(){

        return new Promise((resolve,reject)=>{

            const request =
                indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = e=>{

                const db = e.target.result;

                if(!db.objectStoreNames.contains(STORE)){

                    db.createObjectStore(STORE,{
                        keyPath:"id"
                    });

                }

            };

            request.onsuccess = ()=>{

                this.db = request.result;

                resolve();

            };

            request.onerror = ()=>{

                reject(request.error);

            };

        });

    }

    async save(project){

        return new Promise((resolve,reject)=>{

            const tx =
                this.db.transaction(STORE,"readwrite");

            tx.objectStore(STORE).put(project);

            tx.oncomplete = ()=>resolve();

            tx.onerror = ()=>reject(tx.error);

        });

    }

    async load(id){

        return new Promise((resolve,reject)=>{

            const tx =
                this.db.transaction(STORE);

            const request =
                tx.objectStore(STORE).get(id);

            request.onsuccess =
                ()=>resolve(request.result);

            request.onerror =
                ()=>reject(request.error);

        });

    }

}
