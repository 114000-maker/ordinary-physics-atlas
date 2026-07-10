"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  CONCEPTS,
  DOMAINS,
  EDGES,
  type ConceptEdge,
  type ConceptNode,
  type Domain,
  type LearningLevel,
} from "./physics-data";

export interface KnowledgeGraphProps {
  /** Controlled concept selection. */
  selectedId: string | null;
  /** Called for node, relationship-list, keyboard, and empty-canvas selections. */
  onSelect: (id: string | null) => void;
  /** Omit to show all domains. Both Set and array forms are accepted. */
  visibleDomains?: ReadonlySet<string> | readonly string[];
  /** Search dims non-matches while leaving their prerequisite context available. */
  searchQuery?: string;
  /** Alias for searchQuery, useful for compact host APIs. */
  query?: string;
  className?: string;
  ariaLabel?: string;
  /** Optional built-in chrome for standalone use. Host pages can provide their own panels. */
  showChrome?: boolean;
  showDetails?: boolean;
}

interface Point3 {
  x: number;
  y: number;
  z: number;
}

interface Camera {
  yaw: number;
  pitch: number;
  zoom: number;
  panX: number;
  panY: number;
}

interface PositionedConcept extends Point3 {
  concept: ConceptNode;
  domain: Domain;
  baseRadius: number;
}

interface ScreenPoint {
  x: number;
  y: number;
  depth: number;
  scale: number;
}

interface ProjectedNode extends ScreenPoint {
  positioned: PositionedConcept;
  radius: number;
  fog: number;
}

interface TooltipState {
  id: string;
  x: number;
  y: number;
}

interface PointerPosition {
  x: number;
  y: number;
}

interface GestureState {
  pointers: Map<number, PointerPosition>;
  lastX: number;
  lastY: number;
  travel: number;
  dragged: boolean;
  mode: "rotate" | "pan";
  pinchDistance: number | null;
  pinchCenter: PointerPosition | null;
}

interface RenderState {
  visibleDomainIds: ReadonlySet<string>;
  selectedId: string | null;
  ancestorIds: ReadonlySet<string>;
  directPrerequisiteIds: ReadonlySet<string>;
  directUnlockIds: ReadonlySet<string>;
  ancestryEdgeIds: ReadonlySet<string>;
  queryMatches: ReadonlySet<string>;
  hasQuery: boolean;
  hoverId: string | null;
}

const TWO_PI = Math.PI * 2;
const LEVELS: readonly LearningLevel[] = ["基礎", "核心", "進階"];
const LEVEL_Y: Record<LearningLevel, number> = {
  基礎: 185,
  核心: 18,
  進階: -170,
};
const LEVEL_RADIUS: Record<LearningLevel, number> = {
  基礎: 112,
  核心: 170,
  進階: 225,
};
const INITIAL_CAMERA: Readonly<Camera> = {
  yaw: -0.58,
  pitch: -0.18,
  zoom: 1.12,
  panX: 0,
  panY: 4,
};

const SR_ONLY: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const CONCEPT_BY_ID = new Map<string, ConceptNode>(
  CONCEPTS.map((concept) => [concept.id, concept]),
);
const DOMAIN_BY_ID = new Map<string, Domain>(
  DOMAINS.map((domain) => [domain.id, domain]),
);
const EDGES_INTO = new Map<string, ConceptEdge[]>();
const EDGES_OUT_OF = new Map<string, ConceptEdge[]>();

for (const edge of EDGES) {
  const incoming = EDGES_INTO.get(edge.to) ?? [];
  incoming.push(edge);
  EDGES_INTO.set(edge.to, incoming);

  const outgoing = EDGES_OUT_OF.get(edge.from) ?? [];
  outgoing.push(edge);
  EDGES_OUT_OF.set(edge.from, outgoing);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function signedNoise(value: string, salt: number): number {
  const hash = hashString(`${salt}:${value}`);
  return (hash / 0xffffffff) * 2 - 1;
}

function colorWithAlpha(color: string, alpha: number): string {
  const normalized = color.trim();
  const short = /^#([\da-f])([\da-f])([\da-f])$/i.exec(normalized);
  const long = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(normalized);

  if (short) {
    const red = Number.parseInt(short[1] + short[1], 16);
    const green = Number.parseInt(short[2] + short[2], 16);
    const blue = Number.parseInt(short[3] + short[3], 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  if (long) {
    const red = Number.parseInt(long[1], 16);
    const green = Number.parseInt(long[2], 16);
    const blue = Number.parseInt(long[3], 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  return color;
}

function makeLayout(): PositionedConcept[] {
  const orderedDomains = [...DOMAINS].sort((a, b) => a.order - b.order);
  const domainIndex = new Map(
    orderedDomains.map((domain, index) => [domain.id, index]),
  );
  const buckets = new Map<string, ConceptNode[]>();

  for (const concept of CONCEPTS) {
    const key = `${concept.domainId}:${concept.level}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push(concept);
    buckets.set(key, bucket);
  }
  for (const bucket of buckets.values()) {
    bucket.sort((a, b) => a.id.localeCompare(b.id));
  }

  const sector = TWO_PI / Math.max(1, orderedDomains.length);
  return CONCEPTS.flatMap((concept) => {
    const domain = DOMAIN_BY_ID.get(concept.domainId);
    if (!domain) return [];

    const index = domainIndex.get(domain.id) ?? 0;
    const centerAngle = -Math.PI / 2 + index * sector;
    const bucket = buckets.get(`${concept.domainId}:${concept.level}`) ?? [concept];
    const rank = Math.max(0, bucket.findIndex((item) => item.id === concept.id));
    const spread = bucket.length > 1 ? rank / (bucket.length - 1) - 0.5 : 0;
    const clusterIndex = Math.max(0, domain.clusters.indexOf(concept.cluster));
    const clusterSpread =
      domain.clusters.length > 1
        ? clusterIndex / (domain.clusters.length - 1) - 0.5
        : 0;
    const angle =
      centerAngle +
      spread * sector * 0.74 +
      clusterSpread * sector * 0.08 +
      signedNoise(concept.id, 1) * sector * 0.025;
    const radialLane = (rank % 3) - 1;
    const radius =
      LEVEL_RADIUS[concept.level] +
      radialLane * 17 +
      clusterSpread * 22 +
      signedNoise(concept.id, 2) * 9;
    const y =
      LEVEL_Y[concept.level] +
      spread * 54 +
      clusterSpread * 12 +
      signedNoise(concept.id, 3) * 8;

    return [
      {
        concept,
        domain,
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
        baseRadius: concept.track === "共同基礎" ? 5 : concept.track === "延伸" ? 3.8 : 4.4,
      },
    ];
  });
}

const POSITIONED_CONCEPTS = makeLayout();

function projectPoint(
  point: Point3,
  camera: Camera,
  width: number,
  height: number,
): ScreenPoint {
  const yawCos = Math.cos(camera.yaw);
  const yawSin = Math.sin(camera.yaw);
  const pitchCos = Math.cos(camera.pitch);
  const pitchSin = Math.sin(camera.pitch);
  const rotatedX = point.x * yawCos - point.z * yawSin;
  const yawDepth = point.x * yawSin + point.z * yawCos;
  const rotatedY = point.y * pitchCos - yawDepth * pitchSin;
  const depth = point.y * pitchSin + yawDepth * pitchCos;
  const fit = clamp(Math.min(width / 940, height / 760), 0.52, 1.06);
  const perspective = (camera.zoom * fit * 900) / clamp(900 + depth, 390, 1450);

  return {
    x: width / 2 + camera.panX + rotatedX * perspective,
    y: height / 2 + camera.panY + rotatedY * perspective,
    depth,
    scale: perspective,
  };
}

function collectAncestry(selectedId: string | null): {
  nodeIds: Set<string>;
  edgeIds: Set<string>;
} {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  if (!selectedId || !CONCEPT_BY_ID.has(selectedId)) return { nodeIds, edgeIds };

  const pending = [selectedId];
  const expanded = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || expanded.has(current)) continue;
    expanded.add(current);

    for (const edge of EDGES_INTO.get(current) ?? []) {
      edgeIds.add(edge.id);
      if (!nodeIds.has(edge.from)) {
        nodeIds.add(edge.from);
        pending.push(edge.from);
      }
    }
  }
  nodeIds.delete(selectedId);
  return { nodeIds, edgeIds };
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase("zh-Hant");
}

function matchesSearch(concept: ConceptNode, query: string): boolean {
  if (!query) return true;
  const domain = DOMAIN_BY_ID.get(concept.domainId);
  const searchable = [
    concept.title,
    concept.cluster,
    concept.summary,
    concept.equation,
    concept.evidence,
    concept.misconception,
    concept.track,
    concept.level,
    domain?.title ?? "",
    domain?.subtitle ?? "",
    domain?.code ?? "",
  ]
    .join(" ")
    .toLocaleLowerCase("zh-Hant");
  return searchable.includes(query);
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const background = context.createRadialGradient(
    width * 0.5,
    height * 0.4,
    10,
    width * 0.5,
    height * 0.48,
    Math.max(width, height) * 0.78,
  );
  background.addColorStop(0, "#132638");
  background.addColorStop(0.48, "#091522");
  background.addColorStop(1, "#040910");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const horizon = context.createLinearGradient(0, 0, 0, height);
  horizon.addColorStop(0, "rgba(111, 169, 201, 0.035)");
  horizon.addColorStop(0.58, "rgba(18, 42, 59, 0)");
  horizon.addColorStop(1, "rgba(0, 0, 0, 0.22)");
  context.fillStyle = horizon;
  context.fillRect(0, 0, width, height);

  context.save();
  context.fillStyle = "rgba(202, 225, 238, 0.14)";
  for (let index = 0; index < 72; index += 1) {
    const starX = ((hashString(`star-x-${index}`) % 10000) / 10000) * width;
    const starY = ((hashString(`star-y-${index}`) % 10000) / 10000) * height;
    const radius = 0.25 + (hashString(`star-r-${index}`) % 8) / 10;
    context.beginPath();
    context.arc(starX, starY, radius, 0, TWO_PI);
    context.fill();
  }
  context.restore();
}

function drawConeAndAxis(
  context: CanvasRenderingContext2D,
  camera: Camera,
  width: number,
  height: number,
  visibleDomainIds: ReadonlySet<string>,
): void {
  const orderedDomains = [...DOMAINS].sort((a, b) => a.order - b.order);
  const sector = TWO_PI / Math.max(1, orderedDomains.length);
  const wedges = orderedDomains
    .filter((domain) => visibleDomainIds.has(domain.id))
    .map((domain, index) => {
      const orderedIndex = orderedDomains.findIndex((item) => item.id === domain.id);
      const center = -Math.PI / 2 + orderedIndex * sector;
      const halfWidth = sector * 0.34;
      const apex = projectPoint(
        { x: Math.cos(center) * 96, y: 222, z: Math.sin(center) * 96 },
        camera,
        width,
        height,
      );
      const left = projectPoint(
        {
          x: Math.cos(center - halfWidth) * 276,
          y: -214,
          z: Math.sin(center - halfWidth) * 276,
        },
        camera,
        width,
        height,
      );
      const right = projectPoint(
        {
          x: Math.cos(center + halfWidth) * 276,
          y: -214,
          z: Math.sin(center + halfWidth) * 276,
        },
        camera,
        width,
        height,
      );
      return {
        domain,
        index,
        center,
        points: [apex, left, right] as const,
        depth: (apex.depth + left.depth + right.depth) / 3,
      };
    })
    .sort((a, b) => b.depth - a.depth);

  for (const wedge of wedges) {
    const [apex, left, right] = wedge.points;
    context.save();
    context.beginPath();
    context.moveTo(apex.x, apex.y);
    context.lineTo(left.x, left.y);
    context.lineTo(right.x, right.y);
    context.closePath();
    context.globalAlpha = 0.045;
    context.fillStyle = wedge.domain.color;
    context.fill();
    context.globalAlpha = 0.18;
    context.strokeStyle = wedge.domain.color;
    context.lineWidth = 0.7;
    context.stroke();
    context.restore();
  }

  for (const level of LEVELS) {
    const radius = LEVEL_RADIUS[level];
    context.save();
    context.beginPath();
    for (let step = 0; step <= 80; step += 1) {
      const angle = (step / 80) * TWO_PI;
      const point = projectPoint(
        {
          x: Math.cos(angle) * radius,
          y: LEVEL_Y[level],
          z: Math.sin(angle) * radius,
        },
        camera,
        width,
        height,
      );
      if (step === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
    context.closePath();
    context.setLineDash(level === "核心" ? [3, 5] : [1, 7]);
    context.strokeStyle = "rgba(183, 215, 229, 0.2)";
    context.lineWidth = 0.8;
    context.stroke();
    context.restore();
  }

  const axisTop = projectPoint({ x: 0, y: -244, z: 0 }, camera, width, height);
  const axisBottom = projectPoint({ x: 0, y: 244, z: 0 }, camera, width, height);
  context.save();
  context.beginPath();
  context.moveTo(axisTop.x, axisTop.y);
  context.lineTo(axisBottom.x, axisBottom.y);
  context.strokeStyle = "rgba(218, 235, 242, 0.42)";
  context.lineWidth = 1;
  context.stroke();

  context.font = '600 10px "Noto Sans TC", sans-serif';
  context.textBaseline = "middle";
  for (const level of LEVELS) {
    const point = projectPoint({ x: 0, y: LEVEL_Y[level], z: 0 }, camera, width, height);
    context.beginPath();
    context.arc(point.x, point.y, 2.2, 0, TWO_PI);
    context.fillStyle = "rgba(225, 239, 245, 0.78)";
    context.fill();
    context.fillStyle = "rgba(218, 234, 241, 0.72)";
    context.fillText(level, point.x + 9, point.y);
  }
  context.restore();

  if (width < 720) return;
  context.save();
  context.font = '600 10px "Noto Sans TC", sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const wedge of wedges) {
    const label = projectPoint(
      {
        x: Math.cos(wedge.center) * 306,
        y: -222,
        z: Math.sin(wedge.center) * 306,
      },
      camera,
      width,
      height,
    );
    context.globalAlpha = clamp((510 - label.depth) / 900, 0.3, 0.9);
    context.fillStyle = wedge.domain.color;
    context.fillText(`${wedge.domain.code} · ${wedge.domain.title}`, label.x, label.y, 118);
  }
  context.restore();
}

function drawEdge(
  context: CanvasRenderingContext2D,
  edge: ConceptEdge,
  from: ProjectedNode,
  to: ProjectedNode,
  state: RenderState,
): void {
  const isAncestry = state.ancestryEdgeIds.has(edge.id);
  const isDirectUnlock =
    state.selectedId === edge.from && state.directUnlockIds.has(edge.to);
  const isHighlighted = isAncestry || isDirectUnlock;
  const bothMatch = state.queryMatches.has(edge.from) && state.queryMatches.has(edge.to);
  let alpha = edge.type === "hard" ? 0.22 : 0.11;

  if (state.selectedId) alpha = isHighlighted ? 0.88 : 0.022;
  else if (state.hasQuery) alpha = bothMatch ? 0.55 : 0.025;
  alpha *= Math.min(from.fog, to.fog);
  if (alpha < 0.012) return;

  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));
  const bend = clamp(distance * 0.07, 4, 28) * (hashString(edge.id) % 2 === 0 ? 1 : -1);
  const controlX = (from.x + to.x) / 2 - (deltaY / distance) * bend;
  const controlY = (from.y + to.y) / 2 + (deltaX / distance) * bend;
  const targetAngle = Math.atan2(to.y - controlY, to.x - controlX);
  const targetX = to.x - Math.cos(targetAngle) * (to.radius + 2);
  const targetY = to.y - Math.sin(targetAngle) * (to.radius + 2);
  const targetColor = to.positioned.domain.color;

  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = isHighlighted
    ? targetColor
    : edge.type === "hard"
      ? "#8ca4b1"
      : "#6e8291";
  context.lineWidth = isHighlighted ? (edge.type === "hard" ? 1.8 : 1.25) : 0.75;
  context.setLineDash(edge.type === "soft" ? [4, 5] : []);
  if (isHighlighted) {
    context.shadowColor = targetColor;
    context.shadowBlur = 7;
  }
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.quadraticCurveTo(controlX, controlY, targetX, targetY);
  context.stroke();

  if (isHighlighted || (!state.selectedId && !state.hasQuery && edge.type === "hard")) {
    const arrowSize = isHighlighted ? 4.8 : 3.2;
    context.setLineDash([]);
    context.fillStyle = context.strokeStyle;
    context.beginPath();
    context.moveTo(targetX, targetY);
    context.lineTo(
      targetX - Math.cos(targetAngle - 0.52) * arrowSize,
      targetY - Math.sin(targetAngle - 0.52) * arrowSize,
    );
    context.lineTo(
      targetX - Math.cos(targetAngle + 0.52) * arrowSize,
      targetY - Math.sin(targetAngle + 0.52) * arrowSize,
    );
    context.closePath();
    context.fill();
  }
  context.restore();
}

function drawNode(
  context: CanvasRenderingContext2D,
  node: ProjectedNode,
  state: RenderState,
): void {
  const { concept, domain } = node.positioned;
  const isSelected = concept.id === state.selectedId;
  const isAncestor = state.ancestorIds.has(concept.id);
  const isDirectPrerequisite = state.directPrerequisiteIds.has(concept.id);
  const isUnlock = state.directUnlockIds.has(concept.id);
  const isRelated = isSelected || isAncestor || isUnlock;
  const isMatch = state.queryMatches.has(concept.id);
  const isHovered = state.hoverId === concept.id;
  let alpha = 0.84;
  let sizeMultiplier = 1;

  if (state.selectedId) {
    if (isSelected) {
      alpha = 1;
      sizeMultiplier = 1.7;
    } else if (isDirectPrerequisite || isUnlock) {
      alpha = 0.96;
      sizeMultiplier = 1.24;
    } else if (isAncestor) {
      alpha = 0.82;
      sizeMultiplier = 1.04;
    } else {
      alpha = 0.065;
      sizeMultiplier = 0.82;
    }
  } else if (state.hasQuery) {
    if (isMatch) {
      alpha = 1;
      sizeMultiplier = 1.25;
    } else {
      alpha = 0.09;
      sizeMultiplier = 0.8;
    }
  }
  if (isHovered) {
    alpha = 1;
    sizeMultiplier = Math.max(sizeMultiplier, 1.55);
  }
  alpha *= node.fog;
  const radius = node.radius * sizeMultiplier;

  context.save();
  const highlighted =
    isSelected || isHovered || isDirectPrerequisite || isUnlock || (state.hasQuery && isMatch);
  const glowRadius = radius * (isSelected ? 6.2 : highlighted ? 4.6 : 2.4);
  const glow = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
  glow.addColorStop(0, colorWithAlpha(domain.color, highlighted ? 0.58 : 0.2));
  glow.addColorStop(0.3, colorWithAlpha(domain.color, highlighted ? 0.2 : 0.07));
  glow.addColorStop(1, colorWithAlpha(domain.color, 0));
  context.globalAlpha = alpha;
  context.fillStyle = glow;
  context.beginPath();
  context.arc(node.x, node.y, glowRadius, 0, TWO_PI);
  context.fill();

  // Soft cast shadow gives every knowledge point a floating, tactile depth.
  context.globalAlpha = alpha * 0.72;
  context.shadowColor = "rgba(0, 0, 0, 0.9)";
  context.shadowBlur = radius * 2.4;
  context.fillStyle = "rgba(0,0,0,.72)";
  context.beginPath();
  context.ellipse(
    node.x + radius * 0.28,
    node.y + radius * 0.62,
    radius * 0.98,
    radius * 0.52,
    -0.25,
    0,
    TWO_PI,
  );
  context.fill();

  // A multi-stop radial surface replaces flat glyphs with glassy 3D spheres.
  context.shadowColor = domain.color;
  context.shadowBlur = highlighted ? radius * 2.3 : radius * 0.9;
  const surface = context.createRadialGradient(
    node.x - radius * 0.38,
    node.y - radius * 0.46,
    Math.max(0.4, radius * 0.06),
    node.x,
    node.y,
    radius * 1.18,
  );
  surface.addColorStop(0, "rgba(255,255,255,.98)");
  surface.addColorStop(0.12, colorWithAlpha(domain.color, 1));
  surface.addColorStop(0.52, colorWithAlpha(domain.color, 0.88));
  surface.addColorStop(0.82, colorWithAlpha(domain.color, 0.44));
  surface.addColorStop(1, "rgba(3,7,14,.98)");
  context.globalAlpha = alpha;
  context.fillStyle = surface;
  context.beginPath();
  context.arc(node.x, node.y, radius, 0, TWO_PI);
  context.fill();

  context.shadowBlur = 0;
  context.lineWidth = isSelected ? 1.8 : highlighted ? 1.15 : 0.65;
  context.strokeStyle = highlighted
    ? "rgba(245,250,255,.94)"
    : colorWithAlpha(domain.color, 0.7);
  context.stroke();

  // Specular crescent and lower rim make the sphere read at small sizes.
  if (radius > 3.2) {
    context.globalAlpha = alpha * 0.86;
    context.beginPath();
    context.arc(
      node.x - radius * 0.14,
      node.y - radius * 0.12,
      radius * 0.56,
      Math.PI * 1.05,
      Math.PI * 1.7,
    );
    context.strokeStyle = "rgba(255,255,255,.72)";
    context.lineWidth = Math.max(0.55, radius * 0.09);
    context.stroke();

    context.beginPath();
    context.arc(node.x, node.y, radius * 0.82, 0.2, Math.PI * 0.88);
    context.strokeStyle = "rgba(0,0,0,.48)";
    context.lineWidth = Math.max(0.5, radius * 0.08);
    context.stroke();
  }

  // Rings encode learning depth without changing the icon silhouette.
  const ringCount = concept.level === "進階" ? 2 : concept.level === "核心" ? 1 : 0;
  for (let ring = 0; ring < ringCount; ring += 1) {
    context.globalAlpha = alpha * (0.72 - ring * 0.18);
    context.beginPath();
    context.ellipse(
      node.x,
      node.y,
      radius + 3 + ring * 3,
      (radius + 3 + ring * 3) * 0.38,
      -0.32,
      0,
      TWO_PI,
    );
    context.strokeStyle = colorWithAlpha(domain.color, 0.9);
    context.lineWidth = 0.75;
    context.setLineDash(ring === 0 ? [] : [2, 3]);
    context.stroke();
  }

  if (isSelected) {
    context.globalAlpha = 1;
    context.beginPath();
    context.arc(node.x, node.y, radius + 8, 0, TWO_PI);
    context.setLineDash([2, 3]);
    context.strokeStyle = "rgba(240, 249, 252, 0.95)";
    context.lineWidth = 1;
    context.stroke();
  }

  const showLabel =
    isSelected ||
    isHovered ||
    isDirectPrerequisite ||
    isUnlock ||
    (state.hasQuery && isMatch && state.queryMatches.size <= 18) ||
    (!state.selectedId && !state.hasQuery && node.scale > 1.45 && hashString(concept.id) % 4 === 0);
  if (showLabel) {
    context.globalAlpha = clamp(alpha + 0.1, 0, 1);
    context.shadowColor = "#06101a";
    context.shadowBlur = 5;
    context.fillStyle = isSelected ? "#f4fbfd" : "#d8e7ed";
    context.font = `${isSelected ? 600 : 500} ${isSelected ? 12 : 10}px "Noto Sans TC", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(concept.title, node.x, node.y + radius + 7, 136);
  }
  context.restore();
}

function renderScene(
  canvas: HTMLCanvasElement,
  camera: Camera,
  state: RenderState,
  projectedRef: { current: ProjectedNode[] },
): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;

  context.clearRect(0, 0, width, height);
  drawBackground(context, width, height);
  drawConeAndAxis(context, camera, width, height, state.visibleDomainIds);

  const projected = POSITIONED_CONCEPTS.filter(({ concept }) =>
    state.visibleDomainIds.has(concept.domainId),
  )
    .map((positioned): ProjectedNode => {
      const screen = projectPoint(positioned, camera, width, height);
      const fog = clamp((535 - screen.depth) / 900, 0.23, 1);
      return {
        ...screen,
        positioned,
        fog,
        radius: clamp(positioned.baseRadius * screen.scale, 2.3, 7.8),
      };
    })
    .sort((a, b) => b.depth - a.depth);
  projectedRef.current = projected;
  const projectedById = new Map(
    projected.map((node) => [node.positioned.concept.id, node]),
  );

  const visibleEdges = EDGES.map((edge) => ({
    edge,
    from: projectedById.get(edge.from),
    to: projectedById.get(edge.to),
  }))
    .filter(
      (item): item is { edge: ConceptEdge; from: ProjectedNode; to: ProjectedNode } =>
        Boolean(item.from && item.to),
    )
    .sort((a, b) => (b.from.depth + b.to.depth) / 2 - (a.from.depth + a.to.depth) / 2);

  for (const { edge, from, to } of visibleEdges) {
    drawEdge(context, edge, from, to, state);
  }
  for (const node of projected) {
    drawNode(context, node, state);
  }

  if (projected.length === 0) {
    context.save();
    context.fillStyle = "rgba(222, 237, 243, 0.72)";
    context.font = '500 14px "Noto Sans TC", sans-serif';
    context.textAlign = "center";
    context.fillText("目前篩選下沒有可顯示的概念", width / 2, height / 2);
    context.restore();
  }
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

interface RelationListProps {
  title: string;
  emptyText: string;
  edges: readonly ConceptEdge[];
  resolveId: (edge: ConceptEdge) => string;
  onSelect: (id: string) => void;
}

function RelationList({ title, emptyText, edges, resolveId, onSelect }: RelationListProps) {
  return (
    <section aria-label={title} style={{ marginTop: 14 }}>
      <h3
        style={{
          margin: "0 0 7px",
          color: "rgba(222, 237, 243, 0.68)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.13em",
        }}
      >
        {title} · {edges.length}
      </h3>
      {edges.length === 0 ? (
        <p style={{ margin: 0, color: "rgba(215, 232, 239, 0.42)", fontSize: 12 }}>
          {emptyText}
        </p>
      ) : (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {edges.map((edge) => {
            const id = resolveId(edge);
            const concept = CONCEPT_BY_ID.get(id);
            if (!concept) return null;
            const domain = DOMAIN_BY_ID.get(concept.domainId);
            return (
              <li key={edge.id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  title={edge.reason}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    maxWidth: 246,
                    padding: "6px 8px",
                    border: `1px solid ${colorWithAlpha(domain?.color ?? "#9db7c4", 0.34)}`,
                    borderRadius: 999,
                    background: "rgba(9, 22, 34, 0.72)",
                    color: "#dbe9ee",
                    font: '500 11px/1.2 "Noto Sans TC", sans-serif',
                    cursor: "pointer",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      flex: "0 0 auto",
                      borderRadius: edge.type === "hard" ? "50%" : 1,
                      background: domain?.color ?? "#9db7c4",
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {concept.title}
                  </span>
                  <span style={{ color: "rgba(216, 232, 238, 0.48)", fontSize: 9 }}>
                    {edge.type === "hard" ? "必要" : "建議"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function KnowledgeGraph({
  selectedId,
  onSelect,
  visibleDomains,
  searchQuery,
  query,
  className,
  ariaLabel = "普通物理學知識圖譜。概念由基礎、核心至進階沿垂直軸排列；箭頭由先備概念指向後續概念。",
  showChrome = false,
  showDetails = false,
}: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectedRef = useRef<ProjectedNode[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const cameraRef = useRef<Camera>({ ...INITIAL_CAMERA });
  const lastInteractionRef = useRef(0);
  const instructionsId = useId();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [zoomValue, setZoomValue] = useState(INITIAL_CAMERA.zoom);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const normalizedQuery = normalizeSearch(searchQuery ?? query ?? "");

  const visibleDomainIds = useMemo<ReadonlySet<string>>(() => {
    if (!visibleDomains) return new Set(DOMAINS.map((domain) => domain.id));
    return visibleDomains instanceof Set
      ? new Set(visibleDomains)
      : new Set(visibleDomains);
  }, [visibleDomains]);

  const queryMatches = useMemo(() => {
    const matches = new Set<string>();
    for (const concept of CONCEPTS) {
      if (
        visibleDomainIds.has(concept.domainId) &&
        matchesSearch(concept, normalizedQuery)
      ) {
        matches.add(concept.id);
      }
    }
    return matches;
  }, [normalizedQuery, visibleDomainIds]);

  const ancestry = useMemo(() => collectAncestry(selectedId), [selectedId]);
  const directPrerequisiteEdges = useMemo(
    () => (selectedId ? EDGES_INTO.get(selectedId) ?? [] : []),
    [selectedId],
  );
  const directUnlockEdges = useMemo(
    () => (selectedId ? EDGES_OUT_OF.get(selectedId) ?? [] : []),
    [selectedId],
  );
  const directPrerequisiteIds = useMemo(
    () => new Set(directPrerequisiteEdges.map((edge) => edge.from)),
    [directPrerequisiteEdges],
  );
  const directUnlockIds = useMemo(
    () => new Set(directUnlockEdges.map((edge) => edge.to)),
    [directUnlockEdges],
  );
  const selectedConcept = selectedId ? CONCEPT_BY_ID.get(selectedId) ?? null : null;
  const selectedDomain = selectedConcept
    ? DOMAIN_BY_ID.get(selectedConcept.domainId) ?? null
    : null;

  const keyboardConcepts = useMemo(
    () =>
      CONCEPTS.filter(
        (concept) =>
          visibleDomainIds.has(concept.domainId) &&
          (!normalizedQuery || queryMatches.has(concept.id)),
      ).sort((a, b) => {
        const domainOrder =
          (DOMAIN_BY_ID.get(a.domainId)?.order ?? 0) -
          (DOMAIN_BY_ID.get(b.domainId)?.order ?? 0);
        if (domainOrder !== 0) return domainOrder;
        const levelOrder = LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);
        return levelOrder || a.title.localeCompare(b.title, "zh-Hant");
      }),
    [normalizedQuery, queryMatches, visibleDomainIds],
  );

  const gestureRef = useRef<GestureState>({
    pointers: new Map(),
    lastX: 0,
    lastY: 0,
    travel: 0,
    dragged: false,
    mode: "rotate",
    pinchDistance: null,
    pinchCenter: null,
  });

  useEffect(() => setMounted(true), []);

  const localPointer = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, []);

  const hitTest = useCallback((x: number, y: number): ProjectedNode | null => {
    for (let index = projectedRef.current.length - 1; index >= 0; index -= 1) {
      const node = projectedRef.current[index];
      const id = node.positioned.concept.id;
      const queryAllowsHit =
        !normalizedQuery ||
        queryMatches.has(id) ||
        id === selectedId ||
        ancestry.nodeIds.has(id) ||
        directUnlockIds.has(id);
      if (!queryAllowsHit) continue;
      const hitRadius = Math.max(10, node.radius + 5);
      if (Math.hypot(x - node.x, y - node.y) <= hitRadius) return node;
    }
    return null;
  }, [ancestry.nodeIds, directUnlockIds, normalizedQuery, queryMatches, selectedId]);

  const setHoveredNode = useCallback((node: ProjectedNode | null, x: number, y: number) => {
    const id = node?.positioned.concept.id ?? null;
    hoverIdRef.current = id;
    setTooltip(id ? { id, x, y } : null);
  }, []);

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = performance.now();
  }, []);

  const resetView = useCallback(() => {
    cameraRef.current = { ...INITIAL_CAMERA };
    setZoomValue(INITIAL_CAMERA.zoom);
    markInteraction();
  }, [markInteraction]);

  const changeZoom = useCallback(
    (nextZoom: number) => {
      const zoom = clamp(nextZoom, 0.45, 2.5);
      cameraRef.current.zoom = zoom;
      setZoomValue(zoom);
      markInteraction();
    },
    [markInteraction],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2) return;
      const point = localPointer(event);
      const gesture = gestureRef.current;
      gesture.pointers.set(event.pointerId, point);
      gesture.lastX = point.x;
      gesture.lastY = point.y;
      gesture.travel = 0;
      gesture.dragged = false;
      gesture.mode = event.button === 2 || event.shiftKey ? "pan" : "rotate";
      if (gesture.pointers.size === 2) {
        const [first, second] = [...gesture.pointers.values()];
        gesture.pinchDistance = Math.hypot(second.x - first.x, second.y - first.y);
        gesture.pinchCenter = {
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        };
      }
      setHoveredNode(null, point.x, point.y);
      markInteraction();
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [localPointer, markInteraction, setHoveredNode],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const point = localPointer(event);
      const gesture = gestureRef.current;
      if (!gesture.pointers.has(event.pointerId)) {
        if (event.pointerType === "mouse") setHoveredNode(hitTest(point.x, point.y), point.x, point.y);
        return;
      }

      gesture.pointers.set(event.pointerId, point);
      if (gesture.pointers.size >= 2) {
        const [first, second] = [...gesture.pointers.values()];
        const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
        const center = {
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        };
        if (gesture.pinchDistance && gesture.pinchCenter) {
          cameraRef.current.zoom = clamp(
            cameraRef.current.zoom * (distance / gesture.pinchDistance),
            0.45,
            2.5,
          );
          setZoomValue(cameraRef.current.zoom);
          cameraRef.current.panX += center.x - gesture.pinchCenter.x;
          cameraRef.current.panY += center.y - gesture.pinchCenter.y;
        }
        gesture.pinchDistance = distance;
        gesture.pinchCenter = center;
        gesture.dragged = true;
      } else {
        const deltaX = point.x - gesture.lastX;
        const deltaY = point.y - gesture.lastY;
        gesture.travel += Math.hypot(deltaX, deltaY);
        if (gesture.travel > 4) gesture.dragged = true;
        if (gesture.mode === "pan") {
          cameraRef.current.panX += deltaX;
          cameraRef.current.panY += deltaY;
        } else {
          cameraRef.current.yaw += deltaX * 0.007;
          cameraRef.current.pitch = clamp(
            cameraRef.current.pitch + deltaY * 0.0055,
            -0.92,
            0.48,
          );
        }
        gesture.lastX = point.x;
        gesture.lastY = point.y;
      }
      markInteraction();
    },
    [hitTest, localPointer, markInteraction, setHoveredNode],
  );

  const finishPointer = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>, cancelled = false) => {
      const point = localPointer(event);
      const gesture = gestureRef.current;
      const wasTracked = gesture.pointers.has(event.pointerId);
      const wasSinglePointer = gesture.pointers.size === 1;
      const wasTap =
        wasTracked &&
        wasSinglePointer &&
        !gesture.dragged &&
        gesture.mode === "rotate" &&
        !cancelled;
      gesture.pointers.delete(event.pointerId);

      if (wasTap) {
        const node = hitTest(point.x, point.y);
        onSelect(node?.positioned.concept.id ?? null);
      }
      if (gesture.pointers.size === 1) {
        const remaining = [...gesture.pointers.values()][0];
        gesture.lastX = remaining.x;
        gesture.lastY = remaining.y;
        gesture.dragged = true;
      } else if (gesture.pointers.size === 0) {
        gesture.pinchDistance = null;
        gesture.pinchCenter = null;
        gesture.travel = 0;
        if (event.pointerType === "mouse") {
          setHoveredNode(hitTest(point.x, point.y), point.x, point.y);
        }
      }
      markInteraction();
    },
    [hitTest, localPointer, markInteraction, onSelect, setHoveredNode],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      const multiplier = Math.exp(-event.deltaY * 0.0012);
      changeZoom(cameraRef.current.zoom * multiplier);
    },
    [changeZoom],
  );

  const cycleSelection = useCallback(
    (direction: 1 | -1) => {
      if (keyboardConcepts.length === 0) return;
      const current = selectedId
        ? keyboardConcepts.findIndex((concept) => concept.id === selectedId)
        : -1;
      const next =
        current < 0
          ? direction === 1
            ? 0
            : keyboardConcepts.length - 1
          : (current + direction + keyboardConcepts.length) % keyboardConcepts.length;
      onSelect(keyboardConcepts[next].id);
    },
    [keyboardConcepts, onSelect, selectedId],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
      let handled = true;
      switch (event.key) {
        case "ArrowLeft":
          cameraRef.current.yaw -= 0.1;
          break;
        case "ArrowRight":
          cameraRef.current.yaw += 0.1;
          break;
        case "ArrowUp":
          cameraRef.current.pitch = clamp(cameraRef.current.pitch - 0.08, -0.92, 0.48);
          break;
        case "ArrowDown":
          cameraRef.current.pitch = clamp(cameraRef.current.pitch + 0.08, -0.92, 0.48);
          break;
        case "+":
        case "=":
          changeZoom(cameraRef.current.zoom * 1.12);
          break;
        case "-":
        case "_":
          changeZoom(cameraRef.current.zoom / 1.12);
          break;
        case "Home":
        case "0":
          resetView();
          break;
        case "PageDown":
        case "]":
          cycleSelection(1);
          break;
        case "PageUp":
        case "[":
          cycleSelection(-1);
          break;
        case "Enter":
          if (!selectedId && keyboardConcepts[0]) onSelect(keyboardConcepts[0].id);
          break;
        case "Escape":
          onSelect(null);
          break;
        default:
          handled = false;
      }
      if (handled) {
        event.preventDefault();
        markInteraction();
      }
    },
    [changeZoom, cycleSelection, keyboardConcepts, markInteraction, onSelect, resetView, selectedId],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = clamp(window.devicePixelRatio || 1, 1, 2);
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const backingWidth = Math.round(nextWidth * pixelRatio);
      const backingHeight = Math.round(nextHeight * pixelRatio);
      if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
        canvas.width = backingWidth;
        canvas.height = backingHeight;
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    let animationFrame = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const elapsed = clamp(time - previousTime, 0, 40);
      previousTime = time;
      const gestureIsActive = gestureRef.current.pointers.size > 0;
      if (
        !reducedMotion &&
        !gestureIsActive &&
        time - lastInteractionRef.current > 1800
      ) {
        cameraRef.current.yaw += elapsed * 0.000045;
      }

      renderScene(
        canvas,
        cameraRef.current,
        {
          visibleDomainIds,
          selectedId,
          ancestorIds: ancestry.nodeIds,
          directPrerequisiteIds,
          directUnlockIds,
          ancestryEdgeIds: ancestry.edgeIds,
          queryMatches,
          hasQuery: Boolean(normalizedQuery),
          hoverId: hoverIdRef.current,
        },
        projectedRef,
      );
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [
    ancestry,
    directPrerequisiteIds,
    directUnlockIds,
    normalizedQuery,
    queryMatches,
    reducedMotion,
    selectedId,
    visibleDomainIds,
  ]);

  const tooltipConcept = tooltip ? CONCEPT_BY_ID.get(tooltip.id) ?? null : null;
  const tooltipDomain = tooltipConcept
    ? DOMAIN_BY_ID.get(tooltipConcept.domainId) ?? null
    : null;
  const tooltipLeft = tooltip
    ? `clamp(12px, ${tooltip.x + 16}px, calc(100% - 292px))`
    : 0;
  const tooltipTop = tooltip
    ? `clamp(12px, ${tooltip.y + 16}px, calc(100% - 154px))`
    : 0;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        minHeight: 540,
        overflow: "hidden",
        isolation: "isolate",
        background: "#040910",
        color: "#e3eef2",
        fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      }}
    >
      <p id={instructionsId} style={SR_ONLY}>
        拖曳可旋轉，按住 Shift 或滑鼠右鍵拖曳可平移，滾輪或雙指可縮放；方向鍵旋轉，
        加減鍵縮放，Page Up 與 Page Down 依序選擇概念，Home 重設視角，Escape 取消選取。
      </p>
      <label style={SR_ONLY}>
        以清單選擇概念
        <select
          value={selectedId ?? ""}
          onChange={(event) => onSelect(event.currentTarget.value || null)}
        >
          <option value="">未選取概念</option>
          {keyboardConcepts.map((concept) => (
            <option key={concept.id} value={concept.id}>
              {DOMAIN_BY_ID.get(concept.domainId)?.title}／{concept.level}／{concept.title}
            </option>
          ))}
        </select>
      </label>
      <div aria-live="polite" style={SR_ONLY}>
        {selectedConcept
          ? `已選取${selectedConcept.title}。共有${directPrerequisiteEdges.length}個直接先備概念，並可直接解鎖${directUnlockEdges.length}個概念。`
          : "目前未選取概念。"}
      </div>

      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label={ariaLabel}
        aria-describedby={instructionsId}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointer(event)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onPointerLeave={() => {
          if (gestureRef.current.pointers.size === 0) setHoveredNode(null, 0, 0);
        }}
        onDoubleClick={resetView}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        onContextMenu={(event) => event.preventDefault()}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: tooltip ? "pointer" : "grab",
        }}
      >
        普通物理學概念圖譜。請使用頁面中的概念清單瀏覽內容。
      </canvas>

      {showChrome && mounted
        ? createPortal(
          <>
          <div className={`graph-interaction-chip ${selectedId ? "is-selection-active" : ""}`} aria-hidden="true">
            <span>拖曳旋轉</span>
            <i>·</i>
            <span>右鍵平移</span>
            <i>·</i>
            <span>滾輪縮放</span>
            {normalizedQuery ? <><i>·</i><span>{queryMatches.size} 個結果</span></> : null}
          </div>
          <div className={`graph-zoom-toolbar ${selectedId ? "is-selection-active" : ""}`} role="group" aria-label="圖譜縮放控制">
            <button type="button" onClick={() => changeZoom(zoomValue * 1.14)} aria-label="放大圖譜">＋</button>
            <input
              type="range"
              min="0.45"
              max="2.5"
              step="0.01"
              value={zoomValue}
              onChange={(event) => changeZoom(Number(event.currentTarget.value))}
              aria-label="圖譜縮放比例"
            />
            <button type="button" onClick={() => changeZoom(zoomValue / 1.14)} aria-label="縮小圖譜">−</button>
            <output>{Math.round(zoomValue * 100)}%</output>
            <button type="button" className="graph-reset-button" onClick={resetView}>重設</button>
          </div>
          </>,
          document.body,
        )
        : null}

      {tooltipConcept && tooltipDomain && tooltip ? (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            left: tooltipLeft,
            top: tooltipTop,
            zIndex: 3,
            width: 280,
            padding: 12,
            border: `1px solid ${colorWithAlpha(tooltipDomain.color, 0.42)}`,
            borderRadius: 12,
            background: "rgba(5, 15, 24, 0.92)",
            boxShadow: `0 12px 38px rgba(0, 0, 0, 0.38), 0 0 22px ${colorWithAlpha(tooltipDomain.color, 0.1)}`,
            backdropFilter: "blur(14px)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              marginBottom: 5,
              color: tooltipDomain.color,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            {tooltipDomain.code} · {tooltipDomain.title} ／ {tooltipConcept.level}
          </div>
          <div style={{ color: "#edf7f9", fontSize: 14, fontWeight: 650 }}>
            {tooltipConcept.title}
          </div>
          <p
            style={{
              display: "-webkit-box",
              margin: "6px 0 0",
              overflow: "hidden",
              color: "rgba(219, 234, 240, 0.68)",
              fontSize: 11,
              lineHeight: 1.55,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {tooltipConcept.summary}
          </p>
        </div>
      ) : null}

      {showDetails && selectedConcept && selectedDomain ? (
        <aside
          aria-label={`${selectedConcept.title}的概念關係`}
          style={{
            position: "absolute",
            zIndex: 4,
            top: 16,
            right: 16,
            width: "min(330px, calc(100% - 32px))",
            maxHeight: "calc(100% - 78px)",
            overflowY: "auto",
            padding: 16,
            border: `1px solid ${colorWithAlpha(selectedDomain.color, 0.36)}`,
            borderRadius: 16,
            background: "rgba(5, 15, 24, 0.9)",
            boxShadow: `0 18px 60px rgba(0, 0, 0, 0.38), 0 0 32px ${colorWithAlpha(selectedDomain.color, 0.08)}`,
            backdropFilter: "blur(18px)",
          }}
        >
          <button
            type="button"
            aria-label="取消選取"
            onClick={() => onSelect(null)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 28,
              height: 28,
              border: "1px solid rgba(218, 234, 240, 0.14)",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.035)",
              color: "rgba(229, 241, 245, 0.68)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: "24px",
            }}
          >
            ×
          </button>
          <div
            style={{
              marginBottom: 7,
              paddingRight: 30,
              color: selectedDomain.color,
              fontSize: 9,
              fontWeight: 750,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {selectedDomain.code} · {selectedDomain.title} ／ {selectedConcept.level}
          </div>
          <h2 style={{ margin: 0, color: "#f0f8fa", fontSize: 18, lineHeight: 1.35 }}>
            {selectedConcept.title}
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              color: "rgba(219, 234, 240, 0.7)",
              fontSize: 12,
              lineHeight: 1.65,
            }}
          >
            {selectedConcept.summary}
          </p>
          {selectedConcept.equation ? (
            <code
              style={{
                display: "block",
                marginTop: 10,
                padding: "7px 9px",
                overflowX: "auto",
                border: "1px solid rgba(202, 224, 233, 0.1)",
                borderRadius: 8,
                background: "rgba(0, 0, 0, 0.2)",
                color: "rgba(231, 242, 246, 0.82)",
                fontSize: 11,
              }}
            >
              {selectedConcept.equation}
            </code>
          ) : null}
          <RelationList
            title="直接先備"
            emptyText="這是此路徑的起始概念"
            edges={directPrerequisiteEdges}
            resolveId={(edge) => edge.from}
            onSelect={onSelect}
          />
          <RelationList
            title="可直接解鎖"
            emptyText="目前沒有直接後續節點"
            edges={directUnlockEdges}
            resolveId={(edge) => edge.to}
            onSelect={onSelect}
          />
        </aside>
      ) : null}
    </div>
  );
}
