import React from 'react';
import { Route, Switch } from 'react-router-dom';
import cn from 'classnames';
import { SvgPageNotFound } from 'iblis-react-undraw';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as BooksAPI from 'BooksAPI';
import SearchPage from 'pages/SearchPage';
import LibraryPage from 'pages/LibraryPage';
import { ShelfID } from "../constants";
import { copyWithout, groupByID } from "../utils";
import './App.scss';
import PageInfo from "components/PageInfo";

export const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: (theme) => null
});

// I don't see the necessity to include [booksByID] in this context. I'm passing
// an object as value so that it's more easily expandable
export const LibraryContext = React.createContext({
  updateBookShelf: (book, shelf) => null
});

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: localStorage.theme || 'light',
      booksByID: {},
      loading: false,
      error: null
    }

    // Note: I'm creating context objects to prevent a new context object from being created every
    // time render is called causing unintentional re-rendering of consumers.
    // See: https://it.reactjs.org/docs/context.html#caveats

    this.libraryContext = {
      updateBookShelf: this.updateBookShelf
    };

    this.themeContext = {
      theme: this.state.theme,
      setTheme: this.setTheme
    }
  }

  setTheme = (theme) => {
    localStorage.theme = theme;
    this.themeContext = { theme, setTheme: this.setTheme };
    this.setState({ theme });
  }

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks = () => {
    console.log('Fetching books');
    this.setState({ loading: true, error: null });
    return BooksAPI.getAll()
      .then(books => {
        this.setState({
          booksByID: groupByID(books),
          loading: false, error: null
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: error })
      })
  };

  updateBookShelf = async (book, shelfID) => {
    console.log('Moving book "%s" to shelf %s', book.title, shelfID);
    // Optimistically update the local (UI) state
    let revertLocalUpdate = this.updateBookShelfLocally(book, shelfID);
    try {
      // The API returns the state of all shelves described as lists of book IDs
      const serverShelves = await BooksAPI.updateBookShelf(book.id, shelfID);
      if ('error' in serverShelves) {
        // It's not documented that the API can return a JSON with an error field (like search());
        // Just in case...
        toast.error(`Your last operation was rejected by the server. Details: "${serverShelves.error}"`);
        revertLocalUpdate();
      }
    } catch (error) {
      console.error(error);
      toast.error(`Your last operation did not succeed. Error details: "${error.message}"`);
      revertLocalUpdate();
    }
  }

  /**
   * Used for optimistically updating the local state of the application.
   */
  updateBookShelfLocally = (book, shelfID) => {
    let booksByID = this.state.booksByID;

    // Trust [state], not [book.shelf] (even though they should be consistent)
    let currentShelf = (book.id in booksByID)
      ? booksByID[book.id].shelf
      : ShelfID.NONE;

    this.setState(state => {
      if (currentShelf === shelfID)   // Nothing to update
        return null;

      if (shelfID === ShelfID.NONE) {  // Remove the book from the user library
        return { booksByID: copyWithout(book.id, state.booksByID) };
      }

      // Either add a new book or move a book to one shelf to another
      let updatedBook = { ...book, shelf: shelfID };
      return { booksByID: { ...state.booksByID, [book.id]: updatedBook } };
    }, () => {
      console.log('Optimistic update completed:', { book: book.title, from: currentShelf, to: shelfID });
    });

    // Return a function that can be used to revert the local update (in case of error)
    return () => this.updateBookShelfLocally(book, currentShelf);
  }

  render() {
    // console.log('Render App', this.state);
    let { booksByID, loading, error, theme } = this.state;

    return (
      <div className={cn("theme", theme)}>
        <div className="App">
          <ToastContainer />
          <LibraryContext.Provider value={this.libraryContext}>
            <ThemeContext.Provider value={this.themeContext}>
              <Switch>

                <Route exact path="/">
                  <LibraryPage booksByID={booksByID} loading={loading} error={error} />
                </Route>

                <Route exact path="/search">
                  <SearchPage booksByID={booksByID} loading={loading} error={error} />
                </Route>

                <Route path="*">
                  <Error404 />
                </Route>

              </Switch>
            </ThemeContext.Provider>
          </LibraryContext.Provider>
        </div>
      </div>
    );
  }
}

function Error404() {
  return <PageInfo
    illustration={
      <SvgPageNotFound
        primarycolor="var(--color-primary)"
        accentcolor="#444"
      />}
    title="Page not found"
    text="The URL you typed is not valid."
  />;
}

export default App;
