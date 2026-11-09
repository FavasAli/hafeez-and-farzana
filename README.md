# Hafeez & Farhana — Wedding Invitation (React)
npm install
npm run dev      # develop
npm run build    # production build in /dist (deploy to Netlify / Vercel / any static host)

Libraries: framer-motion (animation), three + @react-three/fiber + drei (3D rings).
The 3D lighting (`<Environment preset="city">`) downloads a small HDR file, so the first load needs internet.

## Gallery
The "Our moments" grid and continuously scrolling "Wedding day" slider use static image URLs configured in `src/config.js`. The Wedding day slider randomly selects six images on page load. Its "Open full album" button links to the Google Photos album.
