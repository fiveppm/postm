# syntax=docker/dockerfile:1
# postmonster: static landing (Astro build) behind nginx with brotli + gzip,
# security headers and redirects (PRD A1, docs/deploy.md "landing").

ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:1.29-alpine

# ---------------------------------------------------------------- build
FROM ${NODE_IMAGE} AS build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Build-time public env (bundled into the static JS). Same knobs as .env.example.
ARG PUBLIC_APP_URL=https://app.postmonster.xyz
ARG PUBLIC_APP_API_URL=https://app.postmonster.xyz/api
ARG PUBLIC_SOURCE_CODE_URL=https://github.com/fiveppm/postm
ARG PUBLIC_OPERATOR_NAME="[OPERATOR_NAME]"
ARG PUBLIC_OPERATOR_LEGAL_NAME="[OPERATOR_LEGAL_NAME]"
ARG PUBLIC_OPERATOR_COUNTRY="[COUNTRY/STATE]"
ARG PUBLIC_EFFECTIVE_DATE="[EFFECTIVE_DATE]"
ENV PUBLIC_APP_URL=${PUBLIC_APP_URL} \
    PUBLIC_APP_API_URL=${PUBLIC_APP_API_URL} \
    PUBLIC_SOURCE_CODE_URL=${PUBLIC_SOURCE_CODE_URL} \
    PUBLIC_OPERATOR_NAME=${PUBLIC_OPERATOR_NAME} \
    PUBLIC_OPERATOR_LEGAL_NAME=${PUBLIC_OPERATOR_LEGAL_NAME} \
    PUBLIC_OPERATOR_COUNTRY=${PUBLIC_OPERATOR_COUNTRY} \
    PUBLIC_EFFECTIVE_DATE=${PUBLIC_EFFECTIVE_DATE}

# Fail the build on data drift: networks.ts must match the app's provider registry.
# (Skipped with a notice when app/ is not part of the build context.)
RUN node scripts/sync-networks.mjs

RUN npm run build

# ------------------------------------------------------- brotli module
# ngx_brotli built as a dynamic module against the exact nginx of the base
# image (--with-compat). Versions stay in sync automatically.
FROM ${NGINX_IMAGE} AS ngx-build
RUN apk add --no-cache build-base cmake git curl pcre2-dev zlib-dev openssl-dev linux-headers
# ngx_brotli expects prebuilt brotli static libs in deps/brotli/out
# (its config only links, it does not build them).
RUN set -eux; \
    mkdir -p /usr/src; \
    NGINX_VERSION="$(nginx -v 2>&1 | sed 's/.*nginx\///')"; \
    curl -fsSL "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" | tar xz -C /usr/src; \
    git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/google/ngx_brotli.git /usr/src/ngx_brotli; \
    cmake -S /usr/src/ngx_brotli/deps/brotli -B /usr/src/ngx_brotli/deps/brotli/out \
      -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF; \
    cmake --build /usr/src/ngx_brotli/deps/brotli/out -j; \
    cd "/usr/src/nginx-${NGINX_VERSION}"; \
    ./configure --with-compat --add-dynamic-module=/usr/src/ngx_brotli; \
    make modules

# ---------------------------------------------------------------- serve
FROM ${NGINX_IMAGE}

# PUBLIC_APP_URL is consumed at container start by the envsubst template
# (redirect /login + CSP connect-src). Keep it in sync with the build args.
ARG PUBLIC_APP_URL=https://app.postmonster.xyz
ENV PUBLIC_APP_URL=${PUBLIC_APP_URL}

COPY --from=ngx-build /usr/src/nginx-*/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
COPY --from=ngx-build /usr/src/nginx-*/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf.template /etc/nginx/templates/security-headers.conf.template
# the shipped conf.d/default.conf would claim default_server otherwise
RUN rm -f /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

# precompressed variants for gzip_static / brotli_static
RUN set -eux; \
    apk add --no-cache gzip brotli; \
    find /usr/share/nginx/html -type f \
      \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' \
         -o -name '*.json' -o -name '*.xml' -o -name '*.txt' \) \
      -exec gzip -9 -k {} \; -exec brotli -q 11 -k {} \; ; \
    apk del gzip brotli

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
