import React from 'react';
import cn from 'classnames';
import logo from 'assets/app-logo.svg';
import './Header.scss';

export function Header({ position, className, children }) {
  return (
    <header className={cn('Header', position, className)}>
      {children}
    </header>
  );
}

Header.defaultProps = {
  position: 'fixed'
};

export function HeaderLayout({ className, children }) {
  return (
    <div className={cn('HeaderLayout', className)}>
      {children}
    </div>
  )
}

Header.Logo = () => (
  <img src={logo} className="Header-logo" alt="MyReads logo" />
);

