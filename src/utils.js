import React from "react";

export const keysOf = Object.keys;
export const valuesOf = Object.values;
export const entriesOf = Object.entries;

export function groupByID(iterable, idKey = 'id') {
  let byID = {};
  for (let elem of iterable)
    byID[elem[idKey]] = elem;
  return byID;
}

export function copyWithout(key, obj) {
  let copy = Object.assign({}, obj);
  delete copy[key];
  return copy;
}

export function clipText(text, maxLength) {
  if (text.length <= maxLength)
    return text;
  return text.substr(0, maxLength - 3) + '...';
}

/**
 * Calls the provided [callback] when the user click outside the element identified by [ref]
 */
export function useClickOutside(ref, callback) {
  React.useEffect(() => {

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target))
        callback()
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}