/**
 * Components that require little code and little or no styles.
 */
import React, { useContext } from "react";
import './utils.scss'
import ReactLoading from "react-loading";
import { ThemeContext } from "../App";
import { IconButton } from "./buttons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export function PageLoader({ loading, children }) {
  return (loading) ? (
    <div className='PageLoader'>
      <ReactLoading type="bars" color="var(--color-primary)" />
    </div>
  ) : (
    <>
      {(typeof children === 'function')
        ? children()
        : children}
    </>
  );
}

export function ThemeSwitcher() {
  let { theme, setTheme } = useContext(ThemeContext);
  let otherTheme = (theme === 'light') ? 'dark' : 'light';
  return (
    <IconButton
      title="Toggle light/dark theme"
      icon={(theme !== "light") ? faSun : faMoon}
      onClick={() => setTheme(otherTheme)}
    />
  )
}