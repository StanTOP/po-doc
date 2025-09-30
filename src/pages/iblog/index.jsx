import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

/* ====== Лёгкие SVG-иконки (inline) ====== */
const BlogIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M4 5a2 2 0 0 1 2-2h9a1 1 0 1 1 0 2H6v14h12V8a1 1 0 1 1 2 0v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z"/>
    <path d="M9 7h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm0 4h9a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm0 4h9a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2z"/>
  </svg>
);

const DocsIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M6 2h7.586a2 2 0 0 1 1.414.586l3.414 3.414A2 2 0 0 1 19 7.414V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h11V7.414L13.586 4H6z"/>
    <path d="M8 9h7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm0 4h7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z"/>
  </svg>
);

const StartIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M13 2.05a1 1 0 0 0-2 0v6.9l-3.4 3.4a1 1 0 0 0 1.4 1.4l3-3 3 3a1 1 0 0 0 1.4-1.4L13 8.95v-6.9z"/>
    <path d="M5 14a7 7 0 0 0 14 0 1 1 0 1 1 2 0 9 9 0 1 1-18 0 1 1 0 1 1 2 0z"/>
  </svg>
);

const StrategyIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M4 3a1 1 0 0 0-1 1v16a1 1 0 1 0 2 0v-5h3a1 1 0 0 0 1-1V8h3a1 1 0 0 0 1-1V4h6a1 1 0 1 0 0-2H4z"/>
    <path d="M16.293 11.293a1 1 0 0 1 1.414 0L19 12.586l1.293-1.293a1 1 0 0 1 1.414 1.414L20.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414L19 15.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L17.586 14l-1.293-1.293a1 1 0 0 1 0-1.414z"/>
  </svg>
);

/** Верхние карточки: иконка + текст, без больших изображений */
const TOP_CARDS = [
  {
    title: 'Все статьи блога',
    desc: 'Хронологическая лента',
    to: '/blog',
    icon: <BlogIcon />,
    iconBg: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
  },
  {
    title: 'Документация по сервису аналитики',
    desc: 'Раздел Docs',
    to: '/docs',
    icon: <DocsIcon />,
    iconBg: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
  },
  {
    title: 'С чего начать новичку',
    desc: 'Подборка для старта (скоро)',
    to: null, // показываем бейдж "Скоро"
    icon: <StartIcon />,
    iconBg: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
  },
  {
    title: 'Стратегии торговли',
    desc: 'Подходы, правила, примеры',
    to: '/blog/tags',
    icon: <StrategyIcon />,
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
];

const MAX_POSTS = 10;

/* ---------- helpers ---------- */
const cleanText = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();

/** Парсим страницу /blog: заголовок, ссылка, дата; берём только MAX_POSTS свежих */
function parseBlogList(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const arts = Array.from(doc.querySelectorAll('article'));
  const items = [];

  for (const a of arts) {
    const linkEl = a.querySelector('h2 a, h3 a, a[href^="/blog/"]');
    if (!linkEl) continue;

    const permalink = linkEl.getAttribute('href');
    const title = cleanText(linkEl);

    const timeEl = a.querySelector('time');
    const dateStr = timeEl?.getAttribute('datetime') || timeEl?.textContent || '';
    const date = dateStr ? new Date(dateStr) : null;

    items.push({ title, permalink, date });
  }

  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items.slice(0, MAX_POSTS);
}

/** Карточка с иконкой */
function IconCard({ item }) {
  const body = (
    <div className="ps-card ps-card--icon">
      <div className="ps-card__body">
        <div className="ps-card__head">
          <span className="ps-card__icon" style={{ background: item.iconBg }}>
            {item.icon}
          </span>
          <div className="ps-card__titles">
            <h3 className="ps-card__title">{item.title}</h3>
            {item.desc && <p className="ps-card__desc">{item.desc}</p>}
          </div>
          {!item.to && <span className="ps-card__badge">Скоро</span>}
        </div>
      </div>
    </div>
  );

  return item.to ? (
    <Link to={item.to} className="ps-card__link">{body}</Link>
  ) : body;
}

export default function Iblog() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/blog', { cache: 'no-store' });
        if (!res.ok) { if (mounted) setPosts([]); return; }
        const html = await res.text();
        const items = parseBlogList(html);
        if (mounted) setPosts(items);
      } catch {
        if (mounted) setPosts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Layout title="Блог" description="Навигация по блогу и свежие публикации Pocket Signals">
      <main className="container margin-vert--lg ps-iblog">
        {/* HERO */}
        <header className="ps-hero">
          <h1 className="ps-hero__title">Блог Pocket Signals</h1>
          <p className="ps-hero__sub">Подборки по темам и свежие публикации в одном месте.</p>
          {/* Кнопки убраны по твоей просьбе */}
        </header>

        {/* ВЕРХНИЕ КАРТОЧКИ (2 колонки) */}
        <section className="ps-block">
          <div className="ps-grid ps-grid--top2">
            {TOP_CARDS.map((c) => (
              <IconCard key={c.title} item={c} />
            ))}
          </div>
        </section>

        {/* ЛЕНТА: ПОСЛЕДНИЕ 10 СТАТЕЙ (2 колонки), только заголовок + кнопка */}
        <section className="ps-block">
          <h2 className="ps-block__title">Последние записи в блоге</h2>

          <div className="ps-list ps-list--2col">
            {posts === null && <p style={{ opacity: 0.7 }}>Загружаем…</p>}
            {posts && posts.length === 0 && <p style={{ opacity: 0.7 }}>Записей не найдено.</p>}

            {posts && posts.map((p) => (
              <article className="ps-postRow ps-postRow--simple" key={p.permalink}>
                <div className="ps-postRow__body">
                  <h4 className="ps-postRow__title"><Link to={p.permalink}>{p.title}</Link></h4>
                  <div className="ps-postRow__actions">
                    <Link className="button button--md ps-btn-white" to={p.permalink}>
                      Читать статью
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
