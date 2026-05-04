"use client";

import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeData,
} from "@/types/canvas";
import { CanvasCallbacksCtx } from "./canvas-callbacks";

const BORDER_REST = "#2a2a30";
const BORDER_SELECTED = "#00c8d4";
const MIN_W = 60;
const MIN_H = 40;

const HANDLE_STYLE: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 1.5,
  backgroundColor: "#1a1a1f",
  borderColor: BORDER_SELECTED,
  opacity: 0.85,
};

const CONN_HANDLE_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "white",
  border: "1.5px solid #2a2a30",
};

const CONN_HANDLE_CLASS =
  "opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto";
const LINE_STYLE: React.CSSProperties = {
  borderColor: BORDER_SELECTED,
  opacity: 0.35,
};

interface SvgShapeProps {
  width: number;
  height: number;
  fill: string;
  stroke: string;
}

function DiamondShape({ width, height, fill, stroke }: SvgShapeProps) {
  const cx = width / 2;
  const cy = height / 2;
  const pad = 0.75;
  const points = `${cx},${pad} ${width - pad},${cy} ${cx},${height - pad} ${pad},${cy}`;
  return (
    <svg width={width} height={height} className="absolute inset-0">
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function HexagonShape({ width, height, fill, stroke }: SvgShapeProps) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = cx - 0.75;
  const ry = cy - 0.75;
  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  const points = angles.map((a) => `${cx + rx * Math.cos(a)},${cy + ry * Math.sin(a)}`).join(" ");
  return (
    <svg width={width} height={height} className="absolute inset-0">
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function CylinderShape({ width, height, fill, stroke }: SvgShapeProps) {
  const cx = width / 2;
  const ellipseRY = Math.max(height * 0.15, 10);
  const sw = 1.5;
  const pad = sw / 2;
  return (
    <svg width={width} height={height} className="absolute inset-0">
      <rect x={pad} y={ellipseRY} width={width - pad * 2} height={height - 2 * ellipseRY} fill={fill} stroke="none" />
      <line x1={pad} y1={ellipseRY} x2={pad} y2={height - ellipseRY} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      <line x1={width - pad} y1={ellipseRY} x2={width - pad} y2={height - ellipseRY} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      <ellipse cx={cx} cy={height - ellipseRY} rx={cx - pad} ry={ellipseRY - pad} fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      <ellipse cx={cx} cy={ellipseRY} rx={cx - pad} ry={ellipseRY - pad} fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ColorSwatch({
  fill,
  text,
  isSelected,
  onClick,
}: {
  fill: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label={`Node color ${fill}`}
      aria-pressed={isSelected}
      style={{
        backgroundColor: fill,
        outline: isSelected ? `2px solid ${text}` : "none",
        outlineOffset: "2px",
        boxShadow: hovered ? `0 0 0 3px ${text}33, 0 0 5px 0 ${text}1a` : undefined,
      }}
      className="w-5 h-5 rounded-md border border-white/10 transition-all duration-150 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

function ColorToolbar({
  id,
  data,
  selected,
}: {
  id: string;
  data: CanvasNodeData;
  selected: boolean | undefined;
}) {
  const onNodesChange = useContext(CanvasCallbacksCtx);
  const { getNode } = useReactFlow<CanvasNode, CanvasEdge>();

  const handleColorSelect = useCallback(
    (fill: string, text: string) => {
      const node = getNode(id);
      if (!node) return;
      onNodesChange([
        {
          type: "replace",
          id,
          item: { ...node, data: { ...node.data, color: fill, textColor: text } },
        },
      ]);
    },
    [id, getNode, onNodesChange],
  );

  const stopEvent = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <NodeToolbar isVisible={!!selected} position={Position.Top}>
      <div
        className="nodrag nopan flex gap-1 rounded-xl border border-surface-border bg-elevated px-2 py-1.5 shadow-lg"
        onMouseDown={stopEvent}
        onPointerDown={stopEvent}
      >
        {NODE_COLORS.map((c) => (
          <ColorSwatch
            key={c.fill}
            fill={c.fill}
            text={c.text}
            isSelected={(data.color ?? DEFAULT_NODE_COLOR) === c.fill}
            onClick={() => handleColorSelect(c.fill, c.text)}
          />
        ))}
      </div>
    </NodeToolbar>
  );
}

export function CanvasNodeRenderer({
  id,
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const onNodesChange = useContext(CanvasCallbacksCtx);
  const { getNode } = useReactFlow<CanvasNode, CanvasEdge>();

  const [dragW, setDragW] = useState<number | null>(null);
  const [dragH, setDragH] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(data.label ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const baseW = data.width && data.width > 0 ? data.width : 160;
  const baseH = data.height && data.height > 0 ? data.height : 80;
  const w = dragW ?? baseW;
  const h = dragH ?? baseH;

  useEffect(() => {
    if (!isEditing) setLocalLabel(data.label ?? "");
  }, [data.label, isEditing]);

  const fill = data.color ?? DEFAULT_NODE_COLOR;
  const textColor = data.textColor ?? DEFAULT_NODE_TEXT_COLOR;
  const stroke = selected ? BORDER_SELECTED : BORDER_REST;
  const { shape } = data;

  const handleResizeEnd = useCallback(
    (_: unknown, params: { width: number; height: number }) => {
      setDragW(null);
      setDragH(null);
      const node = getNode(id);
      if (!node) return;
      onNodesChange([
        {
          type: "replace",
          id,
          item: {
            ...node,
            width: params.width,
            height: params.height,
            style: { ...node.style, width: params.width, height: params.height },
            data: { ...node.data, width: params.width, height: params.height },
          },
        },
      ]);
    },
    [id, getNode, onNodesChange],
  );

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newLabel = e.target.value;
      setLocalLabel(newLabel);
      const node = getNode(id);
      if (!node) return;
      onNodesChange([
        {
          type: "replace",
          id,
          item: { ...node, data: { ...node.data, label: newLabel } },
        },
      ]);
    },
    [id, getNode, onNodesChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") stopEditing();
    },
    [stopEditing],
  );

  const stopEvent = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const labelNode = isEditing ? (
    <div
      className="nodrag nopan absolute inset-0 flex items-center justify-center px-3"
      onMouseDown={stopEvent}
      onPointerDown={stopEvent}
    >
      <textarea
        ref={textareaRef}
        value={localLabel}
        onChange={handleLabelChange}
        onBlur={stopEditing}
        onKeyDown={handleKeyDown}
        placeholder="Label..."
        rows={1}
        className="w-full resize-none bg-transparent border-none focus:outline-none text-sm font-medium text-center leading-tight"
        style={{ overflow: "hidden", color: textColor }}
      />
    </div>
  ) : (
    <span
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-sm font-medium leading-tight"
      style={{ color: textColor }}
    >
      {localLabel || <span className="opacity-30">Label...</span>}
    </span>
  );

  if (shape === "diamond" || shape === "hexagon" || shape === "cylinder") {
    return (
      <div
        style={{ width: w, height: h, position: "relative" }}
        className="group"
        onDoubleClick={handleDoubleClick}
      >
        <ColorToolbar id={id} data={data} selected={selected} />
        <NodeResizer
          isVisible={selected}
          minWidth={MIN_W}
          minHeight={MIN_H}
          handleStyle={HANDLE_STYLE}
          lineStyle={LINE_STYLE}
          onResize={(_, p) => { setDragW(p.width); setDragH(p.height); }}
          onResizeEnd={handleResizeEnd}
        />
        <Handle id="handle-top" type="source" position={Position.Top} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
        <Handle id="handle-right" type="source" position={Position.Right} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
        <Handle id="handle-bottom" type="source" position={Position.Bottom} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
        <Handle id="handle-left" type="source" position={Position.Left} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
        {shape === "diamond" && (
          <DiamondShape width={w} height={h} fill={fill} stroke={stroke} />
        )}
        {shape === "hexagon" && (
          <HexagonShape width={w} height={h} fill={fill} stroke={stroke} />
        )}
        {shape === "cylinder" && (
          <CylinderShape width={w} height={h} fill={fill} stroke={stroke} />
        )}
        {labelNode}
      </div>
    );
  }

  const borderRadius =
    shape === "circle" ? "50%" : shape === "pill" ? "9999px" : "10px";

  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: fill,
        border: `1.5px solid ${stroke}`,
        borderRadius,
        position: "relative",
      }}
      className="group flex items-center justify-center text-sm font-medium"
      onDoubleClick={handleDoubleClick}
    >
      <ColorToolbar id={id} data={data} selected={selected} />
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_W}
        minHeight={MIN_H}
        handleStyle={HANDLE_STYLE}
        lineStyle={LINE_STYLE}
        onResize={(_, p) => { setDragW(p.width); setDragH(p.height); }}
        onResizeEnd={handleResizeEnd}
      />
      <Handle id="handle-top" type="source" position={Position.Top} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
      <Handle id="handle-right" type="source" position={Position.Right} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
      <Handle id="handle-bottom" type="source" position={Position.Bottom} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
      <Handle id="handle-left" type="source" position={Position.Left} style={CONN_HANDLE_STYLE} className={CONN_HANDLE_CLASS} />
      {labelNode}
    </div>
  );
}
