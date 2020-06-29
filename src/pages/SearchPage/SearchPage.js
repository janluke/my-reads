import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { debounce } from 'debounce';

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SvgNotFound, SvgSearch } from 'iblis-react-undraw';

import * as BooksAPI from 'BooksAPI';
import { searchTerms } from "constants.js";
import BookGrid from "components/BookGrid";
import PageInfo from "components/PageInfo";
import { Header, HeaderLayout } from 'components/Header';
import { BackButton } from "components/buttons";
import { ThemeSwitcher } from "components/utils";
import './SearchPage.scss';
import Scaffold from "../../components/Scaffold";


function SearchHelp({ onTermChipClick }) {
  return (
    <div className="Search-content">
      <div className="SearchHelp">
        <div className="SearchHelp-illustration">
          <SvgSearch primarycolor="var(--color-primary)" />
        </div>
        <p className="SearchHelp-text">
          <strong>Note:</strong> the backend API uses a fixed set of cached search results
          and is limited to the following search terms (including prefixes of them).
          Any other query will return no results.
        </p>
        <ul className="SearchHelp-term-list">
          {searchTerms.map(term => (
            <li key={term}>
            <span className="search-term-chip" onClick={() => onTermChipClick(term)}>
              {term}
            </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * A controlled input component that wraps a text input and a button for clearing it.
 * Being controlled, note that you need to explicitly clear the input [value] when the
 * button is pressed (or nothing will happen).
 */
function SearchField({ value, placeholder, autoFocus, onChange, onClear }) {
  let [hasFocus, setFocus] = useState(autoFocus);
  let inputRef = useRef(null);

  const onClearWrapper = (e) => {
    setFocus(true);
    inputRef.current.focus();
    if (onClear) onClear();
  }

  return (
    <div className={cn('SearchField', { onFocus: hasFocus })}>
      <div className="SearchField-icon">
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <input
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <button
        className={cn('SearchField-clear', { 'hidden': !value })}
        onMouseDown={(e) => e.preventDefault()}  // prevent the button to steal the focus to the input
        onClick={onClearWrapper}
      >
        &times;
      </button>
    </div>
  );
}

SearchField.defaultProps = {
  autoFocus: false
}

function normalizeQuery(rawQuery) {
  return rawQuery.trim();
}

class SearchPage extends React.Component {
  static DEBOUNCE_TIME = 500;  // in milliseconds

  static propTypes = {
    booksByID: PropTypes.object.isRequired
  }

  state = {
    loading: false,
    /** Value of the SearchField */
    inputQuery: '',
    /** Query that current results are relative to */
    resultsQuery: '',
    results: [],
    error: null
  }

  onInputQueryChange = (value) => {
    this.setState({ inputQuery: value });
    this.fetchResultsDebounced(value);
  }

  fetchResults = (rawQuery) => {
    let query = normalizeQuery(rawQuery);
    if (query === this.state.resultsQuery) {
      if (this.state.loading) {
        // This is necessary in the following scenario:
        // 1. current [resultsQuery] is "ciao" and so is [inputQuery]
        // 2. the user deletes some chars so that the [inputQuery] is now "ci" and stops typing
        // 3. while waiting for a server response for "ci", the user rewrites the deleted chars and stops
        // 4. when [receiveResults] gets results for "ci", it ignores them because the query
        //    has changed meanwhile and leaves [loading] set to true
        // 5. [fetchResults] is called with "ciao", which is the last [resultsQuery] and so we arrive
        //    here; if we don't set [loading] to false, the page keeps "loading" for no reason
        this.setState({ loading: false });
      }
      return;
    }

    if (!query) {
      this.setState({ results: [], resultsQuery: '', loading: false });
    }
    else {
      this.setState({ loading: true });
      BooksAPI.search(query)
        .then(results => this.receiveResults(results, query))
        .catch((error) => this.setState({ loading: false, error: error }));
    }
  }

  receiveResults = (results, query) => {
    if (normalizeQuery(this.state.inputQuery) !== query) {
      console.log('Ignoring results for outdated query "%s"', query);
    }
    else if ('error' in results) {
      if (results.error.includes('empty query')) {
        // The API weirdly returns an "empty query" error when the query is not in the set
        // of available search terms even if the query is perfectly valid and not empty.
        // Note that fetchResults() never sends a request with an empty query.
        this.setState({ results: [], resultsQuery: query, loading: false });
      }
      else { // It's not documented if this endpoint can return other kind of errors. Just in case...
        let error = Error(results.error);
        console.error(error);
        this.setState({ loading: false, error });
      }
    }
    else {  // No errors
      this.setState({ results, resultsQuery: query, loading: false });
    }
  }

  fetchResultsDebounced = debounce(this.fetchResults, SearchPage.DEBOUNCE_TIME);

  setQuery = (rawQuery) => {
    this.setState({ inputQuery: rawQuery });
    this.fetchResults(rawQuery);
  }

  renderResults() {
    let { results, resultsQuery } = this.state;
    let userBooks = this.props.booksByID;

    let resultsWithShelf = results.map(
      book => (book.id in userBooks) ? userBooks[book.id] : book)

    if (results.length === 0)
      return (
        <PageInfo
          illustration={<SvgNotFound primarycolor="var(--color-primary)" />}
          title={'No books found'}
          text={`Couldn't find any book for "${resultsQuery}"`}
        />
      );
    else
      return (
        <div className="Search-content">
          <BookGrid books={resultsWithShelf} showShelfRibbon />
        </div>
      );
  }

  onClearInput = () => {
    console.log('Clear input');
    this.onInputQueryChange('');
  }

  render() {
    // console.log('Search state', this.state);
    let { inputQuery, resultsQuery, loading, error } = this.state;

    return (
      <Scaffold
        loading={loading || this.props.loading}
        error={error || this.props.error}
        header={(
          <Header position="fixed" className="Search-header">
            <HeaderLayout>
              <Link to="/">
                <BackButton />
              </Link>

              <SearchField
                placeholder="Search books..."
                autoFocus
                value={inputQuery}
                onChange={this.onInputQueryChange}
                onClear={this.onClearInput}
              />

              <ThemeSwitcher />
            </HeaderLayout>
          </Header>
        )}
        renderBody={() => (
          (!resultsQuery)
            ? <SearchHelp onTermChipClick={this.setQuery} />
            : this.renderResults()
        )}
      />
    );
  }
}

export default SearchPage;