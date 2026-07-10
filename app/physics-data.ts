/**
 * 普通物理知識圖譜（微積分取向，繁體中文）。
 *
 * 編排原則：節點是可以用觀察、解釋、推導或計算來檢核的學習成果，
 * 而非課本章名。文字、分類與先修圖皆為本站原創；外部來源只用來校準
 * 課程範圍、術語、量測標準與物理教育研究中的常見概念困難。
 */

export type LearningLevel = "基礎" | "核心" | "進階";
export type Track = "共同基礎" | "微積分主線" | "延伸";
export type PrerequisiteKind = "hard" | "soft";
export type SourceKind =
  | "課程"
  | "開放教科書"
  | "標準"
  | "物理教育研究"
  | "實驗教學規範";

export interface Domain {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  color: string;
  order: number;
  clusters: string[];
}

export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  organization: string;
  url: string;
  note: string;
}

export interface Prerequisite {
  id: string;
  type: PrerequisiteKind;
  reason: string;
}

export interface ConceptNode {
  id: string;
  domainId: string;
  cluster: string;
  title: string;
  level: LearningLevel;
  track: Track;
  summary: string;
  equation: string;
  /** KaTeX-compatible LaTeX source generated from the canonical equation. */
  latex: string;
  evidence: string;
  misconception: string;
  prerequisites: Prerequisite[];
  sourceIds: string[];
}

export interface ConceptEdge {
  id: string;
  from: string;
  to: string;
  type: PrerequisiteKind;
  reason: string;
}

export const SOURCES: readonly Source[] = [
  {
    id: "ntu-ocw-physics",
    kind: "課程",
    title: "普通物理學（105S111）",
    organization: "國立臺灣大學開放式課程",
    url: "https://ocw.aca.ntu.edu.tw/courses/105S111",
    note: "繁體中文術語與兩學期普通物理範圍參照；涵蓋力學、流體、熱學、相對論、電磁學、光學與近代物理。",
  },
  {
    id: "openstax-up-v1",
    kind: "開放教科書",
    title: "University Physics Volume 1",
    organization: "OpenStax, Rice University",
    url: "https://openstax.org/details/books/university-physics-volume-1",
    note: "微積分普通物理的力學、振動、波與聲學範圍基準。",
  },
  {
    id: "openstax-up-v2",
    kind: "開放教科書",
    title: "University Physics Volume 2",
    organization: "OpenStax, Rice University",
    url: "https://openstax.org/details/books/university-physics-volume-2",
    note: "熱學、電場、電路、磁場與電磁感應的範圍基準。",
  },
  {
    id: "openstax-up-v3",
    kind: "開放教科書",
    title: "University Physics Volume 3",
    organization: "OpenStax, Rice University",
    url: "https://openstax.org/details/books/university-physics-volume-3",
    note: "電磁波、光學、相對論、量子、原子與核物理的範圍基準。",
  },
  {
    id: "mit-801",
    kind: "課程",
    title: "8.01SC Classical Mechanics",
    organization: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
    note: "以力、守恆量、轉動與實驗驗證組織經典力學。",
  },
  {
    id: "mit-802",
    kind: "課程",
    title: "8.02 Physics II: Electricity and Magnetism",
    organization: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/",
    note: "靜電、磁場與力、Maxwell 方程組及電磁輻射的課程範圍。",
  },
  {
    id: "mit-803",
    kind: "課程",
    title: "8.03SC Physics III: Vibrations and Waves",
    organization: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/",
    note: "振動、阻尼、驅動、正常模態與波動的進階銜接。",
  },
  {
    id: "nist-si",
    kind: "標準",
    title: "NIST Special Publication 330: The International System of Units (SI), 2019 Edition",
    organization: "National Institute of Standards and Technology",
    url: "https://www.nist.gov/pml/special-publication-330",
    note: "SI 單位、量綱與由定義常數建立單位的權威依據。",
  },
  {
    id: "physport-fci",
    kind: "物理教育研究",
    title: "Force Concept Inventory (FCI) assessment page",
    organization: "PhysPort",
    url: "https://www.physport.org/assessments/assessment.cfm?A=FCI",
    note: "用來校準運動學與牛頓力學常見迷思；本站不重製受保護題目。",
  },
  {
    id: "fci-doi",
    kind: "物理教育研究",
    title: "Force Concept Inventory",
    organization: "The Physics Teacher",
    url: "https://doi.org/10.1119/1.2343497",
    note: "Hestenes、Wells 與 Swackhamer（1992）的 FCI 原始論文。",
  },
  {
    id: "physport-bema",
    kind: "物理教育研究",
    title: "Brief Electricity and Magnetism Assessment (BEMA)",
    organization: "PhysPort",
    url: "https://www.physport.org/assessments/assessment.cfm?A=BEMA",
    note: "用來校準基礎電磁學的概念覆蓋與常見推理困難。",
  },
  {
    id: "bema-doi",
    kind: "物理教育研究",
    title: "Evaluating an electricity and magnetism assessment tool: BEMA",
    organization: "Physical Review ST Physics Education Research",
    url: "https://doi.org/10.1103/PhysRevSTPER.2.010105",
    note: "Ding、Chabay、Sherwood 與 Beichner（2006）的 BEMA 效度研究。",
  },
  {
    id: "csem-doi",
    kind: "物理教育研究",
    title: "Surveying students' conceptual knowledge of electricity and magnetism",
    organization: "American Journal of Physics",
    url: "https://doi.org/10.1119/1.1371296",
    note: "Maloney 等人（2001）的 CSEM 研究，涵蓋靜電至電磁感應。",
  },
  {
    id: "tce-doi",
    kind: "物理教育研究",
    title: "Introductory thermal concept evaluation: assessing students' understanding",
    organization: "The Physics Teacher",
    url: "https://doi.org/10.1119/1.1424603",
    note: "Yeo 與 Zadnik（2001）的 Thermal Concept Evaluation，校準溫度、熱與相變等常見概念困難。",
  },
  {
    id: "mwcs2-doi",
    kind: "物理教育研究",
    title: "Mechanical waves conceptual survey: modification and standard multiple-choice test",
    organization: "Physical Review Physics Education Research",
    url: "https://doi.org/10.1103/PhysRevPhysEducRes.12.010107",
    note: "Barniol 與 Zavala（2016）的機械波概念量表，涵蓋傳播、疊加、反射與駐波。",
  },
  {
    id: "rci-doi",
    kind: "物理教育研究",
    title: "Relativity concept inventory: Development, analysis, and results",
    organization: "Physical Review ST Physics Education Research",
    url: "https://doi.org/10.1103/PhysRevSTPER.9.010118",
    note: "Aslanides 與 Savage（2013）的 RCI，校準同時性、時間膨脹與長度收縮等迷思。",
  },
  {
    id: "qmcs-doi",
    kind: "物理教育研究",
    title: "Design and validation of the Quantum Mechanics Conceptual Survey",
    organization: "Physical Review ST Physics Education Research",
    url: "https://doi.org/10.1103/PhysRevSTPER.6.020121",
    note: "McKagan、Perkins 與 Wieman（2010）的 QMCS，校準近代物理課程中的量子概念範圍。",
  },
  {
    id: "laverty-caballero-doi",
    kind: "物理教育研究",
    title: "Analysis of the most common concept inventories in physics: What are we assessing?",
    organization: "Physical Review Physics Education Research",
    url: "https://doi.org/10.1103/PhysRevPhysEducRes.14.010123",
    note: "提醒概念量表主要提供核心概念證據，仍須另設科學實作與跨概念的表現任務。",
  },
  {
    id: "aapt-lab",
    kind: "實驗教學規範",
    title: "AAPT Recommendations for the Undergraduate Physics Laboratory Curriculum",
    organization: "American Association of Physics Teachers",
    url: "https://www.aapt.org/resources/upload/LabGuidlinesDocument_EBendorsed_nov10.pdf",
    note: "量測、建模、實驗設計、資料分析與科學溝通的學習成果依據。",
  },
] as const;

/** 只標示資訊架構與視覺敘事的靈感；不列入物理內容來源。 */
export const MARBLE_ATTRIBUTION = {
  title: "OS Taxonomy",
  creator: "Marble",
  repositoryUrl: "https://github.com/withmarbleapp/os-taxonomy",
  curriculumUrl: "https://withmarble.com/curriculum/",
  note: "本站借鏡其以領域、群組與可展開節點呈現知識地圖的方式；中文物理分類、文字、證據與先修關係皆重新設計。",
} as const;

export const DOMAINS: readonly Domain[] = [
  { id: "d01-foundations", code: "01", title: "量測與數學語言", subtitle: "把自然現象轉成可檢驗的量、圖與模型", color: "#44D7B6", order: 1, clusters: ["物理量與尺度", "向量工具", "微積分工具", "實驗與資料"] },
  { id: "d02-kinematics", code: "02", title: "運動學", subtitle: "不先問成因，精確描述位置如何隨時間改變", color: "#5AB0FF", order: 2, clusters: ["一維運動", "多維運動", "曲線與相對運動", "數值表徵"] },
  { id: "d03-dynamics", code: "03", title: "力與牛頓定律", subtitle: "以交互作用解釋運動改變", color: "#7A8CFF", order: 3, clusters: ["牛頓架構", "常見作用力", "曲線與非慣性系", "約束與平衡"] },
  { id: "d04-conservation", code: "04", title: "能量與動量", subtitle: "從系統觀點追蹤跨時間不變的量", color: "#A879FF", order: 4, clusters: ["功與能", "位能與守恆", "衝量與動量", "碰撞與系統"] },
  { id: "d05-rotation-gravity-fluids", code: "05", title: "轉動、引力與流體", subtitle: "由質點推廣到剛體、軌道與連續介質", color: "#D66DCC", order: 5, clusters: ["剛體轉動", "角動量與平衡", "萬有引力", "流體"] },
  { id: "d06-oscillations-waves", code: "06", title: "振動與機械波", subtitle: "由局部週期運動走向傳播、干涉與聲音", color: "#FF6B8A", order: 6, clusters: ["簡諧振動", "阻尼與驅動", "行波", "疊加與聲學"] },
  { id: "d07-thermodynamics", code: "07", title: "熱學與統計觀點", subtitle: "連結巨觀狀態量、能量流與微觀機率", color: "#FF8A5B", order: 7, clusters: ["溫度與物態", "分子模型", "熱傳與功", "熱力學定律"] },
  { id: "d08-electrostatics", code: "08", title: "靜電場與電位", subtitle: "以場與位能描述電荷的遠距作用", color: "#F7B84B", order: 8, clusters: ["電荷與電場", "通量與高斯定律", "電位", "電容與介質"] },
  { id: "d09-circuits", code: "09", title: "直流與交流電路", subtitle: "把電磁概念濃縮成元件與網路模型", color: "#D9CE4A", order: 9, clusters: ["電流與材料", "電源與功率", "網路定律", "暫態與交流"] },
  { id: "d10-magnetism-induction", code: "10", title: "磁場與電磁感應", subtitle: "理解移動電荷、變動磁通與場的統一", color: "#8FD05A", order: 10, clusters: ["磁力", "磁場來源", "感應", "電感與 Maxwell 補全"] },
  { id: "d11-optics-em", code: "11", title: "電磁波與光學", subtitle: "從 Maxwell 波到成像、干涉與繞射", color: "#35C98D", order: 11, clusters: ["電磁波", "幾何光學", "成像", "波動光學"] },
  { id: "d12-modern", code: "12", title: "近代物理", subtitle: "在高速、微觀與核尺度重建直覺", color: "#3AC6C8", order: 12, clusters: ["狹義相對論", "光量子", "物質波與量子力學", "原子與原子核"] },
] as const;

type Seed = Omit<ConceptNode, "domainId" | "sourceIds" | "latex"> & { extraSourceIds?: string[] };

const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5",
  "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-", "ⁿ": "n",
};

const SUBSCRIPTS: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5",
  "₆": "6", "₇": "7", "₈": "8", "₉": "9", "₊": "+", "₋": "-", "ᵢ": "i", "ₙ": "n",
};

function convertUnicodeScripts(value: string): string {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const scriptMap = SUPERSCRIPTS[character] ? SUPERSCRIPTS : SUBSCRIPTS[character] ? SUBSCRIPTS : null;
    if (!scriptMap) {
      result += character;
      continue;
    }

    const marker = scriptMap === SUPERSCRIPTS ? "^" : "_";
    let content = "";
    while (index < value.length && scriptMap[value[index]]) {
      content += scriptMap[value[index]];
      index += 1;
    }
    index -= 1;
    result += `${marker}{${content}}`;
  }
  return result;
}

/** Convert the compact display equation into real, copyable LaTeX source. */
export function equationToLatex(equation: string): string {
  let latex = convertUnicodeScripts(equation.normalize("NFC"));

  latex = latex
    .replace(/([A-Za-z])⃗/g, "\\vec{$1}")
    .replace(/([A-Za-zθ])̂/g, "\\hat{$1}")
    .replace(/([A-Za-z])̄/g, "\\bar{$1}")
    .replace(/â/g, "\\hat{a}")
    .replace(/î/g, "\\hat{i}")
    .replace(/ĵ/g, "\\hat{j}")
    .replace(/k̂/g, "\\hat{k}")
    .replace(/x¨/g, "\\ddot{x}")
    .replace(/q¨/g, "\\ddot{q}")
    .replace(/θ¨/g, "\\ddot{\\theta}")
    .replace(/ẋ/g, "\\dot{x}")
    .replace(/θ̇/g, "\\dot{\\theta}")
    .replace(/ṙ/g, "\\dot{r}");

  const greek: Record<string, string> = {
    α: "\\alpha", β: "\\beta", γ: "\\gamma", Δ: "\\Delta", δ: "\\delta",
    ε: "\\varepsilon", η: "\\eta", θ: "\\theta", κ: "\\kappa", λ: "\\lambda",
    μ: "\\mu", π: "\\pi", ρ: "\\rho", σ: "\\sigma", τ: "\\tau",
    φ: "\\phi", Φ: "\\Phi", ψ: "\\psi", ω: "\\omega", Ω: "\\Omega", ℓ: "\\ell",
  };
  latex = latex.replace(/[αβγΔδεηθκλμπρστφΦψωΩℓ]/g, (character) => greek[character]);

  latex = latex
    .replace(/ℰ/g, "\\mathcal{E}")
    .replace(/ħ/g, "\\hbar")
    .replace(/Ĥ/g, "\\hat{H}")
    .replace(/″/g, "''")
    .replace(/∇/g, "\\nabla ")
    .replace(/∂/g, "\\partial ")
    .replace(/∮/g, "\\oint ")
    .replace(/∫/g, "\\int ")
    .replace(/Σ/g, "\\sum ")
    .replace(/⟨/g, "\\langle ")
    .replace(/⟩/g, "\\rangle ")
    .replace(/√\(([^()]*)\)/g, "\\sqrt{$1}")
    .replace(/√([^；\s]+)/g, "\\sqrt{$1}")
    .replace(/½/g, "\\frac{1}{2}")
    .replace(/⅓/g, "\\frac{1}{3}")
    .replace(/×/g, "\\times ")
    .replace(/·/g, "\\cdot ")
    .replace(/−/g, "-")
    .replace(/±/g, "\\pm ")
    .replace(/∓/g, "\\mp ")
    .replace(/≈/g, "\\approx ")
    .replace(/≥/g, "\\ge ")
    .replace(/≤/g, "\\le ")
    .replace(/∝/g, "\\propto ")
    .replace(/⇒/g, "\\Rightarrow ")
    .replace(/↔/g, "\\leftrightarrow ")
    .replace(/→/g, "\\to ")
    .replace(/⊥/g, "\\perp ")
    .replace(/∞/g, "\\infty ")
    .replace(/lim\(([^)]*)\)/g, "\\lim_{$1}")
    .replace(/\bcos\b/g, "\\cos")
    .replace(/\bsin\b/g, "\\sin")
    .replace(/\bln\b/g, "\\ln")
    .replace(/\blog\b/g, "\\log")
    .replace(/\bdet\b/g, "\\det")
    .replace(/e\^\(([^()]*)\)/g, "e^{$1}")
    .replace(/\^\(([^()]*)\)/g, "^{$1}");

  const wordSubscripts = [
    "on", "by", "ext", "net", "frame", "system", "cons", "cm", "rel", "orbit",
    "fluid", "displaced", "eff", "total", "model", "cond", "rad", "env", "rms",
    "quadratic", "rev", "universe", "test", "enclosed", "inside", "outside", "other",
    "series", "parallel", "node", "loop", "source", "terminal", "stop", "initial", "final",
    "medium", "max", "min", "beat", "telescope", "toroid", "solenoid", "cond",
  ];
  for (const word of wordSubscripts) {
    latex = latex.replace(new RegExp(`_${word}\\b`, "g"), `_{\\mathrm{${word}}}`);
  }

  latex = latex
    .replace(/\b(COP|Re|PV)\b/g, "\\mathrm{$1}")
    .replace(/([0-9])\s*(km|kg|cm|mm|m|s|h|N|J|Pa|eV)\b/g, "$1\\,\\mathrm{$2}")
    .replace(/([\u3400-\u9fff]+(?:[、—－][\u3400-\u9fff]+)*)/g, "\\text{$1}")
    .replace(/（/g, "\\;(\\text{")
    .replace(/）/g, "})")
    .replace(/；/g, "\\qquad ")
    .replace(/，/g, ",\\;")
    .replace(/：/g, ":\\;")
    .replace(/\s+/g, " ")
    .replace(/\\text\{n_\{1\}>n_\{2\}\}/g, "n_{1}>n_{2}")
    .trim();

  return latex;
}

const hard = (id: string, reason: string): Prerequisite => ({ id, type: "hard", reason });
const soft = (id: string, reason: string): Prerequisite => ({ id, type: "soft", reason });

const DOMAIN_SOURCE_IDS: Record<string, string[]> = {
  "d01-foundations": ["ntu-ocw-physics", "openstax-up-v1", "nist-si", "aapt-lab"],
  "d02-kinematics": ["ntu-ocw-physics", "openstax-up-v1", "mit-801", "physport-fci", "fci-doi"],
  "d03-dynamics": ["ntu-ocw-physics", "openstax-up-v1", "mit-801", "physport-fci", "fci-doi"],
  "d04-conservation": ["ntu-ocw-physics", "openstax-up-v1", "mit-801"],
  "d05-rotation-gravity-fluids": ["ntu-ocw-physics", "openstax-up-v1", "mit-801"],
  "d06-oscillations-waves": ["ntu-ocw-physics", "openstax-up-v1", "mit-803", "mwcs2-doi"],
  "d07-thermodynamics": ["ntu-ocw-physics", "openstax-up-v2", "tce-doi"],
  "d08-electrostatics": ["ntu-ocw-physics", "openstax-up-v2", "mit-802", "physport-bema", "bema-doi", "csem-doi"],
  "d09-circuits": ["ntu-ocw-physics", "openstax-up-v2", "mit-802", "physport-bema", "bema-doi", "csem-doi"],
  "d10-magnetism-induction": ["ntu-ocw-physics", "openstax-up-v2", "mit-802", "physport-bema", "bema-doi", "csem-doi"],
  "d11-optics-em": ["ntu-ocw-physics", "openstax-up-v3", "mit-802"],
  "d12-modern": ["ntu-ocw-physics", "openstax-up-v3", "nist-si", "rci-doi", "qmcs-doi"],
};

const materialize = (domainId: string, seeds: Seed[]): ConceptNode[] =>
  seeds.map(({ extraSourceIds = [], ...seed }) => ({
    ...seed,
    latex: equationToLatex(seed.equation),
    domainId,
    sourceIds: [...DOMAIN_SOURCE_IDS[domainId], ...extraSourceIds],
  }));

const node = (
  id: string,
  cluster: string,
  title: string,
  level: LearningLevel,
  track: Track,
  summary: string,
  equation: string,
  evidence: string,
  misconception: string,
  prerequisites: Prerequisite[],
  extraSourceIds: string[] = [],
): Seed => ({ id, cluster, title, level, track, summary, equation, evidence, misconception, prerequisites, extraSourceIds });

const D01: Seed[] = [
  node("phy-001", "物理量與尺度", "物理量、模型與可檢驗命題", "基礎", "共同基礎", "區分現象、理想化模型與模型可產生的定量預測。", "物理量 = 數值 × 單位", "能為一個真實情境選定系統、變數與可否證的預測。", "誤以為模型愈像實物、細節愈多就必然愈好。", []),
  node("phy-002", "物理量與尺度", "SI 基本量、導出量與單位", "基礎", "共同基礎", "用一致的 SI 基本單位表達長度、質量、時間與其他物理量。", "1 N = 1 kg·m·s⁻²", "能把複合量拆成 SI 基本單位並辨認量綱。", "誤以為單位只是答案後面的標籤，不參與推理。", [hard("phy-001", "必須先知道物理量如何承載可比較的測量。")]),
  node("phy-003", "物理量與尺度", "單位換算與比例因子", "基礎", "共同基礎", "把等於一的換算因子連乘，保持物理量不變而改寫單位。", "72 km/h × 1000 m/km × 1 h/3600 s = 20 m/s", "能寫出每一步可消去單位的換算鏈。", "誤以為換單位只要移動小數點，無須追蹤量綱。", [hard("phy-002", "換算依賴對單位與物理量的區分。")]),
  node("phy-004", "物理量與尺度", "量綱分析與尺度律", "核心", "共同基礎", "利用量綱齊次性檢查方程式，並推測變數間可能的冪次關係。", "[Q] = MᵃLᵇTᶜ", "能排除量綱不合的公式並建構無因次組合。", "誤以為量綱正確就足以證明公式正確。", [hard("phy-002", "量綱分析以基本量與導出量為語法。"), soft("phy-003", "熟悉換算可強化單位消去的操作感。")]),
  node("phy-005", "物理量與尺度", "數量級、估算與極限檢查", "基礎", "共同基礎", "以十的冪次、代表尺度與邊界情形快速判斷答案是否合理。", "Q ≈ 10ⁿ × 代表係數", "能在缺少細節時提出有假設的費米估算。", "誤以為估算是不精確的猜測，不能用來驗證計算。", [hard("phy-003", "合理估算仍須保持單位與比例一致。")]),
  node("phy-006", "向量工具", "純量、向量與幾何表示", "基礎", "共同基礎", "以大小與方向描述向量，並區分向量量與純量量。", "A⃗ = |A⃗| â", "能用箭頭與文字說明向量相等、相反與相加。", "誤以為向量的正負只代表大小為正或負。", [hard("phy-001", "需先辨認物理量及其操作意義。")]),
  node("phy-007", "向量工具", "分量、基底與單位向量", "基礎", "共同基礎", "把向量投影到選定座標基底，並由分量重建幾何向量。", "A⃗ = Aₓî + Aᵧĵ + A_zk̂", "能在旋轉座標軸後重新求分量而保持向量本身不變。", "誤以為向量分量是物體固有、不隨座標選擇改變的量。", [hard("phy-006", "分量是向量在基底方向上的表示。")]),
  node("phy-008", "向量工具", "內積與投影", "核心", "微積分主線", "以內積量化兩向量的方向對齊程度，取得投影與夾角。", "A⃗·B⃗ = AB cosθ = AₓBₓ + AᵧBᵧ + A_zB_z", "能判斷功或通量類計算中哪個分量有效。", "誤以為內積等於兩向量大小直接相乘，忽略夾角。", [hard("phy-007", "內積的分量計算需要向量分解。")]),
  node("phy-009", "向量工具", "外積與右手定則", "核心", "微積分主線", "以外積建立垂直於兩向量平面的有向面積向量。", "A⃗×B⃗ = AB sinθ n̂", "能同時求外積大小、方向並說明交換順序的符號。", "誤以為右手定則決定物理因果，而不是外積方向的約定。", [hard("phy-007", "外積的計算與方向判定建立在向量分量上。")]),
  node("phy-010", "微積分工具", "導數作為瞬時變化率", "核心", "微積分主線", "把導數理解為有限差商在時間或空間間隔趨近零的極限。", "df/dx = lim(Δx→0) Δf/Δx", "能從函數、表格或圖形估計某點的瞬時斜率。", "誤以為導數只是代公式，與局部變化的物理意義無關。", [hard("phy-001", "先要知道被比較的是哪一個可測物理量。")]),
  node("phy-011", "微積分工具", "積分作為累積與連續加總", "核心", "微積分主線", "把積分視為無窮小貢獻的極限總和，並用基本定理連結導數。", "∫ₐᵇ f(x)dx = lim Σ f(xᵢ)Δx", "能由變化率曲線求一段區間的淨累積量。", "誤以為積分面積永遠為正，忽略帶符號的累積。", [hard("phy-010", "基本定理以瞬時變化率連結總變化。")]),
  node("phy-012", "實驗與資料", "不確定度、有效數字與傳播", "核心", "共同基礎", "以測量區間與不確定度表達資料品質，並傳播到導出量。", "σ_f² ≈ Σ(∂f/∂xᵢ)²σᵢ²", "能報告含單位、合理位數與不確定度的結果。", "誤以為更多小數位代表更準確，或不確定度等同操作錯誤。", [hard("phy-002", "測量值及不確定度必須共享一致單位。"), soft("phy-005", "尺度判斷有助辨識不合理精度。")]),
  node("phy-013", "實驗與資料", "圖形的斜率、截距與面積", "核心", "共同基礎", "把圖形幾何特徵翻譯成變數間的局部關係與累積量。", "斜率 = Δy/Δx；面積 = ∫y dx", "能為坐標軸附量與單位，並解釋斜率或面積的單位。", "誤以為任何圖線的斜率與曲線下方面積都有相同物理意義。", [hard("phy-010", "斜率的極限意義來自導數。"), hard("phy-011", "曲線下帶號面積的意義來自積分。")]),
  node("phy-014", "實驗與資料", "線性化、擬合與殘差", "進階", "微積分主線", "用變數轉換與殘差圖檢驗模型，而不只追求漂亮的直線。", "y = axⁿ ⇒ ln y = ln a + n ln x", "能由斜率、截距及殘差判斷冪次模型是否受資料支持。", "誤以為相關係數接近一就證明模型與因果關係。", [hard("phy-013", "擬合參數的物理意義需由圖形斜率與截距解讀。"), soft("phy-012", "不確定度可判斷殘差是否顯著。")]),
  node("phy-015", "實驗與資料", "實驗設計、控制變因與模型修正", "進階", "共同基礎", "規劃可重現的測量，區分隨機與系統效應，並以證據修正模型。", "殘差 rᵢ = yᵢ − y_model(xᵢ)", "能提出對照、校正與重複測量方案，並用殘差支持結論。", "誤以為實驗只是驗證已知答案，與模型生成無關。", [hard("phy-012", "設計必須預先考慮測量解析度與不確定度。"), hard("phy-014", "模型比較需要擬合與殘差證據。")], ["laverty-caballero-doi"]),
];

const D02: Seed[] = [
  node("phy-016", "一維運動", "參考系、座標與時鐘", "基礎", "共同基礎", "說明位置與運動敘述相對於哪一組座標軸、原點與時間基準。", "事件 = (t, x, y, z)", "能為同一運動選兩個參考系並比較描述差異。", "誤以為物體有不依觀察者而定的絕對速度。", [hard("phy-006", "參考系以向量與座標表達空間關係。")]),
  node("phy-017", "一維運動", "位置、位移與路程", "基礎", "共同基礎", "以位置函數描述物體，並區分端點位移與實際路徑長。", "Δx = x_f − x_i；路程 = ∫|dx|", "能從運動路徑同時計算位移與路程並解釋差異。", "誤以為位移大小必定等於走過的路程。", [hard("phy-016", "位置與位移必須相對既定參考系定義。")]),
  node("phy-018", "一維運動", "平均速率與平均速度", "基礎", "共同基礎", "平均速度取淨位移除以時間，平均速率則取總路程除以時間。", "v̄ = Δx/Δt；平均速率 = 路程/Δt", "能在往返行程中分別求兩種平均並判斷方向。", "誤以為平均速度是初速與末速的算術平均。", [hard("phy-017", "兩種平均的差異來自位移與路程。")]),
  node("phy-019", "一維運動", "瞬時速度", "核心", "微積分主線", "讓時間區間趨近零，由位置函數取得某瞬間的速度與方向。", "v = dx/dt", "能從 x–t 圖的切線或位置函數求指定時刻速度。", "誤以為位置為零時速度也必為零。", [hard("phy-018", "瞬時速度是平均速度的極限。"), hard("phy-010", "瞬時變化率需要導數概念。")]),
  node("phy-020", "一維運動", "加速度", "核心", "微積分主線", "用速度的瞬時變化率描述速度大小或方向如何改變。", "a = dv/dt = d²x/dt²", "能依 v–t 圖斜率判斷加速度符號及快慢變化。", "誤以為加速度為負必表示物體正在減速。", [hard("phy-019", "加速度描述速度的變化。"), hard("phy-010", "必須以導數定義瞬時變化率。")]),
  node("phy-021", "一維運動", "等加速度運動", "核心", "共同基礎", "在加速度為常數的模型下連結位置、速度與時間。", "x = x₀ + v₀t + ½at²；v = v₀ + at", "能先檢查等加速度假設，再選用不含多餘未知數的關係式。", "誤以為所有直線運動都能套等加速度公式。", [hard("phy-020", "等加速度是加速度定義下的一個特殊模型。")]),
  node("phy-022", "一維運動", "近地面自由落體", "基礎", "共同基礎", "忽略空氣阻力時，所有物體具有相同向下重力加速度。", "a_y = −g ≈ −9.8 m/s²", "能依自選正方向一致地寫出拋上與落下各階段運動。", "誤以為較重物體的自由落體加速度較大，或最高點加速度為零。", [hard("phy-021", "近地自由落體採固定加速度模型。")]),
  node("phy-023", "多維運動", "向量位置、速度與加速度", "核心", "微積分主線", "對位置向量逐分量微分，描述平面與空間中的運動。", "v⃗ = dr⃗/dt；a⃗ = d²r⃗/dt²", "能由參數式軌跡求速度、加速度及瞬時運動方向。", "誤以為速度與加速度必須同方向。", [hard("phy-007", "多維運動須用分量表示向量。"), hard("phy-019", "各分量的瞬時變化率就是速度。")]),
  node("phy-024", "多維運動", "拋體運動與分量獨立性", "核心", "共同基礎", "忽略阻力時，水平分量等速、鉛直分量等加速度且共享同一時間。", "x = v₀cosθ·t；y = y₀ + v₀sinθ·t − ½gt²", "能由情境建立兩軸方程並以共同時間聯立。", "誤以為水平速度會在飛行中被重力逐漸消耗。", [hard("phy-021", "鉛直分量使用等加速度模型。"), hard("phy-023", "需要把同一向量運動分解到兩軸。"), soft("phy-022", "自由落體提供鉛直分量的具體模型。")]),
  node("phy-025", "曲線與相對運動", "相對位置與相對速度", "核心", "共同基礎", "以向量差連結不同移動觀察者對同一事件的速度描述。", "v⃗_A/B = v⃗_A/G − v⃗_B/G", "能畫速度向量三角形解船流、風速或追及問題。", "誤以為相對速度只要把兩個速率相減，不需顧方向。", [hard("phy-016", "相對運動先要標明各參考系。"), hard("phy-023", "速度合成是向量運算。")]),
  node("phy-026", "曲線與相對運動", "等速率圓周運動", "核心", "共同基礎", "即使速率不變，速度方向持續改變，因此有指向圓心的加速度。", "a_c = v²/r = ω²r", "能由速度向量變化推導向心加速度大小與方向。", "誤以為等速率代表速度不變、所以加速度為零。", [hard("phy-023", "圓周運動的加速度來自速度向量方向改變。"), soft("phy-009", "外積可簡潔表示角速度與切向速度。")]),
  node("phy-027", "曲線與相對運動", "切向—法向加速度", "進階", "微積分主線", "把曲線運動加速度分成改變速率的切向分量與改變方向的法向分量。", "a⃗ = (dv/dt)t̂ + (v²/ρ)n̂", "能由速率函數與曲率半徑判定兩個加速度分量。", "誤以為曲線上任何加速度都只指向曲率中心。", [hard("phy-020", "要先理解加速度是完整速度向量的變化率。"), hard("phy-026", "法向加速度由圓周運動局部化而來。")]),
  node("phy-028", "曲線與相對運動", "極座標運動學", "進階", "微積分主線", "考慮極座標基底本身隨角度旋轉，推得徑向與方位速度、加速度。", "v⃗ = ṙ r̂ + rθ̇ θ̂", "能正確寫出極座標加速度，包含科氏型交叉項。", "誤以為對極座標分量微分時單位向量保持不變。", [hard("phy-007", "極座標仍需掌握隨位置改變的基底。"), hard("phy-010", "速度與加速度來自時間微分。"), soft("phy-026", "圓周運動是 r 固定的特例。")]),
  node("phy-029", "數值表徵", "運動圖形的跨表徵推理", "核心", "共同基礎", "在位置—時間、速度—時間與加速度—時間圖間用斜率及面積轉換。", "Δx = ∫v dt；Δv = ∫a dt", "能由任一運動圖定性畫出另外兩圖並標示轉折。", "誤以為位置圖線的高度就是物體速度，或把圖線當實際路徑。", [hard("phy-013", "跨圖轉換依賴斜率與面積。"), hard("phy-019", "位置圖斜率是速度。"), hard("phy-020", "速度圖斜率是加速度。")]),
  node("phy-030", "數值表徵", "離散資料與數值積分運動", "進階", "延伸", "由取樣資料用有限差分和逐步積分重建速度與位置，並評估步長誤差。", "vₙ₊₁ ≈ vₙ + aₙΔt；xₙ₊₁ ≈ xₙ + vₙΔt", "能以試算或程式模擬非恆定加速度並用縮小步長檢查收斂。", "誤以為電腦輸出的更多位數等同更準確的物理解。", [hard("phy-011", "逐步更新是積分的離散近似。"), hard("phy-020", "更新量由加速度定義取得。"), soft("phy-029", "圖形可用來檢核數值軌跡。")]),
];

const D03: Seed[] = [
  node("phy-031", "牛頓架構", "慣性與質量", "基礎", "共同基礎", "質量量化物體對速度改變的抗拒程度，而非物體所受力的大小。", "同力下 a ∝ 1/m", "能用相同外力造成不同加速度的證據比較慣性質量。", "誤以為質量大的物體必然運動得慢或需要力來維持速度。", [hard("phy-001", "需先區分物體屬性、交互作用與模型量。")]),
  node("phy-032", "牛頓架構", "交互作用與力的分類", "基礎", "共同基礎", "把力視為物體間交互作用，依接觸或遠距來源辨識施力者與受力者。", "F⃗_on A by B", "能為每一個力命名受力物、施力物及作用種類。", "誤以為運動方向本身是一種力，或物體攜帶著力。", [hard("phy-031", "須先把物體屬性與外界作用分開。")]),
  node("phy-033", "牛頓架構", "自由體圖與系統邊界", "核心", "共同基礎", "隔離選定系統，只畫外界對系統施加的力，並以向量分量組織。", "ΣF⃗_ext = 各外力向量和", "能為同一裝置選不同系統邊界並畫出一致的自由體圖。", "誤以為自由體圖要畫速度、加速度，或同時畫作用與反作用力。", [hard("phy-032", "每支力箭頭必須對應一個可辨識的交互作用。"), hard("phy-007", "合力需以向量分量相加。")]),
  node("phy-034", "牛頓架構", "牛頓第一定律與慣性系", "核心", "共同基礎", "在合外力為零的慣性系中，物體速度向量保持不變。", "ΣF⃗ = 0 ⇒ v⃗ = 常數", "能判斷靜止與等速度運動皆可能是零合力狀態。", "誤以為物體只要在移動就一定有同方向合力。", [hard("phy-016", "慣性定律的陳述依賴參考系。"), hard("phy-032", "零合力是交互作用向量和的條件。")]),
  node("phy-035", "牛頓架構", "牛頓第二定律", "核心", "共同基礎", "合外力決定動量變化；質量固定且低速時化為質量乘加速度。", "ΣF⃗_ext = dp⃗/dt；m 固定時 = ma⃗", "能由自由體圖逐軸列式並預測加速度，而非只代公式。", "誤以為 ma 是額外的一個力，或每一個力各自等於 ma。", [hard("phy-020", "第二定律把合力連到加速度。"), hard("phy-033", "必須先正確取得系統合外力。")]),
  node("phy-036", "牛頓架構", "牛頓第三定律", "核心", "共同基礎", "兩物體交互作用時，同時互施大小相等、方向相反且作用在不同物體上的力。", "F⃗_A on B = −F⃗_B on A", "能從力的名稱配對作用—反作用並說明為何不互相抵消。", "誤以為較重或正在加速的一方施力較大。", [hard("phy-032", "第三定律配對需清楚標記施力與受力物。")]),
  node("phy-037", "常見作用力", "重量與近地重力", "基礎", "共同基礎", "重量是地球對物體的重力，不等於質量，也不等同秤的讀數。", "W⃗ = mg⃗", "能在電梯或斜面情境中分開重量與支持力。", "誤以為失重代表重力消失，或重量就是物體壓秤的力。", [hard("phy-035", "重量是代入第二定律的其中一個外力。")]),
  node("phy-038", "常見作用力", "支持力與接觸幾何", "基礎", "共同基礎", "理想支持力垂直於接觸面，大小由約束和整體動力學決定。", "N = 非固定的約束反力", "能用法向方向的第二定律求支持力，而不預設 N = mg。", "誤以為支持力永遠等於重量，或是物體自身產生的力。", [hard("phy-033", "支持力需在正確系統自由體圖中辨認。")]),
  node("phy-039", "常見作用力", "繩張力、滑輪與理想繩模型", "核心", "共同基礎", "在無質量繩與無摩擦滑輪模型中，同一段繩張力相同，實際裝置則須另行判斷。", "理想同繩段：T₁ = T₂", "能為多物體系統分別畫圖並用繩長約束連立。", "誤以為滑輪必定把力放大，或所有相連繩段張力都相等。", [hard("phy-033", "張力必須作為外力畫在各受力物上。"), soft("phy-036", "第三定律有助區分繩兩端的不同交互作用配對。")]),
  node("phy-040", "常見作用力", "彈性力與虎克定律", "核心", "共同基礎", "在小形變線性區，彈簧力與相對平衡位置的位移成反比且反向。", "Fₛ = −kx", "能由力—伸長圖求彈力常數並辨識偏離線性區。", "誤以為 k 是彈簧受力大小，或負號代表力的大小為負。", [hard("phy-035", "彈力進入第二定律以決定運動。"), soft("phy-013", "力—伸長圖斜率提供 k。")]),
  node("phy-041", "常見作用力", "靜摩擦與動摩擦", "核心", "共同基礎", "靜摩擦依維持不滑所需而調整至上限；滑動後用動摩擦近似。", "0 ≤ f_s ≤ μ_sN；f_k ≈ μ_kN", "能先由運動條件求所需靜摩擦，再檢查是否超過上限。", "誤以為靜摩擦永遠等於 μ_sN，或摩擦總與速度反向。", [hard("phy-035", "摩擦大小需由第二定律與運動狀態共同決定。"), hard("phy-038", "摩擦模型中的上限取決於支持力。")]),
  node("phy-042", "常見作用力", "阻力與終端速度", "進階", "微積分主線", "介質阻力依速度而變，使運動方程非等加速度；終端速度時合力為零。", "m dv/dt = mg − bv 或 mg − cv²", "能從受力模型判斷終端速度並用數值法畫出漸近過程。", "誤以為到達終端速度是因重力消失，或加速度突然歸零。", [hard("phy-035", "速度相依力仍須放入牛頓第二定律。"), soft("phy-030", "非線性阻力常需數值積分。")]),
  node("phy-043", "曲線與非慣性系", "圓周運動的受力分析", "核心", "共同基礎", "向心力不是新力，而是所有真實力在指向圓心方向的合力。", "ΣF_r = mv²/r", "能從自由體圖找出提供向心加速度的力或力分量。", "誤以為必須另外畫一支向心力，或勻速圓周合力為零。", [hard("phy-026", "需先知道圓周運動所需的向心加速度。"), hard("phy-035", "由第二定律把徑向合力連到加速度。")]),
  node("phy-044", "曲線與非慣性系", "非慣性系與慣性力", "進階", "延伸", "在加速或旋轉參考系中加入慣性力，讓方程保持類牛頓形式。", "F⃗_慣性 = −mA⃗_frame", "能比較慣性系與加速系對同一現象的兩套一致分析。", "誤以為離心力在所有參考系都是一個額外真實交互作用。", [hard("phy-025", "需能轉換不同移動參考系的運動描述。"), hard("phy-035", "慣性力是為非慣性座標改寫第二定律。")]),
  node("phy-045", "約束與平衡", "平動平衡與耦合約束", "進階", "微積分主線", "用幾何或繩長限制連結多物體加速度，並把平衡視為加速度為零的特例。", "ΣF⃗ = 0；C(q₁,q₂,…)=常數", "能由約束式微分取得加速度關係，再與各自由體圖聯立。", "誤以為平衡只代表靜止，或相連物體必有相同方向加速度。", [hard("phy-033", "耦合系統仍需為每個系統邊界列外力。"), hard("phy-035", "平衡與加速情況皆由第二定律統一處理。"), soft("phy-039", "理想繩提供常見的幾何約束。")]),
];

const D04: Seed[] = [
  node("phy-046", "功與能", "變力作功與線積分", "核心", "微積分主線", "功累積力沿實際位移方向的分量，可正、可負或為零。", "W = ∫_C F⃗·dr⃗", "能依路徑計算變力作功並由符號解釋能量轉移。", "誤以為只要有力或有位移就一定作正功。", [hard("phy-008", "作功取力在位移方向的投影。"), hard("phy-032", "需先辨認是哪一個交互作用力在作功。"), hard("phy-011", "變力作功是沿路徑的連續累積。")]),
  node("phy-047", "功與能", "動能", "基礎", "共同基礎", "動能是與參考系相關的運動狀態量，大小由質量與速率決定。", "K = ½mv²", "能比較不同參考系中的同一物體動能並說明差異。", "誤以為動能是物體絕對持有且與觀察者無關的量。", [hard("phy-031", "動能含慣性質量。"), hard("phy-019", "動能取決於相對選定參考系的速率。")]),
  node("phy-048", "功與能", "功—動能定理", "核心", "共同基礎", "所有外力對質點所作的淨功等於其動能改變。", "W_net = ΔK", "能由自由體圖判定各力作功並與速度變化互相檢核。", "誤以為只有保守力才能用功—動能定理。", [hard("phy-035", "定理由沿位移積分牛頓第二定律得到。"), hard("phy-046", "淨功需加總各力的線積分。"), hard("phy-047", "定理連結的狀態量是動能。")]),
  node("phy-049", "位能與守恆", "保守力、路徑獨立與位能", "核心", "微積分主線", "若兩點間作功與路徑無關，可用位能差保存該交互作用的能量帳。", "ΔU = −W_cons；∮F⃗·dr⃗ = 0", "能用閉合路徑作功或位能函數判別保守力。", "誤以為位能屬於單一物體，或任何只依位置的力都必然保守。", [hard("phy-046", "保守性的判準以沿路徑作功為基礎。")]),
  node("phy-050", "位能與守恆", "由位能取得力", "進階", "微積分主線", "位能在空間中下降最快的方向給出保守力，斜率大小決定力。", "F⃗ = −∇U；一維 Fₓ = −dU/dx", "能由 U(x) 圖或函數求力的方向與大小。", "誤以為位能值低就表示力一定小。", [hard("phy-010", "力由位能對位置的導數取得。"), hard("phy-049", "必須先建立保守力與位能差的定義。")]),
  node("phy-051", "位能與守恆", "位能圖、轉折點與穩定性", "核心", "共同基礎", "由總能水平線與位能曲線判讀允許區、轉折點及平衡穩定性。", "K = E − U ≥ 0；dU/dx = 0", "能不解運動方程便由 U(x) 圖預測運動範圍與速度快慢。", "誤以為位能曲線就是物體在空間中的實際軌跡。", [hard("phy-047", "允許區判準來自動能非負。"), hard("phy-050", "平衡與穩定性由位能斜率和曲率判定。")]),
  node("phy-052", "位能與守恆", "機械能與總能量守恆", "核心", "共同基礎", "選定系統後，能量可在動能、位能、內能與跨邊界轉移間重分配。", "Δ(K + U + E_int) = W_ext + Q", "能先畫系統邊界，再建立含耗散或外力作功的能量帳。", "誤以為有摩擦時能量不守恆，或機械能守恆適用所有情況。", [hard("phy-048", "功—動能定理提供動能帳。"), hard("phy-049", "位能項只對已納入系統的保守交互作用定義。")]),
  node("phy-053", "功與能", "功率與能量流率", "核心", "微積分主線", "功率描述能量轉移的瞬時速率，與總能量或總功不同。", "P = dW/dt = F⃗·v⃗", "能從力與速度求瞬時功率，並由功率曲線求總能量。", "誤以為高功率必代表作功較多，忽略作用時間。", [hard("phy-046", "功率是作功的時間變化率。"), hard("phy-010", "瞬時功率用導數定義。"), soft("phy-019", "力學功率可寫成力與速度的內積。")]),
  node("phy-054", "衝量與動量", "衝量", "核心", "微積分主線", "衝量累積一段時間內的合外力，等於系統動量改變。", "J⃗ = ∫F⃗_net dt = Δp⃗", "能由力—時間圖的帶號面積求動量改變。", "誤以為峰值力較大就必然產生較大衝量。", [hard("phy-011", "衝量是力隨時間的積分。"), hard("phy-035", "衝量—動量關係來自第二定律的一般式。")]),
  node("phy-055", "衝量與動量", "線動量與動量流", "基礎", "共同基礎", "動量結合慣性與速度，是具有方向且依參考系而變的狀態量。", "p⃗ = mv⃗", "能以向量分量比較多物體系統碰撞前後總動量。", "誤以為速率相同的物體動量相同，或動量與動能可互換。", [hard("phy-031", "動量含慣性質量。"), hard("phy-023", "動量方向由速度向量決定。")]),
  node("phy-056", "衝量與動量", "系統動量守恆", "核心", "共同基礎", "若選定系統所受外衝量可忽略，總動量在交互作用前後相同。", "ΔP⃗_system = J⃗_ext；J⃗_ext ≈ 0 ⇒ P⃗_i = P⃗_f", "能先判斷系統與時間尺度，再逐分量套用守恆。", "誤以為每個物體各自動量守恆，或碰撞必同時守恆動能。", [hard("phy-054", "守恆條件由外衝量是否可忽略決定。"), hard("phy-055", "需能加總系統內各物體動量。"), soft("phy-036", "內力成對使封閉系統總動量改變互相抵消。")]),
  node("phy-057", "碰撞與系統", "質心位置與質心運動", "核心", "微積分主線", "質心是質量加權位置；其運動只由系統合外力決定。", "R⃗_cm = Σmᵢr⃗ᵢ/M；M A⃗_cm = ΣF⃗_ext", "能對離散或連續分布求質心並預測其軌跡。", "誤以為質心一定在物體材料內部或固定不動。", [hard("phy-055", "質心速度與總動量滿足 P⃗ = M V⃗_cm。"), hard("phy-011", "連續質量分布需以積分取代加總。"), soft("phy-035", "質心運動服從系統版本第二定律。")]),
  node("phy-058", "碰撞與系統", "一維彈性與非彈性碰撞", "核心", "共同基礎", "所有孤立碰撞守恆動量；只有彈性碰撞另外守恆碰撞前後總動能。", "P_i = P_f；彈性時 K_i = K_f", "能以動量、動能或恢復係數解一維碰撞並檢查物理解。", "誤以為黏在一起表示動量有損失，或碰撞力較大的一方改變較多動量。", [hard("phy-052", "彈性判準需比較碰撞前後動能。"), hard("phy-056", "碰撞速度首先受系統動量守恆限制。")]),
  node("phy-059", "碰撞與系統", "二維碰撞與散射幾何", "進階", "微積分主線", "在平面碰撞中分別守恆各方向總動量，並以幾何限制未知方向。", "Σpₓ,i = Σpₓ,f；Σpᵧ,i = Σpᵧ,f", "能畫動量向量圖並解出散射角或末速度。", "誤以為總動量守恆代表每個方向上的動量大小都不變。", [hard("phy-007", "二維守恆要將動量分解成獨立分量。"), hard("phy-056", "各分量守恆來自向量總動量守恆。")]),
  node("phy-060", "碰撞與系統", "變質量系統與火箭方程", "進階", "延伸", "明確追蹤穿越系統邊界的動量流，處理火箭等質量隨時間改變的系統。", "m dv = −u_rel dm；Δv = u_rel ln(m_i/m_f)", "能由短時間動量帳推導理想火箭速度增量。", "誤以為可直接把 m(t) 代入 F = ma 而忽略排出質量攜帶的動量。", [hard("phy-035", "須從第二定律的一般動量形式出發。"), hard("phy-056", "推導需要對系統邊界做完整動量帳。"), soft("phy-011", "連續排質量的累積導向對數積分。")]),
];

const D05: Seed[] = [
  node("phy-061", "剛體轉動", "角位置、角速度與角加速度", "核心", "微積分主線", "用共同轉角描述剛體定軸轉動，並以時間導數定義角速度和角加速度。", "ω = dθ/dt；α = dω/dt", "能在角度—時間圖上判斷 ω、α 的符號與變化。", "誤以為剛體上每一點具有相同線速度。", [hard("phy-010", "角速度與角加速度都是瞬時變化率。"), soft("phy-026", "圓周運動提供角量與線量的幾何連結。")]),
  node("phy-062", "剛體轉動", "等角加速度轉動學", "核心", "共同基礎", "角加速度固定時，角運動方程與一維等加速度運動同構。", "θ = θ₀ + ω₀t + ½αt²；ω = ω₀ + αt", "能辨認等角加速度假設並一致處理轉動正方向。", "誤以為線加速度固定就等於角加速度固定。", [hard("phy-061", "等角加速度是角運動定義的特殊情況。"), soft("phy-021", "與平移等加速度方程的類比可協助建模。")]),
  node("phy-063", "剛體轉動", "力矩與力臂", "核心", "共同基礎", "力矩量化力對指定點或軸造成轉動改變的能力，取決於垂直力臂。", "τ⃗ = r⃗×F⃗；|τ| = Fℓ_⊥", "能用外積或力臂求力矩並說明正負方向。", "誤以為離軸較遠的任何力都必有較大力矩，忽略方向。", [hard("phy-009", "力矩方向與大小由外積定義。"), hard("phy-032", "力矩仍源自可辨識的交互作用力。")]),
  node("phy-064", "剛體轉動", "轉動慣量與平行軸定理", "核心", "微積分主線", "轉動慣量是質量相對選定轉軸的分布量，會隨轉軸位置改變。", "I = ∫r_⊥² dm；I = I_cm + Md²", "能由積分或平行軸定理求簡單剛體的 I。", "誤以為轉動慣量只由總質量決定，與轉軸無關。", [hard("phy-011", "連續質量分布需要積分加總。"), hard("phy-031", "轉動慣量是慣性質量的空間加權。")]),
  node("phy-065", "剛體轉動", "轉動動力學", "核心", "共同基礎", "繞固定軸的合外力矩決定角動量變化；剛體且 I 固定時為 Iα。", "Στ_ext = dL/dt；固定軸時 Στ = Iα", "能由受力圖選定取矩點並列出角加速度方程。", "誤以為每一個力矩各自等於 Iα，或合力為零就一定無角加速度。", [hard("phy-061", "角加速度是轉動狀態的變化量。"), hard("phy-063", "需先求所有外力矩的向量和。"), hard("phy-064", "I 連結力矩與角加速度。")]),
  node("phy-066", "剛體轉動", "轉動功與轉動動能", "核心", "共同基礎", "力矩經角位移作功，改變剛體的轉動動能。", "W = ∫τ dθ = Δ(½Iω²)", "能在含平移與轉動的系統中建立完整能量帳。", "誤以為轉動物體只能有轉動動能，不能同時有質心平動動能。", [hard("phy-046", "轉動作功是線性作功的角度版本。"), hard("phy-064", "轉動動能取決於所選軸的轉動慣量。"), hard("phy-061", "轉動動能含角速度。")]),
  node("phy-067", "角動量與平衡", "角動量與角衝量", "核心", "微積分主線", "角動量依參考點定義；外力矩的時間積分改變系統角動量。", "L⃗ = r⃗×p⃗；ΔL⃗ = ∫τ⃗_ext dt", "能為質點與定軸剛體計算角動量並檢查方向。", "誤以為角動量永遠與角速度同方向，或不必指定原點。", [hard("phy-009", "質點角動量使用位置與動量的外積。"), hard("phy-055", "角動量建立在線動量上。"), hard("phy-063", "外力矩控制角動量變化。")]),
  node("phy-068", "角動量與平衡", "角動量守恆", "核心", "共同基礎", "若相對選定點的合外力矩為零，系統總角動量保持不變。", "Στ⃗_ext = 0 ⇒ L⃗_i = L⃗_f", "能在收臂旋轉、爆炸或軌道情境中選系統並套用守恆。", "誤以為角速度守恆，或內部改變轉動慣量會破壞角動量守恆。", [hard("phy-067", "守恆條件來自角衝量—角動量關係。"), soft("phy-056", "與線動量守恆的系統邊界推理相似。")]),
  node("phy-069", "角動量與平衡", "無滑動滾動", "核心", "共同基礎", "純滾動以接觸點瞬時靜止的幾何約束連結質心平移與繞質心轉動。", "v_cm = ωR；a_cm = αR", "能建立滾動物體的平移、轉動與能量方程並判斷摩擦方向。", "誤以為滾動時接觸點速度等於質心速度，或靜摩擦一定耗散能量。", [hard("phy-061", "滾動約束連結角量與線量。"), hard("phy-065", "加速滾動同時滿足平移與轉動動力學。"), hard("phy-066", "總動能含平移與轉動兩部分。")]),
  node("phy-070", "角動量與平衡", "剛體靜力平衡", "核心", "共同基礎", "靜止剛體同時滿足合外力為零與任意點合外力矩為零。", "ΣF⃗ = 0 且 Στ⃗ = 0", "能選方便取矩點解梁、梯子或人體關節的未知支撐力。", "誤以為合力為零就足以保證物體不轉動。", [hard("phy-045", "平動平衡提供合力條件。"), hard("phy-063", "還須用力矩平衡限制轉動。")]),
  node("phy-071", "萬有引力", "萬有引力定律與疊加", "核心", "共同基礎", "任意兩質量互相吸引，力沿連心線並依距離平方反比；多源時向量疊加。", "F = Gm₁m₂/r²", "能對多質點求合引力並區分距離 r 與各坐標分量。", "誤以為較大質量對較小質量施力較大，違反第三定律。", [hard("phy-035", "引力是進入第二定律的特定外力。"), hard("phy-036", "兩質量互施的引力為第三定律對。"), hard("phy-007", "多源引力需逐分量向量相加。")]),
  node("phy-072", "萬有引力", "重力場與重力位能", "核心", "微積分主線", "以單位質量所受力定義重力場，並以位能描述保守引力交互作用。", "g⃗ = −GM r̂/r²；U = −GMm/r", "能由球對稱質量求場、位能與逃逸速度。", "誤以為位能零點必在地面，或 U 為負代表能量不存在。", [hard("phy-049", "萬有引力是保守力，可定義位能。"), hard("phy-050", "重力場可由單位質量位能梯度取得。"), hard("phy-071", "場函數來自萬有引力定律。")]),
  node("phy-073", "萬有引力", "圓軌道、逃逸與克卜勒定律", "進階", "微積分主線", "以萬有引力提供向心加速度，並用能量與角動量統一理解軌道。", "v_orbit = √(GM/r)；T² = 4π²a³/(GM)", "能推導圓軌道速度、週期或逃逸速度並檢查尺度。", "誤以為太空人失重是因軌道上沒有重力，或維持圓軌道需要持續推進。", [hard("phy-043", "圓軌道需要徑向合力提供向心加速度。"), hard("phy-068", "中央力矩為零使角動量守恆。"), hard("phy-072", "軌道能量由重力位能決定。")]),
  node("phy-074", "流體", "密度與連續介質模型", "基礎", "共同基礎", "在遠大於分子尺度下，把質量視為連續分布並以局部密度描述。", "ρ = dm/dV；均勻時 ρ = m/V", "能由幾何與密度求質量，並說明連續模型的適用尺度。", "誤以為密度與物體總大小成正比，或同一物質密度永遠不受狀態影響。", [hard("phy-002", "密度是含質量與體積的導出量。"), soft("phy-011", "非均勻介質的總質量由密度積分取得。")]),
  node("phy-075", "流體", "壓力與面力", "基礎", "共同基礎", "壓力是流體在面上每單位面積施加的法向力，靜止流體中各向相同。", "p = dF_⊥/dA", "能從微小面元素求壓力造成的力，且不混淆壓力與總力。", "誤以為壓力本身有固定方向，或面積越大壓力就越大。", [hard("phy-035", "壓力造成的面力會進入受力平衡。"), hard("phy-002", "需掌握 Pa = N/m² 的導出單位。")]),
  node("phy-076", "流體", "靜水壓與帕斯卡原理", "核心", "共同基礎", "靜止流體中壓力隨深度增加；外加壓力可不衰減地傳到封閉流體。", "p = p₀ + ρgh", "能由薄流體層的受力平衡推導壓力—深度關係。", "誤以為同一深度的壓力取決於容器形狀或液體總量。", [hard("phy-074", "壓力梯度與流體密度相關。"), hard("phy-075", "推導需要把壓力轉為面力。"), soft("phy-045", "靜止流體元素滿足力平衡。")]),
  node("phy-077", "流體", "浮力與阿基米德原理", "核心", "共同基礎", "浸入物體表面壓力差的合力等於所排開流體的重量。", "F_B = ρ_fluid g V_displaced", "能由排液體積判斷漂浮比例、上浮或下沉。", "誤以為浮力等於物體重量，或浸得越深浮力必越大。", [hard("phy-076", "浮力來自上下表面的靜水壓差。"), hard("phy-037", "排開流體的重量用 mg 計算。")]),
  node("phy-078", "流體", "穩定流與連續方程", "核心", "共同基礎", "穩定流中質量不能在管段內憑空累積；不可壓縮流的體積流率沿流管不變。", "ρAv = 常數；不可壓縮時 A₁v₁ = A₂v₂", "能由截面變化預測流速，並指出可壓縮時須保留密度。", "誤以為窄處流量較少，或連續方程本身是能量守恆。", [hard("phy-074", "質量流率由密度、截面與速度組成。"), hard("phy-056", "連續方程是控制體的質量守恆。")]),
  node("phy-079", "流體", "伯努力方程與能量線", "核心", "共同基礎", "沿理想穩定流線，單位體積的壓力能、動能與重力位能之和不變。", "p + ½ρv² + ρgy = 常數", "能先檢查穩定、不可壓縮、低黏滯假設再比較兩點。", "誤以為任何流動中速度快的地方壓力都必較低。", [hard("phy-052", "伯努力式是理想流體的機械能帳。"), hard("phy-078", "截面速度通常由連續方程先限制。"), hard("phy-076", "靜止極限應回到靜水壓關係。")]),
  node("phy-080", "流體", "黏滯、層流與泊肅葉定律", "進階", "延伸", "真實流體的剪切使機械能耗散；圓管層流流率對半徑極敏感。", "Q = πR⁴Δp/(8ηL)；Re = ρvL/η", "能用雷諾數判斷模型傾向，並預測半徑改變對流率的影響。", "誤以為黏滯只是讓所有流速減少同一固定量，或伯努力式仍可無修正套用。", [hard("phy-078", "流率與平均速度由質量連續性定義。"), hard("phy-079", "黏滯流需辨認理想能量關係失效之處。"), soft("phy-004", "雷諾數是量綱分析得到的無因次比值。")]),
];

const D06: Seed[] = [
  node("phy-081", "簡諧振動", "平衡點與回復作用", "基礎", "共同基礎", "穩定平衡附近的小偏離常產生指回平衡點、近似正比於位移的回復力。", "F ≈ −k_eff x", "能由力或位能圖判斷平衡點穩定性與回復方向。", "誤以為任何指向固定點的力都必導致簡諧運動。", [hard("phy-040", "彈簧力是線性回復作用的原型。"), hard("phy-051", "穩定平衡可由位能局部最低點判斷。")]),
  node("phy-082", "簡諧振動", "簡諧運動方程與相位", "核心", "微積分主線", "線性回復力使位移滿足二階微分方程，解為具振幅、頻率與相位的正弦函數。", "x¨ + ω²x = 0；x = A cos(ωt + φ)", "能由初始位置、速度求 A、ω、φ 並檢查相位。", "誤以為物體通過平衡點時加速度最大，或振幅決定頻率。", [hard("phy-035", "運動方程由回復力代入第二定律。"), hard("phy-081", "簡諧模型要求線性回復作用。"), hard("phy-020", "二階導數代表加速度。")]),
  node("phy-083", "簡諧振動", "簡諧振子的能量交換", "核心", "共同基礎", "無耗散振子在動能與彈性位能間週期交換，總機械能固定。", "E = ½mv² + ½kx² = ½kA²", "能由任一位置求速率，並在能量圖上辨認轉折點。", "誤以為平衡點沒有能量，或端點速度為零代表總能量為零。", [hard("phy-052", "能量守恆提供不解時間函數的分析法。"), hard("phy-082", "振幅與位移界定簡諧運動狀態。")]),
  node("phy-084", "簡諧振動", "單擺與小角近似", "核心", "微積分主線", "單擺的精確回復力矩為非線性；小角度時 sinθ≈θ 才近似簡諧。", "θ¨ + (g/ℓ)sinθ = 0；小角 T ≈ 2π√(ℓ/g)", "能推導小角週期並說明它何時不再與振幅無關。", "誤以為單擺在任何振幅都完全是簡諧運動。", [hard("phy-063", "擺的運動由重力力矩控制。"), hard("phy-082", "線性化後的方程與簡諧運動同型。"), soft("phy-014", "小角近似是一種可用殘差檢驗的線性化。")]),
  node("phy-085", "阻尼與驅動", "阻尼振動與時間尺度", "進階", "微積分主線", "速度相依阻力使振幅衰減；欠阻尼、臨界與過阻尼對應不同回復行為。", "mx¨ + bẋ + kx = 0", "能由 b² 與 4mk 的比較分類響應並讀出衰減時間。", "誤以為阻尼只降低頻率而不改變振幅，或臨界阻尼會振盪最快。", [hard("phy-042", "線性阻力提供速度相依阻尼項。"), hard("phy-082", "阻尼是在簡諧方程加入耗散。")]),
  node("phy-086", "阻尼與驅動", "受迫振動、共振與相位差", "進階", "微積分主線", "週期外力輸入能量；穩態振幅與相位取決於驅動頻率和阻尼。", "mx¨ + bẋ + kx = F₀cosω_dt", "能畫出頻率響應並解釋共振峰隨阻尼的改變。", "誤以為共振頻率時振幅必無限大，或共振只在頻率完全相等才存在。", [hard("phy-053", "穩態振幅由平均輸入功率與耗散平衡。"), hard("phy-085", "阻尼決定共振峰與相位轉換。")]),
  node("phy-087", "阻尼與驅動", "耦合振子與正常模態", "進階", "延伸", "線性耦合系統可分解成彼此獨立、各自以固定頻率振動的正常模態。", "M q¨ + Kq = 0；det(K − ω²M)=0", "能找出兩耦合振子的同相、反相模態與頻率。", "誤以為每個物體各自只以一個固有頻率運動。", [hard("phy-045", "耦合系統的座標受到共同約束或作用。"), hard("phy-082", "每個正常模態都服從簡諧方程。")]),
  node("phy-088", "行波", "波函數、振幅、波長與頻率", "基礎", "共同基礎", "行波把局部擾動形狀以有限速度搬移；相位連結空間與時間週期。", "y(x,t)=A cos(kx−ωt+φ)；v=λf", "能從波形或函數讀出 A、λ、f、方向與相速度。", "誤以為介質質點會隨波形一起從源移到遠方。", [hard("phy-013", "波形是依位置或時間繪出的函數圖。"), hard("phy-019", "相速度描述固定相位的位置變化率。")]),
  node("phy-089", "行波", "波動方程與介質波速", "核心", "微積分主線", "局部耦合與慣性使擾動滿足二階偏微分方程；波速由介質參數決定。", "∂²y/∂x² = (1/v²)∂²y/∂t²；弦上 v=√(T/μ)", "能驗證給定波函數滿足波動方程並由張力、線密度預測波速。", "誤以為搖得更大或更快一定讓同一介質中的波傳得更快。", [hard("phy-010", "波動方程含空間與時間二階導數。"), hard("phy-035", "弦微元的第二定律導出波速。"), hard("phy-088", "行波解須符合波函數的相位結構。")]),
  node("phy-090", "疊加與聲學", "線性疊加與干涉", "核心", "共同基礎", "線性介質中各波獨立穿越，總位移是瞬時代數和；相位差決定相長或相消。", "y_total = Σyᵢ；Δφ = 2πΔr/λ", "能由路徑差判定觀測點的相長、相消或中間強度。", "誤以為相消干涉會永久摧毀兩列波的能量。", [hard("phy-088", "需能比較兩波在同一點同一時刻的相位。")]),
  node("phy-091", "疊加與聲學", "駐波、節點與腹點", "核心", "共同基礎", "相反方向、同頻同振幅的波疊加成不移動的節腹圖樣，能量局部往返交換。", "y = 2A sin(kx)cos(ωt)", "能由邊界條件標出節點並辨識駐波不是靜止介質。", "誤以為節點處沒有波通過，或腹點位置的介質沿弦傳播。", [hard("phy-090", "駐波是兩列行波疊加的特例。"), hard("phy-088", "節腹間距由波長與相位決定。")]),
  node("phy-092", "疊加與聲學", "弦、氣柱的邊界條件與諧波", "核心", "共同基礎", "固定端、自由端及開閉氣柱限制可容納的波長，形成離散正常頻率。", "弦或開管 fₙ=nv/(2L)；閉管 fₙ=nv/(4L), n為奇數", "能先畫位移節腹，再列出允許波長與頻率。", "誤以為所有邊界都有相同節點條件，或閉管包含所有整數諧波。", [hard("phy-089", "頻率由介質波速和允許波長共同決定。"), hard("phy-091", "邊界條件選出駐波模態。")]),
  node("phy-093", "疊加與聲學", "聲壓、強度與分貝", "核心", "共同基礎", "聲波是介質壓力與密度的縱向擾動；強度是單位面積平均功率。", "I=P/A；β=10log₁₀(I/I₀)", "能處理點聲源反平方衰減並正確比較分貝差。", "誤以為分貝是線性尺度，或聲音較大代表頻率較高。", [hard("phy-053", "強度是功率的面密度。"), hard("phy-075", "聲波可用壓力擾動描述。"), hard("phy-089", "聲速由介質的彈性與慣性決定。")]),
  node("phy-094", "疊加與聲學", "拍頻與都卜勒效應", "核心", "共同基礎", "近頻波疊加產生拍頻；源與觀察者相對介質運動則改變接收頻率。", "f_beat=|f₁−f₂|；f′=f(v±v_o)/(v∓v_s)", "能用接近或遠離關係選符號，並區分拍頻與都卜勒移頻。", "誤以為都卜勒效應改變聲源實際發出的頻率，或只看源與觀察者相對速度即可。", [hard("phy-090", "拍頻是不同頻率波的時間疊加。"), hard("phy-025", "都卜勒效應需要分清源、觀察者與介質的速度。"), hard("phy-088", "頻率與波長由相位到達率定義。")]),
  node("phy-095", "行波", "色散、相速度與群速度", "進階", "延伸", "若不同波數以不同相速度傳播，波包會展寬；包絡以群速度移動。", "v_p=ω/k；v_g=dω/dk", "能由色散關係 ω(k) 求相速度與群速度並解釋差異。", "誤以為波峰速度永遠等於資訊或能量傳遞速度。", [hard("phy-010", "群速度是色散關係的斜率。"), hard("phy-088", "需掌握波數、角頻率與相位速度。"), soft("phy-090", "波包由一群不同波數成分疊加。")]),
];

const D07: Seed[] = [
  node("phy-096", "溫度與物態", "熱平衡、溫度與第零定律", "基礎", "共同基礎", "溫度是決定兩系統接觸時淨熱流方向的狀態量；共同平衡使溫標可建立。", "A↔C 平衡且 B↔C 平衡 ⇒ A↔B 平衡", "能以第零定律說明溫度計如何比較不同系統。", "誤以為溫度等同物體所含熱量，或接觸時一定由較大物體流向較小物體。", [hard("phy-001", "溫度需被視為可測、可比較的狀態量。"), soft("phy-002", "Kelvin 是 SI 基本單位。")]),
  node("phy-097", "溫度與物態", "熱膨脹與溫度尺度", "基礎", "共同基礎", "材料尺寸隨溫度改變；在小溫差下可用線性係數近似。", "ΔL = αL₀ΔT；ΔV ≈ βV₀ΔT", "能從材料係數預測間隙或雙金屬片的相對變形。", "誤以為有孔金屬板受熱時孔會縮小，或所有材料膨脹率相同。", [hard("phy-096", "熱膨脹由溫度變化而非熱量直接決定。"), soft("phy-004", "係數的量綱可檢查公式。")]),
  node("phy-098", "溫度與物態", "狀態變數與理想氣體方程", "核心", "共同基礎", "理想氣體的壓力、體積、粒子數與絕對溫度由狀態方程連結。", "pV = nRT = Nk_BT", "能判斷一組狀態量是否足以決定平衡態並比較兩狀態。", "誤以為 pV=nRT 是任意過程的能量守恆式，或攝氏溫度可直接代入。", [hard("phy-075", "氣體壓力是容器壁上的面力密度。"), hard("phy-096", "狀態方程必須使用絕對溫度。")]),
  node("phy-099", "分子模型", "氣體動力論與均方根速率", "核心", "微積分主線", "巨觀壓力來自分子碰撞的動量傳遞，溫度量化平移動能的統計尺度。", "pV = ⅓NM⟨v²⟩；v_rms=√(3k_BT/M)", "能從微觀碰撞推理壓力對粒子數、質量與速率的依賴。", "誤以為固定溫度下所有分子都有相同速率，或較重分子平均動能較大。", [hard("phy-054", "壁面受力來自分子碰撞的動量改變率。"), hard("phy-098", "推導結果必須與理想氣體狀態方程相容。")]),
  node("phy-100", "溫度與物態", "熱量、熱容量與比熱", "基礎", "共同基礎", "熱是因溫差跨越邊界的能量轉移；熱容量描述升溫所需能量。", "Q = mcΔT；C = dQ/dT（指定過程）", "能用熱平衡能量帳求混合後溫度並指出熱量不是狀態量。", "誤以為物體含有熱，或比熱大代表物體溫度必較高。", [hard("phy-052", "熱是能量跨越系統邊界的一種方式。"), hard("phy-096", "熱傳方向與溫度差相關。")]),
  node("phy-101", "溫度與物態", "相變與潛熱", "核心", "共同基礎", "一階相變期間輸入能量改變微觀結構而非必然改變溫度。", "Q = mL", "能分段建立含升溫與相變的加熱曲線能量帳。", "誤以為持續加熱就一定持續升溫，或沸騰只由溫度決定。", [hard("phy-100", "需先區分升溫的顯熱與相變的潛熱。"), soft("phy-096", "相共存時仍可達熱平衡。")]),
  node("phy-102", "熱傳與功", "熱傳導與熱阻", "核心", "微積分主線", "溫度梯度驅動導熱；穩態下熱流率由材料、面積、長度與溫差決定。", "P_cond = −kA dT/dx；R_th=L/(kA)", "能為多層材料建立串聯熱阻並求穩態溫度分布。", "誤以為金屬摸起來較冷必表示它的溫度較低。", [hard("phy-053", "導熱功率是能量傳遞率。"), hard("phy-010", "局部溫度梯度由空間導數描述。"), hard("phy-096", "淨熱流由溫度差驅動。")]),
  node("phy-103", "熱傳與功", "對流、輻射與淨熱交換", "核心", "共同基礎", "對流結合流體運動；熱輻射以電磁能傳遞，淨交換須扣除環境回射。", "P_rad = εσA(T⁴−T_env⁴)", "能比較導熱、對流、輻射在一個真實散熱情境中的角色。", "誤以為只有高溫發光物體才會輻射，或真空中無法傳熱。", [hard("phy-053", "各熱傳機制都以能量流率比較。"), hard("phy-096", "淨交換取決於物體與環境的絕對溫度。"), soft("phy-078", "對流涉及流體的整體質量運動。")]),
  node("phy-104", "熱傳與功", "壓力—體積功與 PV 圖", "核心", "微積分主線", "準靜態膨脹時氣體對外作功等於 PV 路徑下的帶號面積。", "W_by = ∫p_ext dV", "能由 PV 圖比較不同路徑的功並正確處理符號約定。", "誤以為氣體功只由初末狀態決定，或封閉迴圈淨功必為零。", [hard("phy-046", "PV 功是壓力面力沿邊界位移的累積。"), hard("phy-075", "壓力把活塞面積轉成力。"), hard("phy-013", "PV 圖下面積有功的單位與意義。")]),
  node("phy-105", "熱力學定律", "熱力學第一定律與內能", "核心", "共同基礎", "內能是狀態量；其改變等於傳入熱量減去系統對外作功。", "ΔU = Q − W_by", "能先聲明符號與系統邊界，再對一段過程建立第一定律帳。", "誤以為 Q 與 W 是系統儲存的狀態量，或絕熱即等溫。", [hard("phy-052", "第一定律是含熱與內能的總能量守恆。"), hard("phy-100", "熱量是跨邊界能量轉移。"), hard("phy-104", "體積功依熱力路徑而定。")]),
  node("phy-106", "熱力學定律", "等溫、等壓、等容與絕熱過程", "核心", "共同基礎", "不同限制決定熱、功、內能與狀態變數如何連動；過程名稱不能互換。", "理想氣體：ΔU = nC_VΔT；可逆絕熱 pV^γ=常數", "能在 PV 圖辨識典型路徑並逐一計算 Q、W、ΔU。", "誤以為等溫表示沒有熱傳，或絕熱表示溫度不變。", [hard("phy-098", "狀態方程連結各過程中的 p、V、T。"), hard("phy-105", "每種過程都須滿足第一定律。")]),
  node("phy-107", "熱力學定律", "熱機、冰箱與循環效率", "核心", "共同基礎", "循環裝置在高低溫庫間搬運能量；效率與性能係數受能量守恆和第二定律限制。", "η=W_out/Q_H=1−Q_C/Q_H；COP_R=Q_C/W_in", "能由能流圖求未知熱量、功與效率並檢查上限。", "誤以為熱機可把吸收熱量百分之百轉成功，或冰箱製造冷。", [hard("phy-105", "完整循環的內能改變為零，仍須做能量帳。"), hard("phy-106", "循環由多種熱力過程組成。")]),
  node("phy-108", "熱力學定律", "熵與熱力學第二定律", "核心", "微積分主線", "熵是狀態量；孤立系統總熵不減，可逆路徑給出狀態差的積分表示。", "dS = δQ_rev/T；ΔS_universe ≥ 0", "能為不可逆熱交換計算系統加環境的總熵變。", "誤以為某個子系統的熵不能減少，或熵只等於日常語意的混亂。", [hard("phy-100", "熵變積分用到可逆熱量與絕對溫度。"), hard("phy-107", "第二定律解釋熱機效率上限與熱流方向。"), hard("phy-011", "有限過程的熵差由微小可逆路徑積分。")]),
  node("phy-109", "熱力學定律", "微觀態、巨觀態與統計熵", "進階", "延伸", "巨觀狀態對應許多微觀排列；平衡傾向具有壓倒性較多微觀態的巨觀狀態。", "S = k_B lnΩ", "能用簡單二態粒子模型比較不同巨觀分布的多重度。", "誤以為第二定律禁止微觀漲落，或熵增加是一股額外的力。", [hard("phy-108", "統計定義必須與巨觀熵及第二定律一致。"), soft("phy-005", "數量級可展示大量粒子下機率差距的巨大。")]),
  node("phy-110", "分子模型", "能量均分與 Maxwell–Boltzmann 分布", "進階", "延伸", "熱平衡中可用二次自由度均分平均能量，粒子速率則呈現寬分布。", "⟨E_quadratic⟩=½k_BT；f(v)∝v²e^(−Mv²/2k_BT)", "能由自由度預測理想氣體熱容量並比較不同溫度的速率分布。", "誤以為均分定理表示每個粒子每瞬間能量完全相同。", [hard("phy-099", "氣體動力論連結粒子運動與溫度。"), hard("phy-109", "分布與平均量建立在微觀態機率上。"), soft("phy-100", "熱容量可由可用自由度推得。")]),
];

const D08: Seed[] = [
  node("phy-111", "電荷與電場", "電荷、量子化與守恆", "基礎", "共同基礎", "電荷是物質的交互作用屬性，封閉系統總電荷守恆且以基本電荷為離散單位。", "Q = Ne；ΔQ_system = 0（封閉系統）", "能以電子轉移而非電荷創生解釋摩擦起電與感應帶電。", "誤以為正電是加入一種正物質，或接觸後電荷被消耗。", [hard("phy-001", "需把電荷視為可測的物理量與模型屬性。"), soft("phy-056", "守恆推理需明確畫出系統邊界。")]),
  node("phy-112", "電荷與電場", "庫侖定律", "核心", "共同基礎", "兩靜止點電荷的力沿連線，大小與電荷乘積成正比、與距離平方成反比。", "F⃗₁₂ = kq₁q₂ r̂₁₂/r²", "能用符號與單位向量一致判斷吸引、排斥及作用方向。", "誤以為較大電荷對較小電荷施力較大，或把距離分量各自平方。", [hard("phy-111", "力的正負與大小由兩電荷決定。"), hard("phy-007", "庫侖力是沿連心線的向量。"), soft("phy-036", "兩電荷互力是一對第三定律力。")]),
  node("phy-113", "電荷與電場", "電場作為局部交互作用描述", "核心", "共同基礎", "電場把源電荷與測試電荷分開：某點場等於正測試電荷每單位電荷所受力。", "E⃗ = F⃗/q_test；F⃗ = qE⃗", "能由正負測試電荷受力反推同一電場方向。", "誤以為電場方向會隨放入的測試電荷正負而改變，或無電荷處就無電場。", [hard("phy-112", "點電荷場由庫侖力除以測試電荷取得。"), hard("phy-035", "帶電粒子的加速度由電力代入第二定律。")]),
  node("phy-114", "電荷與電場", "電場疊加與電偶極", "核心", "共同基礎", "多源電場逐一向量相加；等量異號近鄰電荷形成具方向的偶極矩。", "E⃗_total = ΣE⃗ᵢ；p⃗ = qd⃗", "能用對稱性和分量求多電荷場，並畫出偶極的近遠場方向。", "誤以為電場線相交處可有兩個場方向，或等量異號電荷場處處互消。", [hard("phy-113", "疊加的是每個源在同一位置造成的電場。"), hard("phy-007", "多個電場必須按分量向量相加。")]),
  node("phy-115", "電荷與電場", "連續電荷分布的電場積分", "進階", "微積分主線", "把線、面或體電荷切成微小電荷元，再積分每個電荷元的場貢獻。", "E⃗ = (1/4πε₀)∫(dq/r²)r̂；dq=λdl=σdA=ρdV", "能為有限線段、圓環或圓盤建立含幾何與方向的電場積分。", "誤以為可先積分場的大小再於最後補方向。", [hard("phy-011", "連續分布用積分取代離散加總。"), hard("phy-114", "積分是電場向量疊加的連續版本。"), hard("phy-074", "密度概念推廣為線、面、體電荷密度。")]),
  node("phy-116", "通量與高斯定律", "電通量與有向面積", "核心", "微積分主線", "電通量量化電場穿越有向表面的法向成分，不是表面上儲存的電量。", "Φ_E = ∫_S E⃗·dA⃗", "能判斷封閉面各區域通量的正負並計算簡單表面積分。", "誤以為通量只取決於場大小，或電場線真的被表面截留。", [hard("phy-008", "通量取電場在面法向的投影。"), hard("phy-011", "非均勻場與曲面需以面積分累積。"), hard("phy-113", "被積分的向量場是電場。")]),
  node("phy-117", "通量與高斯定律", "高斯定律與對稱性", "核心", "微積分主線", "任意封閉面的總電通量只由包覆淨電荷決定；對稱性足夠時可反求場。", "∮E⃗·dA⃗ = Q_enclosed/ε₀", "能先論證球、柱或平面對稱，再選高斯面求場。", "誤以為高斯定律只適用對稱分布，或高斯面外電荷沒有電場影響。", [hard("phy-116", "高斯定律陳述的是封閉面總通量。"), hard("phy-111", "右側只計入封閉面內的淨電荷。"), soft("phy-115", "積分法可檢核對稱分布結果。")]),
  node("phy-118", "通量與高斯定律", "導體的靜電平衡", "核心", "共同基礎", "靜電平衡導體內部電場為零、體內無淨電荷，表面為等位面且場垂直表面。", "E_inside = 0；E_⊥,outside = σ/ε₀", "能用高斯面與切向受力論證空腔、屏蔽及表面電荷分布。", "誤以為導體內任何位置都不能有電荷，或導體表面電場必處處同大。", [hard("phy-117", "跨導體表面的場可由高斯定律連到表面電荷。"), hard("phy-034", "靜電平衡要求自由電荷不再加速。")]),
  node("phy-119", "電位", "電位差與電場作功", "核心", "共同基礎", "電位差是單位正電荷的位能差，也等於電場線積分的負值。", "ΔV = ΔU/q = −∫E⃗·dr⃗", "能沿任意路徑由電場求兩點電位差並解釋伏特單位。", "誤以為電位是向量或沿電場方向電位上升。", [hard("phy-046", "電場作功是力沿位移的線積分。"), hard("phy-113", "電力為 qE⃗。"), hard("phy-049", "靜電力保守時可定義位能差。")]),
  node("phy-120", "電位", "點電荷與連續分布的電位", "核心", "微積分主線", "以無窮遠為零點時，點電荷電位為 kq/r；多源電位直接代數疊加。", "V = (1/4πε₀)∫dq/r", "能先以純量積分求 V，再由對稱性判斷等位面。", "誤以為負電位代表該處能量不可能存在，或電位相加也需分解方向。", [hard("phy-112", "點電荷電位由庫侖場的線積分取得。"), hard("phy-119", "電位的定義依選定零點與電位差。"), hard("phy-011", "連續電荷分布需積分各 dq 的純量貢獻。")]),
  node("phy-121", "電位", "電場與電位梯度", "進階", "微積分主線", "電場指向電位下降最快方向，其分量等於電位對相應坐標的負偏導。", "E⃗ = −∇V", "能由等位線疏密與形狀畫出垂直的電場方向及相對大小。", "誤以為電位為零的地方電場必為零，或等位線可以相交。", [hard("phy-010", "梯度由各方向的空間變化率組成。"), hard("phy-119", "局部極限把電位差連到電場。"), soft("phy-050", "與由位能梯度取得力的結構相同。")]),
  node("phy-122", "電位", "電荷系統的靜電位能", "核心", "共同基礎", "靜電位能屬於電荷系統的相對配置，組裝多電荷需避免重複計算配對。", "U = ½ΣᵢqᵢV_other(rᵢ)", "能由組裝過程或配對和求多電荷系統位能。", "誤以為每個電荷各自擁有全部位能，或 U=qV 時 V 可包含自身電位。", [hard("phy-049", "位能是保守交互作用的系統狀態量。"), hard("phy-120", "多電荷電位可純量疊加。")]),
  node("phy-123", "電容與介質", "電容與幾何", "核心", "共同基礎", "電容描述導體配置在給定電位差下儲存等量異號電荷的能力，取決於幾何與介質。", "C = Q/ΔV；平行板 C=εA/d", "能從場與電位差推導平行板電容並判斷幾何趨勢。", "誤以為電容器的 C 會隨當下 Q 或 V 改變，或單片板獨自儲存正負電荷。", [hard("phy-118", "電容器極板需用導體等位與表面電荷性質。"), hard("phy-119", "電容以兩導體間電位差定義。")]),
  node("phy-124", "電容與介質", "介電質、極化與束縛電荷", "進階", "微積分主線", "外電場使介質內偶極取向或誘發，束縛電荷改變場與電容。", "P⃗ = 偶極矩/體積；C = κC₀（充滿線性介質）", "能分別預測隔離電容器與接電池電容器插入介質後的 Q、V、E、U。", "誤以為介電質完全阻斷電場，或插入介質的所有條件下電壓都不變。", [hard("phy-114", "極化以大量電偶極的取向描述。"), hard("phy-123", "介質透過改變 Q–V 關係改變電容。"), soft("phy-117", "束縛表面電荷對場的影響仍符合高斯定律。")]),
  node("phy-125", "電容與介質", "電場能量與能量密度", "進階", "微積分主線", "建立電荷配置所作的功儲存在電磁場配置中，可用局部能量密度積分。", "U_C=½CV²=Q²/(2C)；u_E=½εE²", "能在固定 Q 或固定 V 條件下比較幾何改變造成的能量與力。", "誤以為電容器能量只存在金屬板上，或插入介質永遠增加儲能。", [hard("phy-122", "場能量等價於組裝電荷系統的位能。"), hard("phy-123", "集總形式以 C、Q、V 表示。"), hard("phy-116", "空間總場能需將能量密度作體積積分。")]),
];

const D09: Seed[] = [
  node("phy-126", "電流與材料", "電流與電荷流率", "基礎", "共同基礎", "電流是穿越選定截面的淨電荷流率；傳統電流方向定為正電荷移動方向。", "I = dQ/dt", "能由隨時間通過的正負載子求淨電流大小與方向。", "誤以為電流在元件中被消耗，或電子移動方向就是傳統電流方向。", [hard("phy-111", "電流追蹤的是守恆電荷跨邊界的速率。"), hard("phy-010", "瞬時電流是電荷對時間的導數。")]),
  node("phy-127", "電流與材料", "電流密度與漂移速度", "核心", "微積分主線", "微觀載子在電場下有很小淨漂移，電流是電流密度穿過截面的通量。", "J⃗ = nqv⃗_d；I = ∫J⃗·dA⃗", "能從載子密度、電荷與截面求漂移速度並解釋訊號不等於電子漂移。", "誤以為開關接通後電子須由電池跑到燈泡，燈才立即亮。", [hard("phy-126", "總電流是截面上局部電荷流的加總。"), hard("phy-116", "電流穿面積的數學結構與通量相同。"), soft("phy-074", "載子數密度是連續介質密度概念。")]),
  node("phy-128", "電流與材料", "電阻率、電導率與幾何電阻", "核心", "共同基礎", "電阻率是材料對導電的性質；均勻導線電阻還取決於長度與截面。", "R = ρL/A；σ=1/ρ", "能區分材料電阻率與元件電阻，並預測幾何改變。", "誤以為同材料任何形狀都有相同電阻，或截面越大電阻越大。", [hard("phy-127", "巨觀電阻來自截面電流密度與場的關係。"), hard("phy-002", "Ω、Ω·m 的單位可檢查材料量與元件量。")]),
  node("phy-129", "電流與材料", "歐姆定律與局部導電律", "核心", "共同基礎", "線性歐姆材料在固定條件下 J 與 E 成正比；元件形式 V=IR 是其幾何整合。", "J⃗ = σE⃗；ΔV = IR", "能從 I–V 圖判斷歐姆區並區分定義 R=V/I 與 R 為常數。", "誤以為歐姆定律是所有元件永遠遵守的基本守恆律。", [hard("phy-113", "局部電場驅動載子漂移。"), hard("phy-128", "材料與幾何共同決定線性元件的 R。"), hard("phy-119", "元件電壓是兩端電位差。")]),
  node("phy-130", "電源與功率", "電動勢與內電阻", "核心", "共同基礎", "電源以非靜電作用每單位電荷供能；內電阻使端電壓隨負載電流改變。", "ℰ = dW_source/dq；V_terminal=ℰ−Ir", "能由開路電壓與帶載端電壓求內電阻並畫能量流。", "誤以為電動勢是一種力，或理想電池維持固定電流。", [hard("phy-052", "電源把其他形式能量轉成電能。"), hard("phy-126", "內阻壓降隨電流產生。"), hard("phy-119", "端電壓是電源兩端電位差。")]),
  node("phy-131", "電源與功率", "電功率與焦耳熱", "核心", "共同基礎", "元件的電位差乘電流給出能量轉移率；電阻把有序電能轉為內能。", "P = IV = I²R = V²/R（歐姆電阻）", "能用被動符號約定判斷元件吸收或提供功率。", "誤以為串聯中電阻較大因電流較小所以一定功率較小。", [hard("phy-053", "功率是能量轉移率。"), hard("phy-126", "每秒通過電荷量由電流給出。"), hard("phy-129", "後兩個功率形式只適用歐姆元件。")]),
  node("phy-132", "網路定律", "串聯、並聯與等效電阻", "基礎", "共同基礎", "串聯元件共享電流、並聯元件共享兩端電壓；等效電阻保留端點 I–V 關係。", "R_series=ΣR；1/R_parallel=Σ1/R", "能不用形狀直覺，依節點連接辨認串並聯並求等效值。", "誤以為圖上排成一列就是串聯，或電流到分岔處平均分配。", [hard("phy-126", "串並聯規則建立在節點電荷流。"), hard("phy-129", "各電阻的電壓與電流由 V=IR 連結。")]),
  node("phy-133", "網路定律", "克希荷夫節點定律", "核心", "共同基礎", "穩態節點不能持續累積電荷，因此流入電流代數和等於流出。", "ΣI_node = 0", "能先任選支路方向，列獨立節點方程並解讀負電流。", "誤以為電流在節點必等分，或只有正值方向才可先假設。", [hard("phy-126", "節點定律是電荷流率的守恆。"), hard("phy-111", "其根本依據是電荷守恆。")]),
  node("phy-134", "網路定律", "克希荷夫迴路定律", "核心", "共同基礎", "集總、準靜態電路中繞閉合路徑的電位升降代數和為零。", "ΣΔV_loop = 0", "能沿任選方向一致記錄電源與元件電位變化並列獨立迴路式。", "誤以為電流沿迴路被電阻逐一用掉，或任何有感應磁通的迴路仍滿足零和。", [hard("phy-119", "迴路式追蹤的是電位差。"), hard("phy-130", "電源提供電位升，內阻造成壓降。"), soft("phy-132", "簡單串並聯是網路定律的特例。")]),
  node("phy-135", "暫態與交流", "RC 充電暫態", "進階", "微積分主線", "電容充電時電流隨電荷累積而衰減，時間常數由 R 與 C 決定。", "q(t)=Cℰ(1−e^(−t/RC))；τ=RC", "能由迴路方程建立一階微分方程並讀出一個時間常數後狀態。", "誤以為電容一接上電池就瞬間充滿，或充滿後電流仍以相同大小通過介電層。", [hard("phy-123", "電容關係 q=CV 連結狀態與電壓。"), hard("phy-129", "電阻壓降由瞬時電流決定。"), hard("phy-134", "暫態每一瞬間仍需滿足迴路電壓關係。"), hard("phy-010", "電流 dq/dt 使迴路式成微分方程。")]),
  node("phy-136", "暫態與交流", "RC 放電與時間常數", "核心", "共同基礎", "隔離電源後，電容透過電阻釋放場能，電荷、電壓與電流呈指數衰減。", "q(t)=Q₀e^(−t/RC)；I=−(Q₀/RC)e^(−t/RC)", "能由初始與長時間極限畫出 q、V、I 圖並判斷符號。", "誤以為時間常數是完全放電所需的時間，或每秒減少固定電荷量。", [hard("phy-135", "放電與充電共享同一 RC 動力學與時間常數。"), hard("phy-125", "釋放的能量起初儲存在電場。")]),
  node("phy-137", "網路定律", "電表、負載效應與實際量測", "核心", "共同基礎", "理想電流表串聯且零電阻，理想電壓表並聯且無限電阻；實表會改變原電路。", "R_A→0；R_V→∞", "能把有限內阻納入等效電路並估計量測偏差。", "誤以為電表只讀取而不會影響系統，或電壓表應串聯。", [hard("phy-132", "表的接法與內阻效應用串並聯分析。"), hard("phy-129", "表頭讀值仍由其端點 I–V 關係決定。"), soft("phy-012", "負載效應是一種可量化的系統性測量偏差。")]),
  node("phy-138", "電流與材料", "非歐姆元件與 I–V 特性", "進階", "延伸", "二極體、燈絲等元件的 I–V 關係可能非線性、非對稱或受溫度影響。", "r_d = dV/dI", "能由 I–V 曲線求工作點、割線電阻與微分電阻。", "誤以為任何元件都能用一個固定 R 描述，或曲線斜率必等於 V/I。", [hard("phy-129", "非歐姆行為是對線性 V–I 模型的偏離。"), hard("phy-010", "局部微分電阻是曲線的導數。"), soft("phy-014", "殘差與線性擬合可檢查歐姆範圍。")]),
  node("phy-139", "暫態與交流", "正弦交流與均方根值", "核心", "共同基礎", "交流電壓與電流週期換向；均方根值定義為在電阻上產生相同平均功率的直流值。", "v=V₀cosωt；V_rms=V₀/√2", "能由振幅、頻率與相位畫波形並以 rms 求平均電阻功率。", "誤以為交流平均值為零所以不傳遞能量，或 rms 等於振幅的一半。", [hard("phy-082", "正弦振動的振幅、頻率與相位語言可移用到交流。"), hard("phy-131", "rms 由等效平均功率定義。")]),
  node("phy-140", "暫態與交流", "RLC 阻抗、相位與共振", "進階", "延伸", "正弦穩態下以阻抗統一電阻、電容與電感的幅值和相位響應。", "Z=√(R²+(ωL−1/ωC)²)；ω₀=1/√(LC)", "能畫相量、求電流幅值與相位，並辨認串聯共振條件。", "誤以為各元件電壓峰值可直接代數相加，或共振時每個元件電壓皆為零。", [hard("phy-139", "交流阻抗只對正弦穩態的共同頻率定義。"), hard("phy-123", "電容的電荷—電壓關係造成容抗。"), hard("phy-152", "電感的磁通—電流關係造成感抗。"), soft("phy-086", "RLC 共振與受迫阻尼振子具有同構頻率響應。")]),
];

const D10: Seed[] = [
  node("phy-141", "磁力", "洛倫茲力", "核心", "共同基礎", "帶電粒子在電、磁場中受力；磁力垂直於速度與磁場，因此不直接改變速率。", "F⃗ = q(E⃗ + v⃗×B⃗)", "能用電荷符號與右手定則判斷三維磁力方向。", "誤以為靜止電荷受磁力，或磁力沿磁場方向。", [hard("phy-113", "電場力是洛倫茲力的電性部分。"), hard("phy-009", "磁力方向由速度與磁場的外積定義。"), hard("phy-035", "粒子軌跡由合力代入第二定律。")]),
  node("phy-142", "磁力", "均勻磁場中的帶電粒子運動", "核心", "共同基礎", "垂直速度分量造成等速率圓周，平行分量不變，合成螺旋軌跡。", "r = mv_⊥/(|q|B)；ω_c=|q|B/m", "能由軌跡彎曲方向、半徑與螺距反推電荷符號或動量。", "誤以為磁場會使帶電粒子越轉越快，或所有入射方向都形成圓。", [hard("phy-141", "需先分解洛倫茲磁力與速度的方向。"), hard("phy-043", "垂直磁力提供圓周運動向心力。")]),
  node("phy-143", "磁力", "載流導線的磁力", "核心", "共同基礎", "大量移動載子的洛倫茲力加總成磁場對載流導線的力。", "dF⃗ = I dℓ⃗×B⃗；直導線 F⃗=Iℓ⃗×B⃗", "能從電流方向與磁場求導線受力，並連到微觀載子力。", "誤以為中性導線不可能受磁力，或導線力方向沿電流。", [hard("phy-126", "巨觀電流代表大量載子的定向流。"), hard("phy-141", "導線磁力是各載子洛倫茲力的總和。")]),
  node("phy-144", "磁場來源", "畢奧—沙伐定律", "進階", "微積分主線", "穩定電流元在空間產生磁場，方向由電流元與觀測方向外積決定。", "dB⃗ = (μ₀/4π)I(dℓ⃗×r̂)/r²", "能為有限直線、圓弧或線圈建立磁場向量積分。", "誤以為磁場沿電流方向，或可先積分大小而忽略不同電流元方向。", [hard("phy-009", "定律含電流元與位置方向的外積。"), hard("phy-126", "穩定電流是磁場來源。"), hard("phy-011", "完整導線的場由電流元連續疊加。")]),
  node("phy-145", "磁場來源", "安培定律與對稱性", "核心", "微積分主線", "穩定電流造成磁場的閉路環流；高對稱情況可選安培迴路求場。", "∮B⃗·dℓ⃗ = μ₀I_enclosed", "能論證長直線、長螺線管或環形線圈的對稱性後求 B。", "誤以為任意形狀都可把 B 提出積分，或迴路外電流完全沒有磁效應。", [hard("phy-144", "安培定律與畢奧—沙伐定律描述相同靜磁來源。"), hard("phy-008", "環流取磁場在路徑切向的投影。"), hard("phy-011", "閉路環流是線積分。")]),
  node("phy-146", "磁場來源", "螺線管、環形線圈與磁場侷限", "核心", "共同基礎", "多匝線圈的磁場疊加，在長螺線管或緊密環形線圈中形成近似可控磁場。", "B_solenoid≈μ₀nI；B_toroid=μ₀NI/(2πr)", "能依理想化程度選安培迴路並估算內外磁場。", "誤以為有限螺線管外場精確為零，或增加線圈半徑一定增加內場。", [hard("phy-145", "高對稱線圈場由安培定律快速求得。"), soft("phy-114", "多匝線圈場遵循向量疊加。")]),
  node("phy-147", "磁場來源", "電流迴路的磁偶極矩與力矩", "核心", "共同基礎", "小電流迴路以磁偶極矩描述，在均勻磁場中受力矩並具有取向位能。", "μ⃗ = NI A⃗；τ⃗=μ⃗×B⃗；U=−μ⃗·B⃗", "能判斷線圈穩定取向並計算馬達線圈力矩。", "誤以為均勻磁場必使整個電流迴路有淨平移力。", [hard("phy-143", "力矩來自迴路各段導線磁力。"), hard("phy-063", "相隔的力形成合力矩。"), hard("phy-009", "磁矩、磁場與力矩以外積連結。")]),
  node("phy-148", "感應", "磁通量", "核心", "微積分主線", "磁通量是磁場穿越有向面的法向累積，可由場、面積或夾角改變。", "Φ_B = ∫B⃗·dA⃗", "能為移動、旋轉或非均勻場中的線圈計算磁通量與符號。", "誤以為磁通量等於磁場大小，或面積法向的選擇不影響符號。", [hard("phy-116", "磁通與電通量共享有向面積積分結構。"), hard("phy-144", "需先知道空間中的磁場分布。")]),
  node("phy-149", "感應", "法拉第感應定律", "核心", "共同基礎", "穿過迴路的總磁通量隨時間改變時，沿迴路產生非保守電場與感應電動勢。", "ℰ = ∮E⃗·dℓ⃗ = −dΦ_B/dt", "能區分磁場、面積、方向變化造成的 dΦ_B/dt 並求 ℰ。", "誤以為只要有磁場穿過線圈就必有感應電流，或 ℰ 等於磁通量本身。", [hard("phy-148", "感應量取決於磁通而非單一點磁場。"), hard("phy-010", "電動勢由磁通的時間變化率決定。"), soft("phy-130", "電動勢表示每單位電荷獲得的能量。")]),
  node("phy-150", "感應", "楞次定律與能量守恆", "核心", "共同基礎", "感應效應的方向反抗造成磁通改變的過程，而不一定反抗原磁場本身。", "方向由 ℰ = −dΦ_B/dt 的負號決定", "能用假設感應場、求所需電流方向的步驟判定方向。", "誤以為感應場永遠與外加場反向，或線圈會阻止任何磁場存在。", [hard("phy-149", "楞次方向是法拉第定律負號的物理內容。"), hard("phy-052", "若感應助長原改變將違反能量守恆。"), soft("phy-146", "需能由線圈電流方向判定其磁場方向。")]),
  node("phy-151", "感應", "動生電動勢與導體棒", "核心", "共同基礎", "導體在磁場中運動時，載子受磁力分離，形成可由 v×B 積分的電動勢。", "ℰ = ∫(v⃗×B⃗)·dℓ⃗；垂直時 ℰ=Bℓv", "能聯立磁力、電路與機械能求滑動導體棒的速度或外力。", "誤以為導體棒必須切割真實磁力線才有電動勢，或電荷持續累積無上限。", [hard("phy-141", "載子分離源自 qv×B 的洛倫茲力。"), hard("phy-149", "動生情況仍可由總磁通變化一致描述。"), hard("phy-053", "外力機械功率可轉成電功率與熱。")]),
  node("phy-152", "電感與 Maxwell 補全", "自感與磁場儲能", "核心", "微積分主線", "線圈自身電流改變造成磁通改變，誘發反抗電流變化的電動勢並在磁場儲能。", "ℰ_L=−L dI/dt；U_B=½LI²；u_B=B²/(2μ₀)", "能由磁通鏈結求 L，並在固定幾何下建立磁能帳。", "誤以為電感反抗電流本身而非電流變化，或斷電瞬間電流可任意跳變。", [hard("phy-126", "自感描述的是電流及其變化。"), hard("phy-148", "電感由每單位電流造成的磁通鏈結定義。"), hard("phy-149", "反電動勢來自法拉第感應。"), soft("phy-146", "螺線管提供可直接計算 L 的場模型。")]),
  node("phy-153", "電感與 Maxwell 補全", "RL 暫態", "進階", "微積分主線", "接通或切斷含電感迴路時，電流以 L/R 時間尺度連續建立或衰減。", "I_on=(ℰ/R)(1−e^(−tR/L))；τ=L/R", "能由初始連續性與長時間極限畫出 I、V_R、V_L。", "誤以為接通瞬間電感像普通導線，或長時間直流下仍有固定反電動勢。", [hard("phy-152", "電感電壓由 dI/dt 決定且使電流連續。"), hard("phy-134", "每一瞬間仍需滿足迴路電壓關係。"), hard("phy-010", "暫態由一階微分方程描述。")]),
  node("phy-154", "電感與 Maxwell 補全", "互感與理想變壓器", "進階", "共同基礎", "一線圈的變動電流可透過共同磁通在另一線圈感應電動勢；理想變壓器近似守恆功率。", "ℰ₂=−M dI₁/dt；V₂/V₁=N₂/N₁", "能由匝數比求電壓、電流比並說明直流穩態不能變壓。", "誤以為變壓器創造能量，或匝數升壓時輸出電流也同比增大。", [hard("phy-149", "次級電動勢來自穿過它的磁通變化。"), hard("phy-152", "互感是自感概念推廣到兩個迴路。"), hard("phy-131", "理想輸入與輸出平均功率相等。")]),
  node("phy-155", "電感與 Maxwell 補全", "位移電流與安培—Maxwell 定律", "進階", "微積分主線", "變動電場也產生磁場；位移電流項使不同跨面選擇與電荷守恆相容。", "∮B⃗·dℓ⃗=μ₀(I_cond+ε₀ dΦ_E/dt)", "能以充電電容器說明為何原安培定律不足並算出間隙磁場。", "誤以為位移電流代表電荷真的穿過電容介電層。", [hard("phy-145", "Maxwell 補全在安培環流式加入變動電場。"), hard("phy-116", "新增項使用電通量。"), hard("phy-126", "導電電流與電荷累積需符合連續性。"), soft("phy-135", "充電電容器提供位移電流的典型情境。")]),
];

const D11: Seed[] = [
  node("phy-156", "電磁波", "Maxwell 方程組與電磁波", "進階", "微積分主線", "變動電場與磁場彼此生成，使真空中可存在不依賴介質傳播的橫向波。", "∇²E⃗ = μ₀ε₀ ∂²E⃗/∂t²；B₀=E₀/c", "能從 Faraday 與 Ampere–Maxwell 定律辨認互相耦合的場。", "誤以為電磁波需要以太等物質介質，或 E、B 沿傳播方向振動。", [hard("phy-149", "變動磁場生成環形電場。"), hard("phy-155", "變動電場生成環形磁場。"), hard("phy-089", "辨認所得方程的波動形式。")]),
  node("phy-157", "電磁波", "真空光速與介質折射率", "核心", "共同基礎", "真空波速由電磁常數決定；介質中的相速度以折射率描述，頻率跨界面保持連續。", "c=1/√(μ₀ε₀)；v=c/n；λ_medium=λ₀/n", "能在波跨介面時正確比較 f、v、λ。", "誤以為光進入介質後頻率下降，或折射率越大波速越快。", [hard("phy-156", "真空光速由電磁波方程係數讀出。"), hard("phy-088", "波速、波長與頻率滿足 v=λf。")]),
  node("phy-158", "電磁波", "Poynting 向量、強度與輻射壓", "進階", "微積分主線", "電磁能量以 Poynting 向量流動；平均強度與場振幅平方成正比並可傳遞動量。", "S⃗=(1/μ₀)E⃗×B⃗；⟨I⟩=½cε₀E₀²", "能由場振幅求強度、功率與完全吸收或反射的輻射壓。", "誤以為振幅加倍只讓強度加倍，或無質量光不能傳遞動量。", [hard("phy-156", "電磁波中 E、B 與傳播方向互相垂直。"), hard("phy-125", "電場能量密度是總電磁能的一部分。"), hard("phy-053", "強度是單位面積的能量流率。")]),
  node("phy-159", "電磁波", "電磁頻譜與橫向場", "基礎", "共同基礎", "無線電到伽瑪射線皆是同一類電磁波，差別在頻率、波長與能量尺度。", "c=λf；E⃗⊥B⃗⊥k⃗", "能依頻率排序頻譜區段並畫出場與傳播方向。", "誤以為不同頻譜區是本質不同的物質，或頻率高表示在真空傳得更快。", [hard("phy-157", "所有真空電磁波共享光速與 λf 關係。"), soft("phy-009", "E×B 指向能量傳播方向。")]),
  node("phy-160", "幾何光學", "反射定律與光線模型", "基礎", "共同基礎", "當結構尺度遠大於波長，可用光線近似；鏡面反射的入射角等於反射角。", "θ_i = θ_r（相對法線）", "能以法線作圖追蹤多次反射並說明適用尺度。", "誤以為角度相對鏡面量，或眼睛必須位在法線上才看見反射。", [hard("phy-159", "光線是電磁波傳播方向的幾何近似。"), soft("phy-090", "反射本質仍受波的邊界疊加支配。")]),
  node("phy-161", "幾何光學", "折射與 Snell 定律", "核心", "共同基礎", "波跨介面時切向相位需連續，速度改變使傳播方向依 Snell 定律改變。", "n₁sinθ₁=n₂sinθ₂", "能由折射率判斷向法線或離法線偏折並求未知角。", "誤以為進入較慢介質光必向介面偏，或折射時頻率改變。", [hard("phy-157", "折射率連結介質中的相速度。"), hard("phy-160", "角度皆相對介面法線定義。")]),
  node("phy-162", "幾何光學", "全反射與臨界角", "核心", "共同基礎", "光由高折射率介質往低折射率介質且入射角超過臨界角時，不再有傳播折射光。", "sinθ_c = n₂/n₁（n₁>n₂）", "能先檢查介質次序，再判定是否可能全反射。", "誤以為任何介面只要角度夠大都會全反射，或全反射界面外完全沒有場。", [hard("phy-161", "臨界角是 Snell 定律令折射角為 90° 的極限。")]),
  node("phy-163", "成像", "平面鏡與球面鏡成像", "核心", "共同基礎", "反射光線或其反向延長線的交會定義實像或虛像；近軸球面鏡滿足成像式。", "1/f = 1/d_o + 1/d_i；m=−d_i/d_o", "能用主光線圖與符號成像式互相驗證像的位置、正倒與倍率。", "誤以為虛像不存在所以不能被看見，或鏡子大小決定像的大小。", [hard("phy-160", "鏡面成像建立在逐條光線反射。"), hard("phy-004", "成像式可用極限情況與量綱檢查。")]),
  node("phy-164", "成像", "薄透鏡與折射成像", "核心", "共同基礎", "近軸光經兩次折射後由會聚或發散透鏡成像，焦距由形狀與折射率決定。", "1/f = 1/d_o + 1/d_i；1/f=(n−1)(1/R₁−1/R₂)", "能用光線圖與薄透鏡式判斷實虛像及倍率。", "誤以為遮住半個透鏡會失去半個像，或發散透鏡永遠不能參與實像形成。", [hard("phy-161", "透鏡成像由兩個折射介面組成。"), soft("phy-163", "球面鏡與薄透鏡共享近軸成像語法。")]),
  node("phy-165", "成像", "眼睛、放大鏡、顯微鏡與望遠鏡", "進階", "共同基礎", "複合光學系統以逐級成像與角放大率描述；眼睛調焦改變晶狀體光焦度。", "M_telescope≈−f_o/f_e；近點約 25 cm（慣用值）", "能逐元件追蹤中間像與終像，並解釋近視或遠視矯正。", "誤以為儀器線性倍率越大解析度必越高，或眼睛看遠物需更用力會聚。", [hard("phy-163", "反射式儀器需掌握鏡面成像。"), hard("phy-164", "折射式儀器由多個薄透鏡逐級成像。")]),
  node("phy-166", "波動光學", "Huygens 原理、相干性與波前", "核心", "共同基礎", "波前每點可視為次波源；穩定干涉需要可預測的相位關係與足夠相干性。", "新波前 = 次波包絡；Δφ 保持可預測", "能用波前圖解釋反射、折射與孔徑後擴散。", "誤以為每個次波是真正新增能量源，或兩盞普通燈可形成穩定條紋。", [hard("phy-088", "波前是相位相同點的集合。"), hard("phy-090", "干涉圖樣取決於相位差能否穩定。"), soft("phy-161", "Huygens 幾何可導出 Snell 定律。")]),
  node("phy-167", "波動光學", "雙狹縫與多源干涉", "核心", "共同基礎", "兩相干狹縫的路徑差造成亮暗條紋；遠場小角時條紋近似等距。", "d sinθ = mλ；小角 y_m≈mλL/d", "能由條紋間距反求波長或狹縫距並指出近似條件。", "誤以為每條亮紋只來自其中一個狹縫，或增加狹縫距會增大條紋間距。", [hard("phy-166", "雙縫需有共同來源維持相干。"), hard("phy-090", "亮暗條件由兩波相位差決定。")]),
  node("phy-168", "波動光學", "單狹縫繞射與孔徑極限", "核心", "微積分主線", "有限孔徑內不同位置的次波彼此干涉，使光展寬並形成中央主極大。", "a sinθ = mλ（暗紋，m=±1,±2,…）", "能由孔徑與波長預測中央極大寬度，並以極限檢查趨勢。", "誤以為狹縫越窄透出的光束越窄，或繞射只發生在光遇到障礙時。", [hard("phy-166", "孔徑內連續次波源由 Huygens 原理建立。"), hard("phy-011", "單縫圖樣是跨孔徑振幅的連續積分。")]),
  node("phy-169", "波動光學", "繞射光柵與解析能力", "進階", "共同基礎", "多狹縫使主極大更尖銳；有限孔徑決定兩個鄰近波長或像點能否分辨。", "d sinθ=mλ；光柵 R=mN；圓孔 θ_min≈1.22λ/D", "能區分放大率與解析力，並計算光柵或圓孔的分辨極限。", "誤以為增加倍率可無限看清細節，或狹縫越多主峰位置會改變。", [hard("phy-167", "光柵是雙縫干涉推廣到多個等距源。"), hard("phy-168", "解析極限源自有限孔徑的繞射寬度。"), soft("phy-165", "光學儀器的有效細節受解析而非只受倍率限制。")]),
  node("phy-170", "波動光學", "偏振與 Malus 定律", "核心", "共同基礎", "偏振描述橫波電場振動方向；線偏振片選取入射場在透射軸上的分量。", "I = I₀cos²θ；未偏振光過理想首片 I=I₀/2", "能追蹤多片偏振片後的強度並由現象論證光為橫波。", "誤以為偏振片把光的傳播方向轉彎，或兩片正交偏振片間加入第三片不可能透光。", [hard("phy-159", "只有橫向電場才有線偏振方向。"), hard("phy-008", "透射場振幅是入射場在軸上的投影。"), hard("phy-158", "強度與場振幅平方成正比。")]),
];

const D12: Seed[] = [
  node("phy-171", "狹義相對論", "相對性原理與光速不變", "核心", "共同基礎", "所有慣性系中的物理定律形式相同，且每位慣性觀察者測得真空光速皆為 c。", "c = 299 792 458 m/s（精確定義值）", "能辨認哪些敘述是事件、觀察者測量或座標選擇，並套用兩公設。", "誤以為光速不變是因光相對某種介質傳播，或只有力學定律具相對性。", [hard("phy-016", "相對論比較不同參考系對事件的座標描述。"), hard("phy-157", "光在真空中的速度由電磁理論給出。"), soft("phy-034", "狹義相對論只直接比較慣性系。")]),
  node("phy-172", "狹義相對論", "Lorentz 因子、轉換與時間膨脹", "核心", "微積分主線", "保持光速與時空間隔不變的 Lorentz 轉換混合空間和時間；移動時鐘累積較少固有時。", "γ=1/√(1−v²/c²)；Δt=γΔτ", "能辨認同地發生的兩事件所定義的固有時，再計算另一系時間。", "誤以為時間膨脹是時鐘機械故障或光傳遞延遲造成的表象。", [hard("phy-171", "Lorentz 轉換由兩項相對論公設限制。"), hard("phy-004", "低速極限 γ→1 可作模型檢查。")]),
  node("phy-173", "狹義相對論", "同時性的相對性與長度收縮", "核心", "共同基礎", "空間分離事件是否同時依慣性系而異；移動物體長度需在量測系同時取兩端位置。", "L=L₀/γ；Δt′=γ(Δt−vΔx/c²)", "能先辨認固有長度，再用 Lorentz 轉換說明不同系的同時性。", "誤以為長度收縮是物體真的被壓扁，或同時性差異只是訊號到達時間。", [hard("phy-172", "兩效應都來自 Lorentz 轉換，不是獨立修補。"), soft("phy-017", "長度量測需清楚定義端點位置與位移。")]),
  node("phy-174", "狹義相對論", "相對論動量與能量", "進階", "微積分主線", "高速下以 γ 修正動量與總能量，使四動量守恆並包含靜質能。", "p⃗=γmv⃗；E=γmc²；E²=p²c²+m²c⁴", "能用能量—動量關係分析有質量粒子與光子的極限。", "誤以為相對論質量隨速度增加是唯一正確語言，或物體可由有限能量加速到 c。", [hard("phy-172", "高速修正量由 Lorentz 因子控制。"), hard("phy-055", "相對論動量延伸低速線動量。"), hard("phy-052", "孤立交互作用仍遵守總能量守恆。")]),
  node("phy-175", "光量子", "黑體輻射與能量量子化", "核心", "共同基礎", "黑體光譜隨溫度有特定峰值與總功率；Planck 假設振子交換離散能量解決紫外災難。", "E_n=nhf；λ_maxT=b；P/A=σT⁴", "能比較不同溫度黑體光譜的峰位與曲線面積。", "誤以為較熱黑體只讓原峰變高而峰值波長不變，或量子化表示頻率只能取離散值。", [hard("phy-103", "熱輻射功率與溫度四次方相關。"), hard("phy-159", "黑體能量分布跨越電磁頻譜。"), hard("phy-096", "光譜溫度需使用絕對溫標。")]),
  node("phy-176", "光量子", "光電效應", "核心", "共同基礎", "單光子把能量 hf 交給單電子；最大動能由頻率決定，光強主要改變光電子數率。", "K_max=hf−φ=eV_stop", "能由截止電壓—頻率圖求 Planck 常數與材料功函數。", "誤以為提高低於閾頻的光強終會打出電子，或強度增加必提高最大動能。", [hard("phy-175", "光電關係使用能量量子 hf。"), hard("phy-119", "截止電位把電位能轉成動能差。"), soft("phy-158", "光強描述每面積每時間到達的總能量。")]),
  node("phy-177", "光量子", "光子動量與 Compton 散射", "核心", "共同基礎", "光子雖無靜質量仍攜帶能量與動量；與電子散射時總四動量守恆。", "p=h/λ=E/c；Δλ=(h/m_ec)(1−cosθ)", "能用能量與動量守恆預測散射波長只依角度改變。", "誤以為光子無質量所以動量為零，或 Compton 位移取決於入射光強。", [hard("phy-174", "無質量極限 E=pc 給出光子能量—動量關係。"), hard("phy-176", "光電效應建立單光子能量 hf。"), hard("phy-059", "散射需用二維向量動量守恆。")]),
  node("phy-178", "物質波與量子力學", "de Broglie 物質波與電子繞射", "核心", "共同基礎", "物質粒子也具有由動量決定的波長，繞射實驗顯示其波動表徵。", "λ=h/p", "能由加速電壓求非相對論電子波長並預測繞射尺度。", "誤以為粒子沿路徑像水波般實際攤開，或物質波波長由粒子幾何大小決定。", [hard("phy-177", "光的 p=h/λ 關係被 de Broglie 推廣到物質。"), hard("phy-055", "物質波長由粒子動量而非單獨速度決定。"), soft("phy-168", "繞射提供波動性的可觀察證據。")]),
  node("phy-179", "物質波與量子力學", "不確定關係與波包", "核心", "微積分主線", "位置愈局域需要愈寬波數分布，因此位置與動量的統計散布有下限。", "ΔxΔp ≥ ħ/2；ΔEΔt ≳ ħ/2", "能以波包傅立葉寬度定性預測局域化對動量分布的影響。", "誤以為不確定性只來自儀器不夠精密，或粒子同時有未知但確定的 x、p。", [hard("phy-178", "物質波讓動量與波數分布互相連結。"), hard("phy-012", "Δ 表示統計散布而非單次讀值的有效數字。"), soft("phy-095", "波包由多個波數成分疊加。")]),
  node("phy-180", "物質波與量子力學", "波函數、機率密度與期望值", "核心", "共同基礎", "波函數是機率振幅；可觀察位置機率由 |ψ|² 給出，且全空間機率須正規化。", "∫|ψ|²dx=1；⟨x⟩=∫ψ*xψ dx", "能由給定 ψ 判斷可接受性、正規化並計算區間機率。", "誤以為 ψ 是粒子材料密度，或 |ψ|² 最大處每次必找到粒子。", [hard("phy-179", "量子狀態預測的是測量分布與不確定度。"), hard("phy-011", "正規化與期望值是機率密度的積分。")]),
  node("phy-181", "物質波與量子力學", "Schrödinger 方程、定態與能階", "進階", "微積分主線", "Hamiltonian 決定波函數時間演化；定態是能量本徵態並具有離散或連續能譜。", "iħ∂ψ/∂t=Ĥψ；−(ħ²/2m)ψ″+Uψ=Eψ", "能對無限深方井套邊界條件，求能階與節點數。", "誤以為定態中的粒子靜止，或能量量子化是所有勢能下無條件成立。", [hard("phy-020", "方程中的空間二階導數與動能相關。"), hard("phy-050", "勢能函數 U(x) 決定作用力與量子 Hamiltonian。"), hard("phy-180", "Schrödinger 解須能作為正規化波函數。")]),
  node("phy-182", "原子與原子核", "原子能階、光譜與 Bohr 對應", "核心", "共同基礎", "束縛電子只允許特定能量；能階躍遷的能差對應吸收或放出光子的頻率。", "hf=|E_f−E_i|；氫原子 E_n=−13.6 eV/n²", "能由能階圖列出允許光譜線並分辨吸收與放射。", "誤以為電子在軌道間經過所有中間能量，或能階間距相等。", [hard("phy-175", "光子能量由 hf 決定。"), hard("phy-181", "離散原子能階是束縛態本徵值。"), soft("phy-120", "氫原子的吸引庫侖位能決定束縛尺度。")]),
  node("phy-183", "原子與原子核", "自旋、Pauli 原理與費米子填態", "進階", "延伸", "自旋是內禀角動量；相同費米子不能占據完全相同的單粒子量子態。", "S²=s(s+1)ħ²；電子 s=1/2", "能用量子數與 Pauli 原理解釋原子軌域填入上限。", "誤以為自旋是電子像小球自轉，或兩電子只要位置不同就可有完全相同量子數。", [hard("phy-067", "自旋具有角動量與磁矩語言但不是經典軌道轉動。"), hard("phy-180", "量子態由波函數及內禀自由度共同指定。"), hard("phy-182", "原子能階提供電子填態的結構。")]),
  node("phy-184", "原子與原子核", "核結合能、質量虧損與放射性", "核心", "共同基礎", "原子核質量小於分離核子總質量，差值對應結合能；不穩定核以機率律衰變。", "E_b=Δmc²；N(t)=N₀e^(−λt)；t₁/₂=ln2/λ", "能由原子質量算每核子結合能，並用半衰期處理族群而非單核壽命。", "誤以為半衰期後所有原子都衰變，或質量虧損表示核子消失。", [hard("phy-174", "質量差以 E=mc² 轉成核能尺度。"), hard("phy-111", "核反應仍守恆總電荷。"), hard("phy-136", "指數衰減的時間常數語言可移用到放射族群。")]),
  node("phy-185", "原子與原子核", "核分裂、核融合與反應能", "進階", "共同基礎", "反應前後結合能差轉成動能與輻射；重核分裂與輕核融合都可向較高每核子結合能移動。", "Q=(m_initial−m_final)c²", "能由質量表判斷反應吸能或放能，並同時檢查核子數、電荷與能量守恆。", "誤以為所有核反應都釋能，或融合不需克服庫侖位壘。", [hard("phy-184", "反應能來自初末核結合能與質量差。"), hard("phy-052", "核反應中總能量仍守恆。"), soft("phy-112", "帶正電核之間的庫侖排斥形成融合位壘。")]),
];

export const CONCEPTS: readonly ConceptNode[] = [
  ...materialize("d01-foundations", D01),
  ...materialize("d02-kinematics", D02),
  ...materialize("d03-dynamics", D03),
  ...materialize("d04-conservation", D04),
  ...materialize("d05-rotation-gravity-fluids", D05),
  ...materialize("d06-oscillations-waves", D06),
  ...materialize("d07-thermodynamics", D07),
  ...materialize("d08-electrostatics", D08),
  ...materialize("d09-circuits", D09),
  ...materialize("d10-magnetism-induction", D10),
  ...materialize("d11-optics-em", D11),
  ...materialize("d12-modern", D12),
];

export const EDGES: readonly ConceptEdge[] = CONCEPTS.flatMap((concept) =>
  concept.prerequisites.map((prerequisite) => ({
    id: `${prerequisite.id}__${concept.id}`,
    from: prerequisite.id,
    to: concept.id,
    type: prerequisite.type,
    reason: prerequisite.reason,
  })),
);

export const DOMAIN_BY_ID: Readonly<Record<string, Domain>> = Object.fromEntries(
  DOMAINS.map((domain) => [domain.id, domain]),
);

export const SOURCE_BY_ID: Readonly<Record<string, Source>> = Object.fromEntries(
  SOURCES.map((source) => [source.id, source]),
);

export const CONCEPT_BY_ID: Readonly<Record<string, ConceptNode>> = Object.fromEntries(
  CONCEPTS.map((concept) => [concept.id, concept]),
);

export const CONCEPTS_BY_DOMAIN: Readonly<Record<string, readonly ConceptNode[]>> =
  Object.fromEntries(
    DOMAINS.map((domain) => [
      domain.id,
      CONCEPTS.filter((concept) => concept.domainId === domain.id),
    ]),
  );

export const COUNTS = {
  domains: DOMAINS.length,
  concepts: CONCEPTS.length,
  edges: EDGES.length,
  hardEdges: EDGES.filter((edge) => edge.type === "hard").length,
  softEdges: EDGES.filter((edge) => edge.type === "soft").length,
  byLevel: {
    基礎: CONCEPTS.filter((concept) => concept.level === "基礎").length,
    核心: CONCEPTS.filter((concept) => concept.level === "核心").length,
    進階: CONCEPTS.filter((concept) => concept.level === "進階").length,
  },
  byTrack: {
    共同基礎: CONCEPTS.filter((concept) => concept.track === "共同基礎").length,
    微積分主線: CONCEPTS.filter((concept) => concept.track === "微積分主線").length,
    延伸: CONCEPTS.filter((concept) => concept.track === "延伸").length,
  },
} as const;
