#!/bin/bash
cd RecommendationService 
npm run start &
cd ../OAuthService
npm run start &
cd ../Server
npm run start