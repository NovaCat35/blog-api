# Wayfarer's Frontier (API)

Life is a beautiful mix of distractions, occasional depressions, and joyful moments. For all its worth, we offer gain to learn and hear stories those before us and with us now. Join me as I seek to collect insights from all walks of lives while I try to make sense of my own. 

This project is a current work in progress  ⚠️ 

## Project Links 🔗

- Live Demo: work in progress
- [Frontend Client](https://github.com/NovaCat35/blog-client)
- Backend API _(You are here)_

## Technologies Used 🚀
- **Backend:** Node.js, Express.js, TypeScript
- **Stylesheet Language:** SCSS
- **View Engine:** EJS
- **Database:** MongoDB

## Hosting Platforms 🌐
- [fly.io](https://fly.io): for deploying and hosting the application
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): for cloud-based MongoDB hosting
- [Cloudinary](https://cloudinary.com): for hosting and managing images

## Challenges 🔥
One notable challenge I faced was setting up controllers and routes. This task involved managing various HTTP methods, parsing request bodies, and validating authorization through headers while handling diverse responses. To tackle connectivity issues and logic errors in controllers, I utilized Postman to debug and refine the logic without needing to fully develop the client-side on the local server. Additionally, I made efforts to maintain a clean and organized codebase by segregating authentication, Passport logic, and validation into separate files, which aided in effectively managing different API endpoints.

Another challenge that emerged was during the process of connecting the client and server sides using fetch and JWT. Although Postman helped in testing route calls and logic, issues arose when implementing the client-side due to asynchronous login implementation, leading to error messages. I had to rewrite some logic to accompany earlier failed test with deliberate wrong authorization request.

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
npm install cloudinary
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
