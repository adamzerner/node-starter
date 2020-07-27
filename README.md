# NodeStarter

If you're starting a project, there are usually some standard things that you'll need: accounts, payments, route protection, etc. The idea with NodeStarter is to provide you with all of this boilerplate.

Note: This repo is only for serve-side code. For client-side code, it works in conjunction with [VueStarter](https://github.com/adamzerner/vue-starter). You can of course use a different frontend.

## What it comes with

See https://github.com/adamzerner/vue-starter#what-it-comes-with.

## Getting started

### First steps

1. [Generate your own template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) and then clone. Or clone from this repo with `git clone git@github.com:adamzerner/node-starter.git your-apps-name` and then set your `git remote` properly.
2. `yarn install`
3. Change the `name` in `package.json`
4. Update stuff in `emails` to use your app's name instead of Node Starter
5. Run your database locally. Eg. with `mongod`.
6. Create `.env` and set the following environment variables: `PORT`, `NODE_ENV`, `MONGODB_URI` (different if you're using a different database), `EXPRESS_SESSION_SECRET`, `BASE_API_URL` and `BASE_CLIENT_URL`. My defaults are below.
7. `yarn start`

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

This app [uses](https://nodemailer.com/about/#tldr) [Ethereal](https://ethereal.email/) to deal with emails in development. Instead of actually sending them, Ethereal intercepts them and provides you with a link to view the would-be email. Create an account with Ethereal and fill in `config/mail.js` with your details.

### [Prettier](https://prettier.io/)

If you want it:

1. Make whatever [adjustments](https://prettier.io/docs/en/configuration.html) you want to `.prettierrc`.
2. Make sure that you have a [plugin](https://prettier.io/docs/en/editors.html) set up with your editor.

If you don't:

1. Remove `.prettierrc`.

### SSO

If you want it:

- For Google:
  1. Go to the [developer console](https://console.developers.google.com).
  2. Create a project.
  3. Set up your OAuth Consent Screen.
  4. Create an OAuth 2.0 Client ID.
  5. For "Authorized JavaScript origins", use your value for `BASE_CLIENT_URL` (development and production).
  6. For "Authorized redirect URIs", use use your value for `BASE_API_URL` (development and production) and then add `/sso/google/callback`. Eg. `http://localhost:3000/sso/google/callback` and `https://nodestarter.herokuapp.com/sso/google/callback`.
  7. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` according to what you're given.
- For Twitter:
  1. Go to the [developer console](https://developer.twitter.com/en/apps).
  2. [Create](https://developer.twitter.com/en/apps/create) an app.
  3. Make sure you enable sign in with Twitter.
  4. For "Callback URLs", use your value for `BASE_API_URL` (development and production) and then add `/sso/twitter/callback`. Eg. `http://localhost:3000/sso/twitter/callback` and `https://nodestarter.herokuapp.com/sso/twitter/callback`.
  5. Once created, go to the "Keys and tokens" tab, and use the "Consumer API keys" values for `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` respectively.
  6. Go to the "Permissions" tab, click "Edit", check off "Request email address from users" under "Additional permissions" and click "Save".
- For LinkedIn:
  1. Go to the [developer console](https://www.linkedin.com/developers/).
  2. [Create](https://www.linkedin.com/developers/apps/new) an app.
  3. Go to the "Auth" tab and use "Client ID" and "Client Secret" for your `LINKEDIN_KEY` and `LINKEDIN_SECRET` environment variables respectively.
  4. For "Authorized redirect URLs for your app", use your value for `BASE_API_URL` (development and production) and then add `/sso/linkedin/callback`. Eg. `http://localhost:3000/sso/linkedin/callback` and `https://nodestarter.herokuapp.com/sso/linkedin/callback`.
  5. Go to the "Products" tab and add "Sign In with LinkedIn".

If you don't:

1. `yarn remove passport-google-oauth20 passport-linkedin-oauth2 passport-twitter`
2. Remove `routes/sso`, adjust `routes/index.js`, and remove stuff from the `passport` folder.
3. `cmd+f` and remove `googleId`, `twitterId`, and `linkedinId`.

### Stripe

This codebase uses Stripe checkout. See https://stripe.com/docs/payments/checkout/accept-a-payment and https://github.com/stripe-samples/checkout-one-time-payments/tree/master/client-and-server/server for more information.

If you want it:

1. Register/log in.
2. Create a new account/project.
3. Under "Get your test API keys", use the value for "Secret key" for your `STRIPE_API_KEY` environment variable ("Publishable key" is for the client-side codebase).
4. [Create a product and price](https://stripe.com/docs/payments/checkout/accept-a-payment#create-products-and-prices). This codebase uses a product called "Basic Plan" and second called "Premium Plan" but you can use whatever you want. The important part is setting the `STRIPE_BASIC_PLAN_PRICE_ID` and `STRIPE_PREMIUM_PLAN_PRICE_ID` environment variables based on the price ids.
5. To [confirm the payment is successful](https://stripe.com/docs/payments/checkout/accept-a-payment#payment-success), this codebase is using webhooks. To set up a webhook, go to https://dashboard.stripe.com/test/webhooks and add a webhook with the endpoint `https://your-production-domain.com/user/checkout-webhook`. Under "Events to send" add the "checkout.session.completed" event and then click "Add endpoint" at the bottom right.
6. Then set the environment variable `STRIPE_WEBHOOK_SECRET` to the "Signing secret".
7. To test in development you'll need to [forward the webhooks to your local server](https://stripe.com/docs/payments/checkout/accept-a-payment#testing-webhooks-locally). The `yarn forward-stripe-webhook` script will do that for you.

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
- Fill in `productionTransportOptions` in `config/mail.js`. My goto is to use Zoho Mail.
