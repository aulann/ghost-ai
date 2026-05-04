import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function n(
  id: string,
  label: string,
  x: number,
  y: number,
  shape: string,
  color: string,
  textColor: string,
  width: number,
  height: number,
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, color, textColor, shape, width, height },
  };
}

function e(id: string, source: string, target: string): CanvasEdge {
  return { id, type: "canvasEdge", source, target, data: {} };
}

const microservicesNodes: CanvasNode[] = [
  n("ms-gateway",  "API Gateway",      0,   90, "rectangle", "#10233D", "#52A8FF", 160,  80),
  n("ms-auth",     "Auth Service",    280,    0, "pill",      "#2E1938", "#BF7AF0", 160,  70),
  n("ms-user",     "User Service",    280,  100, "pill",      "#0F2E18", "#62C073", 160,  70),
  n("ms-product",  "Product Service", 280,  200, "pill",      "#331B00", "#FF990A", 160,  70),
  n("ms-userdb",   "User DB",         530,   75, "cylinder",  "#062822", "#0AC7B4", 120, 100),
  n("ms-productdb","Product DB",      530,  175, "cylinder",  "#062822", "#0AC7B4", 120, 100),
];

const microservicesEdges: CanvasEdge[] = [
  e("ms-e1", "ms-gateway",  "ms-auth"),
  e("ms-e2", "ms-gateway",  "ms-user"),
  e("ms-e3", "ms-gateway",  "ms-product"),
  e("ms-e4", "ms-user",     "ms-userdb"),
  e("ms-e5", "ms-product",  "ms-productdb"),
];

const cicdNodes: CanvasNode[] = [
  n("ci-source",   "Source Control", 0,    0, "rectangle", "#10233D", "#52A8FF", 160, 80),
  n("ci-build",    "CI Build",       220,  0, "rectangle", "#0F2E18", "#62C073", 160, 80),
  n("ci-test",     "Test Suite",     440,  0, "rectangle", "#331B00", "#FF990A", 160, 80),
  n("ci-registry", "Registry",       650,  0, "cylinder",  "#2E1938", "#BF7AF0", 120, 100),
  n("ci-staging",  "Staging",        840,  0, "hexagon",   "#062822", "#0AC7B4", 140, 110),
  n("ci-prod",     "Production",    1050,  0, "hexagon",   "#0F2E18", "#62C073", 140, 110),
];

const cicdEdges: CanvasEdge[] = [
  e("ci-e1", "ci-source",   "ci-build"),
  e("ci-e2", "ci-build",    "ci-test"),
  e("ci-e3", "ci-test",     "ci-registry"),
  e("ci-e4", "ci-registry", "ci-staging"),
  e("ci-e5", "ci-staging",  "ci-prod"),
];

const eventDrivenNodes: CanvasNode[] = [
  n("ev-order",     "Order Service",    0,   0, "pill",      "#10233D", "#52A8FF", 160,  70),
  n("ev-payment",   "Payment Service",  0, 120, "pill",      "#10233D", "#52A8FF", 160,  70),
  n("ev-bus",       "Event Bus",      280,  60, "hexagon",   "#2E1938", "#BF7AF0", 140, 110),
  n("ev-notify",    "Notification",   520,   0, "rectangle", "#331B00", "#FF990A", 160,  80),
  n("ev-analytics", "Analytics",      520, 120, "rectangle", "#0F2E18", "#62C073", 160,  80),
  n("ev-shipping",  "Shipping",       520, 240, "rectangle", "#062822", "#0AC7B4", 160,  80),
];

const eventDrivenEdges: CanvasEdge[] = [
  e("ev-e1", "ev-order",   "ev-bus"),
  e("ev-e2", "ev-payment", "ev-bus"),
  e("ev-e3", "ev-bus",     "ev-notify"),
  e("ev-e4", "ev-bus",     "ev-analytics"),
  e("ev-e5", "ev-bus",     "ev-shipping"),
];

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Architecture",
    description: "API gateway routing to isolated services backed by dedicated datastores.",
    nodes: microservicesNodes,
    edges: microservicesEdges,
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "Source to production: build, test, containerize, stage, and deploy.",
    nodes: cicdNodes,
    edges: cicdEdges,
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers publish to a central event bus consumed by downstream services.",
    nodes: eventDrivenNodes,
    edges: eventDrivenEdges,
  },
];
