import { useEffect, useState } from "react";
import content from "./content.json";
import "./Articles.css";

const categories = [
  "All posts",
  ...new Set(content.articles.map((article) => article.category)),
];

function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All posts");
  const normalizedQuery = query.trim().toLowerCase();
  const articles = content.articles.filter((article) => {
    const matchesCategory =
      activeCategory === "All posts" || article.category === activeCategory;
    const searchableText = `${article.title} ${article.category} ${article.summary}`;
    return (
      matchesCategory && searchableText.toLowerCase().includes(normalizedQuery)
    );
  });

  useEffect(() => {
    document.title = "Field Notes — Bhanu Vamshi";
  }, []);

  return (
    <div className="field-notes-page">
      <header className="field-notes-topbar">
        <a
          className="field-notes-brand"
          href="/#hero"
          aria-label="Back to portfolio home"
        >
          BV<span>✦</span>
        </a>
        <span className="field-notes-status">
          FIELD NOTES / {content.articles.length} POSTS
        </span>
        <a className="field-notes-home" href="/#hero">
          BACK TO PORTFOLIO <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="field-notes-masthead">
          <div className="field-notes-kicker">
            <span className="field-notes-dot" />
            THE PLATFORM JOURNAL
          </div>
          <div className="field-notes-heading-row">
            <div>
              <h1>
                FIELD
                <br />
                <em>NOTES.</em>
              </h1>
              <p>
                Things learned while building, debugging, and finding better
                ways through ServiceNow.
              </p>
            </div>
            <div className="field-notes-aside" aria-hidden="true">
              <span>BHANU VAMSHI</span>
              <b>SN</b>
              <span>BUILD / SHARE / REPEAT</span>
            </div>
          </div>
          <div className="field-notes-bottomline">
            <span>COMMUNITY POSTS</span>
            <span>01 — {String(content.articles.length).padStart(2, "0")}</span>
            <a
              href={content.profile.communityArticlesUrl}
              target="_blank"
              rel="noreferrer"
            >
              FULL PROFILE FEED <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section
          className="field-notes-library"
          aria-labelledby="article-list-title"
        >
          <div className="field-notes-library-head">
            <div>
              <span className="field-notes-overline">THE ARCHIVE</span>
              <h2 id="article-list-title">Ideas in the wild</h2>
            </div>
            <label className="field-notes-search">
              <span className="sr-only">Search articles</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the archive"
              />
            </label>
          </div>

          <div
            className="field-notes-filters"
            aria-label="Filter articles by category"
          >
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "active" : ""}
                type="button"
                key={category}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="field-notes-results" aria-live="polite">
            <span>{String(articles.length).padStart(2, "0")} ENTRIES</span>
            <span>OPEN AN ARTICLE TO READ ON SERVICENOW COMMUNITY ↗</span>
          </div>

          {articles.length > 0 ? (
            <div className="field-notes-list">
              {articles.map((article, index) => (
                <article className="field-notes-entry" key={article.url}>
                  <div className="field-notes-entry-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="field-notes-entry-main">
                    <div className="field-notes-entry-meta">
                      <span>{article.category}</span>
                      <time>{article.date}</time>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <a href={article.url} target="_blank" rel="noreferrer">
                      READ ARTICLE <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <span className="field-notes-entry-mark" aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p className="field-notes-empty">No entries match those filters.</p>
          )}
        </section>
      </main>

      <footer className="field-notes-footer">
        <a href="/#hero">
          BV✦ <span>BACK TO THE PORTFOLIO</span>
        </a>
        <span>© {new Date().getFullYear()} BHANU VAMSHI</span>
      </footer>
    </div>
  );
}

export default ArticlesPage;
