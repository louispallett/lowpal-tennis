# Tennis Tournament Creator

![Server Tests](https://github.com/louispallett/lowpal-tennis/actions/workflows/main.yml/badge.svg)
![Static Badge](https://img.shields.io/badge/license-GPL2.0-green?style=flat&logo=license)

[![A screenshot of the home page of the website. An indigo background with the website title at the top of the page. Underneath are two tennis rackets crossed at their handles, with buttons for 'Register' and 'Login' underneath. To the right handside, a silhouette of a women looking left, holding a racket in her hand.](https://res.cloudinary.com/divlee1zx/image/upload/v1757927457/Screenshot_From_2025-09-15_10-09-24_jkx6pc.png)](https://www.tennistournamentcreator.com)

## Purpose

_Tennis Tournament Creator_ is a web application with the aim of simplifying the running of and participation in tennis tournaments by both hosts and players.

It aims to take various tasks, such as registration of players, creation of teams and matches, allocation of players to matches, and 

## Tech 

This is a full stack NextJS application built with TypeScript and React, as well as [MongoDB](https://www.mongodb.com/) to store data.

A full list of technologies can be found in the package.json [file](https://github.com/louispallett/lowpal-tennis/package.json). However, some highlights are:

### _Client_
- [Axios](https://github.com/axios/axios): Promise based HTTP client for simplifying requests to the server.
- [country-codes-list](https://www.npmjs.com/package/country-codes-list): A moduule with list of codes per country and their country calling code, for sign-up forms.
- [React](https://react.dev/): The popular frontend library. React Component Libraries include:
    - [react-hook-form](https://www.react-hook-form.com/): Collates form data and improves client-side error handling.
    - [react-router](https://reactrouter.com/): Client-side routing in React.
    - [react-tournament-bracket](https://github.com/g-loot/react-tournament-brackets): A specialized React component library for presenting tournament brackets dynamically.
### _Server_
- [bcrypt](https://www.npmjs.com/package/bcrypt): A hashing library for passwords.
- [luxon](https://github.com/moment/luxon): JavaScript library for working with dates and times.
- [mongoose](https://mongoosejs.com/): Object Data Modeling library for MongoDB and Node.js.
- [nodemailer](https://www.nodemailer.com/): Node.js module for automated emailing.
- [zod](https://zod.dev/): TypeScript-first schema validation with static type inference
- Developer Dependencies:
    - [jest](https://jestjs.io/): JavaScript testing framework. 
    - [nodemon](https://nodemon.io/): Node.js dev tool to automatically restart servers during development.

## Version 3.0.3
Version 3 has migrated the application over to NextJS and TypeScript. As with version 2, all users can now host and join multiple tournaments. 

Hosts can:
- Create tournaments.
- Assign seeds and rankings to players.
- Generate teams.
- Generate matches and tournament brackets, assigning players according to a personal [seeding](https://en.wikipedia.org/wiki/Seeding_(sports)) algorithm.
- Move tournaments between stages ('Sign-up', 'Draw', 'Play', and 'Finished').

Players can:
- Join tournaments.
- See their own teams and matches, as well as full tournament bracket(s).
- Update match results, and automatically be moved to the next match.
