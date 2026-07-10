# Self-hosted deployment (deployment-host)

Spread Your Sheets is a frontend-only app: everything runs client-side in the
browser, and there is no backend, database, or persistent storage. Production
deployment is a single pre-built nginx image serving the static build,
fronted by a reverse proxy that already runs on the target host.

## Host assumptions

- Target host is **deployment-host**, running Docker and Docker Compose.
- A shared **Traefik** instance already runs on that host, attached to an
  external Docker network named `proxy-network`, with an entrypoint named
  `web`.
- A **Cloudflare Tunnel** is already configured outside this repo, routing
  `app.example.com` to `http://traefik:80`. This stack
  does not run its own `cloudflared` container.
- No database, queue, scheduler, migrations, or persistent app storage are
  needed by this app.

## Image strategy

- The image is built from [`deploy/Dockerfile.prod`](../../deploy/Dockerfile.prod):
  a Node 22 stage runs `npm ci` and `vite build` in `web/`, and the resulting
  `web/dist` is copied into an `nginx:alpine` runtime stage. The final image
  contains no source files, no `node_modules`, and no backend runtime.
- Images are built and published automatically by
  [`.github/workflows/docker-build.yml`](../../.github/workflows/docker-build.yml)
  on every push to `main`, and pushed to:

  ```text
  ghcr.io/slightlyprivate/spread-your-sheets-web:latest
  ghcr.io/slightlyprivate/spread-your-sheets-web:main-<short-sha>
  ```

  Pull requests do not publish images.

## Directory layout

On the host, the stack lives under:

```text
/srv/stacks/spread-your-sheets/
  docker-compose.yml
  .env
```

`docker-compose.yml` and `.env.example` are tracked in this repo under
[`deploy/deployment-host/`](../../deploy/deployment-host/) and copied to the
host as-is; `.env` itself is host-local and not committed anywhere.

## Initial setup

```bash
mkdir -p /srv/stacks/spread-your-sheets
cd /srv/stacks/spread-your-sheets

# copy docker-compose.yml and .env.example from repo deploy/deployment-host/
cp .env.example .env
# edit .env if needed (APP_HOST, IMAGE_TAG)

docker compose pull
docker compose up -d

curl https://app.example.com/health
```

The `proxy-network` network must already exist on the host (it's created and
owned by the shared Traefik stack, not by this one).

## Updating

```bash
cd /srv/stacks/spread-your-sheets
docker compose pull
docker compose up -d
docker image prune -f
curl https://app.example.com/health
```

With `IMAGE_TAG=latest` (the default), this always deploys the most recent
`main` build.

## Rollback

Pin `.env` to a previous build's short-sha tag, then redeploy:

```bash
# in .env:
# IMAGE_TAG=main-<previous-short-sha>

docker compose pull
docker compose up -d
curl https://app.example.com/health
```

Short-sha tags for past builds are visible in the GHCR package's version
history, or by finding the corresponding commit on `main`.

## Health check

The nginx image exposes `GET /health`, returning HTTP 200 with the plain-text
body `ok`. Use it for manual verification, uptime checks, or container
health checks.

## Reverse proxy / Traefik labels

The `web` service is not published on a host port; Traefik reaches it over
the `proxy-network` network using these labels (already set in
[`docker-compose.yml`](../../deploy/deployment-host/docker-compose.yml)):

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=proxy-network"
  - "traefik.http.routers.spread-your-sheets.rule=Host(`${APP_HOST}`)"
  - "traefik.http.routers.spread-your-sheets.entrypoints=web"
  - "traefik.http.routers.spread-your-sheets.service=spread-your-sheets-web"
  - "traefik.http.services.spread-your-sheets-web.loadbalancer.server.port=80"
```

`APP_HOST` comes from `.env` and must match the public hostname configured in
the Cloudflare Tunnel.

## Cloudflare Tunnel note

The tunnel is configured manually, outside this repo, with a public hostname
rule:

```text
app.example.com -> http://traefik:80
```

This repo does not manage or run `cloudflared`; it only assumes that rule
already exists and points at the shared Traefik entrypoint.

## Troubleshooting

- **Image pull fails / unauthorized** — confirm the GHCR package
  `spread-your-sheets-web` is set to public visibility (packages can default
  to private on first publish even from a public repo; this may need to be
  changed once manually on GitHub after the first workflow run).
- **`curl` to the public hostname fails or times out** — check `APP_HOST` in
  `.env` matches the Cloudflare Tunnel public hostname exactly (including
  no trailing slash/protocol).
- **Traefik never picks up the service** — verify the external `proxy-network`
  network exists (`docker network ls`) and that the `web` container is
  attached to it (`docker inspect` or `docker compose ps`).
- **Cloudflare reports the hostname but the app doesn't load** — confirm the
  tunnel's public hostname rule points at `http://traefik:80`, and that
  Traefik's `web` entrypoint is actually listening there.
- **Routing/labels look wrong** — check `docker compose config` output for
  the resolved label values, and check the Traefik dashboard/logs for the
  `spread-your-sheets` router and `spread-your-sheets-web` service.
- **Old version still showing after deploy** — likely a stale browser cache;
  `index.html` is served with `Cache-Control: no-cache` specifically to avoid
  this, so a hard refresh should be enough. Hashed files under `/assets/`
  are cached long-term by design and change name on every build.

## Local verification

Build and smoke-test the image locally before relying on it in production:

```bash
# from repo root
docker build -f deploy/Dockerfile.prod -t spread-your-sheets-web:local .
docker run --rm -p 8080:80 spread-your-sheets-web:local

curl http://localhost:8080/health
# open http://localhost:8080 in a browser
```
