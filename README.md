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
- MONGO_CONNECTION_STRING=mongodb://mongo:27017/mangrove_db
- AWS_REGION=us-west-2
- AWS_BUCKET_NAME=mangrove-monitoring-images
- AWS_ACCESS_KEY=**ASK IN THE CHANNEL**
- AWS_SECRET_ACCESS_KEY=**ASK IN THE CHANNEL**

## General Overview

To run, simply do `npm run dev`  
You will know it is working if you get the line  
`Database connected: mongodb+srv://headHoncho:pmbrjDh5HgN2ySrZ@mmict.qvtwcsp.mongodb.net/?retryWrites=true&w=majority`.  
/users is routed to have uploadUser, getUser, getImages, and getClassifications while /upload has uploadImage (uploadToS3) and uploadClassification.  