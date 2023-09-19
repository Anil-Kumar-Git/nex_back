FROM node:lts
 
WORKDIR /user/src/app
 
COPY . .
 
RUN npm ci
 
RUN npm run build:web
 
USER node

ENV DB_SERVER_PORT $DB_SERVER_PORT
ENV DB_SERVER_USERNAME $DB_SERVER_USERNAME
ENV DB_SERVER_PASSWORD $DB_SERVER_PASSWORD
ENV secretKey $secretKey
 
CMD ["npm", "run", "start:web:prod"]