/**
 * IEC 60617 Standard Electrical Symbols
 * Single-line diagram symbols for power systems
 */

import React from 'react'

interface SymbolProps {
  className?: string
  state?: 'open' | 'closed'
  width?: number
  height?: number
}

// Transformer (2-winding) - IEC 60617-6
export const TransformerSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 60,
  height = 80
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 80"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Primary winding (top circle) */}
    <circle cx="30" cy="25" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Secondary winding (bottom circle) */}
    <circle cx="30" cy="55" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Top connection line */}
    <line x1="30" y1="0" x2="30" y2="10" stroke="currentColor" strokeWidth="2" />
    {/* Bottom connection line */}
    <line x1="30" y1="70" x2="30" y2="80" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Circuit Breaker - IEC 60617-7
export const CircuitBreakerSymbol: React.FC<SymbolProps> = ({
  className = '',
  state = 'closed',
  width = 40,
  height = 60
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 60"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top connection */}
    <line x1="20" y1="0" x2="20" y2="15" stroke="currentColor" strokeWidth="2" />
    {/* Fixed contact (top) */}
    <rect x="15" y="15" width="10" height="4" fill="currentColor" />
    {/* Moving contact */}
    {state === 'closed' ? (
      <line x1="20" y1="19" x2="20" y2="41" stroke="currentColor" strokeWidth="2" />
    ) : (
      <line x1="20" y1="19" x2="32" y2="38" stroke="currentColor" strokeWidth="2" />
    )}
    {/* Fixed contact (bottom) */}
    <rect x="15" y="41" width="10" height="4" fill="currentColor" />
    {/* Bottom connection */}
    <line x1="20" y1="45" x2="20" y2="60" stroke="currentColor" strokeWidth="2" />
    {/* Cross mark for circuit breaker */}
    <line x1="10" y1="25" x2="18" y2="35" stroke="currentColor" strokeWidth="1.5" />
    <line x1="18" y1="25" x2="10" y2="35" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

// Disconnect Switch (Isolator) - IEC 60617-7
export const DisconnectSwitchSymbol: React.FC<SymbolProps> = ({
  className = '',
  state = 'closed',
  width = 40,
  height = 50
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 50"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top connection */}
    <line x1="20" y1="0" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
    {/* Fixed contact (top) */}
    <circle cx="20" cy="14" r="3" fill="currentColor" />
    {/* Moving blade */}
    {state === 'closed' ? (
      <line x1="20" y1="14" x2="20" y2="36" stroke="currentColor" strokeWidth="2" />
    ) : (
      <line x1="20" y1="14" x2="32" y2="32" stroke="currentColor" strokeWidth="2" />
    )}
    {/* Fixed contact (bottom) */}
    <circle cx="20" cy="36" r="3" fill="currentColor" />
    {/* Bottom connection */}
    <line x1="20" y1="38" x2="20" y2="50" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Ground/Earth Switch - IEC 60617-7
export const GroundSwitchSymbol: React.FC<SymbolProps> = ({
  className = '',
  state = 'open',
  width = 40,
  height = 50
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 50"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top connection */}
    <line x1="20" y1="0" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
    {/* Fixed contact */}
    <circle cx="20" cy="12" r="3" fill="currentColor" />
    {/* Moving blade */}
    {state === 'closed' ? (
      <line x1="20" y1="12" x2="20" y2="28" stroke="currentColor" strokeWidth="2" />
    ) : (
      <line x1="20" y1="12" x2="8" y2="26" stroke="currentColor" strokeWidth="2" />
    )}
    {/* Earth symbol */}
    <line x1="10" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="2" />
    <line x1="13" y1="35" x2="27" y2="35" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="40" x2="24" y2="40" stroke="currentColor" strokeWidth="2" />
    <line x1="19" y1="45" x2="21" y2="45" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Busbar - IEC 60617-6
export const BusbarSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 200,
  height = 10
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 10"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="3" width="200" height="4" fill="currentColor" />
  </svg>
)

// Power Line - IEC 60617-6
export const PowerLineSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 100,
  height = 4
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 4"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Load - IEC 60617-6
export const LoadSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 50,
  height = 50
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 50 50"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Connection line */}
    <line x1="25" y1="0" x2="25" y2="10" stroke="currentColor" strokeWidth="2" />
    {/* Load arrow pointing down */}
    <polygon
      points="25,10 15,25 20,25 20,45 30,45 30,25 35,25"
      fill="currentColor"
    />
  </svg>
)

// Generator - IEC 60617-6
export const GeneratorSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 60,
  height = 60
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 60"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle */}
    <circle cx="30" cy="35" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* G letter */}
    <text
      x="30"
      y="41"
      textAnchor="middle"
      fontSize="16"
      fontWeight="bold"
      fill="currentColor"
    >
      G
    </text>
    {/* Top connection */}
    <line x1="30" y1="0" x2="30" y2="15" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Current Transformer (CT) - IEC 60617-6
export const CTSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 40,
  height = 40
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Primary (straight line through) */}
    <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="2" />
    {/* Secondary (circle) */}
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Secondary connection dots */}
    <circle cx="20" cy="8" r="2" fill="currentColor" />
    <circle cx="20" cy="32" r="2" fill="currentColor" />
  </svg>
)

// Fuse - IEC 60617-7
export const FuseSymbol: React.FC<SymbolProps> = ({
  className = '',
  width = 30,
  height = 50
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 50"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top connection */}
    <line x1="15" y1="0" x2="15" y2="10" stroke="currentColor" strokeWidth="2" />
    {/* Fuse body (rectangle) */}
    <rect x="5" y="10" width="20" height="30" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Fuse element (line inside) */}
    <line x1="15" y1="15" x2="15" y2="35" stroke="currentColor" strokeWidth="1" />
    {/* Bottom connection */}
    <line x1="15" y1="40" x2="15" y2="50" stroke="currentColor" strokeWidth="2" />
  </svg>
)

// Symbol type definitions for export
export const SYMBOL_TYPES = {
  transformer: {
    name: 'Máy biến áp',
    code: 'MBA',
    component: TransformerSymbol,
    width: 60,
    height: 80,
  },
  circuitBreaker: {
    name: 'Máy cắt',
    code: 'MC',
    component: CircuitBreakerSymbol,
    width: 40,
    height: 60,
  },
  disconnect: {
    name: 'Dao cách ly',
    code: 'DCL',
    component: DisconnectSwitchSymbol,
    width: 40,
    height: 50,
  },
  groundSwitch: {
    name: 'Dao tiếp địa',
    code: 'TD',
    component: GroundSwitchSymbol,
    width: 40,
    height: 50,
  },
  busbar: {
    name: 'Thanh cái',
    code: 'BUS',
    component: BusbarSymbol,
    width: 200,
    height: 10,
  },
  powerLine: {
    name: 'Đường dây',
    code: 'LINE',
    component: PowerLineSymbol,
    width: 100,
    height: 4,
  },
  load: {
    name: 'Phụ tải',
    code: 'LOAD',
    component: LoadSymbol,
    width: 50,
    height: 50,
  },
  generator: {
    name: 'Máy phát điện',
    code: 'GEN',
    component: GeneratorSymbol,
    width: 60,
    height: 60,
  },
  ct: {
    name: 'Biến dòng',
    code: 'CT',
    component: CTSymbol,
    width: 40,
    height: 40,
  },
  fuse: {
    name: 'Cầu chì',
    code: 'FUSE',
    component: FuseSymbol,
    width: 30,
    height: 50,
  },
} as const

export type SymbolType = keyof typeof SYMBOL_TYPES
