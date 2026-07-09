// ==============================================
// StageCue UI Manager
// ==============================================

export class UI {

    constructor(playlist) {

        this.playlist = playlist;

        this.container =
            document.getElementById("playlist");

    }

    render() {

        this.container.innerHTML = "";

        if (this.playlist.items.length === 0) {

            this.container.innerHTML = `
                <div class="emptyPlaylist">
                    Drop videos here
                </div>
            `;

            return;

        }

        this.playlist.items.forEach((clip, index) => {

            this.container.appendChild(

                this.createPlaylistItem(
                    clip,
                    index
                )

            );

        });

    }

    createPlaylistItem(clip, index) {

        const item = document.createElement("div");

        item.className = "playlist-item";

        if (index === this.playlist.currentIndex) {

            item.classList.add("active");

        }

        item.draggable = true;

        item.dataset.index = index;

        item.innerHTML = `

        <div class="thumb">

            ${
                clip.thumbnail
                ? `<img src="${clip.thumbnail}">`
                : ""
            }

        </div>

        <div class="info">

            <div class="title">

                ${clip.name}

            </div>

            <div class="meta">

                ${clip.duration || "--:--"}

            </div>

        </div>

        `;

        this.bindItemEvents(item, index);

        return item;

    }

    bindItemEvents(item, index) {

        item.onclick = () => {

            this.playlist.select(index);

        };

        item.ondblclick = () => {

            this.playlist.play(index);

        };

        item.oncontextmenu = e => {

            e.preventDefault();

            this.showContextMenu(
                e.clientX,
                e.clientY,
                index
            );

        };

    }

    //------------------------------------

    showContextMenu(x, y, index) {

        this.closeContextMenu();

        const menu = document.createElement("div");

        menu.className = "contextMenu";

        menu.style.left = x + "px";
        menu.style.top = y + "px";

        menu.innerHTML = `

            <div data-action="play">
                ▶ Play
            </div>

            <div data-action="remove">
                🗑 Remove
            </div>

        `;

        menu.onclick = e => {

            const action =
                e.target.dataset.action;

            switch(action){

                case "play":

                    this.playlist.play(index);

                    break;

                case "remove":

                    this.playlist.remove(index);

                    break;

            }

            this.closeContextMenu();

        };

        document.body.appendChild(menu);

        setTimeout(()=>{

            document.addEventListener(
                "click",
                () => this.closeContextMenu(),
                {once:true}
            );

        },10);

    }

    closeContextMenu(){

        document
            .querySelectorAll(".contextMenu")
            .forEach(m=>m.remove());

    }

}
