# ☕ Hệ Thống Quản Lý & Bán Hàng Quán Cà Phê Thông Minh (Coffee Management & POS System)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

[**Tiếng Việt**](README.md) | [**English**](README.en.md)

> **Hệ thống Quản lý Quán Cà Phê** là giải pháp phần mềm toàn diện, hiện đại dành cho chuỗi hoặc quán cà phê, tích hợp liền mạch giữa **Kênh Khách Hàng (Customer Portal)**, **Điểm Bán Hàng Tại Quầy (POS System)**, **Quản Trị Vận Hành (Admin Portal)** và **Trợ Lý Ảo Thông Minh AI (Google Gemini)**.

---

## 📌 Mục Lục

1. [Tổng Quan Dự Án](#-tổng-quan-dự-án)
2. [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
   - [Phân Hệ Khách Hàng (Client Portal)](#1-phân-hệ-khách-hàng-client-portal)
   - [Phân Hệ Bán Hàng Tại Quầy (POS System)](#2-phân-hệ-bán-hàng-tại-quầy-pos-system)
   - [Phân Hệ Quản Trị & Vận Hành (Admin Portal)](#3-phân-hệ-quản-trị--vận-hành-admin-portal)
   - [Trợ Lý Ảo AI Tích Hợp (Gemini AI Chatbot)](#4-trợ-lý-ảo-ai-tích-hợp-gemini-ai-chatbot)
3. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
4. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
5. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
6. [Tài Khoản Mẫu & Phân Quyền (Demo Accounts)](#-tài-khoản-mẫu--phân-quyền-demo-accounts)
7. [Các Lệnh Scripts Chính](#-các-lệnh-scripts-chính)
8. [Tác Giả & Bản Quyền](#-tác-giả--bản-quyền)

---

## 📖 Tổng Quan Dự Án

Dự án được xây dựng theo mô hình **Fullstack Monorepo** hiện đại:
- **Backend (Express + MongoDB)** chạy song hành cùng **Frontend (React + Vite)** trên cùng một tiến trình duy nhất thông qua **Vite Middleware Mode** trên cổng `5173` (hoặc có thể tách chạy độc lập).
- Giao diện được thiết kế hiện đại, mượt mà, tối ưu trải nghiệm người dùng cả trên máy tính để bàn lẫn thiết bị cảm ứng (máy POS tại quầy, máy tính bảng, điện thoại).
- Dữ liệu mẫu (sản phẩm, khu vực bàn, nhân viên, khách hàng, cấu hình) được tự động nạp (**Auto Seed**) ngay khi khởi chạy lần đầu.

---

## ✨ Tính Năng Nổi Bật

### 1. Phân Hệ Khách Hàng (Client Portal)
- **Trang chủ & Giới thiệu**: Trải nghiệm câu chuyện thương hiệu, tin tức sự kiện, không gian quán.
- **Thực đơn trực tuyến (Menu)**:
  - Phân loại rõ ràng theo danh mục (Trà sữa, Kem mây, Cà phê, Trà hoa, Đồ ăn vặt...).
  - Bộ lọc tìm kiếm nhanh theo tên và mức giá.
  - Trang chi tiết món: Tùy chỉnh kích cỡ (Size), mức đường, lượng đá, chọn món kèm (Topping).
- **Giỏ hàng & Đặt món**:
  - Giỏ hàng tiện lợi lưu trữ trạng thái mua hàng tức thì.
  - Đặt hàng & thanh toán linh hoạt (Tiền mặt khi nhận, Chuyển khoản ngân hàng qua mã QR tiện lợi, Cổng VNPay & MoMo).
- **Tài khoản & Hội viên thân thiết (Loyalty & Membership)**:
  - Đăng ký, Đăng nhập, Cập nhật thông tin cá nhân.
  - Tích lũy điểm thưởng theo giá trị hóa đơn.
  - Phân hạng thành viên: **Đồng**, **Bạc**, **Vàng**, **Kim Cương** với các ưu đãi chiết khấu riêng biệt.
  - Xem lịch sử đơn hàng và trạng thái đơn.

---

---

### 2. Phân Hệ Xử Lý Đơn Hàng Trực Tuyến (Online Orders Processing)
- **Quản lý Tiếp nhận & Điều phối Đơn Hàng**: Xử lý toàn diện các đơn hàng đặt trực tuyến từ khách hàng (Giao tận nơi hoặc Mang về).
- **Hỗ trợ Đa Cổng Thanh Toán**: Thanh toán Tiền mặt (COD), Chuyển khoản VietQR, và Cổng thanh toán chuyển hướng MoMo & VNPay.
- **Theo dõi Trạng thái Chế biến**: Điều phối trạng thái đơn từ `Pending` -> `Completed` / `Cancelled`.

---

### 3. Phân Hệ Quản Trị & Vận Hành (Admin Portal)
- **Bảng điều khiển (Dashboard)**:
  - Tổng quan doanh thu theo ngày, tuần, tháng.
  - Thống kê số lượng đơn hàng, số khách phục vụ, các món bán chạy nhất (Top Sellers).
- **Quản lý Thực đơn & Danh mục (Products & Categories)**:
  - Thêm, sửa, xóa món, tải ảnh món ăn, thiết lập giá, mô tả.
  - Bật/tắt trạng thái còn món hoặc tạm hết hàng tức thì.
- **Quản lý Kho Nguyên Liệu & Phiếu Nhập Xuất (Inventory & Receipts)**:
  - Quản lý định mức tồn kho, đơn vị tính, đơn giá vốn của từng nguyên liệu pha chế.
  - Lập **Phiếu Nhập Kho (PNK)** từ nhà cung cấp kèm giá vốn, tự động cộng tồn kho tức thì.
  - Lập **Phiếu Xuất Kho (PXK)** cho quầy pha chế, tự động khấu trừ tồn kho và kiểm tra lượng tồn thực tế.
  - Bản in xem trước chứng từ kho chuyên nghiệp đầy đủ chữ ký Người lập, Người nhận, Thủ kho.
- **Quản lý Nhân sự & Phân quyền (Staff & RBAC)**:
  - Phân quyền theo vai trò rõ ràng: `ADMIN`, `MANAGER`, `CASHIER`, `BARISTA`, `WAITER`.
  - Quản lý mã PIN phê duyệt nội bộ của Quản lý.
- **Quản lý Khách hàng & Hạng thẻ (Customer CRM)**:
  - Quản lý danh sách thành viên, số điểm tích lũy, tổng chi tiêu, thăng hạng thành viên tự động.
- **Quản lý Mã giảm giá (Coupons)**:
  - Tạo chương trình ưu đãi theo %, theo số tiền cố định, giới hạn lượt dùng và ngày hiệu lực.
- **Báo cáo & Xuất dữ liệu (Reports & Export)**:
  - Báo cáo phân tích doanh thu, lợi nhuận.
  - Hỗ trợ xuất dữ liệu ra file Excel (`.xlsx`) phục vụ kế toán.
- **Nhật ký hệ thống (Audit Logs)**:
  - Lưu lại toàn bộ lịch sử các tác vụ quan trọng trong hệ thống để giám sát và kiểm tra định kỳ.
- **Cấu hình Quán (Settings)**:
  - Tùy chỉnh thông tin hóa đơn (Tên quán, Địa chỉ, Hotline, VAT, Tỷ lệ quy đổi điểm thưởng).

---

### 4. Trợ Lý Ảo AI Tích Hợp (Gemini AI Chatbot)
- Tích hợp **Google Gemini 2.0** với khả năng **Function / Tool Calling**:
  - Hỗ trợ tư vấn món theo sở thích, khẩu vị của khách (uống ngọt, thanh mát, ít béo...).
  - Kiểm tra số lượng bàn trống theo thời gian thực.
  - Tra cứu các chương trình khuyến mãi hiện có.
  - Giải đáp thông tin chi nhánh, giờ mở cửa và câu chuyện thương hiệu.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router Dom v7](https://reactrouter.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Data Fetching & Cache**: [TanStack Query v5 (React Query)](https://tanstack.com/query)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons & Date**: [React Icons](https://react-icons.github.io/react-icons/), [Day.js](https://day.js.org/)
- **Excel Export**: [SheetJS (XLSX)](https://sheetjs.com/)

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) (chạy qua `tsx`)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Token) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **AI Engine**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini Flash API)

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
coffee-management/
├── backend/                  # Mã nguồn Back-end (Express API)
│   ├── config/               # Cấu hình kết nối CSDL MongoDB
│   ├── controllers/          # Bộ điều khiển xử lý nghiệp vụ API
│   ├── middleware/           # Middleware xác thực JWT, RBAC, phân quyền
│   ├── models/               # Schema Mongoose (User, Product, Order, Shift, ...)
│   ├── routes/               # Khai báo các endpoints RESTful API
│   ├── seed/                 # Seeder dữ liệu mẫu ban đầu
│   ├── services/             # Logic nghiệp vụ & Tích hợp Gemini AI
│   ├── app.ts                # Khởi tạo Express & gắn Vite Middleware
│   └── server.ts             # Điểm khởi chạy máy chủ Backend
│
├── frontend/                 # Mã nguồn Front-end (React + Vite)
│   ├── src/
│   │   ├── api/              # Cấu hình Axios & lời gọi API
│   │   ├── components/       # Các components tái sử dụng (POS, Shift, Modals, Navbar...)
│   │   ├── layouts/          # Layout chính: MainLayout, AdminLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── admin/        # Giao diện Quản trị (Dashboard, Products, Staff, Reports...)
│   │   │   ├── client/       # Giao diện Khách hàng (Home, Menu, Cart, Profile, Story...)
│   │   │   └── POSPage.tsx   # Giao diện Bán hàng tại quầy POS
│   │   ├── routes/           # Cấu hình đường dẫn & Route Guards (Private, Admin)
│   │   ├── stores/           # Global Store Zustand (Auth, Cart, Shift...)
│   │   ├── types/            # Khai báo TypeScript Interfaces & Types
│   │   ├── App.tsx           # Component gốc ứng dụng
│   │   └── main.tsx          # Điểm gắn kết React DOM
│   └── index.html            # File HTML gốc của Client
│
├── .env                      # File biến môi trường (MongoDB, JWT, Gemini API Key)
├── package.json              # Khai báo dependencies và scripts toàn dự án
├── tsconfig.json             # Cấu hình TypeScript
└── README.md                 # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Môi Trường (Prerequisites)
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản **v18 trở lên** hoặc v20, v22).
- Đã cài đặt và đang bật dịch vụ **MongoDB** (Local `mongodb://localhost:27017` hoặc tài khoản [MongoDB Atlas](https://www.mongodb.com/atlas)).

### 2. Cài Đặt Thư Viện (Dependencies)
Mở cửa sổ dòng lệnh tại thư mục gốc dự án (`coffee-management`) và thực hiện:
```bash
npm install
```

### 3. Cấu Hình Biến Môi Trường (`.env`)
Tạo hoặc kiểm tra file `.env` tại thư mục gốc dự án:
```env
# Cổng chạy ứng dụng
PORT=5173

# Chuỗi kết nối MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/coffee-management

# Môi trường chạy
NODE_ENV=development

# Khóa bảo mật JSON Web Token
JWT_SECRET=coffee_management_super_secret_jwt_key_2026
JWT_EXPIRES_IN=1d

# (Tùy chọn) Khóa Google Gemini AI dùng cho Chatbot thông minh
# Lấy khóa miễn phí tại: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Khởi Chạy Ứng Dụng (Development)
Chạy lệnh duy nhất để khởi động toàn bộ ứng dụng:
```bash
npm run dev
```

Hệ thống sẽ:
1. Tự động kết nối tới cơ sở dữ liệu MongoDB.
2. Kiểm tra và nạp sẵn dữ liệu mẫu (Danh mục, Sản phẩm, Sơ đồ bàn, Nhân viên, Khách hàng) nếu CSDL đang trống.
3. Khởi động Web Server tại địa chỉ:
   - 🌐 **Giao diện Ứng dụng (Web App)**: [http://localhost:5173/](http://localhost:5173/)
   - ⚡ **Backend API Endpoints**: [http://localhost:5173/api/](http://localhost:5173/api/)

---

## 🔑 Tài Khoản Mẫu & Phân Quyền (Demo Accounts)

Hệ thống đã chuẩn bị sẵn các tài khoản demo sau khi seed database:

### 1. Tài Khoản Nhân Viên & Quản Trị (Admin & Staff)
Truy cập trang đăng nhập nhân viên tại: `http://localhost:5173/admin/login`

| Chức vụ | Email Đăng Nhập | Mật khẩu | Mã PIN Ủy Quyền (Override PIN) | Quyền hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Chủ Quán (ADMIN)** | `admin@lauracoffee.vn` | `123456` | `9999` | Toàn quyền hệ thống, báo cáo doanh thu, cài đặt, phân quyền |
| **Quản Lý (MANAGER)** | `manager@lauracoffee.vn` | `123456` | `1234` | Quản lý menu, bàn, nhân viên ca, duyệt hủy đơn / giảm giá |
| **Thu Ngân (CASHIER)** | `cashier@lauracoffee.vn` | `123456` | — | Bán hàng POS, mở/chốt ca làm việc, in hóa đơn |
| **Pha Chế (BARISTA)** | `barista@lauracoffee.vn` | `123456` | — | Xem danh sách món cần làm (KDS), hoàn thành món |
| **Phục Vụ (WAITER)** | `waiter@lauracoffee.vn` | `123456` | — | Xem trạng thái bàn, order món tại bàn |

### 2. Tài Khoản Khách Hàng Thân Thiết (Demo Customers)
Truy cập trang đăng nhập khách hàng tại: `http://localhost:5173/login`

| Tên Khách Hàng | Số Điện Thoại | Hạng Thẻ (Tier) | Điểm Tích Lũy |
| :--- | :--- | :--- | :--- |
| **Nguyễn Thị Mai** | `0901234567` | 💎 **Kim Cương** | 1,250 điểm |
| **Trần Văn Nam** | `0902345678` | 🥇 **Vàng** | 650 điểm |
| **Lê Hoàng Yến** | `0903456789` | 🥈 **Bạc** | 280 điểm |
| **Phạm Quốc Anh** | `0904567890` | 🥉 **Đồng** | 50 điểm |

---

## 📜 Các Lệnh Scripts Chính

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ Fullstack (Express + Vite Middleware) ở chế độ phát triển |
| `npm run dev:frontend` | Chạy riêng biệt frontend Vite |
| `npm run dev:backend` | Chạy riêng biệt backend Express với `tsx watch` |
| `npm run build` | Kiểm tra kiểu TypeScript và đóng gói ứng dụng Frontend ra thư mục `dist` |
| `npm run start` | Khởi chạy backend ở môi trường Production |
| `npm run lint` | Kiểm tra chuẩn code toàn bộ dự án với ESLint |

---

## 💡 Gợi Ý Phát Triển Mở Rộng
- [ ] Tích hợp cổng thanh toán trực tuyến tự động (MoMo, VNPay, ZaloPay, VietQR động).
- [ ] In hóa đơn nhiệt qua giao thức Web Bluetooth hoặc Network Printer (ESC/POS).
- [ ] Gửi thông báo đơn hàng theo thời gian thực (WebSockets / Socket.io).
- [ ] Ứng dụng di động (Mobile App) cho khách hàng quét mã QR tại bàn để tự gọi món (Self-ordering).

---

## 📝 Bản Quyền

Dự án được phát triển phục vụ mục đích học tập, nghiên cứu và triển khai giải pháp quản lý F&B thông minh.  
Chúc bạn có những trải nghiệm tuyệt vời cùng dự án! ☕✨
