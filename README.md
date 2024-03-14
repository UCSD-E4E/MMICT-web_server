# Mangrove Monitoring Server

This is code to run a web server for the Mangrove Monitoring Project.

## Getting Started

Before starting the server, start the docker network by running the command `docker network create -d bridge --subnet=172.18.0.0/16 --gateway=172.18.0.1 mmict_bridge`

Then `cd` into `MMICT-web_server` and build the Docker image for the web server with `docker build -t mangrove-web-server .`

To start the server run the command `docker-compose up`

To stop the server run the command `docker-compose down`

## Create A .env File
Create a file called .env and paste in the following information:
- PORT=8000
- MONGO_CONNECTION_STRING=mongodb://mongo:27017/mangrove_db (docker container)
- AWS_REGION=us-west-2
- AWS_BUCKET_NAME=mangrove-monitoring-images
- AWS_ACCESS_KEY=**ASK IN THE CHANNEL**
- AWS_SECRET_ACCESS_KEY=**ASK IN THE CHANNEL**
