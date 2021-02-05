
# movie_factory_api

## Project setup 

`
npm install
`

### Compiles and hot-reloads for development 

`
npm run start 
`

### Compiles and minifies for production

npm run build


### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

---

# dependencies

- axios for the requesting API
- bcrypt to hash the password 
- body-parser to parse incoming request bodies in a middleware before your handlers, available under the req.body property 
- dotenv to load environment variables from a .env file
- express framework to build web applications with Node JS
- JsonWebToken to secure the token
- Mongoose framework to connect NodeJs and the database MongoDB
- nodemailer to send emails
- Swagger framework for API
- cors for interaction between browser and server 
- vue router to initialize routing inside the SPA

---

# Entry point

    Entry point of the application is index.js

    We import inside this file modules of NodeJS body-parser, cors, dotenv, the router, Express and Mongoose.

---

# Routes

## middleware.js

    This route allows to verify the token.

## movieRouter.js

    This route allows to send our requests to select movies by id, by categoy, by year, by title, by actor and import the video from the database if we are connected. 

## userRouter.js

    This route allows to send our requests to login by email adress and password. The input data are compared with the database data. If we create a new account or change our password, the new data are recorded into the database. 
    This route allows to send our requests to add informations about user into the database like add a favorite movie or remove it and add a seen movie or remove it.

### Methods inside

post(): this methods allows to create an information one time.
put(): this methods allows to create an information several times.

---