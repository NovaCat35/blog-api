# Wayfarer's Frontier (API)

Life is a beautiful mix of ups and downs. For all its worth, I like to sort out my thoughts, post some projects I'm working on, and collect insights from all walks of life while I try to make sense of my own. 🧳

> Welcome to the backend API! This repo was made using Mongoose & MongoDB, though I may intend to go back and rewrite everything using PostgreSQL as the ODIN Project updated quite a few lessons by the time I finished this project.

## Project Links 🔗

- [Live Demo](https://wayfarers-frontier.pages.dev/)
- [Frontend Client](https://github.com/NovaCat35/blog-client)
- Backend API _(You are here)_
- [CMS](https://github.com/NovaCat35/blog-cms)

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
One notable challenge I faced was setting up controllers and routes. This task involved managing various HTTP methods, parsing request bodies, and validating authorization through headers while handling diverse responses. To tackle connectivity issues and logic errors in controllers, I utilized Postman to debug and refine the logic without needing to fully develop the client side on the local server. Additionally, I made efforts to maintain a clean and organized codebase by segregating authentication, Passport logic, and validation into separate files, which aided in effectively managing different API endpoints.

Another challenge that emerged was during the process of connecting the client and server sides using fetch and JWT. Although Postman helped in testing route calls and logic, issues arose when implementing the client-side due to asynchronous login implementation, leading to error messages. I had to rewrite some logic to accompany an earlier failed test with a deliberately wrong authorization request. Please note, for authentication with JWT, see this video for a helpful reminder: https://www.youtube.com/watch?v=7nafaH9SddU . Also, please take a look at the official doc for passport.js with JWT authentication.


Status errors due to incomplete logic (i.e. 404, 504) also confused me. This happened when working with forms and fetch requests on the client side, which I surmise is correct. Using Postman, I carefully debug my code using POSTMAN as a way to see the result of my requests. This helped me figure out where the issue was.

During production, Google flagged authentication login/sign-up routes for potential security issues. Working with the Google Search Console tool, I reworked some parts and reviewed code in this area to prevent these security leaks in the future.

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
npm install --save multer
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

> 2. Run tsc (npx tsc/npm run build) to transpile your TypeScript files to JavaScript. From step 1, we will output this in "./dist". It may be better to just directly link this to script every time we run devstart. 

### Production

> Type in terminal the following :

```
npm install compression
npm install helmet
npm install express-rate-limit
```

> Reminder: change env variables(within host provider) & set node version in our package.json & NODE_ENV = "production" 

> Reminder: After running npm run build (e.g. ts -> js) you need to change the routes from "./src/..." to "./dist/..."

> NOTE: You must build or transpile the TypeScript files for production environment. Run `npm run build`. Note any path you have to /src may need to be changed to /dist for production.

> NOTE: To connect github with Fly.io: https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/

> NOTE: fly launch -> connect github -> plug in .env on production & make ts transpile to js & change route "src" to "dist" in app.js -> fly deploy https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/
