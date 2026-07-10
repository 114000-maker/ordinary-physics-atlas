"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import KnowledgeGraph from "./KnowledgeGraph";
import MathFormula from "./MathFormula";
import {
  LEVEL_DESCRIPTIONS,
  UI,
  conceptCopy,
  domainCopy,
  levelLabel,
  sourceCopy,
  sourceKindLabel,
  trackLabel,
  type Locale,
  type Theme,
} from "./i18n";
import {
  CONCEPTS,
  DOMAINS,
  EDGES,
  SOURCES,
  type ConceptEdge,
  type ConceptNode,
} from "./physics-data";

const conceptById = new Map(CONCEPTS.map((concept) => [concept.id, concept]));

const directPrerequisites = new Map<string, ConceptEdge[]>();
const directUnlocks = new Map<string, ConceptEdge[]>();

for (const edge of EDGES) {
  const prereqs = directPrerequisites.get(edge.to) ?? [];
  prereqs.push(edge);
  directPrerequisites.set(edge.to, prereqs);

  const unlocks = directUnlocks.get(edge.from) ?? [];
  unlocks.push(edge);
  directUnlocks.set(edge.from, unlocks);
}

function getAncestors(id: string) {
  const visited = new Set<string>();
  const queue = [...(directPrerequisites.get(id) ?? []).map((edge) => edge.from)];

  while (queue.length) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    for (const edge of directPrerequisites.get(current) ?? []) {
      queue.push(edge.from);
    }
  }

  return visited;
}

function domainFor(concept: ConceptNode | undefined) {
  return DOMAINS.find((domain) => domain.id === concept?.domainId);
}

export default function PhysicsAtlas() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleDomains, setVisibleDomains] = useState(
    () => new Set(DOMAINS.map((domain) => domain.id)),
  );
  const [query, setQuery] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh-Hant");
  const [theme, setTheme] = useState<Theme>("dark");
  const searchRef = useRef<HTMLInputElement>(null);
  const t = UI[locale];

  const selected = selectedId ? conceptById.get(selectedId) : undefined;
  const selectedDomain = domainFor(selected);
  const selectedText = selected ? conceptCopy(selected, locale) : null;
  const selectedDomainText = selectedDomain ? domainCopy(selectedDomain, locale) : null;
  const prereqEdges = selected ? directPrerequisites.get(selected.id) ?? [] : [];
  const unlockEdges = selected ? directUnlocks.get(selected.id) ?? [] : [];
  const ancestorCount = selected ? getAncestors(selected.id).size : 0;

  const filteredConcepts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    if (!normalized) return [];

    return CONCEPTS.filter((concept) => {
      if (!visibleDomains.has(concept.domainId)) return false;
      const domain = domainFor(concept);
      const localizedConcept = conceptCopy(concept, locale);
      const localizedDomain = domain ? domainCopy(domain, locale) : null;
      const haystack = [
        concept.title,
        concept.cluster,
        concept.summary,
        localizedConcept.title,
        localizedConcept.cluster,
        localizedConcept.summary,
        concept.equation,
        domain?.title ?? "",
        localizedDomain?.title ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase(locale);
      return haystack.includes(normalized);
    }).slice(0, 9);
  }, [locale, query, visibleDomains]);

  const selectConcept = useCallback((id: string | null) => {
    setSelectedId(id);
    setIntroDismissed(true);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("topic", id);
      else url.searchParams.delete("topic");
      window.history.replaceState({}, "", url);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const topic = params.get("topic");
      if (topic && conceptById.has(topic)) {
        setSelectedId(topic);
        setIntroDismissed(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedLocale = window.localStorage.getItem("physics-atlas-locale");
      const savedTheme = window.localStorage.getItem("physics-atlas-theme");
      if (savedLocale === "en" || savedLocale === "zh-Hant") setLocale(savedLocale);
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("physics-atlas-locale", locale);
    window.localStorage.setItem("physics-atlas-theme", theme);
  }, [locale, theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !sourcesOpen && !listOpen) {
        const target = event.target as HTMLElement | null;
        if (target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }
      if (event.key === "Escape") {
        if (sourcesOpen) setSourcesOpen(false);
        else if (listOpen) setListOpen(false);
        else if (query) setQuery("");
        else if (selectedId) selectConcept(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [listOpen, query, selectedId, selectConcept, sourcesOpen]);

  const toggleDomain = (id: string) => {
    setVisibleDomains((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        if (next.size === 1) return current;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const featured = conceptById.get("phy-035") ?? CONCEPTS[0];

  return (
    <main
      className={`atlas ${selected ? "atlas--selected" : ""}`}
      data-theme={theme}
      data-locale={locale}
      lang={locale}
    >
      <div className="graph-stage" aria-hidden="false">
        <KnowledgeGraph
          className="knowledge-graph"
          selectedId={selectedId}
          onSelect={selectConcept}
          visibleDomains={visibleDomains}
          searchQuery={query}
          locale={locale}
          theme={theme}
          showChrome
        />
      </div>

      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <button className="wordmark" type="button" onClick={() => selectConcept(null)}>
          <span className="wordmark__symbol" aria-hidden="true">Φ</span>
          <span>
            <strong>物理譜</strong>
            <small>PHYSICA ATLAS</small>
          </span>
        </button>

        <div className="header-actions">
          <button
            type="button"
            className="preference-button preference-button--theme"
            aria-label={theme === "dark" ? t.lightMode : t.darkMode}
            title={theme === "dark" ? t.lightMode : t.darkMode}
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          >
            <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
            <small>{theme === "dark" ? (locale === "en" ? "LIGHT" : "亮色") : (locale === "en" ? "DARK" : "暗色")}</small>
          </button>
          <button
            type="button"
            className="preference-button preference-button--language"
            aria-label={locale === "zh-Hant" ? t.english : t.chinese}
            title={locale === "zh-Hant" ? t.english : t.chinese}
            onClick={() => setLocale((current) => current === "zh-Hant" ? "en" : "zh-Hant")}
          >
            <span aria-hidden="true">{locale === "zh-Hant" ? "EN" : "中"}</span>
            <small>{locale === "zh-Hant" ? "ENGLISH" : "中文"}</small>
          </button>
          <button type="button" className="utility-button header-list-button" onClick={() => setListOpen(true)}>
            {t.listView}
          </button>
          <button type="button" className="utility-button" onClick={() => setSourcesOpen(true)}>
            {t.research}
          </button>
        </div>
      </header>

      <section className={`hero ${introDismissed ? "hero--quiet" : ""}`} aria-labelledby="hero-title">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title">
          {t.heroLines[0]}
          <br />
          {t.heroLines[1]}
          <br />
          <span className="hero-accent">{t.heroLines[2]}</span>
        </h1>
        <p className="hero-lead">{t.lead}</p>
        <p className="hero-note">{t.note}</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => selectConcept(featured.id)}>
            <span aria-hidden="true">◎</span>
            {t.start}
          </button>
          <button className="text-button" type="button" onClick={() => setSourcesOpen(true)}>
            {t.method} <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="hero-stats" aria-label={t.statsLabel}>
          <span><strong>{CONCEPTS.length}</strong> {t.concepts}</span>
          <span><strong>{EDGES.length}</strong> {t.relations}</span>
          <span><strong>{DOMAINS.length}</strong> {t.domains}</span>
        </div>
      </section>

      <section className="search-dock" aria-label={t.searchRegion}>
        <div className="search-box">
          <span className="search-box__icon" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
          <kbd>/</kbd>
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label={t.clearSearch}>×</button>
          )}
        </div>

        {query && (
          <div className="search-results" role="listbox" aria-label={t.results}>
            {filteredConcepts.length ? (
              filteredConcepts.map((concept) => {
                const domain = domainFor(concept);
                const localizedConcept = conceptCopy(concept, locale);
                const localizedDomain = domain ? domainCopy(domain, locale) : null;
                return (
                  <button
                    type="button"
                    key={concept.id}
                    role="option"
                    aria-selected={selectedId === concept.id}
                    onClick={() => {
                      selectConcept(concept.id);
                      setQuery("");
                    }}
                  >
                    <span className="result-dot" style={{ background: domain?.color }} />
                    <span><strong>{localizedConcept.title}</strong><small>{localizedDomain?.title} · {localizedConcept.cluster}</small></span>
                    <span aria-hidden="true">↗</span>
                  </button>
                );
              })
            ) : (
              <p>{t.noResults}</p>
            )}
          </div>
        )}
      </section>

      <nav className="domain-legend" aria-label={t.domainFilter}>
        <div className="legend-heading">
          <span>{t.domainHeading}</span>
          <button
            type="button"
            onClick={() => setVisibleDomains(new Set(DOMAINS.map((domain) => domain.id)))}
          >
            {t.showAll}
          </button>
        </div>
        <div className="legend-grid">
          {DOMAINS.map((domain) => {
            const active = visibleDomains.has(domain.id);
            const count = CONCEPTS.filter((concept) => concept.domainId === domain.id).length;
            const localizedDomain = domainCopy(domain, locale);
            return (
              <button
                key={domain.id}
                type="button"
                className={active ? "is-active" : ""}
                aria-pressed={active}
                onClick={() => toggleDomain(domain.id)}
              >
                <span className="legend-dot" style={{ background: domain.color }} />
                <span>{localizedDomain.title}</span>
                <small>{count}</small>
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="level-key" aria-label={t.levelKey}>
        <span className="level-key__line" aria-hidden="true" />
        <div>
          <strong>{t.learningPath}</strong>
          {LEVEL_DESCRIPTIONS[locale].map((level) => (
            <p key={level.level}><b>{levelLabel(level.level, locale)}</b>{level.note}</p>
          ))}
        </div>
      </aside>

      {selected && selectedDomain && selectedText && selectedDomainText && (
        <aside className="concept-panel" role="dialog" aria-label={`${t.allConcepts}: ${selectedText.title}`}>
          <button className="panel-close" type="button" onClick={() => selectConcept(null)} aria-label={t.closeDetails}>×</button>
          <div className="panel-scroll">
            <p className="concept-kicker">
              <span style={{ background: selectedDomain.color }} />
              {selectedDomainText.title} · {selectedText.cluster} · {levelLabel(selected.level, locale)}
            </p>
            <h2>{selectedText.title}</h2>
            <p className="concept-summary">{selectedText.summary}</p>

            {selected.equation && (
              <div className="equation-card">
                <span>{t.coreRelation}</span>
                <MathFormula latex={selected.latex} />
              </div>
            )}

            <div className="concept-metrics">
              <div><strong>{ancestorCount}</strong><span>{t.ancestors}</span></div>
              <div><strong>{prereqEdges.length}</strong><span>{t.builtOn}</span></div>
              <div><strong>{unlockEdges.length}</strong><span>{t.unlocks}</span></div>
            </div>

            <div className="track-row">
              <span>{trackLabel(selected.track, locale)}</span>
              <span>{levelLabel(selected.level, locale)} {t.node}</span>
            </div>

            <section className="evidence-block">
              <h3>{t.evidence}</h3>
              <p>{selectedText.evidence}</p>
            </section>

            <section className="misconception-block">
              <h3>{t.misconception}</h3>
              <p>{selectedText.misconception}</p>
            </section>

            <RelationList
              title={t.builtOn}
              edges={prereqEdges}
              target="from"
              onSelect={selectConcept}
              locale={locale}
            />
            <RelationList
              title={t.nextUnlocks}
              edges={unlockEdges}
              target="to"
              onSelect={selectConcept}
              locale={locale}
            />

            <section className="source-tags">
              <h3>{t.sources}</h3>
              <div>
                {selected.sourceIds.map((id) => {
                  const source = SOURCES.find((item) => item.id === id);
                  return source ? (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      {source.organization}
                    </a>
                  ) : null;
                })}
                <button type="button" onClick={() => setSourcesOpen(true)}>{t.allSources}</button>
              </div>
            </section>
          </div>
        </aside>
      )}

      {sourcesOpen && (
        <ResearchModal locale={locale} onClose={() => setSourcesOpen(false)} />
      )}

      {listOpen && (
        <ConceptListModal
          onClose={() => setListOpen(false)}
          locale={locale}
          onSelect={(id) => {
            selectConcept(id);
            setListOpen(false);
          }}
        />
      )}
    </main>
  );
}

function RelationList({
  title,
  edges,
  target,
  onSelect,
  locale,
}: {
  title: string;
  edges: ConceptEdge[];
  target: "from" | "to";
  onSelect: (id: string) => void;
  locale: Locale;
}) {
  if (!edges.length) return null;

  return (
    <section className="relation-list">
      <h3>{title}<span>{edges.length}</span></h3>
      {edges.map((edge) => {
        const concept = conceptById.get(edge[target]);
        const domain = domainFor(concept);
        if (!concept) return null;
        const localizedConcept = conceptCopy(concept, locale);
        const prerequisiteType = edge.type === "hard" ? UI[locale].hard : UI[locale].soft;
        return (
          <button type="button" key={edge.id} onClick={() => onSelect(concept.id)}>
            <span className="relation-dot" style={{ background: domain?.color }} />
            <span>
              <strong>{localizedConcept.title}</strong>
              <small>{prerequisiteType}{locale === "zh-Hant" ? ` · ${edge.reason}` : " · Conceptual support for this relationship."}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        );
      })}
    </section>
  );
}

function ResearchModal({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const t = UI[locale];
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="research-modal" role="dialog" aria-modal="true" aria-labelledby="research-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={t.closeResearch}>×</button>
        <p className="eyebrow">{t.researchEyebrow}</p>
        <h2 id="research-title">{t.researchTitle}</h2>
        <div className="method-grid">
          {t.researchSteps.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <div className="source-index">
          <h3>{t.sourceIndex}</h3>
          {SOURCES.map((source) => {
            const localizedSource = sourceCopy(source, locale);
            return (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                <span>{sourceKindLabel(source.kind, locale)}</span>
                <strong>{localizedSource.title}</strong>
                <small>{source.organization} · {localizedSource.note}</small>
                <b aria-hidden="true">↗</b>
              </a>
            );
          })}
        </div>

        <p className="license-note">{t.license}</p>
      </section>
    </div>
  );
}

function ConceptListModal({
  onClose,
  onSelect,
  locale,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
  locale: Locale;
}) {
  const [filter, setFilter] = useState("");
  const normalized = filter.trim().toLocaleLowerCase(locale);
  const t = UI[locale];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="list-modal" role="dialog" aria-modal="true" aria-labelledby="list-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={t.closeList}>×</button>
        <p className="eyebrow">{t.indexEyebrow}</p>
        <h2 id="list-title">{t.allConcepts}</h2>
        <input
          autoFocus
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t.searchAll}
          aria-label={t.searchAll}
        />
        <div className="concept-index">
          {DOMAINS.map((domain) => {
            const localizedDomain = domainCopy(domain, locale);
            const concepts = CONCEPTS.filter((concept) =>
              concept.domainId === domain.id &&
              (!normalized || [concept.title, concept.cluster, concept.summary, conceptCopy(concept, locale).title, conceptCopy(concept, locale).cluster].join(" ").toLocaleLowerCase(locale).includes(normalized)),
            );
            if (!concepts.length) return null;
            return (
              <section key={domain.id}>
                <h3><span style={{ background: domain.color }} />{localizedDomain.title}<small>{concepts.length}</small></h3>
                <div>
                  {concepts.map((concept) => {
                    const localizedConcept = conceptCopy(concept, locale);
                    return (
                      <button type="button" key={concept.id} onClick={() => onSelect(concept.id)}>
                        <strong>{localizedConcept.title}</strong>
                        <small>{localizedConcept.cluster} · {levelLabel(concept.level, locale)} · {trackLabel(concept.track, locale)}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
