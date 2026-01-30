# EnergyOPS Additional Screens Design

**Date:** 2026-01-30
**Status:** Approved
**Screens:** Thiết bị, Báo cáo, Người dùng, An toàn

---

## Overview

This document specifies the design for 4 additional screens in the EnergyOPS power grid operations management system. These screens complete the core functionality alongside existing Dashboard, Requests, Tickets, and AI features.

### Design Principles
- Consistent with existing UI patterns (Cards, Tables, KPIs)
- Vietnamese language throughout
- Tailwind CSS with EnergyOPS color palette
- Responsive layout (sidebar + main content)

---

## 1. Thiết bị (Equipment Management)

### Purpose
Unified equipment management hub combining asset inventory, real-time SCADA monitoring, and maintenance tracking.

### Layout Structure

#### Header
- Title: "Quản lý Thiết bị"
- Badge: Equipment count (e.g., "2,847 thiết bị")
- Actions: "Thêm thiết bị", "Xuất Excel", "Đồng bộ SCADA"
- Global search bar for equipment lookup

#### View Switcher (Tabs)
| Tab | Description |
|-----|-------------|
| Theo Trạm | Tree view: Miền → Tỉnh → Trạm → Equipment |
| Theo Loại | Card grid of equipment categories |
| Theo Cấp điện áp | Sections by 500kV/220kV/110kV/22kV |
| Sơ đồ SCADA | Interactive single-line diagram |

#### Filter Panel (Collapsible Left Sidebar)
- Station multi-select
- Equipment type checkboxes
- Voltage level filter
- Status: Vận hành / Bảo trì / Sự cố / Ngừng
- Manufacturer filter
- Installation year range

### View Details

#### Tab 1: Theo Trạm (By Station)
```
Miền Nam
├── TP. Hồ Chí Minh
│   ├── TBA 220kV Tân Định (45 TB) [●]
│   ├── TBA 110kV Thủ Đức (32 TB) [●]
│   └── ...
└── Bình Dương
    └── ...
```
- Expandable tree structure
- Station row: Name, voltage levels, equipment count, status indicator
- Expanded: Equipment table (Mã TB, Tên, Loại, Trạng thái, Thông số)

#### Tab 2: Theo Loại (By Type)
Card grid layout:
| Category | Icon | Example Count |
|----------|------|---------------|
| Máy biến áp (MBA) | 🔌 | 234 |
| Máy cắt (MC) | ⚡ | 567 |
| Dao cách ly (DCL) | 🔧 | 892 |
| Dao tiếp địa (DTĐ) | ⏚ | 445 |
| Tụ bù | 📦 | 123 |
| Kháng điện | 🔄 | 89 |
| Chống sét | ⚡ | 334 |

Click card → filtered table of that type

#### Tab 3: Theo Cấp điện áp (By Voltage)
Horizontal sections with color coding:
- **500kV** (red accent) - Count, health %, equipment list
- **220kV** (orange accent) - Count, health %, equipment list
- **110kV** (blue accent) - Count, health %, equipment list
- **22kV** (green accent) - Count, health %, equipment list

#### Tab 4: Sơ đồ SCADA (Interactive Diagram)
- Station selector dropdown
- SVG single-line diagram with:
  - Clickable equipment symbols
  - Color-coded status:
    - Green = Closed/Normal
    - Red = Open/Tripped
    - Yellow = Alarm
    - Gray = Offline/Unknown
  - Live measurements (kV, A, MW) displayed near equipment
  - Click equipment → slide-out detail panel

### Equipment Detail Panel

Slide-out panel when clicking any equipment:

**Header:**
- Equipment code + name (e.g., "MBA-T1-110 | Máy biến áp T1")
- Status badge
- Quick actions: Xem lịch sử, Tạo phiếu bảo trì, In thông số

**Tabs:**
| Tab | Content |
|-----|---------|
| Thông số kỹ thuật | Specs table (công suất, điện áp, hãng SX, năm lắp đặt, serial) |
| Đo lường real-time | Live gauges (voltage, current, temperature, oil level) |
| Lịch sử vận hành | Timeline of status changes, operations |
| Bảo trì | Schedule, last inspection, next due, repair history |
| Tài liệu | Manuals, test reports, certificates |

### Maintenance Tracking

Summary cards:
- "Bảo trì đến hạn" (red if overdue)
- "Bảo trì tuần này"
- "Đang bảo trì"

Calendar view for maintenance schedule. Alert badges on overdue equipment.

---

## 2. Báo cáo (Reports)

### Purpose
Full reporting hub with template library, custom report builder, and automated scheduling.

### Layout Structure

#### Header
- Title: "Trung tâm Báo cáo"
- Subtitle: "Quản lý và xuất báo cáo vận hành"
- Actions: "Tạo báo cáo mới", "Lịch báo cáo", "Cài đặt"

#### Navigation Tabs
| Tab | Description |
|-----|-------------|
| Mẫu báo cáo | Pre-built template library |
| Báo cáo tùy chỉnh | Drag-and-drop custom builder |
| Đã lên lịch | Scheduled reports management |
| Lịch sử | Generated reports history |

### Tab Details

#### Tab 1: Mẫu báo cáo (Template Library)

**Category filters:** Vận hành | Tuân thủ | Hiệu suất | Sự cố

**Popular templates:**
| Template | Frequency | Description |
|----------|-----------|-------------|
| Báo cáo vận hành ngày | Ngày | Tổng hợp hoạt động vận hành 24h |
| Báo cáo sự cố tháng | Tháng | Thống kê sự cố và nguyên nhân |
| Thống kê phiếu thao tác | Tuần/Tháng | Số lượng, trạng thái phiếu |
| Báo cáo bảo trì thiết bị | Tháng | Tình trạng bảo trì, thiết bị |
| Báo cáo tuân thủ EVN | Quý | Tuân thủ quy định EVN |

Card layout: Template name, icon, description, frequency badge, "Tạo báo cáo" button

#### Tab 2: Báo cáo tùy chỉnh (Custom Builder)

Three-panel layout:

**Left Panel - Data Sources:**
Draggable field categories:
- Phiếu thao tác (ticket fields)
- Thiết bị (equipment fields)
- Sự cố (incident fields)
- Người dùng (user fields)
- Thời gian (date/time)

**Center Panel - Report Canvas:**
- Drop zones: Tiêu đề, Bộ lọc, Cột dữ liệu, Nhóm theo, Sắp xếp
- Live preview of report structure
- Add chart blocks (bar, line, pie)

**Right Panel - Properties:**
- Field settings
- Formatting options
- Aggregation (sum, count, average)

#### Tab 3: Đã lên lịch (Scheduled Reports)

Table columns:
| Tên báo cáo | Tần suất | Người nhận | Lần chạy tiếp | Trạng thái | Actions |

"Thêm lịch mới" modal:
- Select report (template or custom)
- Frequency: Hàng ngày / Hàng tuần / Hàng tháng
- Time picker
- Recipients (email multi-select)
- Export format: PDF / Excel / Both

#### Tab 4: Lịch sử (Report History)

Filter bar: Date range, Report type, Created by

Table columns:
| Tên báo cáo | Loại | Ngày tạo | Người tạo | Kích thước | Actions |

Actions: Xem, Tải xuống, Gửi email, Xóa

Bulk actions: Download all, Delete selected

### Report Generation Modal

**Step 1: Chọn phạm vi**
- Date range (presets: Hôm nay, 7 ngày, Tháng này, Tùy chỉnh)
- Station/area filter
- Equipment type filter

**Step 2: Xem trước**
- Preview first page
- Data summary (record count, key metrics)

**Step 3: Xuất báo cáo**
- Format: PDF / Excel / Word
- Options: Gửi email ngay, Lưu vào lịch sử
- Generate with progress indicator

---

## 3. Người dùng (User Management)

### Purpose
Complete user management with directory, RBAC, shift management, and activity audit logs.

### Layout Structure

#### Header
- Title: "Quản lý Người dùng"
- Badge: User count (e.g., "156 người dùng")
- Actions: "Thêm người dùng", "Nhập từ Excel", "Xuất danh sách"

#### Navigation Tabs
| Tab | Description |
|-----|-------------|
| Danh sách | User directory |
| Phân quyền | Roles & permissions (RBAC) |
| Ca trực | Shift management |
| Nhật ký | Activity audit logs |

### Tab Details

#### Tab 1: Danh sách (User Directory)

**Filter bar:**
- Search: name/email/employee ID
- Role filter dropdown
- Station/department filter
- Status: Hoạt động / Tạm khóa / Nghỉ việc

**Table columns:**
| Avatar + Họ tên | Mã NV | Chức vụ | Phòng/Trạm | Vai trò | Trạng thái | Đăng nhập cuối | Actions |

**Card view option:**
- Photo, name, role, contact
- Quick action buttons

#### Tab 2: Phân quyền (Roles & Permissions)

**Left Panel - Role List:**
| Role | User Count |
|------|------------|
| Quản trị viên | 3 |
| Trưởng ca điều độ | 8 |
| Điều độ viên | 45 |
| Kỹ sư vận hành | 62 |
| Nhân viên bảo trì | 28 |
| Chỉ xem | 10 |

"Tạo vai trò mới" button

**Right Panel - Permission Matrix:**

Permission groups:
```
Phiếu thao tác
├── [x] Xem
├── [x] Tạo
├── [ ] Duyệt
└── [ ] Xóa

Thiết bị
├── [x] Xem
├── [ ] Sửa
└── [ ] Điều khiển SCADA

Báo cáo
├── [x] Xem
├── [x] Tạo
└── [x] Xuất

Người dùng
├── [ ] Xem
└── [ ] Quản lý

An toàn
├── [x] Xem
├── [x] Báo cáo sự cố
└── [ ] Quản lý
```

Station/area scope restrictions

#### Tab 3: Ca trực (Shift Management)

**Calendar view (week/month):**
- Shift legend:
  - Ca sáng: 6:00 - 14:00 (yellow)
  - Ca chiều: 14:00 - 22:00 (blue)
  - Ca đêm: 22:00 - 6:00 (purple)
- Click cell → assign user modal

**Current shift panel:** "Đang trực" - on-duty personnel list

**Handover log section:** Timestamped notes from shift changes

#### Tab 4: Nhật ký (Activity Audit Logs)

**Filter bar:**
- Date range picker
- User filter (multi-select)
- Action type: Đăng nhập / Phiếu thao tác / Thiết bị / Cài đặt / Tất cả
- Severity: Thông tin / Cảnh báo / Quan trọng

**Log table:**
| Thời gian | Người dùng | Hành động | Đối tượng | IP Address | Kết quả |

**Expandable row details:**
- Full action details
- Before/after values
- Device/browser info

### User Detail Modal

**Header:** Avatar, name, role badge, status

**Tabs:**
| Tab | Content |
|-----|---------|
| Thông tin | Personal info, contact, department |
| Quyền hạn | Assigned roles, effective permissions |
| Ca trực | Shift history, upcoming shifts |
| Hoạt động | Recent activity log |

**Actions:** Đặt lại mật khẩu, Khóa tài khoản, Xóa

---

## 4. An toàn (Safety Command Center)

### Purpose
Comprehensive safety management with procedures library, incident tracking, training management, and real-time alerts.

### Layout Structure

#### Header
- Title: "Trung tâm An toàn"
- Safety score badge (e.g., "96/100 điểm")
- Real-time alert indicator (flashing if active)
- Actions: "Báo cáo sự cố", "Kiểm tra an toàn", "Cài đặt cảnh báo"

#### KPI Cards Row
| Metric | Example | Visual |
|--------|---------|--------|
| Ngày không sự cố | 127 ngày | Streak counter |
| Sự cố tháng này | 2 | vs target, trend |
| Tuân thủ đào tạo | 94% | Progress ring |
| Cảnh báo đang mở | 3 | Red if critical |

#### Navigation Tabs
| Tab | Description |
|-----|-------------|
| Tổng quan | Safety dashboard |
| Quy trình | Procedures library |
| Sự cố | Incident management |
| Đào tạo | Training & certifications |
| Cảnh báo | Real-time alerts |

### Tab Details

#### Tab 1: Tổng quan (Dashboard)

Charts:
- Incident trend (12 months line chart)
- Incident by type (pie: Điện giật / Té ngã / Cháy nổ / Khác)
- Compliance by department (horizontal bar)

Lists:
- Recent incidents (last 5)
- Upcoming safety activities calendar

#### Tab 2: Quy trình (Safety Procedures)

**Left sidebar - Category tree:**
- Quy trình chung
- An toàn điện (Lockout/Tagout)
- Làm việc trên cao
- Không gian kín
- Phòng cháy chữa cháy
- Sơ cứu khẩn cấp
- PPE (Bảo hộ lao động)

**Main content:**
- Document cards: Title, version, updated date, file type
- Quick preview on hover
- Actions: Xem, Tải xuống, In
- Search within procedures
- Admin: "Tải lên quy trình mới"

#### Tab 3: Sự cố (Incident Management)

**Sub-tabs:** Tất cả | Đang điều tra | Đã đóng

**Incident table:**
| Mã sự cố | Ngày | Loại | Vị trí | Mức độ | Trạng thái | Người báo cáo |

Severity badges: Nghiêm trọng (red) / Trung bình (yellow) / Nhẹ (blue) / Suýt xảy ra (gray)

**"Báo cáo sự cố" form:**
- Loại sự cố (dropdown)
- Mức độ selection
- Vị trí, thời gian
- Mô tả chi tiết (textarea)
- Người liên quan (multi-select)
- Upload ảnh/tài liệu
- Immediate actions taken

**Incident detail view:**
- Full incident information
- Investigation timeline
- Root cause analysis section
- Corrective actions tracking
- Related documents

#### Tab 4: Đào tạo (Training & Certifications)

**Dashboard cards:**
- Tổng nhân viên đã đào tạo: 142/156
- Chứng chỉ hết hạn tháng này: 8
- Khóa học đang mở: 3

**Sub-tabs:** Chứng chỉ | Khóa học | Lịch sử

**Certifications table:**
| Nhân viên | Loại chứng chỉ | Ngày cấp | Ngày hết hạn | Trạng thái |

Status badges:
- Còn hạn (green)
- Sắp hết hạn - 30 days (yellow)
- Hết hạn (red)

**Training courses:**
- Course cards with progress bars
- Assign employees functionality
- Completion tracking

#### Tab 5: Cảnh báo (Real-time Alerts)

**Active alerts panel (highlighted at top):**
Alert cards with severity colors:
- Critical (red): Immediate danger
- Warning (yellow): Attention needed
- Info (blue): Informational

Card content: Type icon, message, location, timestamp
Actions: Xác nhận, Xử lý, Tắt cảnh báo

**Alert configuration:**
Table: Điều kiện | Mức độ | Thông báo | Trạng thái (toggle)

"Thêm quy tắc" → condition builder modal:
- Trigger condition
- Severity level
- Notification channels (email, SMS, in-app)
- Recipients

**Alert history:**
- Searchable log
- Response time tracking
- Resolution notes

---

## Component Reuse

These screens will reuse existing components:
- `Header` - Page header with title/actions
- `Card` - Content containers
- `Button` - Action buttons
- `Badge` - Status indicators
- `Table` - Data tables
- `Input`, `Select` - Form elements
- `ChartCard` - Chart wrappers

New components to create:
- `TreeView` - For station hierarchy
- `PermissionMatrix` - RBAC checkbox grid
- `ShiftCalendar` - Shift schedule calendar
- `AlertCard` - Real-time alert display
- `SCADADiagram` - Interactive single-line diagram (SVG-based)
- `TimelineLog` - Activity/history timeline

---

## Data Models

### Equipment
```typescript
interface Equipment {
  id: string
  code: string
  name: string
  type: 'MBA' | 'MC' | 'DCL' | 'DTD' | 'TU' | 'KHANG' | 'CS'
  stationId: string
  voltageLevel: 500 | 220 | 110 | 22
  status: 'operating' | 'maintenance' | 'fault' | 'stopped'
  manufacturer: string
  installationYear: number
  specifications: Record<string, string>
  lastMaintenance: Date
  nextMaintenance: Date
}
```

### Report
```typescript
interface Report {
  id: string
  name: string
  type: 'template' | 'custom' | 'scheduled'
  category: 'operational' | 'compliance' | 'performance' | 'incident'
  createdBy: string
  createdAt: Date
  parameters: Record<string, any>
  fileUrl?: string
  fileSize?: number
}
```

### User
```typescript
interface User {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  stationId?: string
  roles: string[]
  status: 'active' | 'locked' | 'inactive'
  lastLogin: Date
}
```

### SafetyIncident
```typescript
interface SafetyIncident {
  id: string
  code: string
  type: 'electric_shock' | 'fall' | 'fire' | 'other'
  severity: 'critical' | 'medium' | 'minor' | 'near_miss'
  location: string
  occurredAt: Date
  reportedBy: string
  status: 'open' | 'investigating' | 'closed'
  description: string
  involvedPersons: string[]
  immediateActions: string
  rootCause?: string
  correctiveActions?: string[]
}
```

---

## Implementation Priority

1. **Thiết bị** - Core functionality, SCADA view is complex
2. **Người dùng** - Required for RBAC across other screens
3. **An toàn** - Critical for compliance
4. **Báo cáo** - Can use simpler version initially

---

## Appendix: Vietnamese Terminology

| English | Vietnamese |
|---------|------------|
| Equipment | Thiết bị |
| Transformer | Máy biến áp (MBA) |
| Circuit Breaker | Máy cắt (MC) |
| Disconnector | Dao cách ly (DCL) |
| Grounding Switch | Dao tiếp địa (DTĐ) |
| Substation | Trạm biến áp (TBA) |
| Report | Báo cáo |
| User | Người dùng |
| Safety | An toàn |
| Incident | Sự cố |
| Maintenance | Bảo trì |
| Shift | Ca trực |
| Permission | Quyền hạn |
| Alert | Cảnh báo |
| Training | Đào tạo |
| Certification | Chứng chỉ |
