/**
 * Symbol Palette - Draggable symbols for the diagram editor
 */

import React, { DragEvent, useCallback } from 'react'
import { SYMBOL_TYPES, SymbolType } from './symbols/iec-symbols'

interface SymbolPaletteProps {
  className?: string
}

interface SymbolItemProps {
  type: SymbolType
  name: string
  code: string
  SymbolComponent: React.FC<{ className?: string; width?: number; height?: number }>
}

const SymbolItem: React.FC<SymbolItemProps> = ({
  type,
  name,
  code,
  SymbolComponent,
}) => {
  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('application/reactflow', type)
      event.dataTransfer.effectAllowed = 'move'
    },
    [type]
  )

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-grab active:cursor-grabbing transition-colors group"
      title={`${name} (${code})`}
    >
      <div className="text-slate-600 group-hover:text-primary-600 transition-colors">
        <SymbolComponent width={32} height={32} />
      </div>
      <span className="mt-1.5 text-[10px] font-medium text-slate-500 group-hover:text-primary-600 text-center leading-tight">
        {code}
      </span>
    </div>
  )
}

export const SymbolPalette: React.FC<SymbolPaletteProps> = ({ className = '' }) => {
  const symbols = Object.entries(SYMBOL_TYPES).map(([key, value]) => ({
    type: key as SymbolType,
    ...value,
  }))

  // Group symbols by category
  const switchSymbols = symbols.filter((s) =>
    ['circuitBreaker', 'disconnect', 'groundSwitch', 'fuse'].includes(s.type)
  )
  const equipmentSymbols = symbols.filter((s) =>
    ['transformer', 'generator', 'load', 'ct'].includes(s.type)
  )
  const connectionSymbols = symbols.filter((s) =>
    ['busbar', 'powerLine'].includes(s.type)
  )

  return (
    <div className={`flex flex-col h-full bg-gray-50 border-r border-gray-200 ${className}`}>
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-slate-700">Ký hiệu</h3>
        <p className="text-xs text-slate-500 mt-0.5">Kéo thả vào sơ đồ</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Equipment */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Thiết bị
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {equipmentSymbols.map((symbol) => (
              <SymbolItem
                key={symbol.type}
                type={symbol.type}
                name={symbol.name}
                code={symbol.code}
                SymbolComponent={symbol.component}
              />
            ))}
          </div>
        </div>

        {/* Switches */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Khí cụ đóng cắt
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {switchSymbols.map((symbol) => (
              <SymbolItem
                key={symbol.type}
                type={symbol.type}
                name={symbol.name}
                code={symbol.code}
                SymbolComponent={symbol.component}
              />
            ))}
          </div>
        </div>

        {/* Connections */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Kết nối
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {connectionSymbols.map((symbol) => (
              <SymbolItem
                key={symbol.type}
                type={symbol.type}
                name={symbol.name}
                code={symbol.code}
                SymbolComponent={symbol.component}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Help text */}
      <div className="p-3 border-t border-gray-200 bg-blue-50">
        <p className="text-xs text-blue-700">
          <strong>Mẹo:</strong> Nhấp đúp vào ký hiệu để thêm nhãn
        </p>
      </div>
    </div>
  )
}
