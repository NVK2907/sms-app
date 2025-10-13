# SMS App - School Management System Frontend

Ứng dụng frontend React cho hệ thống quản lý trường học (SMS).

## Tính năng

- **Xác thực người dùng**: Đăng nhập, đăng ký với phân quyền theo vai trò
- **Dashboard**: Bảng điều khiển riêng cho từng vai trò (Admin, Teacher, Student)
- **Giao diện responsive**: Sử dụng Tailwind CSS
- **Bảo mật**: Protected routes và JWT authentication
- **UI/UX hiện đại**: Sử dụng Heroicons và Headless UI

## Công nghệ sử dụng

- **React 18** - Framework frontend
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Heroicons** - Icon library
- **Headless UI** - UI components

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình API URL trong file `.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

4. Chạy ứng dụng:
```bash
npm run dev
```

## Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
│   ├── Layout.jsx      # Layout chính
│   ├── Header.jsx      # Header với navigation
│   ├── Sidebar.jsx     # Sidebar navigation
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Các trang chính
│   ├── Login.jsx       # Trang đăng nhập
│   ├── Register.jsx    # Trang đăng ký
│   └── Dashboard.jsx   # Trang chủ
├── services/           # API services
│   ├── api.js         # Axios configuration
│   └── authService.js # Authentication service
├── contexts/           # React contexts
│   └── AuthContext.js # Authentication context
├── hooks/             # Custom hooks
├── utils/             # Utility functions
└── App.jsx            # Main app component
```

## Vai trò người dùng

### Admin
- Quản lý người dùng
- Quản lý lớp học
- Quản lý môn học
- Quản lý lịch học
- Xem báo cáo
- Cài đặt hệ thống

### Teacher
- Xem lớp học đang dạy
- Quản lý môn học
- Xem lịch dạy
- Điểm danh học sinh
- Chấm điểm
- Xem báo cáo

### Student
- Xem thông tin lớp học
- Xem môn học
- Xem lịch học
- Xem điểm số
- Xem lịch sử điểm danh

## API Integration

Ứng dụng được thiết kế để tích hợp với backend SMS API. Đảm bảo backend đang chạy trên port 8080 hoặc cập nhật `REACT_APP_API_URL` trong file `.env`.

## Development

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## License

MIT License