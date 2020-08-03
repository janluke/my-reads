import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLastLocation } from "react-router-last-location";
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './buttons.scss';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Button = React.memo(({ color, raised, className, style, children, onClick, ...props }) => {
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
});

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

export function BackButton(props) {
  return <IconButton icon={faArrowLeft} title="Go back" {...props} />;
}

/**
 * A BackButton that, when clicked, causes the browser to go to the last location
 * in the same web-site. If no such location exists, it pushes a default route.
 *
 * IMPORTANT: this component requires to be a descendant of a <LastLocationProvider>
 * (and thus of a Router element).
 */
export function SmartBackButton({ defaultTo = '/', ...props }) {
  let history = useHistory();
  let lastLocation = useLastLocation();
  return <BackButton
    onClick={() => {
      if (lastLocation) history.goBack();
      else history.push(defaultTo)
    }}
    {...props}
  />;
}