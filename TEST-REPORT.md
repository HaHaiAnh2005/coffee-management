# Báo cáo kiểm thử — 28/09/2026

Kết quả mới nhất sau rà soát nhập liệu: **70/70 test đạt**. Xem `INPUT-VALIDATION.md` cho quy tắc 20 mỗi món / 50 cả đơn, họ tên, tiền, liên hệ và phạm vi kiểm thử trình duyệt. Các con số ở các mục bên dưới là lịch sử các đợt trước.

## Cập nhật sau sửa lỗi

- **52/52 test đạt, 0 thất bại, 0 bỏ qua.** Bảy ca lỗi ban đầu đều được chạy lại và đạt.
- Chặn API người dùng và kho bằng token cùng vai trò ADMIN/MANAGER; chặn xóa đơn hàng bằng cùng quyền. Test HTTP kiểm tra người chưa đăng nhập, CUSTOMER, CASHIER, ADMIN, MANAGER và role viết thường.
- Frontend gửi token từ auth store đang dùng. Đăng nhập không còn fallback demo, tự nhận vai trò hoặc chấp nhận mật khẩu sai/mật khẩu thiếu/PIN/mật khẩu mặc định thay cho mật khẩu thật. Tài khoản chưa có mật khẩu bcrypt hợp lệ sẽ không đăng nhập được; không sửa dữ liệu tài khoản hiện có.
- Phiếu kho được validate đầy đủ trước khi ghi: chặn thiếu nguyên liệu, thiếu tồn, tổng xuất từ nhiều dòng cùng nguyên liệu vượt tồn và phiếu rỗng. Tồn kho và phiếu vẫn chưa nằm trong MongoDB transaction; lỗi giữa các lần ghi hoặc nhiều yêu cầu đồng thời vẫn là giới hạn chưa xử lý trong đợt này.
- Giỏ hàng phân biệt ghi chú, gộp lại khi sửa thành món đã có và bảo toàn số lượng/giảm giá.
- ESLint các file test và phần sửa route, middleware, inventory, cart, Axios, Login: đạt. Không dọn toàn bộ lỗi lint có sẵn trong dự án.
- Chưa kiểm thử đầu cuối với trình duyệt/database/thanh toán thật và chưa kiểm toán phân quyền toàn bộ các API khác. Các kết quả bên dưới là lịch sử trước sửa.

## Kết quả

- 13 test ban đầu: đạt toàn bộ.
- Bổ sung 18 test trong `tests/api.test.ts`, `tests/auth.test.ts`, `tests/cart.test.ts`, `tests/inventory.test.ts`.
- Lần chạy cuối: **31 test, 24 đạt, 7 thất bại**, không bỏ qua test.
- `npm run build`: thành công. Vite cảnh báo bundle JavaScript 1.024,36 kB (gzip 292,43 kB), vượt ngưỡng cảnh báo 500 kB.
- `npm run lint`: **193 lỗi, 1 cảnh báo** ở lần kiểm tra ban đầu. Có lỗi kiểu `any`, biến không dùng, khối catch rỗng và quy tắc React Hooks. Đây là kiểm tra tĩnh, không đồng nghĩa có 193 lỗi nghiệp vụ.
- ESLint riêng cho cả 4 file test mới: đạt.

## Lỗi tái hiện được

### 1. Nghiêm trọng: API xóa không yêu cầu đăng nhập (3 test)

Gửi DELETE không có Authorization tới `/api/users/TEST`, `/api/inventory/TEST`, `/api/orders/TEST`.

Mong đợi: 401/403 và không gọi thao tác xóa. Thực tế: 200 và mỗi lần gọi service xóa một lần. Test chạy qua ứng dụng Express, middleware và router thực; phương thức service xóa được mock để không chạm dữ liệu thật. Middleware xác thực và phân quyền vượt qua unit test riêng, nhưng không được gắn vào các route này.

Ưu tiên gắn xác thực/phân quyền phía server và kiểm tra toàn bộ route quản trị. Route guard phía React không bảo vệ API.

### 2. Cao: xuất vượt tồn kho vẫn được chấp nhận (1 test)

Tồn 5, yêu cầu xuất 6. Mong đợi từ chối và không ghi phiếu/tồn kho. Service hiện lưu phiếu trước và dùng `Math.max(0, quantity - requested)` nên chấp nhận, đưa tồn về 0. Test dùng model mock; chưa kiểm tra transaction/concurrency MongoDB thật.

### 3. Cao: xuất nguyên liệu không tồn tại vẫn thành công (1 test)

Lookup nguyên liệu trả null. Mong đợi từ chối phiếu. Thực tế vẫn lưu phiếu và bỏ qua nguyên liệu. Cần kiểm tra đầy đủ các dòng trước khi ghi và bảo đảm cập nhật nhất quán.

### 4. Trung bình: giỏ hàng làm mất ghi chú (1 test)

Thêm cùng sản phẩm/size/đường/đá, nhưng hai ghi chú pha chế khác nhau. Thực tế hai món gộp thành một dòng và chỉ giữ ghi chú đầu tiên.

### 5. Trung bình: sửa món tạo trùng cartItemId (1 test)

Thêm một món size S và một món size L, rồi sửa L thành S. Hai dòng giữ cùng cartItemId. Việc xóa/cập nhật theo ID có thể tác động nhiều dòng. Cần gộp đúng số lượng hoặc bảo đảm định danh dòng duy nhất.

## Phạm vi đã kiểm tra

- HTTP health, hai prefix API, 404 JSON, chặn giá âm qua router thực.
- Token thiếu/sai/hết hạn, token hợp lệ, guard vai trò.
- Tính giá size/topping/số lượng/giảm giá, gộp món, giảm số lượng, chuyển mang về, xóa giỏ.
- Nhập kho, xuất kho đủ tồn và hai tình huống xuất không hợp lệ.
- Các test có sẵn: validation số, model validation, mở ca, coupon phần trăm, xác thực webhook SePay, đối chiếu khoản chuyển, chống xử lý lặp ở mức mock, định giá checkout SePay và chống giả mạo trường xác nhận.

## Chưa xác minh

- Luồng trình duyệt đầu cuối, responsive và thao tác thực tế trên giao diện.
- Đăng ký/đăng nhập và CRUD tích hợp với MongoDB thử nghiệm, index thật, transaction, rollback, tranh chấp đồng thời và tải cao.
- Thanh toán thực/sandbox MoMo, VNPay, ngân hàng SePay; webhook mạng thực.
- Chatbot với Gemini, báo cáo doanh thu, tích điểm/hạng thành viên và toàn bộ vòng đời coupon.

Không kết nối database thật, không nạp `.env` và không gọi dịch vụ thanh toán bên ngoài. Các test đạt không phải chứng nhận ổn định toàn bộ hệ thống. Các test hồi quy vẫn giữ kỳ vọng ban đầu sau khi sửa logic nghiệp vụ.

## Chạy lại

Trong thư mục `C:\QuanCaPheReact\coffee-management`:

```powershell
npm test
npm run build
npm run lint
```

Lệnh runner đã chạy trực tiếp: `node node_modules/tsx/dist/cli.mjs --test tests/*.test.ts`.

Lần chạy mới nhất trả exit code 0 với 52 test đạt; không đánh dấu skip/todo để làm xanh kết quả.
