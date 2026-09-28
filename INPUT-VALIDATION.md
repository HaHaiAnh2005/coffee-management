# Quy tắc nhập liệu và kết quả kiểm tra

Cập nhật 28/09/2026. Quy định cửa hàng: **tối đa 20 cho mỗi món, tối đa 50 cho cả đơn**. Các dòng có cùng mã món nhưng khác size/topping/ghi chú được cộng chung vào giới hạn 20.

| Nhóm | Điều kiện | Nơi áp dụng |
| --- | --- | --- |
| Họ tên người | 2–100 ký tự; chữ Unicode có dấu và khoảng trắng; không chữ số, emoji, dấu câu | Đăng ký, hồ sơ cá nhân, khách hàng, nhân viên, liên hệ, người nhận; API và model User/Customer |
| Số điện thoại | Bắt đầu bằng 0; 10–11 chữ số | Các form liên hệ/cá nhân, checkout, cài đặt, API tương ứng |
| Email | Đúng dạng email, tối đa 254 ký tự | Form có email, API đăng ký/khách/nhân viên |
| Số lượng mua | Số nguyên dương, tối đa 20 mỗi mã sản phẩm, 50 tổng đơn | Thêm/sửa giỏ, gộp size/topping, hai đường import cart dùng cùng store, checkout, API đơn/SePay/MoMo/VNPay, model Order |
| Tiền | Không âm, hữu hạn, không chuỗi giả số, không vượt Number.MAX_SAFE_INTEGER | Giá món, lương, kho, voucher, tổng tiền, giảm giá, mở/đóng ca, tiền thanh toán; NumericInput và middleware API |
| Điểm/lượt dùng | Số nguyên không âm; điều chỉnh điểm phải nguyên dương, không trừ vượt điểm đang có | Quản lý khách/voucher và middleware |
| Kho | Cho phép số lượng thập phân; phiếu nhập/xuất phải dương; không xuất vượt tồn, kể cả lặp nguyên liệu | Form, store kho, service và model |
| Giảm giá phần trăm | 0–100 | Form, middleware và service coupon |
| Mã voucher | 1–30 chữ/số/gạch ngang/gạch dưới, chặn trùng trong danh sách form | Form và API coupon |
| PIN | Đúng 4 chữ số nếu có | Nhân viên và API |
| Số tài khoản | 6–20 chữ số | Cài đặt và API |
| Ngày sinh | Không trong tương lai | Form hồ sơ và middleware |
| Ngày voucher | Ngày hợp lệ; kết thúc không trước bắt đầu nếu gửi cùng payload | Form ngày và middleware |
| Tên món/danh mục/nguyên liệu, lý do, thông tin quán | Không toàn khoảng trắng khi bắt buộc; trường text được chuẩn hóa giới hạn độ dài | Các form đã áp dụng ValidatedInput và middleware; tên món vẫn được có số/ký tự vì không phải họ tên người |
| Tệp ảnh | Phải là image, tối đa 5 MB | ImageDropzone |

`variance` là chênh lệch tiền hệ thống tính, vẫn được âm để thể hiện thiếu quỹ. Số lượng nguyên liệu theo kg/lít vẫn được thập phân. Ô tìm kiếm, mật khẩu và nội dung tự do không áp dụng quy tắc họ tên.

## Kết quả kiểm thử

- **70/70 test đạt**, không skip. Test mới ở `tests/input-rules.test.ts` và `tests/api.test.ts`.
- Build thành công; vẫn có cảnh báo bundle lớn đã có từ trước.
- Test HTTP qua router thực xác nhận tên có số, tiền âm, món thứ 21 và đơn thứ 51 bị trả 400 trước khi ghi dữ liệu/gọi cổng thanh toán.
- Test store kiểm tra sửa/thêm bị từ chối không làm mất giỏ, cộng chung các biến thể và chặn xuất kho vượt tồn từ các dòng lặp.
- Trình duyệt `/register`: `Nguyễn An123`, email sai và điện thoại `-123` hiện lỗi, chặn submit; sửa thành `Nguyễn Thị Ánh`, email đúng và `0912345678` thì lỗi được xóa. Không tạo tài khoản mới trong phép thử này.
- Chưa tự động thao tác đầu cuối từng form quản trị trên trình duyệt; kiểm thử luồng nhập còn lại dựa vào code, validator, store, model và HTTP. Không gọi thanh toán thật.

Chạy lại từ thư mục dự án: `npm test`, `npm run build`.

Một số màn hình quản trị hiện lưu tại state/localStorage hoặc đồng bộ API bất đồng bộ; validation không thay thế việc kiểm tra thành công của thao tác lưu. Chức năng Contact hiện chỉ hiển thị đã gửi tại frontend, chưa có API gửi liên hệ để kiểm thử.
