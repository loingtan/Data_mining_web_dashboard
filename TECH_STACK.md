# Kiến trúc và Công nghệ Sử dụng

## Tổng quan kiến trúc

### Kiến trúc tổng thể
- **Frontend-only Architecture**: Single Page Application (SPA)
- **Client-Server Architecture**: Frontend React kết nối với Supabase backend
- **Component-based Architecture**: Sử dụng React components và Material-UI
- **State Management**: React Query cho server state, React hooks cho local state

### Luồng dữ liệu
```
Frontend (React) → API Calls → Supabase Functions → Database → Response → UI Update
```

## Frontend Technologies

### Core Framework
- **React 19.1.0**: JavaScript library cho UI
- **TypeScript 5.8.2**: Static type checking
- **Vite 6.2.5**: Build tool và dev server hiện đại

### UI Framework và Styling
- **Material-UI (MUI) 7.0.1**: Component library
  - `@mui/material`: Core components
  - `@mui/icons-material`: Icon set
  - `@mui/lab`: Experimental components
- **Emotion**: CSS-in-JS library cho styling
  - `@emotion/react`: Core emotion library
  - `@emotion/styled`: Styled components
  - `@emotion/cache`: Caching cho performance

### State Management và Data Fetching
- **TanStack React Query 5.76.1**: Server state management
  - Caching, synchronization, và background updates
  - Error handling và loading states
- **React Router DOM 7.4.1**: Client-side routing

### Data Visualization
- **Recharts 2.15.3**: Chart library cho React
  - Bar charts, Line charts, Pie charts
  - Responsive và customizable
- **ApexCharts 4.5.0**: Advanced charting library
  - `react-apexcharts`: React wrapper

### Utilities
- **dayjs 1.11.13**: Date manipulation library
- **es-toolkit 1.34.1**: Modern utility library
- **papaparse 5.5.3**: CSV parsing
- **simplebar-react 3.3.0**: Custom scrollbar

### Icons và Assets
- **Iconify React 5.2.1**: Icon framework với 100,000+ icons
- **Fontsource**: Self-hosted fonts
  - `@fontsource-variable/dm-sans`
  - `@fontsource/barlow`

## Backend Infrastructure

### Database và Backend Services
- **Supabase**: Backend-as-a-Service platform
  - PostgreSQL database
  - REST API auto-generation
  - Real-time subscriptions
  - Authentication và authorization
  - Edge Functions cho custom logic

### API Architecture
- **RESTful API**: Standard HTTP methods
- **Serverless Functions**: Supabase Edge Functions
- **Base URL**: `https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1`

### API Endpoints
```
GET /get-user-profile - Thông tin người dùng
GET /get-course-and-week-profiles - Thông tin khóa học
GET /query-week-table - Dữ liệu hoạt động theo tuần
GET /query-models-db - Danh sách mô hình ML
GET /query-test-predictions - Kết quả dự đoán
POST /predict - Thực hiện dự đoán mới
```

## Development Tools

### Code Quality
- **ESLint 9.23.0**: JavaScript/TypeScript linting
  - `@typescript-eslint/parser`: TypeScript parser
  - `eslint-plugin-react`: React-specific rules
  - `eslint-plugin-react-hooks`: Hooks rules
  - `eslint-plugin-import`: Import/export rules
  - `eslint-plugin-perfectionist`: Code organization
  - `eslint-plugin-unused-imports`: Remove unused imports

### Code Formatting
- **Prettier 3.5.3**: Code formatter
- **Vite Plugin Checker**: Real-time type checking

### Build Tools
- **Vite**: Fast build tool
  - `@vitejs/plugin-react-swc`: React plugin với SWC compiler
  - `vite-plugin-checker`: Type checking plugin
- **SWC**: Fast TypeScript/JavaScript compiler

## Project Structure

### Modular Architecture
```
src/
├── components/     # Reusable UI components
├── layouts/        # Layout wrappers (Dashboard, Auth)
├── pages/          # Page-level components
├── routes/         # Routing configuration
├── sections/       # Feature-specific components
├── theme/          # MUI theme customization
├── utils/          # Utilities và API layer
└── _mock/          # Mock data
```

### Component Organization
- **Atomic Design**: Components từ nhỏ đến lớn
- **Feature-based**: Grouping theo tính năng
- **Separation of Concerns**: Logic, UI, và styling tách biệt

## Data Flow Architecture

### Client-Side State
- **React Query**: Server state caching và synchronization
- **React Hooks**: Local component state (useState, useEffect)
- **URL State**: Routing state với React Router

### Data Processing
```
Raw Data → API Response → TypeScript Interfaces → React Components → UI Rendering
```

### Caching Strategy
- **React Query Cache**: Automatic caching cho API responses
- **Browser Cache**: Static assets caching
- **Memory Cache**: Component-level caching

## Security

### Authentication
- **Supabase Auth**: Built-in authentication system
- **JWT Tokens**: Secure API communication
- **API Keys**: Environment-based configuration

### Data Security
- **TypeScript**: Type safety
- **Input Validation**: Client-side validation
- **HTTPS**: Secure communication với Supabase

## Performance Optimizations

### Build Optimizations
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports
- **Bundle Optimization**: Vite optimization

### Runtime Optimizations
- **React Query**: Background refetching và caching
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo và useMemo

## Deployment

### Build Process
```bash
TypeScript Compilation → Vite Build → Static Assets → Deployment
```

### Supported Platforms
- **Vercel**: Configured với vercel.json
- **Netlify**: Static site hosting
- **Traditional Web Servers**: Apache, Nginx

## Browser Support

### Modern Browsers
- **Chrome**: Latest versions
- **Firefox**: Latest versions  
- **Safari**: Latest versions
- **Edge**: Latest versions

### Features Used
- **ES2015+**: Modern JavaScript features
- **CSS Grid và Flexbox**: Modern CSS layout
- **Fetch API**: Modern HTTP requests
- **Local Storage**: Client-side storage

## Development Workflow

### Package Management
- **Yarn 1.22.22**: Primary package manager
- **npm**: Alternative package manager support

### Development Server
- **Hot Module Replacement**: Instant updates
- **TypeScript Checking**: Real-time type validation
- **ESLint Integration**: Live linting feedback

### Quality Assurance
- **Type Safety**: Full TypeScript coverage
- **Code Standards**: ESLint + Prettier enforcement
- **Performance Monitoring**: Vite build analysis
