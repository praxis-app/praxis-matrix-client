FROM node:22.11.0-alpine AS build_stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG NODE_ENV PORT
RUN npm run build

# Prepare the runtime image
FROM busybox:1.35 AS runtime_stage
RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build_stage /app/dist .

# Set port and run the app
ENV PORT=${PORT:-3000}
CMD busybox httpd -f -v -p $PORT