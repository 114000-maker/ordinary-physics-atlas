"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import KnowledgeGraph from "./KnowledgeGraph";
import MathFormula from "./MathFormula";
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

const sourceKindLabels: Record<string, string> = {
  curriculum: "課程範圍",
  course: "大學課程",
  standard: "標準與建議",
  assessment: "物理教育研究",
  textbook: "教材範圍",
  inspiration: "架構靈感",
  reference: "參考資料",
  課程: "大學課程",
  開放教科書: "教材範圍",
  標準: "標準與建議",
  物理教育研究: "物理教育研究",
  實驗教學規範: "實驗教學規範",
};

const levelDescriptions = [
  { label: "基礎", note: "測量、向量與模型" },
  { label: "核心", note: "兩學期普通物理" },
  { label: "進階", note: "微積分深化與近代延伸" },
];

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
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = selectedId ? conceptById.get(selectedId) : undefined;
  const selectedDomain = domainFor(selected);
  const prereqEdges = selected ? directPrerequisites.get(selected.id) ?? [] : [];
  const unlockEdges = selected ? directUnlocks.get(selected.id) ?? [] : [];
  const ancestorCount = selected ? getAncestors(selected.id).size : 0;

  const filteredConcepts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-Hant");
    if (!normalized) return [];

    return CONCEPTS.filter((concept) => {
      if (!visibleDomains.has(concept.domainId)) return false;
      const domain = domainFor(concept);
      const haystack = [
        concept.title,
        concept.cluster,
        concept.summary,
        concept.equation,
        domain?.title ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");
      return haystack.includes(normalized);
    }).slice(0, 9);
  }, [query, visibleDomains]);

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
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic && conceptById.has(topic)) {
      setSelectedId(topic);
      setIntroDismissed(true);
    }
  }, []);

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

  const featured =
    CONCEPTS.find((concept) => concept.title.includes("牛頓第二")) ?? CONCEPTS[0];

  return (
    <main className={`atlas ${selected ? "atlas--selected" : ""}`}>
      <div className="graph-stage" aria-hidden="false">
        <KnowledgeGraph
          className="knowledge-graph"
          selectedId={selectedId}
          onSelect={selectConcept}
          visibleDomains={visibleDomains}
          searchQuery={query}
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
          <button type="button" className="utility-button" onClick={() => setListOpen(true)}>
            列表檢視
          </button>
          <button type="button" className="utility-button" onClick={() => setSourcesOpen(true)}>
            研究依據
          </button>
        </div>
      </header>

      <section className={`hero ${introDismissed ? "hero--quiet" : ""}`} aria-labelledby="hero-title">
        <p className="eyebrow">CALCULUS-BASED GENERAL PHYSICS · 繁體中文版</p>
        <h1 id="hero-title">
          普通物理，
          <br />
          不是章節，
          <br />
          是一張<span className="hero-accent">地圖。</span>
        </h1>
        <p className="hero-lead">
          從量綱、向量與測量開始，沿著先修關係一路走到 Maxwell 方程、相對論與量子。
          每一點都是可評量的概念；每一條線，都說明為什麼它必須先學。
        </p>
        <p className="hero-note">
          依臺大普通物理、MIT 核心課程、NIST 與物理教育研究交叉建構。內容為原創中文整理，
          不重製教材段落或受限制的評量題目。
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => selectConcept(featured.id)}>
            <span aria-hidden="true">◎</span>
            從核心概念開始
          </button>
          <button className="text-button" type="button" onClick={() => setSourcesOpen(true)}>
            閱讀建構方法 <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="hero-stats" aria-label="知識圖譜統計">
          <span><strong>{CONCEPTS.length}</strong> 個概念</span>
          <span><strong>{EDGES.length}</strong> 條先修關係</span>
          <span><strong>{DOMAINS.length}</strong> 個領域</span>
        </div>
      </section>

      <section className="search-dock" aria-label="搜尋知識圖譜">
        <div className="search-box">
          <span className="search-box__icon" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋概念、公式或領域"
            aria-label="搜尋概念、公式或領域"
          />
          <kbd>/</kbd>
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="清除搜尋">×</button>
          )}
        </div>

        {query && (
          <div className="search-results" role="listbox" aria-label="搜尋結果">
            {filteredConcepts.length ? (
              filteredConcepts.map((concept) => {
                const domain = domainFor(concept);
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
                    <span><strong>{concept.title}</strong><small>{domain?.title} · {concept.cluster}</small></span>
                    <span aria-hidden="true">↗</span>
                  </button>
                );
              })
            ) : (
              <p>找不到符合的概念。試試「能量」、「電場」或「熵」。</p>
            )}
          </div>
        )}
      </section>

      <nav className="domain-legend" aria-label="依物理領域篩選">
        <div className="legend-heading">
          <span>領域 · 點選篩選</span>
          <button
            type="button"
            onClick={() => setVisibleDomains(new Set(DOMAINS.map((domain) => domain.id)))}
          >
            全部顯示
          </button>
        </div>
        <div className="legend-grid">
          {DOMAINS.map((domain) => {
            const active = visibleDomains.has(domain.id);
            const count = CONCEPTS.filter((concept) => concept.domainId === domain.id).length;
            return (
              <button
                key={domain.id}
                type="button"
                className={active ? "is-active" : ""}
                aria-pressed={active}
                onClick={() => toggleDomain(domain.id)}
              >
                <span className="legend-dot" style={{ background: domain.color }} />
                <span>{domain.title}</span>
                <small>{count}</small>
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="level-key" aria-label="圖譜縱軸說明">
        <span className="level-key__line" aria-hidden="true" />
        <div>
          <strong>學習進程</strong>
          {levelDescriptions.map((level) => (
            <p key={level.label}><b>{level.label}</b>{level.note}</p>
          ))}
        </div>
      </aside>

      {selected && selectedDomain && (
        <aside className="concept-panel" role="dialog" aria-label={`已選概念：${selected.title}`}>
          <button className="panel-close" type="button" onClick={() => selectConcept(null)} aria-label="關閉概念詳情">×</button>
          <div className="panel-scroll">
            <p className="concept-kicker">
              <span style={{ background: selectedDomain.color }} />
              {selectedDomain.title} · {selected.cluster} · {selected.level}
            </p>
            <h2>{selected.title}</h2>
            <p className="concept-summary">{selected.summary}</p>

            {selected.equation && (
              <div className="equation-card">
                <span>核心關係</span>
                <MathFormula latex={selected.latex} />
              </div>
            )}

            <div className="concept-metrics">
              <div><strong>{ancestorCount}</strong><span>完整先修概念</span></div>
              <div><strong>{prereqEdges.length}</strong><span>直接建立於</span></div>
              <div><strong>{unlockEdges.length}</strong><span>直接解鎖</span></div>
            </div>

            <div className="track-row">
              <span>{selected.track}</span>
              <span>{selected.level}節點</span>
            </div>

            <section className="evidence-block">
              <h3>掌握證據</h3>
              <p>{selected.evidence}</p>
            </section>

            <section className="misconception-block">
              <h3>常見迷思</h3>
              <p>{selected.misconception}</p>
            </section>

            <RelationList
              title="直接建立於"
              edges={prereqEdges}
              target="from"
              onSelect={selectConcept}
            />
            <RelationList
              title="接著解鎖"
              edges={unlockEdges}
              target="to"
              onSelect={selectConcept}
            />

            <section className="source-tags">
              <h3>範圍與研究依據</h3>
              <div>
                {selected.sourceIds.map((id) => {
                  const source = SOURCES.find((item) => item.id === id);
                  return source ? (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      {source.organization}
                    </a>
                  ) : null;
                })}
                <button type="button" onClick={() => setSourcesOpen(true)}>全部來源</button>
              </div>
            </section>
          </div>
        </aside>
      )}

      {sourcesOpen && (
        <ResearchModal onClose={() => setSourcesOpen(false)} />
      )}

      {listOpen && (
        <ConceptListModal
          onClose={() => setListOpen(false)}
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
}: {
  title: string;
  edges: ConceptEdge[];
  target: "from" | "to";
  onSelect: (id: string) => void;
}) {
  if (!edges.length) return null;

  return (
    <section className="relation-list">
      <h3>{title}<span>{edges.length}</span></h3>
      {edges.map((edge) => {
        const concept = conceptById.get(edge[target]);
        const domain = domainFor(concept);
        if (!concept) return null;
        return (
          <button type="button" key={edge.id} onClick={() => onSelect(concept.id)}>
            <span className="relation-dot" style={{ background: domain?.color }} />
            <span>
              <strong>{concept.title}</strong>
              <small>{edge.type === "hard" ? "必要先修" : "建議先修"} · {edge.reason}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        );
      })}
    </section>
  );
}

function ResearchModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="research-modal" role="dialog" aria-modal="true" aria-labelledby="research-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="關閉研究依據">×</button>
        <p className="eyebrow">RESEARCH &amp; PROVENANCE</p>
        <h2 id="research-title">這張圖譜如何被建構</h2>
        <div className="method-grid">
          <article>
            <span>01</span>
            <h3>先定範圍，再拆概念</h3>
            <p>以臺大普通物理與 OpenStax 三冊確認廣度，MIT 課程校準微積分深度；每個節點只表達一個可評量的學習目標。</p>
          </article>
          <article>
            <span>02</span>
            <h3>章節順序不等於先修</h3>
            <p>硬先修表示沒有它就難以理解；軟先修則提供表徵或類比。跨領域關係由向量、能量、場與波等統一觀念串接。</p>
          </article>
          <article>
            <span>03</span>
            <h3>把迷思也納入架構</h3>
            <p>FCI、CSEM、BEMA 等研究型評量用來找出概念瓶頸，但本站不公開重製任何受限制的正式題目或答案。</p>
          </article>
          <article>
            <span>04</span>
            <h3>共享骨架、不同深度</h3>
            <p>代數制與微積分制共享相同物理節點；本站以「微積分主線」呈現，另把 Fourier、量子態等標成進階延伸。</p>
          </article>
        </div>

        <div className="source-index">
          <h3>專業來源與查核入口</h3>
          {SOURCES.map((source) => (
            <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
              <span>{sourceKindLabels[source.kind] ?? "參考資料"}</span>
              <strong>{source.title}</strong>
              <small>{source.organization} · {source.note}</small>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>

        <p className="license-note">
          本站的中文說明、概念分解與先修關係為獨立撰寫。視覺與資料架構受 Marble Skill Taxonomy 啟發，
          未複製其品牌、字型、程式碼或資料記錄。外部來源連結僅用於範圍與研究查核，各自權利仍歸原作者與機構。
        </p>
      </section>
    </div>
  );
}

function ConceptListModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const normalized = filter.trim().toLocaleLowerCase("zh-Hant");

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="list-modal" role="dialog" aria-modal="true" aria-labelledby="list-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="關閉列表檢視">×</button>
        <p className="eyebrow">ACCESSIBLE INDEX</p>
        <h2 id="list-title">全部概念</h2>
        <input
          autoFocus
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="在 {CONCEPTS.length} 個概念中搜尋"
          aria-label="搜尋全部概念"
        />
        <div className="concept-index">
          {DOMAINS.map((domain) => {
            const concepts = CONCEPTS.filter((concept) =>
              concept.domainId === domain.id &&
              (!normalized || [concept.title, concept.cluster, concept.summary].join(" ").toLocaleLowerCase("zh-Hant").includes(normalized)),
            );
            if (!concepts.length) return null;
            return (
              <section key={domain.id}>
                <h3><span style={{ background: domain.color }} />{domain.title}<small>{concepts.length}</small></h3>
                <div>
                  {concepts.map((concept) => (
                    <button type="button" key={concept.id} onClick={() => onSelect(concept.id)}>
                      <strong>{concept.title}</strong>
                      <small>{concept.cluster} · {concept.level} · {concept.track}</small>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
