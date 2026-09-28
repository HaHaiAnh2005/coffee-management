# Kết nối SePay

## Cấu hình đang dùng

- Backend: `http://localhost:5173` (kiểm tra PORT khi chạy).
- Webhook: `https://<your-public-backend>/api/payment/sepay-webhook`
- Phương thức: POST, Content-Type: application/json.
- Xác thực: API Key; chép giá trị `SEPAY_WEBHOOK_API_KEY` từ `.env` sang ô API Key của SePay. Không chép phần `SEPAY_WEBHOOK_API_KEY=` hoặc tiền tố `Apikey` vào ô này.
- Tiền vào, chọn đúng tài khoản TPBank nhận tiền. Kiểm tra `SEPAY_ACCOUNT_NUMBER`, `SEPAY_BANK`, `SEPAY_ACCOUNT_NAME` trong `.env` khớp tài khoản đã liên kết.
- Bật tự động gửi lại khi lỗi. Ban đầu tắt bộ lọc mã thanh toán và tùy chọn chỉ gửi khi có mã; backend tự trích mã từ nội dung ngân hàng.
- Khởi động lại `npm run dev` sau khi sửa `.env`. Giữ backend và tunnel chạy. Đổi URL webhook nếu tunnel được cấp tên mới.

## Thử kết nối

1. SePay → Tích hợp → Webhooks → Thêm webhook, điền các mục trên.
2. Gửi thử từ SePay. HTTP 200 + `success: true` chỉ xác nhận endpoint đã nhận thông báo, không chứng minh một đơn đã được thanh toán.
3. Trên website, tạo một đơn mới và chọn VietQR. Sau khi xác nhận, trang hiển thị QR có mã `BB` + 16 ký tự hex riêng cho đơn. Không dùng QR cũ có nội dung chung.
4. Khi nhận giao dịch đúng ngân hàng, tài khoản, số tiền và mã trong nội dung, backend đánh dấu đơn hoàn thành. Website kiểm tra mỗi 5 giây; cũng có nút kiểm tra thủ công.
5. Sai số tiền (kể cả chuyển thừa), sai tài khoản/mã, tiền ra, đơn bị hủy hoặc webhook trùng không hoàn thành thêm đơn nào. Kiểm tra giao dịch thực tế tại SePay/ngân hàng và log `[SePay]` trên server để đối soát.

## Lưu ý triển khai

- API `/api/payment/sepay-orders` tạo đơn chờ và tính tiền từ giá sản phẩm trong database. Giá size theo giỏ hàng hiện tại: S +0, M +6000, L +10000. Database hiện chưa có bảng giá tùy chọn bổ sung; món có tùy chọn cần cửa hàng xác nhận thay vì tin giá gửi từ trình duyệt.
- MongoDB cần tạo được unique sparse index cho `paymentReference` và `sepayTransactionId`. Server chờ index sẵn sàng trước khi nhận thanh toán.
- API Key chỉ nằm ở backend, không đưa vào frontend hoặc commit `.env`.
- Tích hợp này không bổ sung popup QR đã được gỡ trước đó.
- Chưa xác minh giao dịch ngân hàng thật cho đến khi bạn cấu hình webhook bên SePay và thực hiện đối soát thử.

Tài liệu: https://developer.sepay.vn/vi/sepay-webhooks/tao-webhook và https://developer.sepay.vn/vi/sepay-webhooks/tich-hop-webhook
