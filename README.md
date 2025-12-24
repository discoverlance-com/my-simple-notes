# My Simple Notes

A fast, modern, and minimal notes app built with [Vite](https://vitejs.dev/) and
[React](https://react.dev/). Supports offline usage as a Progressive Web App
(PWA) and can be deployed as a static site or containerized for platforms like
Google Cloud Run.

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
- Make sure to build and serve the `dist` folder with a static server for full
  PWA support.

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
   docker build -t us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-sample-notes:latest .
   ```

2. Push to Artifact Registry:

   ```sh
   docker push us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-sample-notes:latest
   ```

3. Deploy to Cloud Run:

   ```sh

   gcloud run deploy my-sample-notes \
     --image us-central1-docker.pkg.dev/<PROJECT-ID>/<REPO>/my-sample-notes:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

Note: this repo includes a `cloudbuild.yaml` that builds, tests, and deploys the
image to Cloud Run using Google Cloud Build. You can also use a GitHub Actions
workflow to build and deploy, but this project keeps deployment simple by using
Cloud Build.

### Cloud Build Deployment notes

- Create a Cloud Build trigger that uses the repository and the included
  `cloudbuild.yaml` so Cloud Build runs the steps defined there on each trigger.
- Update the image repository in the commands above to your Artifact Registry
  path (for example `us-central1-docker.pkg.dev/PROJECT/REPO`).

---

### Cloud Deploy / Skaffold (optional)

The `clouddeploy` folder contains example Skaffold + Cloud Deploy YAML to help
set up multi-target deployments (test, staging, prod) for Cloud Run. This is
optional — the repository's primary CI path is the included `cloudbuild.yaml`.

Before using the `clouddeploy` examples, replace the concrete names in the YAML
files with your values (project id, image names, service account emails).

- `clouddeploy/skaffold.yaml`
  - `build.artifacts[0].image` — currently the short image name
    `my-sample-notes`. Replace with the image name you want Skaffold to produce
    (for example `my-sample-notes`).
  - `build.googleCloudBuild.serviceAccount` — replace this value with your
    service account email
    (projects/.../serviceAccounts/NAME@PROJECT.iam.gserviceaccount.com).

- `clouddeploy/notes-app-*.yaml` — update
  `spec.template.spec.serviceAccountName` (application runtime service account)
  and `containers[0].image`.

- `clouddeploy/pipeline-config/target-*.yaml` — update `run.location` (project
  string and location) and `executionConfigs[].serviceAccount` (target service
  account).

Service account role guidance:

- Skaffold / controller service account: `roles/artifactregistry.writer`,
  `roles/storage.admin`, `roles/run.admin`, `roles/logging.logWriter`.
- Cloud Deploy target service accounts: `roles/artifactregistry.writer`,
  `roles/clouddeploy.runner`, `roles/run.developer`,
  `roles/iam.serviceAccountUser`.
- Application runtime service account: `roles/logging.logWriter` plus any
  app-specific roles required by your service.

This section is intentionally minimal — it points you to the files to edit and
the roles to grant; do not apply the example manifests until you have replaced
the concrete names with your project-specific values.

#### Getting Started with Cloud Deply

After you have performed the initial changes and service account updates, you
can go ahead to use skaffold to setup the environment and deploy your pipeline.
Visit this
[Google Cloud Quick start for Cloud Run](https://docs.cloud.google.com/deploy/docs/deploy-app-run)
documentation for more details.

```bash

```

## Project Structure

```text
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

Pull requests and issues are welcome! Please open an issue to discuss your ideas
or report bugs.

---

## License

MIT

---

## Author

[Lance Armah-Abraham](https://github.com/discoverlance-com)
