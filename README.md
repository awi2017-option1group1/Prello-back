# Prello-back
Prello's back-end application.

[![CircleCI](https://circleci.com/gh/awi2017-option1group1/Prello-back/tree/master.svg?style=svg)](https://circleci.com/gh/awi2017-option1group1/Prello-back/tree/master)

- - - - - - - - -
## Requirements:
- `Node >= 8`
- `Npm >= 5`
- `TypeORM = 0.11` (TypeORM is young and still under development. Breaking changes can be introduced regularly. Thus, the version is very important.)
- `Redis >= 4.0.2`
- `PostgreSQL >= 10`
- UNIX systems (Linux or iOS) are preferred

- - - - - - - - -

## Installation

- Clone the github repository. 

    `git clone https://github.com/awi2017-option1group1/Prello-back` 

- Install the dependencies for development mode

	`npm install`

- - - - - - - - -

## Execution

- Configure then source the `.env.dev` file

    `source .env.dev`
- Run the database migrations

    `npm run build && npm run migrations`

- To run the application in development mode (need the back-end up and running) 

    `npm run start:dev`

You should be able to see an healthcheck at localhost:5000 (if you did not change the port).
See nginx installation part to finish the setup.

- To run the application in production mode (need the back-end up and running) 

	`npm run build && npm start`

- To run the tests (you should create the test database first)

	`npm test`

- - - - - - - - -

## Dependencies

- Prello back end application is written in `Typescript`.  
- It is built with `Express`.
- We use `TypeORM` as ORM for the application.  
- To test the application we use `Jest`.

- - - - - - - - -

## Contributing

Please follow the Google Angular guidelines: 
[Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)

## Useful links to look at before contributing
- [TypeORM documentation](http://typeorm.io/#/)

