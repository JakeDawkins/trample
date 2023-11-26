# Next.js TS Apollo Template

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Running the Application Locally](#running-the-application-locally)
- [Using Codespaces](#using-codespaces)
- [Running Tests](#running-tests)
  - [Running Unit/Integration tests](#running-unitintegration-tests)
  - [Running End-to-End tests](#running-end-to-end-tests)
- [Starting React Storybook](#starting-react-storybook)
- [Scripts Reference](#scripts-reference)

## Overview

This app is a template setup to quickly stand up a new app with the following tools:

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Storybook](https://storybook.js.org)
- [Jest](https://jestjs.io)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Apollo Client](https://www.apollographql.com/apollo-client)
- [Cypress](https://www.cypress.io)
- [Chromatic](https://www.chromatic.com)
- [Codespaces](https://github.com/features/codespaces)

This template uses Apollo & GraphQL for the data-layer. The template by default generates types based off the [Countries API](https://github.com/trevorblades/countries) by [@trevorblades](https://github.com/trevorblades).

## Directory Structure

```
- components/
  - myComponent/
    - index.tsx # the component itself
    - index.spec.tsx # the unit test suite
    - index.stories.tsx # storybook stories
    - docs.mdx # component documentation used by storybook
- pages/
  - pagename.tsx # uses components/ files
  - pagename.spec.tsx # integration test suite for pages
```

- I chose to use flat directories in this project, since there would be
  many files associated with a single "component".
  - There are test files (`.spec.tsx`), documentation (`.mdx`), storybook files
    (`.stories.tsx`), and the component itself (`.tsx`).
  - If these were all placed in separate peer directories to the components
    themselves, navigating the project would be more challenging. Colocating
    components and associated files allows for quick navigation and easy copying
    to quickly spin up new components.
- This does, however mean that multiple files are named the same thing (like
  `index.spec.tsx`), where you need to focus on the _directory_ name instead of
  the file name when navigating. This can be confusing when multiple files are
  open at the same time from different components, but I think the benefits of
  colocation outweigh the risks there.

## Running the application locally

To run this application, clone this repo and then run the following (requires
[yarn](https://yarnpkg.com/getting-started/install) to be installed previously):

```
cd countries

# install dependencies
yarn

# starts nextjs development server
npm run dev
```

Once up and running, go to [localhost:3000](http://localhost:3000) to see the
app running.

## Using Codespaces

This app is set up to be developed in [Github Codespaces](https://github.com/features/codespaces).

To edit this project, click the `Code` button at the top right of this page.

Click on the `Codespaces` tab and follow the instructions to spin up your own codespace.

## Running Tests

There are three kinds of tests used in this project:

1. Unit tests on individual components to test specific functionality in an
   isolated environment.

- These are found in the `src/components/*` directories under the `index.spec.tsx` files.

2. Integration tests rendering a single page (feature) and using mocked data to
   ensure proper rendering of the page.

- These are found in the `src/pages` directory under the `index.spec.tsx` files.

3. End-to-end tests, which run the application and fetch real-world data. These
   tests act like a user and make assertions about the app's state based on click
   and navigation interaction like a user would.

- These tests are found under the `cypress/e2e` directory.
- An output file is saved to `cypress/videos` showing the last run of these tests.

### Running Unit/Integration tests

To run unit & intergration tests, make sure dependencies are installed and run

```
yarn test:unit
```

### Running End-to-End tests

To run e2e tests, make sure dependencies are installed and run:

```
yarn test:e2e:dev
```

You may need to stop any running instance of `yarn dev` that currently is running
on your machine.

## Starting React Storybook

In most `src/components` directory, there are `index.stories.tsx` and `docs.mdx` files.
These files can include programmatic sandboxes and written documentation on the usage,
accessibility concerns, and props for each of the built components.

> Note: There is a `docs` and a `canvas` tab at the top of each page. The `docs`
> tab is there to display the `docs.mdx` files, and the `canvas` tab is the rendering
> of the examples defined in the `index.stories.mdx` file. You can use the left
> sidebar to navigate between components.

You can also run storybook locally if you'd like. To run storybook, clone this
repo and then run the following (requires [yarn](https://yarnpkg.com/getting-started/install)
to be installed previously):

```
cd countries

# install dependencies
yarn

npm run storybook
```

Once up and running, go to [localhost:6006](http://localhost:6006) to see the
app running.

## Scripts Reference

Using `yarn <command-name>`:

**Development workflow**:

- `dev`: Run app in development mode
- `storybook`: Build and run React Storybook on port 6006
- `generate:types`: Generate GraphQL types
- `generate:types:watch`: Generate GraphQL types and rebuild on change
- `lint`: Check project with ESLint

**Testing**:

- `test:unit`: Run jest tests in `components/` and `pages/`
- `cypress:open`: Open the `Cypress` app locally for manually running e2e tests
  - expects the app to be running on `localhost:3000` (`yarn dev`)
- `cypress:run`: run all Cypress e2e tests
  - expects the app to be running on `localhost:3000` (`yarn dev`)
- `test:e2e:dev`: builds the app with `yarn dev` in the background and opens Cypress tests.

**Deployment**:

- `build`: Build app for production
- `start`: Serve built production app
- `build:storybook`: Build storybook for deploy
- `chromatic`: Deploys storybook instance to Chromatic
  - Expects project token set in this script in `package.json`
