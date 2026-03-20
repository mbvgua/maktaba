FROM mysql:latest

# best practise for app working directory
WORKDIR /usr/src/app

# mysql port to be used locally
EXPOSE 3307

# seed the db schema
# NOTE: eveyrtime you rebuild the docker container again 
# rebuild the image to ensure new schema in containers
COPY db.sql /docker-entrypoint-initdb.d/
