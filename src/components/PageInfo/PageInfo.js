import React from 'react';
import cn from 'classnames';
import './PageInfo.scss';

function PageInfo({ type, illustration, title, text }) {
  return (
    <div className={cn("PageInfo", type)}>
      {illustration && <div className="PageInfo-illustration">{illustration}</div>}
      <div className="PageInfo-content">
        {title && <h2 className="PageInfo-title">{title}</h2>}
        {text && <p className="PageInfo-text">{text}</p>}
      </div>
    </div>
  );
}

export default PageInfo;
