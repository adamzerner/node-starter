### Connecting to the database

First, make sure you start the database locally on your machine using `mongod`. If you need to set the `--dbpath`, there is a `start-db` script in `package.json` that you can use. Be sure to adjust the path based on where you have mongo set up on your machine.

It attempts to connect to a database based on the environment variable `MONGODB_URI`. This variable is initially set to `mongodb://localhost/node-starter`, so you're going to want to substitute out the `node-starter` part for your project's name. You'll also have to make sure to set this environment variable properly in your production environment as well.

### Stripe

- Using Stripe Checkout
- Uses webhooks. Need to run `yarn forward-stripe-webhook` to test in development.
- Need to fill in various environment variables.