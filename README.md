# Birthday Polaroid Collage (React + GSAP)

A scrapbook-style polaroid collage with a birthday intro: confetti, sparkles,
floating balloons and GSAP animations. Polaroids are draggable.

## Run

```bash
npm install
npm run dev
```

Build for production: `npm run build` (output in `dist/`).

## Customise (all in `src/App.jsx`, top of the file)

| Constant | What it does |
| --- | --- |
| `VIDEO_SRC` | Video shown in the centre polaroid |
| `TOP_PHOTO` | Photo on the "I love you" card on top |
| `BIRTHDAY_TITLE` | Text of the animated banner |
| `HANDLE` | Caption under the video (double-click it to edit live) |

### Adding your video / photo

1. Put your files in a `public/` folder, e.g. `public/my-video.mp4`, `public/top-photo.jpg`.
2. Set the constants:

```js
const VIDEO_SRC = "/my-video.mp4";
const TOP_PHOTO = "/top-photo.jpg";
const BIRTHDAY_TITLE = "Happy Birthday Ananya!";
```

### Photos

Your photos are in `public/photos/` (`photo1.jpg` … `photo9.jpg`).
`TOP_PHOTO` is the top card; the `PHOTOS` array feeds the 8 background polaroids.
Change `pos` (e.g. `"50% 25%"`) to move the crop so the face stays visible.

### Background polaroids

The 8 scattered cards come from `initialBg` and use the `PHOTOS` array.
If a photo is missing, the gradient + emoji is shown instead.

## Buttons

- **Celebrate** fires confetti again
- **Shuffle** re-tilts the background polaroids

## Stack

React 18, GSAP 3, Vite 5
