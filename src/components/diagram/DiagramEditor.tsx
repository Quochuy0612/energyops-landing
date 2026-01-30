/**
 * Diagram Editor - Main component combining palette + canvas with export
 */

import React, { useCallback, useRef, useState } from 'react'
import { Node, Edge } from '@xyflow/react'
import { toPng } from 'html-to-image'
import {
  Download,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Image,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

import { SymbolPalette } from './SymbolPalette'
import { DiagramCanvas } from './DiagramCanvas'
import { Button } from '@/components/ui'

export interface DiagramEditorProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  onImageExport?: (imageData: string) => void
  className?: string
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onImageExport,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Handle nodes change with history
  const handleNodesChange = useCallback(
    (newNodes: Node[]) => {
      setNodes(newNodes)
      onNodesChange?.(newNodes)

      // Add to history (simplified - in production use a more robust solution)
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push({ nodes: newNodes, edges })
        return newHistory.slice(-20) // Keep last 20 states
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 19))
    },
    [edges, historyIndex, onNodesChange]
  )

  // Handle edges change
  const handleEdgesChange = useCallback(
    (newEdges: Edge[]) => {
      setEdges(newEdges)
      onEdgesChange?.(newEdges)
    },
    [onEdgesChange]
  )

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setHistoryIndex((prev) => prev - 1)
      onNodesChange?.(prevState.nodes)
      onEdgesChange?.(prevState.edges)
    }
  }, [history, historyIndex, onNodesChange, onEdgesChange])

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex((prev) => prev + 1)
      onNodesChange?.(nextState.nodes)
      onEdgesChange?.(nextState.edges)
    }
  }, [history, historyIndex, onNodesChange, onEdgesChange])

  // Clear all
  const handleClear = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return

    if (window.confirm('Bạn có chắc muốn xóa toàn bộ sơ đồ?')) {
      setNodes([])
      setEdges([])
      onNodesChange?.([])
      onEdgesChange?.([])
      setExportStatus('idle')
    }
  }, [nodes.length, edges.length, onNodesChange, onEdgesChange])

  // Export to PNG
  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return

    const reactFlowElement = canvasRef.current.querySelector('.react-flow') as HTMLElement
    if (!reactFlowElement) return

    setIsExporting(true)
    setExportStatus('idle')

    try {
      // Get the viewport element
      const viewport = reactFlowElement.querySelector('.react-flow__viewport') as HTMLElement
      if (!viewport) throw new Error('Viewport not found')

      const dataUrl = await toPng(reactFlowElement, {
        backgroundColor: '#ffffff',
        quality: 1,
        pixelRatio: 2,
        filter: (node) => {
          // Exclude controls and minimap from export
          const exclude = ['react-flow__controls', 'react-flow__minimap']
          return !exclude.some((cls) => node.classList?.contains(cls))
        },
      })

      // Call callback with base64 data
      onImageExport?.(dataUrl)
      setExportStatus('success')

      // Also trigger download
      const link = document.createElement('a')
      link.download = `so-do-luoi-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()

      // Reset success status after 3 seconds
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
    } finally {
      setIsExporting(false)
    }
  }, [onImageExport])

  return (
    <div className={`flex flex-col h-[600px] border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700">Sơ đồ lưới điện</h3>
          {nodes.length > 0 && (
            <span className="text-xs text-slate-500">
              ({nodes.length} ký hiệu)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={handleClear}
            disabled={nodes.length === 0 && edges.length === 0}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Xóa tất cả"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || nodes.length === 0}
            className="ml-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin mr-2" />
                Đang xuất...
              </>
            ) : exportStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                Đã xuất!
              </>
            ) : exportStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                Lỗi xuất
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Xuất PNG
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Symbol palette */}
        <SymbolPalette className="w-40 flex-shrink-0" />

        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 relative">
          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Kéo ký hiệu từ bảng bên trái vào đây
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  để tạo sơ đồ lưới điện
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 border-t border-gray-200 text-xs text-slate-500">
        <span>
          Zoom: Cuộn chuột | Di chuyển: Kéo nền | Xóa: Chọn + Delete
        </span>
        {exportStatus === 'success' && (
          <span className="text-emerald-600 font-medium">
            Hình ảnh đã được xuất thành công
          </span>
        )}
      </div>
    </div>
  )
}
