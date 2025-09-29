import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

// если блог не на /blog — поменяй
const BLOG_BASE = '/blog';

// твои «теги-меню»
const TAGS = [
  { key: 'indicators', label: 'Индикаторы' },
  { key: 'bots',       label: 'Боты' },
];

export default function BlogSidebar() {
  const {pathname} = useLocation();

  return (
    <nav className="menu thin-scrollbar poBlogSidebar">
      <h3 className="menu__title">Категории</h3>
      <ul className="menu__list">
        {TAGS.map((it) => {
          const to = `${BLOG_BASE}/tags/${it.key}`;
          const active = pathname.startsWith(to);
          return (
            <li key={it.key} className={`menu__list-item ${active ? 'menu__list-item--active' : ''}`}>
              <Link className="menu__link" to={to}>{it.label}</Link>
            </li>
          );
        })}
        <li className="menu__list-item">
          <Link className="menu__link" to={`${BLOG_BASE}/tags`}>Все категории</Link>
        </li>
      </ul>
    </nav>
  );
}
