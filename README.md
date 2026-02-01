# Workspace

A polyglot monorepo that onfigures tests, linters, types, builds, and CI/CD for do-ob projects. This repository is required for development.

## Docker

### Build a Vite PWA Application

```bash
docker build -f Containerfile.nodejs.pwa --build-arg PROJECT=<vite_pwa_project> -t my-pwa .
```

### Build a Next.js Website

```bash
docker build -f Containerfile.nodejs.nextjs --build-arg PROJECT=<nextjs_project> -t my-nextjs .
```