# Student Learning Analytics Dashboard

## Mô tả dự án

Đây là một ứng dụng web phân tích dữ liệu học tập sinh viên được xây dựng với React và Material-UI. Ứng dụng cung cấp dashboard cho việc theo dõi tiến độ học tập, dự đoán kết quả học tập và phân tích dữ liệu giáo dục.

## Tính năng chính

- **Dashboard cho Học viên**: Theo dõi tiến độ cá nhân, hoàn thành khóa học, và thống kê học tập
- **Dashboard cho Giảng viên**: Quản lý và theo dõi tiến độ của tất cả học viên
- **Dự đoán kết quả học tập**: Sử dụng machine learning để dự đoán tỷ lệ hoàn thành khóa học
- **Phân tích dữ liệu**: Biểu đồ và thống kê chi tiết về hoạt động học tập
- **Model Hub**: Quản lý và so sánh các mô hình machine learning

## Yêu cầu hệ thống

- **Node.js**: >= 20.0.0
- **Package Manager**: Yarn (khuyến nghị) hoặc npm
- **Trình duyệt**: Chrome, Firefox, Safari, Edge (phiên bản mới)

## Cài đặt và chạy ứng dụng

### Bước 1: Clone repository hoặc tải source code

```bash
# Nếu sử dụng Git
git clone <repository-url>
cd material-kit-react

# Hoặc giải nén file source code vào thư mục
```

### Bước 2: Cài đặt dependencies

Sử dụng Yarn (khuyến nghị):
```bash
yarn install
```

Hoặc sử dụng npm:
```bash
npm install
```

### Bước 3: Chạy ứng dụng ở chế độ development

Sử dụng Yarn:
```bash
yarn dev
```

Hoặc sử dụng npm:
```bash
npm run dev
```

### Bước 4: Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3039`

## Scripts có sẵn

### Development
- `yarn dev` hoặc `npm run dev`: Chạy ứng dụng ở chế độ development
- `yarn tsc:watch`: Kiểm tra TypeScript trong chế độ watch

### Build và Production
- `yarn build` hoặc `npm run build`: Build ứng dụng cho production
- `yarn start` hoặc `npm run start`: Chạy ứng dụng đã được build
- `yarn re:build`: Clean, install và build lại từ đầu

### Code Quality
- `yarn lint`: Kiểm tra lỗi ESLint
- `yarn lint:fix`: Tự động sửa lỗi ESLint
- `yarn fm:check`: Kiểm tra format code với Prettier
- `yarn fm:fix`: Tự động format code với Prettier
- `yarn fix:all`: Chạy cả lint:fix và fm:fix

### Utility
- `yarn clean`: Xóa các thư mục cache và build
- `yarn re:dev`: Clean, install và chạy development
- `yarn tsc:print`: In cấu hình TypeScript

## Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
├── layouts/            # Layout components (dashboard, auth)
├── pages/              # Các trang chính của ứng dụng
├── routes/             # Cấu hình routing
├── sections/           # Các section component cho từng trang
├── theme/              # Cấu hình theme Material-UI
├── utils/              # Utilities và API calls
├── _mock/              # Mock data cho development
└── global.css          # Global styles
```

## Cấu hình môi trường

Ứng dụng sử dụng Supabase làm backend. API endpoints đã được cấu hình sẵn trong `src/utils/api.ts`:

```typescript
const BASE_URL = 'https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1';
```

## Các trang chính

- `/` - Trang chủ
- `/dashboard` - Tổng quan
- `/student` - Dashboard học viên
- `/teacher` - Dashboard giảng viên
- `/predict` - Dự đoán kết quả học tập
- `/model-hub` - Quản lý mô hình ML
- `/sign-in` - Đăng nhập

## Troubleshooting

### Lỗi khi cài đặt dependencies
```bash
# Xóa node_modules và cài đặt lại
yarn clean
yarn install
```

### Lỗi port đã được sử dụng
Thay đổi port trong `vite.config.ts`:
```typescript
const PORT = 3040; // Thay đổi port khác
```

### Lỗi TypeScript
```bash
# Kiểm tra cấu hình TypeScript
yarn tsc:print

# Chạy TypeScript check
yarn tsc:watch
```

### Lỗi ESLint hoặc Prettier
```bash
# Tự động sửa tất cả lỗi format
yarn fix:all
```

## Phát triển

### Thêm trang mới
1. Tạo component trong `src/pages/`
2. Thêm route trong `src/routes/sections.tsx`
3. Cập nhật navigation trong `src/layouts/`

### Thêm API endpoint
1. Thêm endpoint vào `ENDPOINTS` trong `src/utils/api.ts`
2. Tạo interface TypeScript cho data
3. Tạo hook sử dụng React Query

### Thêm component
1. Tạo component trong `src/components/`
2. Export trong `index.ts`
3. Sử dụng Material-UI theme system

## Hỗ trợ

- Kiểm tra console browser để xem lỗi chi tiết
- Sử dụng React Developer Tools để debug
- Kiểm tra Network tab để debug API calls

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
