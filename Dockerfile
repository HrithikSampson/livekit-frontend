FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
RUN npm run build
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["npm", "start"]
