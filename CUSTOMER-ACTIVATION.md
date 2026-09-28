# Kích hoạt tài khoản cho khách hàng đã có hồ sơ

## Khách mẫu của dự án demo

Seeder cấp tài khoản CUSTOMER cho 9 hồ sơ mẫu chưa có User, dùng email trong hồ sơ và mật khẩu `123456` (lưu bcrypt). Không cần mã kích hoạt cho các tài khoản mẫu đã được cấp. Không ghi đè tài khoản/mật khẩu đã tồn tại. Khách đăng ký thật giữ mật khẩu riêng. Luồng dưới đây vẫn dành cho hồ sơ khác cần liên kết tài khoản.

1. Đăng nhập quản trị bằng ADMIN hoặc MANAGER, vào **Khách hàng**.
2. Chọn **Kích hoạt** ở dòng khách cần tạo tài khoản. Hồ sơ phải có email và số điện thoại.
3. Xác nhận danh tính khách tại quán, chọn ô xác nhận rồi **Cấp mã kích hoạt**.
4. Khách vào `/register`, nhập đúng email/số điện thoại trong hồ sơ, mật khẩu từ 6 ký tự và mã vừa cấp.
5. Đăng ký thành công sẽ đăng nhập bằng token thật. Tài khoản liên kết với mã khách cũ, không cập nhật điểm, hạng, tổng chi tiêu hoặc tạo hồ sơ Customer mới.

Mã có hiệu lực 30 phút, dùng một lần và chỉ lưu bản băm trong database. Cấp mã mới sẽ thay mã cũ. Không gửi SMS/email tự động; quản trị viên trao mã cho khách đã xác nhận. Nếu database lỗi sau khi tiêu thụ mã mà chưa tạo tài khoản, cần cấp lại mã. Tài khoản đã tồn tại không được đặt lại mật khẩu qua luồng này.

## Kiểm chứng 28/09/2026

- 59/59 test đạt; build thành công (còn cảnh báo bundle lớn).
- Test các trường hợp thiếu mã, sai mã, mã không còn hiệu lực, sai email, tài khoản đã tồn tại và chặn cấp mã khi không đủ quyền.
- Đã thử API với database đang chạy: tạo hồ sơ test, cấp mã bằng admin, đăng ký, đăng nhập đúng quyền CUSTOMER; điểm 680, hạng Kim Cương và tổng chi tiêu 6.800.000 được giữ nguyên. Đăng ký lại bị từ chối.
- Hồ sơ test được giữ lại với ID `ACT-ad8203b82fc243f5a1c0f6e2d29e4f9d`, tên `Khach thu kich hoat`; không thay mật khẩu các khách hàng cũ.
- Chưa kiểm thử thao tác giao diện bằng trình duyệt. Xác nhận danh tính tại quán là thao tác của quản trị viên, không phải xác minh tự động.
