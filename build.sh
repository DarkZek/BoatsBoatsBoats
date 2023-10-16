#!/bin/bash
cd ./RecommendationService
npm i
cd ../Server
npm i
cd ../OAuthService
npm i
cd ..

cp .env ./OAuthService/
cp .env ./Server/
cp .env ./RecommendationService/