import React from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './buttons.scss';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


export function Button({ color, raised, className, style, children, onClick, ...props }) {
  return (
    <button
      {...props}
      className={cn("Button", color, className, { 'raised': raised })}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  'raised': false
};

export function IconButton({ icon, raised, size, color, className, onClick, ...props }) {
  return (
    <Button
      color={color}
      raised={raised}
      className={cn("IconButton", className)}
      style={{ width: size, height: size }}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  );
}

export function BackButton({ props }) {
  return (
    <IconButton icon={faArrowLeft} {...props} />
  );
}