# Praxis Matrix Client - Chat-Based CDM

Praxis is a chat-based collaborative decision-making (CDM) app that seamlessly blends informal discussion with structured democratic processes. Built on the Matrix protocol for federated, decentralized communication, this tool allows groups to transition smoothly from informal conversation to structured decision-making without breaking flow.

Designed for organizations, teams, and communities that need robust group decision-making capabilities, it combines the familiarity of messaging apps with powerful decision-making features like inline proposals, multiple voting models, and forum-style organization when needed. The frontend is built with React and the Matrix JS SDK, while the backend leverages the [Synapse](https://github.com/element-hq/synapse) homeserver implementation (Python) and a custom application service for validation and extended functionality.

See the [Praxis CDM Service](https://github.com/praxis-org/praxis-cdm-service) repository for more information.

## Work in progress

You are entering a construction yard. Things are going to change and break regularly as the project is still getting off the ground. Please bear in mind that Praxis is not yet intended for serious use outside of testing or research purposes. Your feedback is highly welcome.

Please note that this is also an experimental approach within the Praxis project. The main repository is located at https://github.com/praxis-app/praxis.

## Installation and setup

Ensure that you have [Node.js](https://nodejs.org/en/download) v22.11.0 installed on your machine before proceeding.

```bash
# Install project dependencies
$ npm install

# Copy environment variables
$ cp .env.example .env
```

## Running the app

```bash
# Run the app in development mode
$ npm run dev
```

## Building the app

```bash
# Build the app for production
$ npm run build
```
