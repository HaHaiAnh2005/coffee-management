import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs text-stone-500 mb-4">
      <Link to="/" className="hover:text-stone-300">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <FiChevronRight className="mx-1.5 w-3 h-3 text-stone-600" />
            {isLast ? (
              <span className="text-stone-200 capitalize font-bold">{name}</span>
            ) : (
              <Link to={routeTo} className="hover:text-stone-300 capitalize">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
