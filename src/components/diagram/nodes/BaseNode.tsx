/**
 * Base Node component for all electrical symbols
 * Provides common functionality: selection, label editing, delete
 */

import React, { useState, useCallback, memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { X } from 'lucide-react'

export interface BaseNodeData {
  label?: string
  voltage?: string
  state?: 'open' | 'closed'
  onDelete?: (id: string) => void
}

interface BaseNodeProps extends NodeProps {
  data: BaseNodeData
  children: React.ReactNode
  showHandles?: boolean
  handlePositions?: {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
  }
}

export const BaseNode = memo(function BaseNode({
  id,
  data,
  selected,
  children,
  showHandles = true,
  handlePositions = { top: true, bottom: true },
}: BaseNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(data.label || '')

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
    if (e.key === 'Escape') {
      setLabelValue(data.label || '')
      setIsEditing(false)
    }
  }, [data.label])

  const handleDelete = useCallback(() => {
    if (data.onDelete) {
      data.onDelete(id)
    }
  }, [data, id])

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-150 ${
        selected ? 'ring-2 ring-primary-500 ring-offset-2 rounded' : ''
      }`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Delete button - visible on selection */}
      {selected && data.onDelete && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors"
          title="Xóa"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Symbol */}
      <div className="text-slate-700">{children}</div>

      {/* Label */}
      {isEditing ? (
        <input
          type="text"
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="mt-1 px-1 py-0.5 text-xs border border-primary-300 rounded text-center w-20 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      ) : (
        labelValue && (
          <span className="mt-1 text-xs font-medium text-slate-600 bg-white/80 px-1 rounded">
            {labelValue}
          </span>
        )
      )}

      {/* Voltage badge */}
      {data.voltage && (
        <span className="mt-0.5 text-[10px] text-slate-500">
          {data.voltage}
        </span>
      )}

      {/* Connection handles */}
      {showHandles && (
        <>
          {handlePositions.top && (
            <Handle
              type="source"
              position={Position.Top}
              className="w-2 h-2 !bg-slate-400 hover:!bg-primary-500 transition-colors"
            />
          )}
          {handlePositions.bottom && (
            <Handle
              type="target"
              position={Position.Bottom}
              className="w-2 h-2 !bg-slate-400 hover:!bg-primary-500 transition-colors"
            />
          )}
          {handlePositions.left && (
            <Handle
              type="source"
              position={Position.Left}
              id="left"
              className="w-2 h-2 !bg-slate-400 hover:!bg-primary-500 transition-colors"
            />
          )}
          {handlePositions.right && (
            <Handle
              type="target"
              position={Position.Right}
              id="right"
              className="w-2 h-2 !bg-slate-400 hover:!bg-primary-500 transition-colors"
            />
          )}
        </>
      )}
    </div>
  )
})
