#!/bin/sh

docker build -t garnetalpha-on.azurecr.io/captive-portal .
docker push garnetalpha-on.azurecr.io/captive-portal
