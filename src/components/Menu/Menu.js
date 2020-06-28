import React from 'react';
import cn from 'classnames';
import './Menu.scss';
import { useClickOutside } from "utils.js";


export function MenuItem({ leading, title, onClick }) {
  return (
    <div className="MenuItem" onClick={onClick}>
      <div className="MenuItem-leading">
        {leading}
      </div>
      <div className="MenuItem-title">
        {title}
      </div>
    </div>
  );
};

export function MenuTitle({ children }) {
  return <h3 className="MenuTitle" onClick={(e) => e.stopPropagation()}>
    {children}
  </h3>;
};

export function Divider({ className }) {
  return <div className={cn("Divider", className)} />
}

export function Menu({ children, className }) {
  return (
    <div className={cn("Menu", className)} >
      {children}
    </div>
  );
}

export function MenuTrigger({
  renderMenu, children, closeOnMenuClick,
  className, popupClassName
}) {
  let [isVisible, setVisibility] = React.useState(false);
  let ref = React.useRef(null);

  const toggleMenu = () => setVisibility(!isVisible);
  const closeMenu = () => setVisibility(false);
  useClickOutside(ref, closeMenu);
  const onMenuClick = (closeOnMenuClick) ? closeMenu : null;

  return (
    <div ref={ref} className={cn("MenuTrigger", className)}>
      <div onClick={toggleMenu}>
        {children}
      </div>
      {isVisible && (
        <div className={cn("MenuTrigger-popup", popupClassName)} onClick={onMenuClick}>
          {renderMenu()}
        </div>
      )}
    </div>
  );
}

MenuTrigger.defaultProps = {
  closeOnMenuClick: true
}
