/**
 * Diagram Canvas - React Flow wrapper with grid, minimap, and controls
 */

import React, { useCallback, useRef, DragEvent } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes, NodeType } from './nodes'
import { SYMBOL_TYPES } from './symbols/iec-symbols'

export interface DiagramCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (nodes: Node[]) => void
  onEdgesChange: (edges: Edge[]) => void
  className?: string
}

let nodeId = 0
const getNodeId = () => `node_${nodeId++}`

const DiagramCanvasInner: React.FC<DiagramCanvasProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
  className = '',
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges)
  const { screenToFlowPosition } = useReactFlow()
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)

  // Sync nodes and edges with parent
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeInternal(changes)
      // Defer to next tick to get updated nodes
      setTimeout(() => {
        if (reactFlowInstance.current) {
          onNodesChange(reactFlowInstance.current.getNodes())
        }
      }, 0)
    },
    [onNodesChangeInternal, onNodesChange]
  )

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeInternal(changes)
      setTimeout(() => {
        if (reactFlowInstance.current) {
          onEdgesChange(reactFlowInstance.current.getEdges())
        }
      }, 0)
    },
    [onEdgesChangeInternal, onEdgesChange]
  )

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'straight' }, eds))
      setTimeout(() => {
        if (reactFlowInstance.current) {
          onEdgesChange(reactFlowInstance.current.getEdges())
        }
      }, 0)
    },
    [setEdges, onEdgesChange]
  )

  // Handle drop from palette
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as NodeType

      if (!type || !SYMBOL_TYPES[type]) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: '',
          state: 'closed',
          onDelete: handleDeleteNode,
        },
      }

      setNodes((nds) => nds.concat(newNode))
      setTimeout(() => {
        if (reactFlowInstance.current) {
          onNodesChange(reactFlowInstance.current.getNodes())
        }
      }, 0)
    },
    [screenToFlowPosition, setNodes, onNodesChange]
  )

  // Delete node handler
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      )
      setTimeout(() => {
        if (reactFlowInstance.current) {
          onNodesChange(reactFlowInstance.current.getNodes())
          onEdgesChange(reactFlowInstance.current.getEdges())
        }
      }, 0)
    },
    [setNodes, setEdges, onNodesChange, onEdgesChange]
  )

  // Update nodes with delete handler
  const nodesWithDelete = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDelete: handleDeleteNode,
    },
  }))

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
  }, [])

  // Handle keyboard delete
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected)
        const selectedEdges = edges.filter((e) => e.selected)

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          setNodes((nds) => nds.filter((n) => !n.selected))
          setEdges((eds) => {
            const nodeIds = selectedNodes.map((n) => n.id)
            return eds.filter(
              (e) =>
                !e.selected &&
                !nodeIds.includes(e.source) &&
                !nodeIds.includes(e.target)
            )
          })
          setTimeout(() => {
            if (reactFlowInstance.current) {
              onNodesChange(reactFlowInstance.current.getNodes())
              onEdgesChange(reactFlowInstance.current.getEdges())
            }
          }, 0)
        }
      }
    },
    [nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange]
  )

  return (
    <div
      ref={reactFlowWrapper}
      className={`w-full h-full ${className}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodesWithDelete}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        deleteKeyCode={['Backspace', 'Delete']}
        className="bg-white"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={15}
          size={1}
          color="#94a3b8"
        />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'transformer':
                return '#3b82f6'
              case 'circuitBreaker':
                return '#ef4444'
              case 'disconnect':
              case 'groundSwitch':
                return '#f97316'
              case 'busbar':
                return '#64748b'
              default:
                return '#6b7280'
            }
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
          className="!bg-gray-100 !border-gray-200"
        />
        <Controls
          showZoom
          showFitView
          showInteractive={false}
          className="!bg-white !border-gray-200 !shadow-md"
        />
      </ReactFlow>
    </div>
  )
}

// Wrap with provider
export const DiagramCanvas: React.FC<DiagramCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
