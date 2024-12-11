# Tennis Tournament by LowPal


![Static Badge](https://img.shields.io/badge/build-passing-brightgreen?style=flat&logo=license)
![Static Badge](https://img.shields.io/badge/license-GPL2.0-green?style=flat&logo=license)

---

![]()

---

_Tennis Tournament by LowPal_ is a web application with the aim of simplifying the running of and participation in tennis tournaments by both hosts and players. It has already been used by a local club in the running of their own In-House tournament.

## Tech 

This is a full stack application written in Node.js (Express) for the backend and using React for the frontend (utilising client-side rendering via React-Router), as well as [MongoDB](https://www.mongodb.com/) to store data.

A full list of technologies can be found in the package.json files for the [server](https://github.com/louispallett/lowpal-tennis/blob/main/server/package.json) and the [client](https://github.com/louispallett/lowpal-tennis/blob/main/client/package.json). However, some highlights are:

### _Client_
- [Axios](https://github.com/axios/axios): Promise based HTTP client for simplifying requests to the server.
- [country-codes-list](https://www.npmjs.com/package/country-codes-list): A moduule with list of codes per country and their country calling code, for sign-up forms.
- [React](https://react.dev/): The popular frontend library. React Component Libraries include:
    - [react-hook-form](https://www.react-hook-form.com/): Collates form data and improves client-side error handling.
    - [react-router](https://reactrouter.com/): Client-side routing in React.
    - [react-tournament-bracket](https://github.com/g-loot/react-tournament-brackets): A specialized React component library for presenting tournament brackets dynamically.
### _Server_
- [bcrypt](https://www.npmjs.com/package/bcrypt): A hashing library for passwords.
- [Express](https://expressjs.com/): Web framework for Node.js.
- [luxon](https://github.com/moment/luxon): JavaScript library for working with dates and times.
- [mongoose](https://mongoosejs.com/): Object Data Modeling library for MongoDB and Node.js.
- [nodemailer](https://www.nodemailer.com/): Node.js module for automated emailing.
- [passport](https://www.npmjs.com/package/passport): Express-compatible authentication middleware to authenticate requests via strategies.
- Developer Dependencies:
    - [jest](https://jestjs.io/): JavaScript testing framework. 
    - [nodemon](https://nodemon.io/): Node.js dev tool to automatically restart servers during development.

## Version 1.0.0
This allows players to:
- Sign up to a tournament
- Express interest in categories
- View their matches and submit results
- View tournament brackets

Version 1.0.0 does not currently support frontend hosting functionality. However, once players have signed up, the server supports:
- Automated creation of teams
- Automated creation of matches and allocation of participants based on player-rankings (i.e., ensuring the top eight players are able to play in the quarter-finals if they all play according to their ability, the top four in the semi-finals, and the top two in the finals).
- Dynamic displaying of tournament brackets for each category through a React Component Library.