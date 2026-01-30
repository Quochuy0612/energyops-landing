/**
 * React Flow custom node components for electrical symbols
 */

import { memo } from 'react'
import { NodeProps } from '@xyflow/react'
import { BaseNode, BaseNodeData } from './BaseNode'
import {
  TransformerSymbol,
  CircuitBreakerSymbol,
  DisconnectSwitchSymbol,
  GroundSwitchSymbol,
  BusbarSymbol,
  PowerLineSymbol,
  LoadSymbol,
  GeneratorSymbol,
  CTSymbol,
  FuseSymbol,
} from '../symbols/iec-symbols'

// Transformer Node
export const TransformerNode = memo(function TransformerNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data}>
      <TransformerSymbol />
    </BaseNode>
  )
})

// Circuit Breaker Node
export const CircuitBreakerNode = memo(function CircuitBreakerNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data}>
      <CircuitBreakerSymbol state={data.state} />
    </BaseNode>
  )
})

// Disconnect Switch Node
export const DisconnectNode = memo(function DisconnectNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data}>
      <DisconnectSwitchSymbol state={data.state} />
    </BaseNode>
  )
})

// Ground Switch Node
export const GroundSwitchNode = memo(function GroundSwitchNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data}>
      <GroundSwitchSymbol state={data.state} />
    </BaseNode>
  )
})

// Busbar Node
export const BusbarNode = memo(function BusbarNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode
      {...props}
      data={data}
      handlePositions={{ top: false, bottom: false, left: true, right: true }}
    >
      <BusbarSymbol />
    </BaseNode>
  )
})

// Power Line Node
export const PowerLineNode = memo(function PowerLineNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode
      {...props}
      data={data}
      handlePositions={{ top: false, bottom: false, left: true, right: true }}
    >
      <PowerLineSymbol />
    </BaseNode>
  )
})

// Load Node
export const LoadNode = memo(function LoadNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data} handlePositions={{ top: true, bottom: false }}>
      <LoadSymbol />
    </BaseNode>
  )
})

// Generator Node
export const GeneratorNode = memo(function GeneratorNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data} handlePositions={{ top: true, bottom: false }}>
      <GeneratorSymbol />
    </BaseNode>
  )
})

// Current Transformer Node
export const CTNode = memo(function CTNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode
      {...props}
      data={data}
      handlePositions={{ top: false, bottom: false, left: true, right: true }}
    >
      <CTSymbol />
    </BaseNode>
  )
})

// Fuse Node
export const FuseNode = memo(function FuseNode(props: NodeProps) {
  const data = props.data as BaseNodeData
  return (
    <BaseNode {...props} data={data}>
      <FuseSymbol />
    </BaseNode>
  )
})

// Node types registry for React Flow
export const nodeTypes = {
  transformer: TransformerNode,
  circuitBreaker: CircuitBreakerNode,
  disconnect: DisconnectNode,
  groundSwitch: GroundSwitchNode,
  busbar: BusbarNode,
  powerLine: PowerLineNode,
  load: LoadNode,
  generator: GeneratorNode,
  ct: CTNode,
  fuse: FuseNode,
}

export type NodeType = keyof typeof nodeTypes
