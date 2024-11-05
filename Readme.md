# Hostel Allocation Software

## Description:

This is an application created to manage and allocate hostel spaces to students of a Nigeria University. The application was built for the client and they later decided not to use the application. It might come in useful to someone ,that's why I am making this open-source. The readme is a work in progress.

The application was created using the following technologies:
* NODEJS
* React
* MongoDB
* Redis 
* Docker
* Docker-Compose

## Getting Started:

Install Docker and Docker-Compose on your development machine. 

Create a network for the services to be run in the docker-compose configurarion file:

> docker network create mongo_network

Check if the ports used in the servise are opened in your dev machine:

You can check like this in :

On Linux / macOS

> lsof -i :<port-number

On Windows:

> netstat -an | findstr :<port-number>


To build and start the project run: 
>  docker compose -f "docker-compose-dev.yml" up -d --build 


Login as an admin using the credentials below:

> username: jamiebones147@gmail.com | password: blazing147

