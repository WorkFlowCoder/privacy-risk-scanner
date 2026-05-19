FROM node:22

WORKDIR /app

COPY ../../package*.json ./
COPY ../../packages ./packages
COPY . ./apps/extension

RUN npm install --workspace=@privacy-scanner/privacy-policy-detector --workspace=extension-app

# Build the privacy-policy-detector package
RUN npm run build --workspace=@privacy-scanner/privacy-policy-detector

WORKDIR /app/apps/extension
