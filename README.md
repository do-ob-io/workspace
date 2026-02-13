# Workspace

A polyglot monorepo that onfigures tests, linters, types, builds, and CI/CD for do-ob projects. This repository is required for development.

## Docker

### Build a Vite PWA Application

```bash
docker build -f Containerfile.nodejs.pwa --build-arg PROJECT=<vite_pwa_project> -t <vite_pwa_project> .
```

### Build a Next.js Website

```bash
docker build -f Containerfile.nodejs.nextjs --build-arg PROJECT=<nextjs_project> -t <nextjs_project> .
```

### Targeting Architecture

```bash
docker buildx build --platform linux/amd64 -f Containerfile.nodejs.<type> --build-arg PROJECT=<vite_pwa_project> -t <vite_pwa_project>:latest
```

### Test Application

```bash
docker run -it --rm --init -p 8080:8080 <project_name>:latest
``` 