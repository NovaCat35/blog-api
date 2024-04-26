### Project: BLOG API

# Lighthouse Chronicles API

Life is a beautiful mix of distractions, occasional depressions, and joyful moments. For all its worth, we offer gain to learn and hear stories those before us and with us now. Join me as I seek to collect insights from all walks of lives while I try to make sense of my own. 🧳

This project is a current work in progress  ⚠️

## Challenges 🔥
One significant challenge I encounter was setting up controller and routes. This challenge involved handling various HTTP methods, parsing request bodies, and validating authorization from headers while dealing with different responses. To address some of the issues with connection, I used postman to help correct some logic controller errors without having to create the entire client-side from scratch on local server. I also try to separate out the abstraction with authentication, passport logics, and validation in their respective files to help in maintaining clean and organized code for handling different API endpoints effectively.

Currently, another challenge is trying to connect both the client and server side with using fetch and JWT...

## Installation Guide ⚙️

### Development

> Type in terminal the following :

```
express members-only --view=ejs
cd members-only
npm install
npm install dotenv --save
npm install passport
npm install passport-local
npm install express-session
npm install mongoose
npm install express-async-handler
npm install express-validator
npm install node-sass-middleware <might not need this anymore bc of script in package.json>
npm install express sass
npm install bcryptjs
npm install luxon (IF TYPESCRIPT: npm install --save @types/luxon)
npm install express jsonwebtoken
npm install passport-jwt
npm install cors
```

> Reminder to check app.js for all added changes

### Installing TypeScript & Nodemon:

> Type in terminal the following :

```
npm i -D typescript @types/express @types/node
npx tsc --init
npm install --save-dev ts-node nodemon
```

> 1. Adjust tsconfig.json: uncomment "outDir", "allowJs", and change "outDir": "./dist"

> 2. Run tsc (npx tsc/npm run build) to transpile your TypeScript files to JavaScript. From step 1, we will output this in "./dist". It may be better to just directly link this to script everytime we run devstart

### Production

> Type in terminal the following :

```
npm install compression
npm install helmet
npm install express-rate-limit
```

> Reminder to change env variables(within host provider) & set node version in our package.json & NODE_ENV = "production"

> NOTE: You must build or transpile the TypeScript files for production environment. Run `npm run build`. Note any path you have to /src may need to be changed to /dist for production.
