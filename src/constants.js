import { faBook, faBookmark, faBookOpen } from "@fortawesome/free-solid-svg-icons";

/**
 * ID for shelves accepted by the backend API. It includes NONE, the value for
 * removing a book from the user's book library.
 */
export const ShelfID = Object.freeze({
  READ: "read",
  READING: "currentlyReading",
  WANT_TO_READ: "wantToRead",
  NONE: "none"
});

export class ShelfData {
  constructor({ id, displayName, icon, color, shortDisplayName, className }) {
    this.id = id;
    this.displayName = displayName;
    this.shortDisplayName = shortDisplayName || displayName;
    this.icon = icon;
    this.color = color;
    // This is used for anchors and CSS class names:
    this.slug = className || this.displayName.toLowerCase().split(' ').join('-');
  }
}

export const Shelves = Object.freeze((() => {  // IIFE
  let READING = Object.freeze(new ShelfData({
    id: ShelfID.READING,
    displayName: "Currently reading",
    shortDisplayName: "Reading",
    icon: faBookOpen,
    color: 'var(--color-shelf-reading)'
  }));

  let WANT_TO_READ = Object.freeze(new ShelfData({
    id: ShelfID.WANT_TO_READ,
    displayName: "Want to read", shortDisplayName: "Wanted",
    icon: faBookmark, color: 'var(--color-shelf-want-to-read)'
  }));

  let READ = Object.freeze(new ShelfData({
    id: ShelfID.READ, displayName: "Read",
    icon: faBook, color: 'var(--color-shelf-read)'
  }));

  let inDisplayOrder = Object.freeze([READING, WANT_TO_READ, READ]);
  let ids = Object.values(ShelfID);

  let byID = Object.freeze(
    Object.fromEntries(
      inDisplayOrder.map(shelf => [shelf.id, shelf]))
  );

  return { READING, WANT_TO_READ, READ, ids, inDisplayOrder, byID }
})());


/**
 * List of search terms accepted by the API.
 */
export const searchTerms = Object.freeze([
  'Android', 'Art', 'Artificial Intelligence', 'Astronomy', 'Austen', 'Baseball', 'Basketball',
  'Bhagat', 'Biography', 'Brief', 'Business', 'Camus', 'Cervantes', 'Christie', 'Classics',
  'Comics', 'Cook', 'Cricket', 'Cycling', 'Desai', 'Design', 'Development', 'Digital Marketing',
  'Drama', 'Drawing', 'Dumas', 'Education', 'Everything', 'Fantasy', 'Film', 'Finance', 'First',
  'Fitness', 'Football', 'Future', 'Games', 'Gandhi', 'Homer', 'Horror', 'Hugo', 'Ibsen', 'Journey',
  'Kafka', 'King', 'Lahiri', 'Larsson', 'Learn', 'Literary Fiction', 'Make', 'Manage', 'Marquez',
  'Money', 'Mystery', 'Negotiate', 'Painting', 'Philosophy', 'Photography', 'Poetry', 'Production',
  'Programming', 'React', 'Redux', 'River', 'Robotics', 'Rowling', 'Satire', 'Science Fiction',
  'Shakespeare', 'Singh', 'Swimming', 'Tale', 'Thrun', 'Time', 'Tolstoy', 'Travel', 'Ultimate',
  'Virtual Reality', 'Web Development', 'iOS'
]);