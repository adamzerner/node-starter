# NodeStarter

If you're starting a project, there are usually some standard things that you'll need: accounts, payments, route protection, etc. The idea with NodeStarter is to provide you with all of this boilerplate.

Note: This repo is only for serve-side code. For client-side code, it works in conjunction with [VueStarter](https://github.com/adamzerner/vue-starter). You can of course use a different frontend.

## What it comes with

See https://github.com/adamzerner/vue-starter#what-it-comes-with.

## Getting started

### First steps

1. `git clone git@github.com:adamzerner/node-starter.git your-apps-name`
2. `yarn install`
3. Run your database locally. Eg. with `mongod`.
4. Create `.env` and set the following environment variables: `PORT`, `NODE_ENV`, `MONGODB_URI` (different if you're using a different database), `EXPRESS_SESSION_SECRET`, `BASE_API_URL` and `BASE_CLIENT_URL`. My defaults are below.
5. `yarn start`

#### My .env defaults

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost/node-starter
EXPRESS_SESSION_SECRET=foobar
BASE_API_URL=http://localhost:3000
BASE_CLIENT_URL=http://localhost:8080
```

#### Connecting to the database

It attempts to connect to a database based on the environment variable `MONGODB_URI`. See `init/connect-to-db.js`.

If you [need](https://stackoverflow.com/questions/7948789/mongod-complains-that-there-is-no-data-db-folder) to set the `--dbpath`, there is a `start-db` script in `package.json` that you can use. Be sure to adjust the path based on where you have mongo set up on your machine.

### Nodemailer

This app [uses](https://nodemailer.com/about/#tldr) [Ethereal](https://ethereal.email/) to deal with emails in development. Instead of actually sending them, Ethereal intercepts them and provides you with a link to view the would-be email.

Create an account with Ethereal and fill in `config/mail.js` with your details.

### [Prettier](https://prettier.io/)

If you want it:

1. Make whatever [adjustments](https://prettier.io/docs/en/configuration.html) you want to `.prettierrc`.
2. Make sure that you have a [plugin](https://prettier.io/docs/en/editors.html) set up with your editor.

If you don't:

1. Remove `.prettierrc`.

### SSO

If you want it:

- You have to create and configure stuff in developer console for Google, Twitter and LinkedIn. Go to the corresponding Passport strategy packages to see some direction for how to do that.
- Gotchas:
  - For Twitter make sure you enable email access.
  - For LinkedIn you need to add the "Sign In with LinkedIn" product in order to have access to the users email.

If you don't:

1. `yarn remove passport-google-oauth20 passport-linkedin-oauth2 passport-twitter`
2. Remove `routes/sso`, adjust `routes/index.js`, and remove stuff from the `passport` folder.
3. `cmd+f` and remove `googleId`, `twitterId`, and `linkedinId`.

### Stripe

This codebase uses Stripe checkout. See https://stripe.com/docs/payments/checkout/accept-a-payment and https://github.com/stripe-samples/checkout-one-time-payments/tree/master/client-and-server/server for more information.

If you want it:

1. Create an account.
2. Create a project.
3. [Create a product and price](https://stripe.com/docs/payments/checkout/accept-a-payment#create-products-and-prices). This codebase uses a product called "Basic Plan" and second called "Premium Plan" but you can use whatever you want. The important part is setting the `STRIPE_BASIC_PLAN_PRICE_ID` and `STRIPE_PREMIUM_PLAN_PRICE_ID` environment variables based on the price ids.
4. To [confirm the payment is successful](https://stripe.com/docs/payments/checkout/accept-a-payment#payment-success), this codebase is using webhooks. To set up a webhook, go to https://dashboard.stripe.com/test/webhooks and add a webhook with the endpoint `https://your-production-domain.com/user/checkout-webhook`. Then set the environment variable `STRIPE_WEBHOOK_SECRET` to the "Signing secret".
5. To test in development you'll need to [forward the webhooks to your local server](https://stripe.com/docs/payments/checkout/accept-a-payment#testing-webhooks-locally). The `yarn forward-stripe-webhook` script will do that for you.

If you don't:

1. Remove `stripeCustomerId` in `models/User/index.js` and elsewhere (use `cmd+f`).
2. Remove `verify` from `init/add-middleware.js`.
3. Remove `emails/purchase-confirmation-email.js` and `services/send-purchase-confirmation-email.js`.
4. Remove the `checkout-session` and `checkout-webhook` routes in `routes/user`.

## Deploying

See https://devcenter.heroku.com/articles/deploying-nodejs.

- You'll need a production database. I like the [mLab MongoDB](https://devcenter.heroku.com/articles/mongolab) add-on in Heroku.
- Be sure to set your environment variables in production.
  - `MONGODB_URI` should be set for you automatically if you use the `mLab MongoDB` add on.
  - You'll have to set `NODE_ENV`, `BASE_API_URL` and `BASE_CLIENT_URL` to their production values.
  - For the `EXPRESS_SESSION_SECRET`, use a [random string of characters](https://github.com/expressjs/session#secret).
  - For the SSO stuff, it'll be the same as what's in your `.env`.
  - For Stripe you're going to want to use a production value for all of the values. For `STRIPE_WEBHOOK_SECRET` [get it](https://stripe.com/docs/webhooks/signatures) from the webhook dashboard page.
- Be sure to set the correct callback URLs for SSO.
