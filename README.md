# 🎬 StageCue

> A professional web-based video playback application inspired by live event playback software.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-orange)
![Platform](https://img.shields.io/badge/platform-Web-success)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

---

## Overview

StageCue is a browser-based media playback application designed for live productions, churches, conferences, theaters, schools, and streaming studios.

It allows operators to build playlists of local media files, preview content, and send synchronized playback to a dedicated fullscreen output window on a second display.

The goal is to provide a lightweight, install-free alternative to traditional playback software while remaining entirely web-based.

---

## Features

### Current

* 🎬 Video playlist
* 📂 Import multiple local videos
* 🖱️ Drag & Drop media
* ▶️ Play / Pause / Stop
* ⏮ Previous / Next cue
* 🔊 Volume control
* 🎞 Automatic video thumbnails
* ⏱ Duration detection
* 🖥 Separate Output Window
* 🔳 Fullscreen Output
* 💾 Save playlist metadata
* 📁 Load playlist
* ⌨ Keyboard shortcuts

---

## Planned Features

* 🎨 Cue colors
* 📝 Cue notes
* ⭐ Favorite cues
* 🔍 Playlist search
* 📋 Duplicate cues
* 🗂 Folder import
* 🎞 Image playback
* 🎵 Audio playback
* 📄 PDF cues
* 🌐 Web page cues
* ⏱ Countdown timers
* 🔄 Loop individual cue
* 🔁 Loop playlist
* 🎛 Fade to Black
* 📺 Multi-display support
* 🎚 Crossfade transitions
* 🎮 MIDI control
* 🎛 Stream Deck integration
* 🎤 OBS integration
* 🌍 Progressive Web App (PWA)

---

## Screenshots

Coming soon.

---

## Project Structure

```text
StageCue/
│
├── index.html
│
├── css/
│   ├── style.css
│   ├── layout.css
│   └── components.css
│
├── js/
│   ├── app.js
│   ├── player.js
│   ├── playlist.js
│   ├── output.js
│   ├── thumbnails.js
│   ├── dragdrop.js
│   ├── shortcuts.js
│   ├── storage.js
│   └── ui.js
│
└── assets/
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/yourusername/stagecue.git
```

### Run

Because StageCue uses ES Modules, open the project with a local web server.

Using VS Code:

1. Install **Live Server**
2. Open the project
3. Right-click `index.html`
4. Select **Open with Live Server**

Or use Python:

```bash
python -m http.server
```

Then open:

```
http://localhost:8000
```

---

## Browser Support

Recommended:

* ✅ Google Chrome
* ✅ Microsoft Edge

Experimental:

* Firefox
* Safari

---

## Technology Stack

* HTML5
* CSS3
* Vanilla JavaScript (ES Modules)
* HTML5 Video API
* Canvas API
* File API
* Local Storage
* File System Access API (planned)

---

## Roadmap

### Version 0.1

* Basic playback
* Playlist
* Output window
* Drag & Drop

### Version 0.2

* Cue editing
* Colors
* Notes
* Search
* Better thumbnails

### Version 0.3

* Images
* Audio
* PDF
* Timers
* Fade to Black

### Version 1.0

* Professional live playback
* Multi-display workflow
* Stream Deck support
* OBS integration
* Production-ready release

---

## Contributing

Contributions are welcome.

If you'd like to improve StageCue:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

Bug reports and feature requests are also appreciated.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

StageCue is inspired by professional live playback workflows used in broadcast, theater, worship production, conferences, and live events. It is an independent open-source project and is not affiliated with or endorsed by any commercial playback software vendor.

---

## Author

**Jimmy Mikheev**

Building a modern, open-source media playback solution for live productions.

⭐ If you find this project useful, consider starring the repository.
