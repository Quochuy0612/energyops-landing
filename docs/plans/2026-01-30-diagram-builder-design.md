# Electrical Grid Diagram Builder - Design Specification

**Date:** 2026-01-30
**Status:** Approved
**Project:** EnergyOps Landing - Phiếu Thao Tác Module

---

## Overview

Add drag-drop electrical diagram builder as Step 5 "Sơ đồ lưới" in the CreateTicket wizard for creating single-line electrical diagrams using IEC 60617 standard symbols.

## Key Decisions

| Aspect | Decision |
|--------|----------|
| Diagram Type | Simple drag-drop builder |
| Symbol Set | 10 IEC 60617 standard symbols |
| Connections | Free placement with manual line drawing |
| Integration | New Step 5 after "Phân công" |
| Output | Export as PNG image, attach to ticket |
| Library | React Flow + html-to-image |
| Visual Style | IEC 60617 technical symbols |

## Symbol Library

| Symbol | Code | Vietnamese | IEC Standard | Size |
|--------|------|------------|--------------|------|
| Transformer (2-winding) | MBA | Máy biến áp | IEC 60617-6 | 60x80px |
| Circuit Breaker | MC | Máy cắt | IEC 60617-7 | 40x60px |
| Disconnect Switch | DCL | Dao cách ly | IEC 60617-7 | 40x50px |
| Ground/Earth Switch | TD | Dao tiếp địa | IEC 60617-7 | 40x50px |
| Busbar | - | Thanh cái | IEC 60617-6 | 200x10px |
| Power Line | - | Đường dây | IEC 60617-6 | 100x4px |
| Load | - | Phụ tải | IEC 60617-6 | 50x50px |
| Generator | - | Máy phát điện | IEC 60617-6 | 60x60px |
| Current Transformer | CT | Biến dòng | IEC 60617-6 | 40x40px |
| Fuse | - | Cầu chì | IEC 60617-7 | 30x50px |

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Sơ đồ lưới điện                           [Xuất PNG] [Xóa] │
├──────────────┬──────────────────────────────────────────────┤
│   SYMBOLS    │                                              │
│  ┌─────────┐ │                                              │
│  │   MBA   │ │                                              │
│  └─────────┘ │                                              │
│  ┌─────────┐ │            CANVAS AREA                       │
│  │   MC    │ │         (React Flow Grid)                    │
│  └─────────┘ │                                              │
│  ┌─────────┐ │      Drop symbols here to build              │
│  │   DCL   │ │           your diagram                       │
│  └─────────┘ │                                              │
│  ┌─────────┐ │                                              │
│  │   TD    │ │                                              │
│  └─────────┘ │                                              │
│     ...      │                                              │
├──────────────┴──────────────────────────────────────────────┤
│  [Quay lại]                           [Lưu nháp] [Gửi duyệt]│
└─────────────────────────────────────────────────────────────┘
```

## User Interactions

1. **Drag & Drop** - Drag symbol from left palette, drop on canvas
2. **Move** - Click and drag placed symbols to reposition
3. **Delete** - Select symbol, press Delete key or click remove button
4. **Add Label** - Double-click symbol to add/edit label text
5. **Draw Line** - Click "Đường dây" tool, click-drag on canvas to draw
6. **Zoom/Pan** - Mouse wheel to zoom, drag background to pan
7. **Export** - Click "Xuất PNG" to download/attach diagram image

## Canvas Features

- Grid background (visual alignment aid)
- Minimap in corner for large diagrams
- Undo/Redo support (Ctrl+Z / Ctrl+Y)

## Technical Implementation

### Dependencies

```json
{
  "@xyflow/react": "^12.0.0",
  "html-to-image": "^1.11.0"
}
```

**Bundle Impact:** ~50KB (React Flow) + ~10KB (html-to-image)

### Type Definitions

```typescript
interface DiagramNode {
  id: string
  type: 'transformer' | 'circuitBreaker' | 'disconnect' | 'groundSwitch' |
        'busbar' | 'powerLine' | 'load' | 'generator' | 'ct' | 'fuse'
  position: { x: number; y: number }
  data: {
    label?: string        // Optional label (e.g., "MC-171-E1")
    voltage?: string      // Optional voltage level
    state?: 'open' | 'closed'  // For switches/breakers
  }
}

interface DiagramEdge {
  id: string
  source: string
  target: string
  type?: 'straight' | 'step'
}
```

### Form Data Extension

```typescript
const [formData, setFormData] = useState({
  // ... existing fields
  diagramNodes: [] as DiagramNode[],
  diagramEdges: [] as DiagramEdge[],
  diagramImage: null as string | null,  // Base64 PNG
})
```

### File Structure

```
src/components/diagram/
├── DiagramEditor.tsx        # Main editor component (~200 lines)
├── SymbolPalette.tsx        # Draggable symbol list (~80 lines)
├── DiagramCanvas.tsx        # React Flow canvas wrapper (~150 lines)
├── nodes/
│   ├── index.tsx            # Export all node types
│   ├── TransformerNode.tsx
│   ├── CircuitBreakerNode.tsx
│   ├── DisconnectNode.tsx
│   ├── GroundSwitchNode.tsx
│   ├── BusbarNode.tsx
│   ├── PowerLineNode.tsx
│   ├── LoadNode.tsx
│   ├── GeneratorNode.tsx
│   ├── CTNode.tsx
│   └── FuseNode.tsx
├── symbols/
│   └── iec-symbols.tsx      # IEC 60617 SVG path definitions
└── index.ts
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/CreateTicket.tsx` | Add Step 5, import DiagramEditor, update steps array |
| `src/types/index.ts` | Add DiagramNode, DiagramEdge interfaces |

### Updated Steps Array

```typescript
const steps: Step[] = [
  { id: 1, title: 'Thông tin chung', icon: FileText },
  { id: 2, title: 'Thiết bị', icon: Settings },
  { id: 3, title: 'Các bước thao tác', icon: ListChecks },
  { id: 4, title: 'Phân công', icon: Users },
  { id: 5, title: 'Sơ đồ lưới', icon: Network },  // NEW
]
```

## Export Flow

```
User clicks "Xuất PNG"
       ↓
html-to-image captures React Flow viewport
       ↓
PNG blob created → converted to base64
       ↓
Stored in formData.diagramImage
       ↓
On submit: uploaded as file attachment to ticket
```

## Validation Rules

- Step 5 is **optional** (user can skip if diagram not needed)
- If user placed symbols but didn't export, show warning:
  - "Bạn chưa xuất hình ảnh sơ đồ. Tiếp tục?"

## Estimated Effort

| Component | Lines of Code |
|-----------|---------------|
| DiagramEditor.tsx | ~200 |
| SymbolPalette.tsx | ~80 |
| DiagramCanvas.tsx | ~150 |
| 10 Node components | ~500 |
| IEC symbols SVG | ~300 |
| Type definitions | ~50 |
| CreateTicket updates | ~100 |
| **Total** | **~1,400 lines** |

---

## References

- [IEC 60617 Graphical Symbols](https://webstore.iec.ch/publication/2723)
- [React Flow Documentation](https://reactflow.dev/)
- [html-to-image](https://github.com/bubkoo/html-to-image)

---

**Approved by:** User
**Date:** 2026-01-30
