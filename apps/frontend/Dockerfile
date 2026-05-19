FROM node:22

WORKDIR /app

COPY ../../package*.json ./
COPY ../../packages ./packages
COPY . ./apps/frontend

RUN npm install --workspace=@privacy-scanner/privacy-policy-detector --workspace=frontend

# Build the privacy-policy-detector package
RUN npm run build --workspace=@privacy-scanner/privacy-policy-detector

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]