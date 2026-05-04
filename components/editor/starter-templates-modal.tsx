"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-templates";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

const PREVIEW_W = 340;
const PREVIEW_H = 210;
const PREVIEW_PAD = 10;

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function computeBounds(nodes: CanvasNode[]): Bounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of nodes) {
    const w = node.data.width ?? 160;
    const h = node.data.height ?? 80;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + w);
    maxY = Math.max(maxY, node.position.y + h);
  }
  return { minX, minY, maxX, maxY };
}

function nodeCenter(node: CanvasNode) {
  const w = node.data.width ?? 160;
  const h = node.data.height ?? 80;
  return { x: node.position.x + w / 2, y: node.position.y + h / 2 };
}

function toSvg(
  x: number,
  y: number,
  bounds: Bounds,
  scale: number,
  ox: number,
  oy: number,
) {
  return {
    x: (x - bounds.minX) * scale + ox,
    y: (y - bounds.minY) * scale + oy,
  };
}

interface PreviewNodeProps {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  shape: string;
}

function PreviewNode({ x, y, w, h, fill, shape }: PreviewNodeProps) {
  const stroke = "#3a3a42";
  const sw = 0.75;

  if (shape === "circle") {
    return (
      <ellipse
        cx={x + w / 2}
        cy={y + h / 2}
        rx={w / 2}
        ry={h / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  }

  if (shape === "pill") {
    const r = h / 2;
    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  }

  if (shape === "diamond") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
  }

  if (shape === "hexagon") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const ry = h / 2;
    const pts = [
      [cx, y],
      [x + w, cy - ry * 0.5],
      [x + w, cy + ry * 0.5],
      [cx, y + h],
      [x, cy + ry * 0.5],
      [x, cy - ry * 0.5],
    ]
      .map(([px, py]) => `${px},${py}`)
      .join(" ");
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
  }

  if (shape === "cylinder") {
    const ry = h * 0.18;
    return (
      <g>
        <rect
          x={x}
          y={y + ry}
          width={w}
          height={h - ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
        <ellipse
          cx={x + w / 2}
          cy={y + ry}
          rx={w / 2}
          ry={ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
        <line
          x1={x}
          y1={y + ry}
          x2={x}
          y2={y + h}
          stroke={stroke}
          strokeWidth={sw}
        />
        <line
          x1={x + w}
          y1={y + ry}
          x2={x + w}
          y2={y + h}
          stroke={stroke}
          strokeWidth={sw}
        />
      </g>
    );
  }

  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={3}
      ry={3}
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
    />
  );
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, edges } = template;

  const bounds = computeBounds(nodes);
  const contentW = bounds.maxX - bounds.minX;
  const contentH = bounds.maxY - bounds.minY;
  const usableW = PREVIEW_W - PREVIEW_PAD * 2;
  const usableH = PREVIEW_H - PREVIEW_PAD * 2;
  const scale =
    contentW === 0 && contentH === 0
      ? 1
      : Math.min(
          usableW / Math.max(contentW, 1),
          usableH / Math.max(contentH, 1),
        );

  const ox = PREVIEW_PAD + (usableW - contentW * scale) / 2;
  const oy = PREVIEW_PAD + (usableH - contentH * scale) / 2;

  const nodeMap = new Map<string, CanvasNode>(nodes.map((nd) => [nd.id, nd]));

  return (
    <svg
      width={PREVIEW_W}
      height={PREVIEW_H}
      viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`}
      className="w-full rounded-xl"
      style={{ background: "#080809" }}
    >
      {edges.map((edge: CanvasEdge) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return null;
        const sc = nodeCenter(src);
        const tc = nodeCenter(tgt);
        const sp = toSvg(sc.x, sc.y, bounds, scale, ox, oy);
        const tp = toSvg(tc.x, tc.y, bounds, scale, ox, oy);
        return (
          <line
            key={edge.id}
            x1={sp.x}
            y1={sp.y}
            x2={tp.x}
            y2={tp.y}
            stroke="#3a3a42"
            strokeWidth={1}
          />
        );
      })}

      {nodes.map((node: CanvasNode) => {
        const w = (node.data.width ?? 160) * scale;
        const h = (node.data.height ?? 80) * scale;
        const p = toSvg(node.position.x, node.position.y, bounds, scale, ox, oy);
        return (
          <PreviewNode
            key={node.id}
            x={p.x}
            y={p.y}
            w={w}
            h={h}
            fill={node.data.color ?? "#1F1F1F"}
            shape={node.data.shape ?? "rectangle"}
          />
        );
      })}
    </svg>
  );
}

interface StarterTemplatesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (template: CanvasTemplate) => void;
}

export function StarterTemplatesModal({
  open,
  onClose,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl border-surface-border bg-surface p-0 sm:max-w-6xl"
      >
        <DialogHeader className="border-b border-surface-border px-6 py-4">
          <DialogTitle className="text-base font-semibold text-copy-primary">
            Starter Templates
          </DialogTitle>
        </DialogHeader>

        <div className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-elevated p-4"
            >
              <div className="overflow-hidden rounded-xl">
                <TemplatePreview template={template} />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-medium text-copy-primary">
                  {template.name}
                </p>
                <p className="text-xs leading-relaxed text-copy-muted">
                  {template.description}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 border-surface-border text-copy-secondary hover:border-brand hover:text-brand"
                onClick={() => onImport(template)}
              >
                <Download className="h-3.5 w-3.5" />
                Import template
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
