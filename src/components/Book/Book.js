import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { ShelfID, Shelves } from 'constants.js';
import { LibraryContext } from "App";
import { Divider, Menu, MenuItem, MenuTitle, MenuTrigger } from "components/Menu";
import './Book.scss';
import { IconButton } from "components/buttons";
import { clipText } from "../../utils";

function ShelfIcon({ shelf }) {
  let { icon, color } = shelf;
  return <FontAwesomeIcon icon={icon} color={color} fixedWidth />
}

/**
 * IMPORTANT: ensure [book.shelf] is defined if the book belongs to a shelf.
 */
function BookActionMenu({ book }) {
  const { updateBookShelf } = useContext(LibraryContext);

  // One add/move action for each shelf different from the one the book is currently in (if any)
  let shelfItems = Shelves.inDisplayOrder
    .filter(shelf => shelf.id !== book.shelf)
    .map(shelf => (
      <MenuItem
        key={shelf.id}
        leading={<ShelfIcon shelf={shelf} />}
        title={shelf.displayName}
        onClick={() => updateBookShelf(book, shelf.id)}
      />
    ));

  return (
    <Menu>
      <MenuTitle>{(book.shelf) ? "Move to" : "Add to"}</MenuTitle>
      {shelfItems}
      {book.shelf && (
        <>
          <Divider />
          <MenuItem
            key="remove"
            leading={<FontAwesomeIcon icon={faTrashAlt} color={"red"} fixedWidth />}
            title="Remove"
            onClick={() => updateBookShelf(book, ShelfID.NONE)}
          />
        </>
      )}
    </Menu>
  );
}

function BookActionMenuTrigger({ book }) {
  const renderMenu = () => <BookActionMenu book={book} />
  return (
    <MenuTrigger className="BookActionMenuTrigger" renderMenu={renderMenu}>
      <IconButton raised color="secondary" icon={faCaretDown} />
    </MenuTrigger>
  );
}

/**
 * Display the book's cover, title and author. It provides an action menu
 * to add/move the book to one of the shelves or remove it from the library.
 *
 * IMPORTANT: ensure [book.shelf] is defined if the book belongs to a shelf,
 * otherwise the book won't have a ribbon and, most importantly, the action menu
 * won't show the correct available actions.
 */
class Book extends React.PureComponent {

  static propTypes = {
    /** Note: ensure [book.shelf] is defined if the book belongs to a shelf  */
    book: PropTypes.object.isRequired,
    showShelfRibbon: PropTypes.bool
  }

  static defaultProps = {
    showShelfRibbon: false
  }

  renderRibbon(shelfID) {
    let shelf = Shelves.byID[shelfID];
    return (
      <div className={cn("Book-ribbon", shelf.slug)}>
        <span>{shelf.shortDisplayName}</span>
      </div>
    );
  }

  render() {
    let { book, showShelfRibbon } = this.props;

    let bookCover = (book.imageLinks)
      ? <img src={book.imageLinks.thumbnail} alt={`Cover of "${book.title}"`} />
      : <div className="Book-cover-placeholder">Cover not available</div>;

    const maxTitleLen = 75;
    const maxAuthorsLen = 50;
    let clippedTitle = clipText(book.title, maxTitleLen);
    let authors = ('authors' in book) ? book.authors.join(', ') : null;
    let clippedAuthors = (authors) ? clipText(authors, maxAuthorsLen) : null;

    return (
      <div className="Book">
        <div className="Book-top">
          <div className="Book-cover">
            {bookCover}
            {(book.shelf && showShelfRibbon) && this.renderRibbon(book.shelf)}
          </div>
          <BookActionMenuTrigger book={book} />
        </div>

        <div className="Book-title" title={(book.title.length > maxTitleLen) ? book.title : null}>
          {clippedTitle}
        </div>

        {(authors) && (
          <div className="Book-authors" title={(authors.length > maxAuthorsLen) ? authors : null}>
            {clippedAuthors}
          </div>
        )}

        {/*{('publishedDate' in book) && (*/}
        {/*  <div className="Book-year">*/}
        {/*    ({getYear(book.publishedDate)})*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  }
}

export default Book;
