import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import {
  Dashboard,
  Requests,
  Tickets,
  CreateTicket,
  TicketDetail,
  AIAssistantPage,
  AIDraftTicket,
  AIForecast,
  Equipment,
  Reports,
  Users,
  Safety,
} from '@/pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/create" element={<CreateTicket />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        {/* AI Features */}
        <Route path="ai/assistant" element={<AIAssistantPage />} />
        <Route path="ai/draft-ticket" element={<AIDraftTicket />} />
        <Route path="ai/forecast" element={<AIForecast />} />
        {/* Core Features */}
        <Route path="equipment" element={<Equipment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="safety" element={<Safety />} />
        <Route path="settings" element={<ComingSoon title="Cài đặt" />} />
        <Route path="help" element={<ComingSoon title="Trợ giúp" />} />
      </Route>
    </Routes>
  )
}

// Placeholder component for pages not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">Tính năng đang được phát triển...</p>
      </div>
    </div>
  )
}

export default App
