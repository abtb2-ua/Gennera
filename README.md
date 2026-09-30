# Digital Twin – Estrella Levante

## Scaffold (2 minutes)

```bash
npm create vite@latest brewery-twin -- --template react
cd brewery-twin
npm i three @react-three/fiber @react-three/drei recharts
npm i tailwindcss @tailwindcss/vite
```

Then copy into the new project (overwrite when asked):

- `vite.config.js`
- `src/index.css`, `src/main.jsx`, `src/App.jsx`, `src/Scene.jsx`, `src/UIOverlay.jsx`, `src/data.js`

Put your Draco-compressed model at `public/model.glb`, then:

```bash
npm run dev -- --host   # open the Network URL on your phone
```

## Notes
- If `public/model.glb` is missing, a placeholder scene renders so you can test hotspots.
- Tune hotspot `position`, `target`, `view` and `distance` in `src/data.js` to match your model's scale.
- Compress a model: `npx gltf-pipeline -i in.glb -o public/model.glb -d`
- Draco decoder is fetched from a CDN by default; for offline use, copy `node_modules/three/examples/jsm/libs/draco/gltf/` to `public/draco/` and call `useGLTF.setDecoderPath('/draco/')`.
- Camera: polar angle clamped 60°–80°, zoom 5–20 units, auto-rotate pauses while a card is open.
