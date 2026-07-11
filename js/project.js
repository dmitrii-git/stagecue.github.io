// ==============================================
// StageCue Project Manager
// ==============================================

export class ProjectManager {

    constructor(database){

        this.database = database;

        this.project = {

            id: "current",

            version: 1,

            name: "Untitled Project",

            created: Date.now(),

            updated: Date.now(),

            playlist: [],

            settings:{

                volume:1,

                loop:false

            }

        };

        this.timer = null;

    }

    //----------------------------------
    // Load
    //----------------------------------

    async load(){

        const saved =
            await this.database.load("current");

        if(saved){

            this.project = saved;

        }

        return this.project;

    }

    //----------------------------------
    // Save
    //----------------------------------

    async save(){

        this.project.updated = Date.now();

        await this.database.save(this.project);

        console.log("Project saved");

    }

    //----------------------------------
    // Debounced Save
    //----------------------------------

    queueSave(){

        clearTimeout(this.timer);

        this.timer = setTimeout(()=>{

            this.save();

        },500);

    }

}
