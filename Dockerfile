#######################
# Step 1: Base target #
#######################
FROM node:10-alpine as base
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium@edge=72.0.3626.121-r0 \
    nss@edge \
    freetype@edge \
    harfbuzz@edge \
    ttf-freefont@edge

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Base dir /app
WORKDIR /app
# Expose the listening port of your app
EXPOSE 7000

################################
# Step 2: "development" target #
################################
FROM base as development
ARG APP_VERSION
COPY src src/
COPY babel.config.js package.json package-lock.json ./
# Install app dependencies
RUN npm --no-git-tag-version version ${APP_VERSION} ; npm install

#CMD ["npm", "start"]
CMD ["npm","run",  "dev"]

##########################
# Step 3: "build" target #
##########################
FROM development as build
ENV NPM_CONFIG_LOGLEVEL warn
# Transpile the code with babel
RUN npm run build

###############################
# Step 4: "production" target #
###############################
FROM build as production
ARG NPM_AUDIT_DRY_RUN
ENV NODE_ENV=production
ARG APP_VERSION
# Copy the transpiled code to use in production (in /app)
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
# Install production dependencies and clean cache
RUN npm --no-git-tag-version version ${APP_VERSION} && \
    npm install --production && \
    npm config set audit-level moderate && \
    npm audit --json --registry=https://registry.npmjs.org || ${NPM_AUDIT_DRY_RUN:-false} && \
    npm cache clean --force
# Install pm2
RUN npm install pm2 -g

USER node

# Copy the pm2 config
COPY ecosystem.config.js .

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
