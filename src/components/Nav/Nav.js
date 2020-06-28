import React from 'react';
import './Nav.scss';
import cn from "classnames";

function Nav({ children, className }) {
  return (
    <nav>
      <ol className={cn("Nav", className)}>
        {children}
      </ol>
    </nav>
  );
}

Nav.Item = ({ children, className, ...props }) => {
  return (
    <li className={cn('NavItem', className)} {...props}>
      {children}
    </li>
  );
}

export default Nav;