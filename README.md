# Mangrove Monitoring Server

This is code to run a web server for the Mangrove Monitoring Project.

## Building the Web Server
Before starting the server, start the docker network by running the command `docker network create -d bridge --subnet=172.18.0.0/16 --gateway=172.18.0.1 mmict_bridge`

Then `cd` into `MMICT-web_server` and build the Docker image for the web server with `docker build -t mangrove-web-server .`

## Building the image processing service
`cd` into `MMICT-ip_service/ip-docker` and build the Docker image with `docker build -t ip_service .`

## Running the dummy-upload pipeline
Because of default port mapping rules on the `mmict_bridge` network created above, currently, the services must be ran *specifically* in the following order. This may no longer be the case once Hou's network is up and running, so this is simply a nice and easy way to run all of the services together (and hopefully we can do away with this in the coming days with a docker-compose). 

Note: I would advise opening a terminal for each service instead of cd-ing into them, as you'll likely want be repeating this process if you're adding features / fixing issues / etc.

1. In `MMICT-ip_service/ip-docker`, start up the ip-service with `docker run -p 8080:5000 --net=mmict_bridge ip_service`

Note: before carrying out step (2), wait until the console prints the warning about werkzeug when running the ip-service. Otherwise, the web server may finish starting up before the ip-service, in which case port mapping issues may occur.

2. In `MMICT-web_server`, start up the web server with `docker-compose up`

3. In `MMICT-frontend`, start up the frontend with `npm start`

## Create A .env File
Create a file called .env and paste in the following information:
- PORT=8000
- MONGO_CONNECTION_STRING=mongodb://mongo:27017/mangrove_db
- AWS_REGION=us-west-2
- AWS_BUCKET_NAME=mangrove-monitoring-images
- AWS_ACCESS_KEY=**ASK IN THE CHANNEL**
- AWS_SECRET_ACCESS_KEY=**ASK IN THE CHANNEL**
