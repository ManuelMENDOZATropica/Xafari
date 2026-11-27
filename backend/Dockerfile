FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

# Dependencias primero (cache). Sin devDependencies (sqlite3, jest...).
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

# Sin root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
