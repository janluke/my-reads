# MyReads   <!-- omit in toc -->

- [Description](#description)
  - [What differentiates my implementation](#what-differentiates-my-implementation)
  - [Tools and libraries](#tools-and-libraries)
- [Available Scripts](#available-scripts)
  - [`npm start`](#npm-start)
  - [`npm test`](#npm-test)
  - [`npm run build`](#npm-run-build)
  - [`npm run eject`](#npm-run-eject)
- [The backend server](#the-backend-server)
  - [`getAll()`](#getall)
  - [`update(book, shelf)`](#updatebook-shelf)
  - [`search(query)`](#searchquery)
  - [The book object](#the-book-object)
  - [The code I used to describe the book object](#the-code-i-used-to-describe-the-book-object)

## Description

**Demo:** https://janluke-myreads.netlify.app/

A simple React app for tracking the books you are currently reading,
want to read or have already read.

This is my implementation of the final assessment project for the Udacity's 
"React Fundamentals" course, part of the React Nanodegree Program.
The purpose of the project is familiarizing with React and React Router.

### What differentiates my implementation

- **Restyling.** The app was built from scratch and was restyled wrt the one provided
  by Udacity. However, I kept the structure of the app the same, even if not optimal
  for the UX. That's mostly because I decided to not use an external component library
  to force myself practicing CSS. On the other hand, implementing what I had in mind
  was a little too time-consuming for being worthwhile.

- **Theming.** I implemented light/dark theming using scoped CSS variables.
   A theme is just a CSS class containing variables (e.g. `--color-primary`).
   I wrapped the entire application with a `div` node whose class attribute is set
   to current theme class. Changing theme is as easy as changing the `div` class.

- **Optimistic updates.** When the user changes the shelf of a book, the UI gets immediately
  updated. If the operation doesn't succeed server-side, the optimistic update is reverted
  and the app shows a toast with an error message.

- **Debounced search.** The search input field is debounced and, in general, the implemented logic
  prevents unnecessary API requests.

### Tools and libraries

- **Bootstrapping**: [Create React App](https://github.com/facebook/create-react-app).
- **Routing**: React Router and `react-router-hash-link`.
- **Styling**: Sass, but I didn't use much its features.
- **State management**: none, because it was out of scope. Redux is the central topic
  of the 2nd course. I used the Context API though.
- **Library of components**: none, because I wanted to practice CSS. Nonetheless, I used
  external packages for some specific components:
  * `react-loading` for the loading indicator;
  * `iblis-react-undraw` for using the awesome [Undraw illustrations](https://undraw.co/)
    changing the primary/accent color;
  * `react-toastify` for toasts.
- **Animations**: I used `react-flip-toolkit` for animating the grids and occasionally
  CSS transitions/keyframes.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) 
for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) 
for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. 
This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) 
right into your project so you have full control over them. All of the commands except `eject` will still work, 
but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, 
and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful
if you couldn’t customize it when you are ready for it.


## The backend server

The app uses a "dummy" REST API provided by Udacity. The API is not very well documented by Udacity 
(maybe intentionally?). This section is a copy of the provided API documentation with additional notes
I took when I started working on the project. Maybe it can be of help to other students.

### `getAll()`

Returns a Promise which resolves to a JSON object containing the books of the user
grouped by shelf:

```javascript
{
  "read": [/* books */],
  "wantToRead": [/* books */],
  "currentlyReading": [/* books */]
}
```

### `update(book, shelf)`

Parameters:

- book: `<Object>` containing at minimum an `id` attribute
- shelf: `<String>` contains one of `["wantToRead", "currentlyReading", "read", "none"]`

Returns a Promise which resolves to an object that describes the current content 
of all shelves in terms of book IDs:

```javascript
{
  "read": [/* book ids */],
  "wantToRead": [/* book ids */],
  "currentlyReading": [/* book ids */]
}
```

### `search(query)`

Returns a Promise which resolves to a JSON object containing a list of a maximum of 20 book objects.

**IMPORTANT**: the returned books do not know which shelf they are on. They are raw results only. 
You'll need to make sure that books have the correct state while on the search page.

### The book object

```yaml  <!--YAML has better syntax highlighting than JSON on GitHub -->
{
    "title": "string",
    "subtitle": "string",
    "authors": [
        "string"
    ],
    "publisher": "string",
    "publishedDate": "string",
    "description": "string",
    "industryIdentifiers": [
        {
            "type": "string",
            "identifier": "string"
        }
    ],
    "readingModes": {
        "text": "boolean",
        "image": "boolean"
    },
    "pageCount": "number",
    "printType": "string",
    "categories": [
        "string"
    ],
    "averageRating": "number",
    "ratingsCount": "number",
    "maturityRating": "string",
    "allowAnonLogging": "boolean",
    "contentVersion": "string",
    "panelizationSummary": {
        "containsEpubBubbles": "boolean",
        "containsImageBubbles": "boolean"
    },
    "imageLinks": {
        "smallThumbnail": "string",
        "thumbnail": "string"
    },
    "language": "string",
    "previewLink": "string",
    "infoLink": "string",
    "canonicalVolumeLink": "string",
    "id": "string",
    "shelf": "string"
}
```

### The code I used to describe the book object

```js
function describe(obj) {
  if (typeof obj !== "object") {
    return typeof obj;
  }
  else if (obj instanceof Array) {
    return (obj.length > 0) ? [getSpecsOf(obj[0])] : [];
  }
  else {
    let specs = {};
    for (let prop of Object.getOwnPropertyNames(obj)) {
      specs[prop] = getSpecsOf(obj[prop]);
    }
    return specs;
  }
}

BooksAPI.getAll().then(
  (data) => console.log(
    JSON.stringify(describe(data[0]), null, 4)
  )
);
```
