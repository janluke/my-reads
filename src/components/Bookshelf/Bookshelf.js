import React from 'react';
import PropTypes from 'prop-types';
import { SvgBookLover } from 'iblis-react-undraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BookGrid from "../BookGrid";
import './Bookshelf.scss';


function compareBooks(a, b) {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  if (a.publishedDate < b.publishedDate) return -1;
  if (a.publishedDate > b.publishedDate) return 1;
  return 0;
}

function renderBooksGrid(books) {
  let sortedBooks = books.sort(compareBooks);
  return <BookGrid books={sortedBooks} />;
}

function renderEmptyShelf() {
  return (
    <div className="Bookshelf-empty">
      <div className="illustration">
        <SvgBookLover primarycolor="var(--color-secondary)"/>
      </div>
      <div className="content">
        <h3 className="content-title">This shelf is empty</h3>
        <p className="content-text">
          Click the search icon on the top-right of the page to find and add new books!
        </p>
      </div>
    </div>
  );
}

function Bookshelf({ title, books, icon, color, ...props }) {
  return (
    <div className="Bookshelf" {...props}>
      <h2 className="Bookshelf-title">
        {icon && <FontAwesomeIcon icon={icon} color={color} className="Bookshelf-icon" />}
        {title}
      </h2>
      <div className="Bookshelf-content">
        {(books.length > 0)
          ? renderBooksGrid(books)
          : renderEmptyShelf()}
      </div>
    </div>
  );
}

Bookshelf.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
};

export default Bookshelf;