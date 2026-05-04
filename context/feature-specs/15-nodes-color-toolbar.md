Add a small floating color toolbar so selected nodes can change both their background and text color directly on the canvas.

## Implementation

1. Check `ui-context.md` for the node color palette.
   Each palette option includes:
   - a node background color
   - a matching text color

   Reuse existing theme colors if they already exist in the `global.css`, Othwerise, keep the palette in the canvas types/constants, such as `types/canvas.ts`.

2. Add a toolbar above selected nodes.
   - only show it when the node is selected
   - keep it slightly above the node without overlapping it
   - show one swatches should feel clearly selected
   - hovering a swatch should show a subtle glow based on its text color
   - keep the glow tight and controlled, not overlay blurred
   - prevent toolbar interactions from dragging nodes or panning the canvas

3. Keep all node updates connected to the existing collaborative canvas state.

## Scope Limits

- don't change shape rendering from the previous unit
- don't change the shape panel or drag preview
- don't change how dropped nodes are created
- keep this focused on resize and label editing only

## Check When Done

- Selected nodes show resize handles.
- Resizing updates node dimensions through the existing node state flow.
- Double-clicking a node opens inline label editing.
- Label editing updates node labels through the existing sync flow.
- Editing closes on blur or Escape.
- Text interactions do not trigger canvas drag or pan.
- `npm run build` passes without type errors.
