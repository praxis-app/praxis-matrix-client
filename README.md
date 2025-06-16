# Praxis Matrix Client - Chat-Based CDM

A chat-based collaborative decision-making (CDM) app that seamlessly blends informal discussion with structured democratic processes. Built on the Matrix protocol for decentralized, censorship-resistant organizing, this tool would allow groups to transition smoothly from conversations to proposals without breaking flow. Designed for worker union formation, grassroots political organizing, and direct action coordination, it combines the familiarity of messaging apps with powerful decision-making features like inline proposals, voting mechanisms, and forum-style organization when needed. The frontend will be built with React, Vite, and the Matrix JS SDK, while the backend will either leverage the Synapse homeserver implementation (Python) or Dendrite (Golang).

## Main supporting arguments

1. **Social decision-making:** Most decisions aren't purely analytical processes but deeply social ones. Chat interfaces excel at supporting the interpersonal dynamics, relationship building, and informal consensus-forming that precede formal decisions, creating a more holistic decision-making environment.
2. **Widespread familiarity:** With 3+ billion global chat app users, the interface pattern is already deeply familiar across cultures and demographics. This dramatically lowers barriers to adoption compared to specialized democratic tools, making participation more accessible.
3. **Chat-first extensibility:** Chat interfaces can smoothly incorporate forum-like features (forum channels, threads, pinned content) without disrupting the core experience. The inverse - adding fluid conversation to forum-based tools - typically results in awkward, bolted-on chat features that users avoid.
4. **Progressive disclosure of complexity**: Chat can start simple (just discussing) then progressively reveal more structured features (polls, ranked choice, consensus blocking) as needed. This lowers the initial learning curve compared to traditional CDM tools that present all features upfront.
5. **Mobile-first design**: Chat interfaces are much better optimized for mobile, crucial for organizers who coordinate on-the-go. Traditional CDM tools often have clunky mobile experiences that can hinder participation.
6. **Integrated voice and video capabilities**: Chat platforms typically include VoIP and video calling, which Matrix supports natively. This enables quick escalation from text discussions to verbal deliberation when decisions require nuanced conversation, emotional connection, or complex negotiation. For distributed organizing, the ability to seamlessly transition between text and video within the same platform eliminates tool-switching friction and keeps all participants engaged regardless of their communication preferences.
7. **Real-time momentum preservation**: Traditional CDM tools often suffer from "context switching fatigue" - users have to leave their conversation flow to create proposals in separate interfaces. Chat-based approaches let decisions emerge organically from discussions, capturing momentum when engagement is highest.
8. **Infrastructure sovereignty**: The proposed Matrix-based architecture would address the infrastructure sovereignty that movements need - allowing them to control their data, their platform, and their destiny, while still benefiting from network effects through federation.
9. **Decentralized resilience via Matrix**: The proposed use of Matrix would provide federated architecture where organizing groups can't be silenced by a single point of failure. For protest coordination or union organizing, this censorship resistance would be invaluable. Groups could self-host or distribute across multiple homeservers while maintaining seamless communication.

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
