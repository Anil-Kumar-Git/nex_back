Nexus7995 

## Description

Nexus7995

## Installation

NPM
```bash
$ npm install
```

MariaDB
```bash
$ docker run --name mariadb_nexus7995 -e MYSQL_ROOT_PASSWORD=mypass -p 3306:3306 -d mariadb
$ docker exec -it mariadb_nexus7995 mariadb --user root -pmypass
$ CREATE DATABASE nexus7995;
```

PHPMyAdmin
```bash
$ docker run --name phpmyadmin_nexus7995 -d --link mariadb_nexus7995:db -p 8080:80 phpmyadmin/phpmyadmin
```

## Running the app

```bash
# development
$ npm run start:api
$ npm run start:web

# watch mode
$ npm run start:api:dev
$ npm run start:web:dev

# production mode
$ npm run start:api:prod
$ npm run start:web:prod
```

## Running the app in Docker

```bash
# nexus7995-api
$ docker build -t nexus7995-api -f Dockerfile_api .
$ docker run -e DB_SERVER_PORT=3306 -e DB_SERVER_USERNAME=root -e DB_SERVER_PASSWORD=mypass -e secretKey="r5u8x/A?D(G+KbPeShVmYq3t6v9y$B&E" -p3000:3000 nexus7995-api

# nexus7995-web
$ docker build -t nexus7995-web -f Dockerfile_web .
$ docker run -e DB_SERVER_PORT=3306 -e DB_SERVER_USERNAME=root -e DB_SERVER_PASSWORD=mypass -e secretKey="r5u8x/A?D(G+KbPeShVmYq3t6v9y$B&E" -p3000:3000 nexus7995-web
```

## Support



## Stay in touch

- Author - 
- Website - 
- Twitter - 

## License
