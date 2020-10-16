# Web Push Tryout
Demo backend + frontend for implementing push notifications using service workers

Most of the frontend is a modified version of the code from [web-push codelabs](https://developers.google.com/web/fundamentals/codelabs/push-notifications). But it also adds support for sending notification, unsubscription and saving/deleting the subscription from db

Built with Typescript + Express + Pg-Promise (Postgresql) + EJS

The backend uses [web-push](https://www.npmjs.com/package/web-push) to handle the web push setup and notifications

# Usage
* Clone the repo using `git clone https://github.com/TotallyNotChase/web-push-tryout.git`
* `cd` into `web-push-tryout`
* Execute `npm i` to set up the packages
* Execute `./node_modules/.bin/web-push generate-vapid-keys` and save the output for later use
* Set up the user configurations, create a file named `userconfig.json` inside `web-push-tryout`

  The format of the JSON should be-
  ```json
  {
    "NAME": <app_name>,
    "PORT": <port_to_assign_the_server_on>,
    "ENV": "development"/"production",
    "DB_CONNECTION": {
      "host": <postgres_host>,
      "port": <postgres_port>,
      "database": <database_name>,
      "user": <postgres_username>,
      "password": <postgres_userpass>
    },
    "PUBLIC_VAPID_KEY": <Public_VAPID_key_generated_from_web-push>,
    "PRIVATE_VAPID_KEY": <Private_VAPID_key_generated_from_web-push>,,
    "WEB_PUSH_CONTACT": <mailto_link_to_an_email_to_be_associated_with_web_push>
  }
  ```

  <table>
  <tr>
    <th>Fieldname</td>
    <th>Description</td>
  </tr>
  <tr>
    <td>

    `NAME`

    </td>
    <td>

    The name of the webapp - can be whatever 

    </td>
  </tr>
  <tr>
    <td>

    `PORT`

    </td>
    <td>

    The port to assign the webserver on (should be a number - not string)

    </td>
  </tr>
  <tr>
    <td>

    `ENV`

    </td>
    <td>

    The environment to run the express server on - usually `development`

    </td>
  </tr>
  <tr>
    <td>

    `DB_CONNECTION`

    </td>
    <td>

    Postgre DB connection object

    `host` is usually `"localhost"` and `port` is `5432` (should be a number - not string) for a default configured postgre server running locally

    `database` should be a **newly created** database on the server

    `user` and `password` are the credentials for the postgre user

    </td>
  </tr>
  <tr>
    <td>

    `PUBLIC_VAPID_KEY`

    </td>
    <td>

    Public VAPID key generated from `web-push generate-vapid-keys` on one of the previous steps

    </td>
  </tr>
  <tr>
    <td>

    `PRIVATE_VAPID_KEY`

    </td>
    <td>

    Private VAPID key generated from `web-push generate-vapid-keys` on one of the previous steps

    </td>
  </tr>
  <tr>
    <td>

    `WEB_PUSH_CONTACT`

    </td>
    <td>

    A `mailto` link to the mail contact associated with the server - should look like `mailto: <youremail>`

    </td>
  </tr>
  </table>

* Execute `npm run build` to build the project

  This will transpile or the typescript files into javascipt and put them into `dist/`

  It also moves any other necessary non-typescript files from `src/` to `dist/` (handled by `copyRes.js`)

* Execute `npm run serve` to run the server

# Tour of the source code
All the backend code related stuff is in `src/`, static assets for the frontend are in `assets/`

## Backend files
<table>
<tr>
  <th>Component</td>
  <th>Description</td>
</tr>
<tr>
  <td>
  
  `controllers/`
  
  </td>
  <td>
  
  Controllers for different routes
  
  </td>
</tr>
<tr>
  <td>
  
  `database/`
  
  </td>
  <td>
  
  Component that manages low level SQL queries using pg-promise and exposes a high level, ORM-like API to be used by the app
  
  </td>
</tr>
<tr>
  <td>
  
  `database/`
  
  </td>
  <td>
  
  Component that manages low level SQL queries using pg-promise and exposes a high level, ORM-like API to be used by the app

  `database/models/` - Types that describe the model of the tables

  `database/repos/` - Classes that handle collection of closely related table(s) and expose the high level API to be used by the app

  `database/sql/` - SQL query files and objects for each collection of closely related table(s), grouped by folder
  
  </td>
</tr>
<tr>
  <td>
  
  `middleware/`
  
  </td>
  <td>
  
  Handles middleware configuration and exposes middleware objects to be used by the app
  
  </td>
</tr>
<tr>
  <td>
  
  `routers/`
  
  </td>
  <td>
  
  Routers that map controllers to corresponding routes - exposes a router object to be used by the app
  
  </td>
</tr>
<tr>
  <td>
  
  `types/`
  
  </td>
  <td>
  
  Extra types used across the project
  
  </td>
</tr>
<tr>
  <td>
  
  `webpush-handler/`
  
  </td>
  <td>
  
  Component that has the web-push API exposed to itself

  Manages the web-push calls
  
  </td>
</tr>
</table>

## Frontend files
The only files that need to be discussed about are the `index.ts` and `sw.ts` files that handle all the push notifications on the frontend side

### index.ts
Makes sure the browser supports push notifications

Initiallized the UI, based on initial state of subscription

Sets up handlers for the subscribe and push buttons

This is more or less a modified version of the codelabs `main.js`, except it adds support for communicating with the backend through `updateSubscriptionOnServer`, `deleteSubscriptionOnServer`, `initiatePushOnServer`. It also adds support for unsubscription on both the frontend and backend, as well as sending the notification itself through the backend.

### sw.ts
Service worker file that sets up event listener for the push notification to be sent
