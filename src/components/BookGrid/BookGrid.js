import React from 'react';
import PropTypes from 'prop-types';
import { Flipped, Flipper } from 'react-flip-toolkit'
import Book from "../Book";
import './BookGrid.scss';


const flippedGridItemCallbacks = {
  onAppear: (el) => {
    const className = 'book-appear';
    el.classList.add(className);
    setTimeout(() => {
      el.style.opacity = 1;
      el.classList.remove(className);
    }, 300);
  },

  onExit: (el, index, removeElement) => {
    el.classList.add('book-exit');
    setTimeout(removeElement, 300);
  }
}

/**
 * In <Flipper />, wait an element to be removed before starting the flip animation.
 */
const hideExitThenFlipEnter = async ({
  hideEnteringElements,
  animateEnteringElements,
  animateExitingElements,
  animateFlippedElements
}) => {
  await Promise.all([hideEnteringElements(), animateExitingElements()]);
  animateFlippedElements();
  animateEnteringElements();
};

function BookGrid({ books, showShelfRibbon }) {
  return (
    <Flipper flipKey={books} handleEnterUpdateDelete={hideExitThenFlipEnter}>
      <ol className="BookGrid">
        {books.map(book => (
          <Flipped key={book.id} flipId={book.id} {...flippedGridItemCallbacks}>
            <li className="BookGrid-item">
              <Book book={book} showShelfRibbon={showShelfRibbon} />
            </li>
          </Flipped>
        ))}
      </ol>
    </Flipper>
  );
}

BookGrid.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object),
  showShelfRibbon: PropTypes.bool,
};

BookGrid.defaultProps = {
  showShelfRibbon: false
}

export default BookGrid;
