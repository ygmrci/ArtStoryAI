import React from 'react';
import PropTypes from 'prop-types';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-surface dark:bg-surface rounded-card shadow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
