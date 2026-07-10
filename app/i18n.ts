import type { ConceptNode, Domain, LearningLevel, Source, Track } from "./physics-data";

export type Locale = "zh-Hant" | "en";
export type Theme = "dark" | "light";

export const UI = {
  "zh-Hant": {
    listView: "列表檢視",
    research: "研究依據",
    lightMode: "切換至亮色背景",
    darkMode: "切換至暗色背景",
    chinese: "中文",
    english: "English",
    languageControl: "語言切換",
    themeControl: "背景色彩模式",
    eyebrow: "CALCULUS-BASED GENERAL PHYSICS · 繁體中文版",
    heroLines: ["普通物理，", "不是章節，", "是一張地圖。"],
    lead: "從量綱、向量與測量開始，沿著先修關係一路走到 Maxwell 方程、相對論與量子。每一點都是可評量的概念；每一條線，都說明為什麼它必須先學。",
    note: "依臺大普通物理、MIT 核心課程、NIST 與物理教育研究交叉建構。內容為原創中文整理，不重製教材段落或受限制的評量題目。",
    start: "從核心概念開始",
    method: "閱讀建構方法",
    concepts: "個概念",
    relations: "條先修關係",
    domains: "個領域",
    statsLabel: "知識圖譜統計",
    searchRegion: "搜尋知識圖譜",
    search: "搜尋概念、公式或領域",
    clearSearch: "清除搜尋",
    results: "搜尋結果",
    noResults: "找不到符合的概念。試試「能量」、「電場」或「熵」。",
    domainFilter: "依物理領域篩選",
    domainHeading: "領域 · 點選篩選",
    showAll: "全部顯示",
    learningPath: "學習進程",
    levelKey: "圖譜縱軸說明",
    coreRelation: "核心關係",
    ancestors: "完整先修概念",
    builtOn: "直接建立於",
    unlocks: "直接解鎖",
    node: "節點",
    evidence: "掌握證據",
    misconception: "常見迷思",
    nextUnlocks: "接著解鎖",
    sources: "範圍與研究依據",
    allSources: "全部來源",
    closeDetails: "關閉概念詳情",
    hard: "必要先修",
    soft: "建議先修",
    researchEyebrow: "RESEARCH & PROVENANCE",
    researchTitle: "這張圖譜如何被建構",
    researchSteps: [
      ["先定範圍，再拆概念", "以臺大普通物理與 OpenStax 三冊確認廣度，MIT 課程校準微積分深度；每個節點只表達一個可評量的學習目標。"],
      ["章節順序不等於先修", "硬先修表示沒有它就難以理解；軟先修則提供表徵或類比。跨領域關係由向量、能量、場與波等統一觀念串接。"],
      ["把迷思也納入架構", "FCI、CSEM、BEMA 等研究型評量用來找出概念瓶頸，但本站不公開重製任何受限制的正式題目或答案。"],
      ["共享骨架、不同深度", "代數制與微積分制共享相同物理節點；本站以「微積分主線」呈現，另把 Fourier、量子態等標成進階延伸。"],
    ],
    sourceIndex: "專業來源與查核入口",
    sourceFallback: "參考資料",
    license: "本站的中文說明、概念分解與先修關係為獨立撰寫。視覺與資料架構受 Marble Skill Taxonomy 啟發，未複製其品牌、字型、程式碼或資料記錄。外部來源連結僅用於範圍與研究查核，各自權利仍歸原作者與機構。",
    closeResearch: "關閉研究依據",
    indexEyebrow: "ACCESSIBLE INDEX",
    allConcepts: "全部概念",
    searchAll: "在 185 個概念中搜尋",
    closeList: "關閉列表檢視",
  },
  en: {
    listView: "Concept Index",
    research: "Research Basis",
    lightMode: "Switch to light background",
    darkMode: "Switch to dark background",
    chinese: "中文",
    english: "English",
    languageControl: "Language switcher",
    themeControl: "Background color mode",
    eyebrow: "CALCULUS-BASED GENERAL PHYSICS · BILINGUAL EDITION",
    heroLines: ["General physics", "is not a chapter list.", "It is a map."],
    lead: "Begin with measurement, vectors, and dimensional reasoning, then follow prerequisite paths toward Maxwell’s equations, relativity, and quantum physics. Every point is assessable; every line explains what must come first.",
    note: "Cross-checked against NTU General Physics, MIT core courses, NIST standards, and physics education research. All explanations are original and do not reproduce restricted assessment items.",
    start: "Start from a core concept",
    method: "Read the methodology",
    concepts: "concepts",
    relations: "prerequisite links",
    domains: "domains",
    statsLabel: "Knowledge graph statistics",
    searchRegion: "Search the knowledge graph",
    search: "Search concepts, equations, or domains",
    clearSearch: "Clear search",
    results: "Search results",
    noResults: "No matching concept. Try “energy,” “electric field,” or “entropy.”",
    domainFilter: "Filter by physics domain",
    domainHeading: "DOMAINS · SELECT TO FILTER",
    showAll: "Show all",
    learningPath: "LEARNING PATH",
    levelKey: "Graph vertical-axis guide",
    coreRelation: "CORE RELATION",
    ancestors: "full prerequisites",
    builtOn: "built directly on",
    unlocks: "direct unlocks",
    node: "node",
    evidence: "EVIDENCE OF MASTERY",
    misconception: "COMMON MISCONCEPTION",
    nextUnlocks: "UNLOCKS NEXT",
    sources: "SCOPE & RESEARCH BASIS",
    allSources: "All sources",
    closeDetails: "Close concept details",
    hard: "Required prerequisite",
    soft: "Recommended prerequisite",
    researchEyebrow: "RESEARCH & PROVENANCE",
    researchTitle: "How this atlas was constructed",
    researchSteps: [
      ["Set the scope, then split concepts", "NTU and the three OpenStax volumes establish breadth, while MIT courses calibrate calculus depth. Each node expresses one assessable learning outcome."],
      ["Chapter order is not prerequisite order", "Hard prerequisites are necessary for comprehension; soft links provide representation or analogy. Vectors, energy, fields, and waves connect domains."],
      ["Misconceptions belong in the map", "Research assessments such as FCI, CSEM, and BEMA identify conceptual bottlenecks. This site does not reproduce restricted test items or answers."],
      ["One backbone, multiple depths", "Algebra- and calculus-based courses share the same physical concepts. This atlas highlights the calculus path and marks Fourier and quantum-state material as extensions."],
    ],
    sourceIndex: "Professional sources and verification links",
    sourceFallback: "Reference",
    license: "The explanations, concept decomposition, and prerequisite graph are independently written. The information architecture is inspired by Marble Skill Taxonomy without copying its brand, typefaces, code, or records. Linked sources remain the property of their authors and institutions.",
    closeResearch: "Close research basis",
    indexEyebrow: "ACCESSIBLE INDEX",
    allConcepts: "All concepts",
    searchAll: "Search across 185 concepts",
    closeList: "Close concept index",
  },
} as const;

const DOMAIN_EN: Record<string, { title: string; subtitle: string }> = {
  "d01-foundations": { title: "Measurement & Mathematical Language", subtitle: "Turn natural phenomena into testable quantities, graphs, and models" },
  "d02-kinematics": { title: "Kinematics", subtitle: "Describe how position changes with time before asking why" },
  "d03-dynamics": { title: "Forces & Newton’s Laws", subtitle: "Explain changes in motion through interactions" },
  "d04-conservation": { title: "Energy & Momentum", subtitle: "Track quantities that persist across time from a systems view" },
  "d05-rotation-gravity-fluids": { title: "Rotation, Gravity & Fluids", subtitle: "Extend particles to rigid bodies, orbits, and continua" },
  "d06-oscillations-waves": { title: "Oscillations & Mechanical Waves", subtitle: "Connect local periodic motion to propagation, interference, and sound" },
  "d07-thermodynamics": { title: "Thermal & Statistical Physics", subtitle: "Connect macroscopic state, energy flow, and microscopic probability" },
  "d08-electrostatics": { title: "Electrostatics & Potential", subtitle: "Describe charge interactions through fields and potential energy" },
  "d09-circuits": { title: "DC & AC Circuits", subtitle: "Condense electromagnetic ideas into components and network models" },
  "d10-magnetism-induction": { title: "Magnetism & Induction", subtitle: "Unify moving charge, changing flux, and electromagnetic fields" },
  "d11-optics-em": { title: "Electromagnetic Waves & Optics", subtitle: "Move from Maxwell waves to imaging, interference, and diffraction" },
  "d12-modern": { title: "Modern Physics", subtitle: "Rebuild intuition at relativistic, quantum, atomic, and nuclear scales" },
};

const CLUSTER_EN: Record<string, string> = {
  "物理量與尺度": "Physical Quantities & Scale", "向量工具": "Vector Tools", "微積分工具": "Calculus Tools", "實驗與資料": "Experiment & Data",
  "一維運動": "One-Dimensional Motion", "多維運動": "Multidimensional Motion", "曲線與相對運動": "Curved & Relative Motion", "數值表徵": "Numerical Representations",
  "牛頓架構": "Newtonian Framework", "常見作用力": "Common Forces", "曲線與非慣性系": "Curved Motion & Non-Inertial Frames", "約束與平衡": "Constraints & Equilibrium",
  "功與能": "Work & Energy", "位能與守恆": "Potential Energy & Conservation", "衝量與動量": "Impulse & Momentum", "碰撞與系統": "Collisions & Systems",
  "剛體轉動": "Rigid-Body Rotation", "角動量與平衡": "Angular Momentum & Equilibrium", "萬有引力": "Gravitation", "流體": "Fluids",
  "簡諧振動": "Simple Harmonic Motion", "阻尼與驅動": "Damping & Driving", "行波": "Traveling Waves", "疊加與聲學": "Superposition & Acoustics",
  "溫度與物態": "Temperature & Phases", "分子模型": "Molecular Models", "熱傳與功": "Heat Transfer & Work", "熱力學定律": "Laws of Thermodynamics",
  "電荷與電場": "Charge & Electric Field", "通量與高斯定律": "Flux & Gauss’s Law", "電位": "Electric Potential", "電容與介質": "Capacitance & Dielectrics",
  "電流與材料": "Current & Materials", "電源與功率": "Sources & Power", "網路定律": "Circuit Laws", "暫態與交流": "Transients & AC",
  "磁力": "Magnetic Forces", "磁場來源": "Sources of Magnetic Field", "感應": "Induction", "電感與 Maxwell 補全": "Inductance & Maxwell’s Completion",
  "電磁波": "Electromagnetic Waves", "幾何光學": "Geometric Optics", "成像": "Imaging", "波動光學": "Wave Optics",
  "狹義相對論": "Special Relativity", "光量子": "Light Quanta", "物質波與量子力學": "Matter Waves & Quantum Mechanics", "原子與原子核": "Atoms & Nuclei",
};

const CONCEPT_TITLE_EN: Record<string, string> = {
  "phy-001": "Physical Quantities, Models & Testable Claims", "phy-002": "SI Base Quantities, Derived Quantities & Units", "phy-003": "Unit Conversion & Conversion Factors", "phy-004": "Dimensional Analysis & Scaling Laws", "phy-005": "Orders of Magnitude, Estimation & Limit Checks",
  "phy-006": "Scalars, Vectors & Geometric Representation", "phy-007": "Components, Bases & Unit Vectors", "phy-008": "Dot Products & Projection", "phy-009": "Cross Products & the Right-Hand Rule", "phy-010": "Derivatives as Instantaneous Rates of Change", "phy-011": "Integrals as Accumulation & Continuous Sums", "phy-012": "Uncertainty, Significant Figures & Propagation", "phy-013": "Graph Slopes, Intercepts & Areas", "phy-014": "Linearization, Fitting & Residuals", "phy-015": "Experimental Design, Controls & Model Revision",
  "phy-016": "Reference Frames, Coordinates & Clocks", "phy-017": "Position, Displacement & Distance", "phy-018": "Average Speed & Average Velocity", "phy-019": "Instantaneous Velocity", "phy-020": "Acceleration", "phy-021": "Motion with Constant Acceleration", "phy-022": "Near-Earth Free Fall", "phy-023": "Vector Position, Velocity & Acceleration", "phy-024": "Projectile Motion & Component Independence", "phy-025": "Relative Position & Relative Velocity", "phy-026": "Uniform Circular Motion", "phy-027": "Tangential & Normal Acceleration", "phy-028": "Polar-Coordinate Kinematics", "phy-029": "Reasoning Across Motion Graphs", "phy-030": "Discrete Data & Numerical Integration of Motion",
  "phy-031": "Inertia & Mass", "phy-032": "Interactions & the Classification of Forces", "phy-033": "Free-Body Diagrams & System Boundaries", "phy-034": "Newton’s First Law & Inertial Frames", "phy-035": "Newton’s Second Law", "phy-036": "Newton’s Third Law", "phy-037": "Weight & Near-Earth Gravity", "phy-038": "Normal Force & Contact Geometry", "phy-039": "Tension, Pulleys & the Ideal-Rope Model", "phy-040": "Elastic Force & Hooke’s Law", "phy-041": "Static & Kinetic Friction", "phy-042": "Drag & Terminal Speed", "phy-043": "Force Analysis in Circular Motion", "phy-044": "Non-Inertial Frames & Inertial Forces", "phy-045": "Translational Equilibrium & Coupled Constraints",
  "phy-046": "Work by a Variable Force & Line Integrals", "phy-047": "Kinetic Energy", "phy-048": "The Work–Energy Theorem", "phy-049": "Conservative Forces, Path Independence & Potential Energy", "phy-050": "Obtaining Force from Potential Energy", "phy-051": "Potential-Energy Diagrams, Turning Points & Stability", "phy-052": "Conservation of Mechanical & Total Energy", "phy-053": "Power & Energy-Flow Rate", "phy-054": "Impulse", "phy-055": "Linear Momentum & Momentum Flow", "phy-056": "Conservation of System Momentum", "phy-057": "Center of Mass Position & Motion", "phy-058": "One-Dimensional Elastic & Inelastic Collisions", "phy-059": "Two-Dimensional Collisions & Scattering Geometry", "phy-060": "Variable-Mass Systems & the Rocket Equation",
  "phy-061": "Angular Position, Velocity & Acceleration", "phy-062": "Rotation with Constant Angular Acceleration", "phy-063": "Torque & Moment Arm", "phy-064": "Moment of Inertia & the Parallel-Axis Theorem", "phy-065": "Rotational Dynamics", "phy-066": "Rotational Work & Kinetic Energy", "phy-067": "Angular Momentum & Angular Impulse", "phy-068": "Conservation of Angular Momentum", "phy-069": "Rolling without Slipping", "phy-070": "Static Equilibrium of Rigid Bodies", "phy-071": "Universal Gravitation & Superposition", "phy-072": "Gravitational Field & Potential Energy", "phy-073": "Circular Orbits, Escape & Kepler’s Laws", "phy-074": "Density & the Continuum Model", "phy-075": "Pressure & Surface Forces", "phy-076": "Hydrostatic Pressure & Pascal’s Principle", "phy-077": "Buoyancy & Archimedes’ Principle", "phy-078": "Steady Flow & the Continuity Equation", "phy-079": "Bernoulli’s Equation & Energy Lines", "phy-080": "Viscosity, Laminar Flow & Poiseuille’s Law",
  "phy-081": "Equilibrium Points & Restoring Effects", "phy-082": "The Simple-Harmonic-Motion Equation & Phase", "phy-083": "Energy Exchange in a Harmonic Oscillator", "phy-084": "The Simple Pendulum & Small-Angle Approximation", "phy-085": "Damped Oscillation & Time Scales", "phy-086": "Driven Oscillation, Resonance & Phase Difference", "phy-087": "Coupled Oscillators & Normal Modes", "phy-088": "Wave Functions, Amplitude, Wavelength & Frequency", "phy-089": "The Wave Equation & Wave Speed in a Medium", "phy-090": "Linear Superposition & Interference", "phy-091": "Standing Waves, Nodes & Antinodes", "phy-092": "Boundary Conditions & Harmonics in Strings and Air Columns", "phy-093": "Sound Pressure, Intensity & Decibels", "phy-094": "Beats & the Doppler Effect", "phy-095": "Dispersion, Phase Velocity & Group Velocity",
  "phy-096": "Thermal Equilibrium, Temperature & the Zeroth Law", "phy-097": "Thermal Expansion & Temperature Scales", "phy-098": "State Variables & the Ideal-Gas Equation", "phy-099": "Kinetic Theory of Gases & RMS Speed", "phy-100": "Heat, Heat Capacity & Specific Heat", "phy-101": "Phase Changes & Latent Heat", "phy-102": "Thermal Conduction & Thermal Resistance", "phy-103": "Convection, Radiation & Net Heat Exchange", "phy-104": "Pressure–Volume Work & PV Diagrams", "phy-105": "The First Law of Thermodynamics & Internal Energy", "phy-106": "Isothermal, Isobaric, Isochoric & Adiabatic Processes", "phy-107": "Heat Engines, Refrigerators & Cycle Efficiency", "phy-108": "Entropy & the Second Law of Thermodynamics", "phy-109": "Microstates, Macrostates & Statistical Entropy", "phy-110": "Equipartition & the Maxwell–Boltzmann Distribution",
  "phy-111": "Electric Charge, Quantization & Conservation", "phy-112": "Coulomb’s Law", "phy-113": "Electric Field as a Local Description of Interaction", "phy-114": "Electric-Field Superposition & Electric Dipoles", "phy-115": "Electric-Field Integrals for Continuous Charge Distributions", "phy-116": "Electric Flux & Oriented Area", "phy-117": "Gauss’s Law & Symmetry", "phy-118": "Electrostatic Equilibrium of Conductors", "phy-119": "Potential Difference & Work by the Electric Field", "phy-120": "Potential of Point Charges & Continuous Distributions", "phy-121": "Electric Field & the Potential Gradient", "phy-122": "Electrostatic Potential Energy of Charge Systems", "phy-123": "Capacitance & Geometry", "phy-124": "Dielectrics, Polarization & Bound Charge", "phy-125": "Electric-Field Energy & Energy Density",
  "phy-126": "Electric Current & Charge-Flow Rate", "phy-127": "Current Density & Drift Velocity", "phy-128": "Resistivity, Conductivity & Geometric Resistance", "phy-129": "Ohm’s Law & Local Conduction", "phy-130": "Electromotive Force & Internal Resistance", "phy-131": "Electric Power & Joule Heating", "phy-132": "Series, Parallel & Equivalent Resistance", "phy-133": "Kirchhoff’s Junction Rule", "phy-134": "Kirchhoff’s Loop Rule", "phy-135": "RC Charging Transients", "phy-136": "RC Discharge & Time Constants", "phy-137": "Meters, Loading Effects & Practical Measurement", "phy-138": "Non-Ohmic Devices & I–V Characteristics", "phy-139": "Sinusoidal AC & RMS Values", "phy-140": "RLC Impedance, Phase & Resonance",
  "phy-141": "The Lorentz Force", "phy-142": "Charged-Particle Motion in a Uniform Magnetic Field", "phy-143": "Magnetic Force on a Current-Carrying Wire", "phy-144": "The Biot–Savart Law", "phy-145": "Ampère’s Law & Symmetry", "phy-146": "Solenoids, Toroids & Magnetic-Field Confinement", "phy-147": "Magnetic Dipole Moment & Torque of a Current Loop", "phy-148": "Magnetic Flux", "phy-149": "Faraday’s Law of Induction", "phy-150": "Lenz’s Law & Energy Conservation", "phy-151": "Motional EMF & Conducting Rods", "phy-152": "Self-Inductance & Magnetic-Field Energy", "phy-153": "RL Transients", "phy-154": "Mutual Inductance & Ideal Transformers", "phy-155": "Displacement Current & the Ampère–Maxwell Law",
  "phy-156": "Maxwell’s Equations & Electromagnetic Waves", "phy-157": "The Speed of Light in Vacuum & Refractive Index", "phy-158": "The Poynting Vector, Intensity & Radiation Pressure", "phy-159": "The Electromagnetic Spectrum & Transverse Fields", "phy-160": "The Law of Reflection & the Ray Model", "phy-161": "Refraction & Snell’s Law", "phy-162": "Total Internal Reflection & the Critical Angle", "phy-163": "Imaging with Plane & Spherical Mirrors", "phy-164": "Thin Lenses & Refractive Imaging", "phy-165": "The Eye, Magnifier, Microscope & Telescope", "phy-166": "Huygens’ Principle, Coherence & Wavefronts", "phy-167": "Double-Slit & Multi-Source Interference", "phy-168": "Single-Slit Diffraction & Aperture Limits", "phy-169": "Diffraction Gratings & Resolving Power", "phy-170": "Polarization & Malus’s Law",
  "phy-171": "The Principle of Relativity & Invariant Light Speed", "phy-172": "The Lorentz Factor, Transformations & Time Dilation", "phy-173": "Relativity of Simultaneity & Length Contraction", "phy-174": "Relativistic Momentum & Energy", "phy-175": "Blackbody Radiation & Energy Quantization", "phy-176": "The Photoelectric Effect", "phy-177": "Photon Momentum & Compton Scattering", "phy-178": "de Broglie Matter Waves & Electron Diffraction", "phy-179": "Uncertainty Relations & Wave Packets", "phy-180": "Wave Functions, Probability Density & Expectation Values", "phy-181": "The Schrödinger Equation, Stationary States & Energy Levels", "phy-182": "Atomic Energy Levels, Spectra & the Bohr Correspondence", "phy-183": "Spin, the Pauli Principle & Fermion Occupation", "phy-184": "Nuclear Binding Energy, Mass Defect & Radioactivity", "phy-185": "Nuclear Fission, Fusion & Reaction Energy",
};

export function domainCopy(domain: Domain, locale: Locale) {
  if (locale === "zh-Hant") return { title: domain.title, subtitle: domain.subtitle };
  return DOMAIN_EN[domain.id] ?? { title: domain.title, subtitle: domain.subtitle };
}

export function clusterLabel(cluster: string, locale: Locale) {
  return locale === "en" ? CLUSTER_EN[cluster] ?? cluster : cluster;
}

export function levelLabel(level: LearningLevel, locale: Locale) {
  if (locale === "zh-Hant") return level;
  return ({ 基礎: "Foundation", 核心: "Core", 進階: "Advanced" } as const)[level];
}

export function trackLabel(track: Track, locale: Locale) {
  if (locale === "zh-Hant") return track;
  return ({ 共同基礎: "Shared Foundation", 微積分主線: "Calculus Path", 延伸: "Extension" } as const)[track];
}

export function conceptCopy(concept: ConceptNode, locale: Locale) {
  if (locale === "zh-Hant") {
    return {
      title: concept.title,
      cluster: concept.cluster,
      summary: concept.summary,
      evidence: concept.evidence,
      misconception: concept.misconception,
    };
  }
  const title = CONCEPT_TITLE_EN[concept.id] ?? concept.title;
  const subject = title.charAt(0).toLowerCase() + title.slice(1);
  return {
    title,
    cluster: clusterLabel(concept.cluster, locale),
    summary: `Builds a conceptual and quantitative understanding of ${subject}, including its physical meaning, assumptions, and range of validity.`,
    evidence: `Can explain ${subject}, interpret the governing relation, and apply it to a representative problem with consistent units, directions, and signs.`,
    misconception: `Avoid treating ${subject} as a formula-only rule; the system boundary, sign convention, model assumptions, and domain of validity still matter.`,
  };
}

export function sourceKindLabel(kind: string, locale: Locale) {
  if (locale === "zh-Hant") {
    return ({ curriculum: "課程範圍", course: "大學課程", standard: "標準與建議", assessment: "物理教育研究", textbook: "教材範圍", inspiration: "架構靈感", reference: "參考資料", 課程: "大學課程", 開放教科書: "教材範圍", 標準: "標準與建議", 物理教育研究: "物理教育研究", 實驗教學規範: "實驗教學規範" } as Record<string, string>)[kind] ?? "參考資料";
  }
  return ({ curriculum: "Curriculum Scope", course: "University Course", standard: "Standards & Guidance", assessment: "Physics Education Research", textbook: "Textbook Scope", inspiration: "Structural Inspiration", reference: "Reference", 課程: "University Course", 開放教科書: "Open Textbook", 標準: "Standards & Guidance", 物理教育研究: "Physics Education Research", 實驗教學規範: "Laboratory Curriculum Guidance" } as Record<string, string>)[kind] ?? "Reference";
}

export function sourceCopy(source: Source, locale: Locale) {
  if (locale === "zh-Hant") return { title: source.title, note: source.note };
  return {
    title: source.id === "ntu-ocw-physics" ? "General Physics (105S111)" : source.title,
    note: "Used to calibrate curriculum scope, terminology, conceptual depth, or research-based evidence for learning.",
  };
}

export const LEVEL_DESCRIPTIONS = {
  "zh-Hant": [
    { level: "基礎" as const, note: "測量、向量與模型" },
    { level: "核心" as const, note: "兩學期普通物理" },
    { level: "進階" as const, note: "微積分深化與近代延伸" },
  ],
  en: [
    { level: "基礎" as const, note: "Measurement, vectors & models" },
    { level: "核心" as const, note: "Two-semester general physics" },
    { level: "進階" as const, note: "Calculus depth & modern extensions" },
  ],
} as const;
