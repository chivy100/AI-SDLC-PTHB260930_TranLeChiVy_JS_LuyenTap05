# NHẬT KÝ PROMPT AI - ỨNG DỤNG FLASHCARD TỪ VỰNG LẬP TRÌNH
**Đề luyện tập số 05 (AI-Driven JavaScript)**  
**Học viên:** Trần Lê Chí Vỹ  
**Lớp:** AI-SDLC-PTHB260930  
**Repository:** `AI-SDLC-PTHB260930_TranLeChiVy_JS_LuyenTap05`  

---

## 1. Prompt Khởi tạo Dữ liệu & Cấu trúc Nền tảng (Mục 4.1 & 4.9)
```text
Hãy thiết kế cấu trúc dữ liệu và các biến quản lý trạng thái cho ứng dụng Flashcard từ vựng lập trình bằng JavaScript thuần:
- Mỗi thẻ là một object gồm đúng 6 thuộc tính:
  1. id: number (sinh bằng Date.now(), duy nhất)
  2. tu: string (không rỗng, không trùng khi so sánh trim và toLowerCase)
  3. nghia: string (không rỗng)
  4. viDu: string (được phép rỗng)
  5. chuDe: string (không rỗng, ví dụ: "JavaScript", "HTML", "CSS")
  6. daThuoc: boolean (mặc định false)
- Khai báo mảng toàn cục `cards` lưu trữ bộ thẻ.
- Khai báo hằng số `STORAGE_KEY = "flashcards"`.
- Khai báo biến `viTri` (chỉ số thẻ đang xem trong bộ thẻ học), `cheDo` ("hoc" hoặc "danh-sach"), `boLoc` ({ chuDe: "all", chiChuaThuoc: false }).
- Viết 2 hàm tiện ích dùng chung:
  + `loadData()`: đọc mảng thẻ từ localStorage với key STORAGE_KEY, parse JSON. Nếu chưa có dữ liệu, trả về danh sách thẻ mẫu mặc định.
  + `saveData()`: lưu mảng `cards` vào localStorage dạng JSON string.
- Viết hàm `validateCard(tu, nghia, chuDe, idDangSua)` dùng chung cho cả Thêm và Sửa thẻ: kiểm tra rỗng các trường bắt buộc, kiểm tra trùng từ (sau khi trim và toLowerCase, bỏ qua thẻ đang sửa nếu có idDangSua).
- Viết hàm `shuffle(mang)` dùng thuật toán Fisher-Yates trả về mảng mới đã xáo trộn, không làm biến đổi mảng gốc.
```

---

## 2. Prompt Xây dựng Giao diện Chính & Bố cục Responsive (Mục 4.2 & CSS)
```text
Hãy xây dựng mã HTML5 và CSS hiện đại cho ứng dụng Flashcard Từ Vựng theo bố cục:
===== FLASHCARD TỪ VỰNG =====   (Học) (Danh sách)
Chủ đề: [Tất cả v]  [x] Chỉ thẻ chưa thuộc   [Xáo trộn]
        +---------------------------+
        |         variable          |   <- bấm để lật
        +---------------------------+
   [<]        Thẻ 4/20         [>]     [Đã thuộc]
Đã thuộc 8/20 (40%)  | JavaScript: 12 | HTML: 5 | CSS: 3

Yêu cầu kỹ thuật giao diện:
- HTML5 ngữ nghĩa: dùng <header>, <nav>, <main>, <section>, <footer>.
- Giao diện có 2 tab chuyển đổi: Chế độ "Học" (`#view-hoc`) và Chế độ "Danh sách" (`#view-danh-sach`).
- Thẻ học có hiệu ứng lật 3D (flip card) bằng CSS 3D Transforms (`perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, `.is-flipped rotateY(180deg)`).
- Mặt trước hiện từ vựng, nhãn chủ đề, nhãn trạng thái và hướng dẫn phím Space. Mặt sau hiện nghĩa tiếng Việt và khối ví dụ dạng code highlight. Thẻ đã thuộc có viền phát sáng màu xanh ngọc (emerald).
- Nút điều hướng [<] [>] tròn, bộ đếm số thẻ "Thẻ x/y", nút đổi trạng thái [Đã thuộc].
- Thanh thống kê ở footer hiển thị tỉ lệ phần trăm đã thuộc kèm thanh progress bar, cùng các tag đếm số lượng thẻ theo từng chủ đề.
- Thiết kế tông màu tối sang trọng (Deep Slate Dark Mode), font chữ Plus Jakarta Sans & JetBrains Mono, hiệu ứng tương tác mượt mà, hỗ trợ chuẩn responsive trên màn hình điện thoại 375px.
```

---

## 3. Prompt Tính năng 1: Thêm Thẻ Mới (Mục 4.3)
```text
Viết chức năng Thêm thẻ từ vựng vào bộ sưu tập ở chế độ "Danh sách":
- Form gồm các ô: Từ vựng (input text), Nghĩa (textarea), Ví dụ (textarea), Chủ đề (input text liên kết với <datalist> gợi ý các chủ đề đã tồn tại trong danh sách).
- Bấm nút "Thêm":
  + Gọi hàm validateCard() kiểm tra dữ liệu.
  + Nếu 'tu', 'nghia' hoặc 'chuDe' rỗng sau khi trim: hiển thị thông báo lỗi màu đỏ ngay bên dưới ô nhập liệu tương ứng.
  + Nếu 'tu' đã tồn tại trong mảng thẻ (so sánh không phân biệt hoa thường): hiển thị thông báo "Từ này đã có trong bộ thẻ" dưới ô từ vựng.
  + Nếu hợp lệ: tạo object thẻ mới (id: Date.now(), daThuoc: false), thêm vào mảng cards, xóa trắng form, hiện thông báo toast "Thêm thẻ thành công!", lưu vào localStorage và gọi hàm render() cập nhật giao diện và danh sách gợi ý datalist.
```

---

## 4. Prompt Tính năng 2: Học Bằng Thẻ Lật & Điều Hướng (Mục 4.4)
```text
Hiện thực chức năng Học từ vựng bằng thẻ lật (Flashcard Learn Mode):
- Hiển thị từng thẻ một từ danh sách thẻ học `danhSachHoc` tại vị trí `viTri`.
- Bấm vào thẻ thì lật sang mặt sau chứa nghĩa và ví dụ; bấm lần nữa thì lật lại mặt trước (sử dụng classList.toggle("is-flipped")).
- Nút [<] và [>] để chuyển thẻ:
  + Tiến tới: nếu đang ở thẻ cuối cùng thì quay vòng về thẻ đầu tiên.
  + Lùi lại: nếu đang ở thẻ đầu tiên thì quay vòng về thẻ cuối cùng.
  + Mỗi khi chuyển thẻ mới, tự động reset trạng thái thẻ về mặt trước (xóa class is-flipped).
  + Cập nhật nhãn bộ đếm "Thẻ x/y".
- Lắng nghe sự kiện bàn phím toàn cục (keydown):
  + Phím Mũi tên trái (ArrowLeft): lùi lại thẻ trước.
  + Phím Mũi tên phải (ArrowRight): tiến tới thẻ tiếp theo.
  + Phím Space (cách): lật thẻ (ngăn chặn cuộn trang mặc định `e.preventDefault()`).
  + Lưu ý: không kích hoạt phím tắt khi người dùng đang nhập liệu trong ô input/textarea.
- Thẻ đã thuộc (daThuoc === true) có viền màu xanh lá nổi bật và badge "Đã thuộc".
```

---

## 5. Prompt Tính năng 3: Sửa Thẻ & Đánh Dấu Đã Thuộc (Mục 4.5)
```text
Hiện thực chức năng Đánh dấu đã thuộc và Sửa thẻ từ vựng:
1. Đánh dấu đã thuộc (ở chế độ Học):
   - Nút [Đã thuộc] / [Chưa thuộc]: khi bấm vào sẽ đổi trạng thái `daThuoc = !daThuoc` của thẻ đang hiển thị.
   - Lưu ngay vào localStorage qua saveData(), cập nhật lại giao diện và thanh thống kê tức thì.
2. Sửa thẻ (ở chế độ Danh sách):
   - Trong bảng danh sách, mỗi dòng có nút "Sửa".
   - Khi bấm "Sửa": đưa toàn bộ dữ liệu của thẻ đó lên form (từ, nghĩa, ví dụ, chủ đề), lưu id đang sửa vào `dangSuaId`.
   - Tiêu đề form đổi thành "Sửa Thẻ Từ Vựng", nút bấm đổi thành "Lưu thay đổi", hiện nút "Hủy sửa".
   - Khi bấm "Lưu thay đổi": kiểm tra tính hợp lệ bằng `validateCard(tu, nghia, chuDe, dangSuaId)` (bỏ qua chính thẻ đang sửa khi xét trùng từ).
   - Nếu hợp lệ: cập nhật lại dữ liệu của thẻ trong mảng cards, giữ nguyên mã thẻ `id` và trạng thái `daThuoc` ban đầu.
   - Lưu vào localStorage, hiển thị thông báo "Cập nhật thành công!", đưa form về trạng thái Thêm thẻ ban đầu và cập nhật giao diện.
```

---

## 6. Prompt Tính năng 4: Xóa Thẻ (Mục 4.6)
```text
Hiện thực chức năng Xóa thẻ từ vựng ở chế độ Danh sách:
- Mỗi dòng trong bảng có nút "Xóa".
- Khi bấm "Xóa": hiển thị hộp thoại xác nhận `confirm('Xóa từ "' + card.tu + '"?')`.
- Nếu người dùng đồng ý:
  + Loại bỏ thẻ khỏi mảng `cards`.
  + Nếu thẻ bị xóa đang được chọn sửa trong form, tự động reset form.
  + Cập nhật lại bộ lọc; nếu thẻ vừa bị xóa đang được hiển thị ở chế độ Học thì điều chỉnh lại chỉ số `viTri` về thẻ hợp lệ gần nhất, đảm bảo không bị lỗi giao diện hoặc chỉ số ngoài biên.
  + Lưu mảng mới vào localStorage bằng `saveData()`.
  + Hiển thị thông báo toast "Xóa thành công!".
  + Gọi `render()` để làm mới bảng và thẻ học.
```

---

## 7. Prompt Tính năng 5: Lọc Thẻ & Xáo Trộn Ngẫu Nhiên (Mục 4.7)
```text
Hiện thực chức năng Lọc và Xáo trộn thẻ học:
1. Lọc thẻ (`locThe`):
   - Dropdown "Chủ đề": gồm tùy chọn "Tất cả" và danh sách các chủ đề duy nhất lấy tự động từ mảng thẻ.
   - Checkbox "Chỉ thẻ chưa thuộc".
   - Hai điều kiện lọc này kết hợp đồng thời (AND). Kết quả lọc được gán vào mảng `danhSachHoc` dùng cho chế độ Học.
   - Xử lý các trạng thái trống ở chế độ Học:
     + Nếu mảng thẻ gốc rỗng: hiển thị hộp thông báo "Chưa có thẻ nào, hãy thêm từ mới" kèm nút chuyển sang chế độ thêm thẻ.
     + Nếu lọc có checkbox "Chỉ thẻ chưa thuộc" mà không còn thẻ nào: hiển thị "Chúc mừng, bạn đã thuộc hết!".
     + Nếu không tìm thấy thẻ nào theo chủ đề: hiển thị "Không có thẻ phù hợp".
2. Xáo trộn ngẫu nhiên (`xaoTron`):
   - Khi bấm nút "Xáo trộn": gọi hàm `shuffle(danhSachHoc)` để đảo ngẫu nhiên mảng thẻ đang học.
   - Tuyệt đối KHÔNG làm thay đổi thứ tự mảng `cards` gốc và KHÔNG thay đổi dữ liệu trong localStorage.
   - Đặt lại `viTri = 0`, reset thẻ về mặt trước và hiển thị thông báo "Đã xáo trộn bộ thẻ học!".
```

---

## 8. Prompt Tính năng 6: Thống Kê & Tỉ Lệ Thuộc (Mục 4.8)
```text
Hiện thực hàm `tinhThongKe()` và cập nhật giao diện thống kê ở chân trang (Footer):
- Đếm tổng số thẻ (`tongThe = cards.length`).
- Đếm số thẻ đã thuộc (`soDaThuoc = cards.filter(c => c.daThuoc).length`).
- Tính phần trăm đã thuộc = (soDaThuoc / tongThe) * 100, làm tròn số nguyên bằng `Math.round()` (nếu tổng thẻ bằng 0 thì trả về 0%). Tính khi hiển thị, không lưu vào object.
- Hiển thị theo định dạng mẫu: `Đã thuộc [số thẻ đã thuộc]/[tổng số thẻ] ([phần trăm]%)`.
- Thống kê số thẻ theo từng chủ đề: duyệt mảng `cards`, sử dụng một object đếm (ví dụ: `{ JavaScript: 12, HTML: 5, CSS: 3 }`).
- Hiển thị các chip thống kê chủ đề theo định dạng: `| JavaScript: 12 | HTML: 5 | CSS: 3`.
- Gọi hàm cập nhật thống kê ngay sau mọi thao tác Thêm, Sửa, Xóa, Đổi trạng thái thuộc.
```

---

## 9. Prompt Tổng Hợp Hàm & Kiểm Thử Đồng Bộ (Mục 4.9 & 4.10)
```text
Rà soát và hoàn thiện mã nguồn `app.js` bảo đảm tính module và chuẩn mực kỹ thuật:
- Viết hàm `render()` dùng chung điều phối toàn bộ việc vẽ lại giao diện: gọi `locThe()`, `renderThongKe()`, `renderDanhSachChuDe()`, `renderHocCard()` hoặc `renderBangDanhSach()`.
- Gắn đầy đủ event listeners trong sự kiện `DOMContentLoaded`.
- Không sử dụng thư viện bên ngoài; không dùng `alert()` và `prompt()`; chỉ dùng `confirm()` cho thao tác xóa.
- Kiểm tra toàn bộ mã nguồn không phát sinh bất kỳ lỗi đỏ nào trong Developer Console (F12).
```
