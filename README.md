# My Simple Notes

A fast, modern, and minimal notes app built with [Vite](https://vitejs.dev/) and [React](https://react.dev/).
Supports offline usage as a Progressive Web App (PWA) and can be deployed as a static site or containerized for platforms like Google Cloud Run.

---

## Features

- ⚡️ **Vite + React**: Instant reloads, fast builds
- 📝 **Note-taking**: Simple, clean UI for managing notes
- 📱 **PWA**: Installable, works offline, mobile-friendly
- 🚀 **Docker-ready**: Easily deploy as a container
- ☁️ **Cloud Run compatible**: Ready for Google Cloud Run

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
git clone https://github.com/yourusername/my-simple-notes.git
cd my-simple-notes
npm install
```

### Local Development

```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Progressive Web App (PWA)

- The app is installable and works offline.
- Make sure to build and serve the `dist` folder with a static server for full PWA support.

---

## Building for Production

```sh
npm run build
```
The output will be in the `dist` directory.

---

## Docker Deployment

Build and run the app with Docker:

```sh
docker build -t my-simple-notes .
docker run -p 8080:8080 my-simple-notes
```

---

## Deploying to Google Cloud Run

1. Build and tag your Docker image:
   ```sh
   docker build -t us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-simple-notes:latest .
   ```
2. Push to Artifact Registry:
   ```sh
   docker push us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-simple-notes:latest
   ```
3. Deploy to Cloud Run:
   ```sh
   gcloud run deploy my-simple-notes \
     --image us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-simple-notes:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

---

## Project Structure

```
my-simple-notes/
├── public/           # Static assets (manifest, icons, sw.js)
├── src/              # React source code
│   ├── App.tsx
│   └── ...
├── Dockerfile        # For containerization
├── nginx.conf        # (optional) Custom nginx config for SPA routing
├── package.json
├── README.md
└── ...
```

---

## Contributing

Pull requests and issues are welcome!
Please open an issue to discuss your ideas or report bugs.

---

## License

MIT

---

## Author

[Lance Armah-Abraham](https://github.com/discoverlance-com)
```
