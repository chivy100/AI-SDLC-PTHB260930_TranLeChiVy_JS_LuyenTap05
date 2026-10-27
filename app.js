/**
 * FLASHCARD TỪ VỰNG - LẬP TRÌNH JAVASCRIPT CƠ BẢN
 * Đề luyện tập số 05 (AI-Driven)
 * 
 * Mã nguồn tuân thủ toàn bộ quy định kỹ thuật & thang điểm chi tiết:
 * 1. Khai báo dữ liệu: Mảng cards, hằng STORAGE_KEY, biến viTri, cheDo, boLoc.
 * 2. Giao diện chính: Bố cục 2 chế độ (Học, Danh sách), đọc từ localStorage, responsive 375px.
 * 3. Chức năng 1 (Thêm thẻ): Datalist, kiểm tra rỗng báo lỗi dưới ô, kiểm tra trùng từ, thông báo.
 * 4. Chức năng 2 (Học thẻ lật): Lật mặt trước/sau (classList.toggle), nút < >, phím mũi tên & Space.
 * 5. Chức năng 3 (Sửa thẻ & Đánh dấu đã thuộc): Đổi trạng thái, đưa lên form sửa giữ nguyên ID.
 * 6. Chức năng 4 (Xóa thẻ): confirm() có tên từ, chuyển thẻ hợp lệ gần nhất.
 * 7. Chức năng 5 (Lọc & Xáo trộn): Lọc chủ đề + chưa thuộc kết hợp, xáo trộn không đổi localStorage.
 * 8. Chức năng 6 (Thống kê): Tỉ lệ đã thuộc %, thống kê theo chủ đề bằng object đếm.
 * 9. Tổ chức chương trình: render(), saveData(), loadData(), validateCard(), shuffle().
 */

// ==========================================================================
// 4.1. KHAI BÁO DỮ LIỆU & HẰNG SỐ
// ==========================================================================
const STORAGE_KEY = "flashcards";

// Dữ liệu mẫu ban đầu để trải nghiệm ngay khi chưa có dữ liệu trong localStorage
const DEFAULT_CARDS = [
  {
    id: 1700000001,
    tu: "variable",
    nghia: "Biến - vùng nhớ dùng để lưu trữ dữ liệu có thể thay đổi trong quá trình thực thi.",
    viDu: "let count = 10;\nconst PI = 3.14;",
    chuDe: "JavaScript",
    daThuoc: false
  },
  {
    id: 1700000002,
    tu: "function",
    nghia: "Hàm - khối mã thực hiện một nhiệm vụ cụ thể, có thể tái sử dụng nhiều lần.",
    viDu: "function greet(name) {\n  return `Xin chào ${name}!`;\n}",
    chuDe: "JavaScript",
    daThuoc: true
  },
  {
    id: 1700000003,
    tu: "flexbox",
    nghia: "Mô hình bố cục một chiều giúp sắp xếp và căn chỉnh các phần tử linh hoạt trong container.",
    viDu: "display: flex;\njustify-content: space-between;\nalign-items: center;",
    chuDe: "CSS",
    daThuoc: false
  },
  {
    id: 1700000004,
    tu: "semantic tag",
    nghia: "Thẻ mang ý nghĩa nội dung rõ ràng cho trình duyệt và lập trình viên (header, main, nav...).",
    viDu: "<header>\n  <nav>Menu</nav>\n</header>",
    chuDe: "HTML",
    daThuoc: true
  },
  {
    id: 1700000005,
    tu: "closure",
    nghia: "Hàm có khả năng ghi nhớ và truy cập vào phạm vi biến (lexical scope) của hàm cha bao bọc nó.",
    viDu: "function outer() {\n  let x = 1;\n  return () => ++x;\n}",
    chuDe: "JavaScript",
    daThuoc: false
  },
  {
    id: 1700000006,
    tu: "grid",
    nghia: "Hệ thống bố cục hai chiều (dòng và cột) mạnh mẽ trong CSS hiện đại.",
    viDu: "display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;",
    chuDe: "CSS",
    daThuoc: false
  }
];

// Khai báo mảng cards và các biến trạng thái
let cards = [];
let viTri = 0;              // Vị trí thẻ đang hiển thị trong bộ thẻ học
let cheDo = "hoc";          // Chế độ: "hoc" hoặc "danh-sach"
let boLoc = {               // Bộ lọc hiện tại
  chuDe: "all",
  chiChuaThuoc: false
};

// Mảng danh sách thẻ đang dùng trong chế độ học (sau khi lọc và xáo trộn)
let danhSachHoc = [];

// Trạng thái đang sửa thẻ (null nếu đang thêm mới, hoặc id thẻ đang sửa)
let dangSuaId = null;

// ==========================================================================
// 4.9. CÁC HÀM TIỆN ÍCH DÙNG CHUNG (STORAGE, SHUFFLE, VALIDATE)
// ==========================================================================

/**
 * Đọc dữ liệu từ localStorage
 * @returns {Array} Mảng các object thẻ từ vựng
 */
function loadData() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Nếu chưa có trong localStorage, nạp dữ liệu mẫu và lưu lại
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
      return [...DEFAULT_CARDS];
    }
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Lỗi khi đọc localStorage:", error);
    return [];
  }
}

/**
 * Lưu mảng cards vào localStorage
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error("Lỗi khi lưu localStorage:", error);
    showToast("Không thể lưu dữ liệu vào trình duyệt!", "error");
  }
}

/**
 * Xáo trộn ngẫu nhiên một mảng (thuật toán Fisher-Yates)
 * Trả về mảng MỚI, KHÔNG làm biến đổi mảng gốc
 * @param {Array} mang 
 * @returns {Array} Mảng mới đã xáo trộn
 */
function shuffle(mang) {
  const ketQua = [...mang];
  for (let i = ketQua.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ketQua[i], ketQua[j]] = [ketQua[j], ketQua[i]];
  }
  return ketQua;
}

/**
 * Kiểm tra tính hợp lệ của dữ liệu thẻ (dùng chung cho Thêm và Sửa)
 * @param {string} tu Từ vựng
 * @param {string} nghia Nghĩa tiếng Việt
 * @param {string} chuDe Chủ đề
 * @param {number|null} idDangSua ID của thẻ đang sửa (bỏ qua khi xét trùng)
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateCard(tu, nghia, chuDe, idDangSua = null) {
  const errors = {
    tu: "",
    nghia: "",
    chuDe: ""
  };
  let isValid = true;

  const tuTrim = tu ? tu.trim() : "";
  const nghiaTrim = nghia ? nghia.trim() : "";
  const chuDeTrim = chuDe ? chuDe.trim() : "";

  // 1. Kiểm tra rỗng
  if (tuTrim === "") {
    errors.tu = "Từ vựng không được để trống";
    isValid = false;
  }

  if (nghiaTrim === "") {
    errors.nghia = "Nghĩa không được để trống";
    isValid = false;
  }

  if (chuDeTrim === "") {
    errors.chuDe = "Chủ đề không được để trống";
    isValid = false;
  }

  // 2. Kiểm tra trùng từ (so sánh sau trim và toLowerCase, bỏ qua thẻ đang sửa)
  if (tuTrim !== "") {
    const tuLower = tuTrim.toLowerCase();
    const isTrung = cards.some(c => {
      if (idDangSua && c.id === idDangSua) {
        return false; // Bỏ qua chính thẻ đang sửa
      }
      return c.tu.trim().toLowerCase() === tuLower;
    });

    if (isTrung) {
      errors.tu = "Từ này đã có trong bộ thẻ";
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Hiển thị thông báo Toast trên giao diện (không dùng alert())
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
let toastTimeout = null;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast-message");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast-notification ${type}`;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.className = "toast-notification hidden";
  }, 3200);
}

// ==========================================================================
// 4.3. CHỨC NĂNG 1: THÊM THẺ
// ==========================================================================
/**
 * Thêm thẻ mới vào bộ từ vựng
 * @param {Object} duLieu { tu, nghia, viDu, chuDe }
 * @returns {boolean} Thành công hay không
 */
function themThe(duLieu) {
  const validation = validateCard(duLieu.tu, duLieu.nghia, duLieu.chuDe, null);
  hienThiLoiForm(validation.errors);

  if (!validation.isValid) {
    return false;
  }

  // Tạo đối tượng thẻ mới đủ 6 thuộc tính chuẩn
  const newCard = {
    id: Date.now(),
    tu: duLieu.tu.trim(),
    nghia: duLieu.nghia.trim(),
    viDu: duLieu.viDu ? duLieu.viDu.trim() : "",
    chuDe: duLieu.chuDe.trim(),
    daThuoc: false
  };

  cards.push(newCard);
  saveData();
  showToast("Thêm thẻ thành công!", "success");
  resetForm();
  render();
  return true;
}

// ==========================================================================
// 4.4. CHỨC NĂNG 2: HỌC BẰNG THẺ LẬT
// ==========================================================================
/**
 * Lật thẻ giữa mặt trước và mặt sau
 */
function latThe() {
  const cardElement = document.getElementById("card-element");
  if (cardElement && danhSachHoc.length > 0) {
    cardElement.classList.toggle("is-flipped");
  }
}

/**
 * Chuyển thẻ học theo hướng (-1: lùi, 1: tới)
 * Có quy tắc quay vòng: cuối -> đầu, đầu -> cuối
 * @param {number} huong 
 */
function chuyenThe(huong) {
  if (danhSachHoc.length === 0) return;

  // Đảm bảo đưa thẻ về mặt trước khi chuyển thẻ
  const cardElement = document.getElementById("card-element");
  if (cardElement) {
    cardElement.classList.remove("is-flipped");
  }

  if (huong === 1) {
    // Tới: nếu ở cuối thì quay về đầu
    viTri = (viTri + 1) % danhSachHoc.length;
  } else if (huong === -1) {
    // Lùi: nếu ở đầu thì quay về cuối
    viTri = (viTri - 1 + danhSachHoc.length) % danhSachHoc.length;
  }

  renderHocCard();
}

// ==========================================================================
// 4.5. CHỨC NĂNG 3: SỬA THẺ & ĐÁNH DẤU ĐÃ THUỘC
// ==========================================================================
/**
 * Đổi trạng thái "Đã thuộc" / "Chưa thuộc" của thẻ đang hiện ở chế độ Học
 */
function danhDauDaThuoc() {
  if (danhSachHoc.length === 0) return;

  const currentCardInDeck = danhSachHoc[viTri];
  if (!currentCardInDeck) return;

  // Tìm thẻ gốc trong mảng cards
  const cardIndex = cards.findIndex(c => c.id === currentCardInDeck.id);
  if (cardIndex !== -1) {
    cards[cardIndex].daThuoc = !cards[cardIndex].daThuoc;
    currentCardInDeck.daThuoc = cards[cardIndex].daThuoc;
    saveData();
    render();
  }
}

/**
 * Đưa dữ liệu thẻ lên form để sửa ở chế độ Danh sách
 * @param {number} id 
 */
function suaThe(id) {
  const targetCard = cards.find(c => c.id === id);
  if (!targetCard) return;

  dangSuaId = targetCard.id;

  // Điền dữ liệu vào form
  document.getElementById("input-card-id").value = targetCard.id;
  document.getElementById("input-tu").value = targetCard.tu;
  document.getElementById("input-nghia").value = targetCard.nghia;
  document.getElementById("input-vidu").value = targetCard.viDu || "";
  document.getElementById("input-chude").value = targetCard.chuDe;

  // Cập nhật giao diện form sang trạng thái Sửa
  document.getElementById("form-title-text").textContent = "Sửa Thẻ Từ Vựng";
  document.getElementById("badge-form-mode").textContent = "Đang sửa";
  document.getElementById("badge-form-mode").className = "badge-form-mode editing";
  document.getElementById("btn-submit-text").textContent = "Lưu thay đổi";
  document.getElementById("btn-cancel-edit").classList.remove("hidden");

  // Xóa các thông báo lỗi cũ nếu có
  xoaLoiForm();

  // Cuộn mượt lên form
  document.getElementById("form-card").scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Lưu thẻ đang sửa
 * @param {Object} duLieu 
 * @returns {boolean}
 */
function luuThe(duLieu) {
  if (!dangSuaId) return false;

  const validation = validateCard(duLieu.tu, duLieu.nghia, duLieu.chuDe, dangSuaId);
  hienThiLoiForm(validation.errors);

  if (!validation.isValid) {
    return false;
  }

  const cardIndex = cards.findIndex(c => c.id === dangSuaId);
  if (cardIndex !== -1) {
    // Giữ nguyên id và daThuoc ban đầu
    cards[cardIndex].tu = duLieu.tu.trim();
    cards[cardIndex].nghia = duLieu.nghia.trim();
    cards[cardIndex].viDu = duLieu.viDu ? duLieu.viDu.trim() : "";
    cards[cardIndex].chuDe = duLieu.chuDe.trim();

    saveData();
    showToast("Cập nhật thành công!", "success");
    resetForm();
    render();
    return true;
  }
  return false;
}

// ==========================================================================
// 4.6. CHỨC NĂNG 4: XÓA THẺ
// ==========================================================================
/**
 * Xóa thẻ khỏi bộ sưu tập (có confirm hỏi xác nhận tên từ)
 * @param {number} id 
 */
function xoaThe(id) {
  const targetCard = cards.find(c => c.id === id);
  if (!targetCard) return;

  // Yêu cầu: "hỏi 'Xóa từ [từ]?'; đồng ý thì xóa."
  const xacNhan = confirm(`Xóa từ "${targetCard.tu}"?`);
  if (!xacNhan) return;

  // Nếu đang sửa chính thẻ này thì hủy sửa
  if (dangSuaId === id) {
    resetForm();
  }

  // Xóa thẻ khỏi mảng cards
  cards = cards.filter(c => c.id !== id);
  saveData();

  // Đảm bảo chế độ Học chuyển sang thẻ hợp lệ gần nhất, không lỗi
  locThe();
  if (viTri >= danhSachHoc.length) {
    viTri = Math.max(0, danhSachHoc.length - 1);
  }

  showToast("Xóa thành công!", "success");
  render();
}

// ==========================================================================
// 4.7. CHỨC NĂNG 5: LỌC VÀ XÁO TRỘN
// ==========================================================================
/**
 * Lọc thẻ theo chủ đề và tùy chọn chỉ thẻ chưa thuộc
 */
function locThe() {
  danhSachHoc = cards.filter(c => {
    // Điều kiện 1: Chủ đề
    const hopChuDe = (boLoc.chuDe === "all") || (c.chuDe.toLowerCase() === boLoc.chuDe.toLowerCase());
    // Điều kiện 2: Chỉ thẻ chưa thuộc
    const hopChuaThuoc = !boLoc.chiChuaThuoc || !c.daThuoc;

    return hopChuDe && hopChuaThuoc;
  });

  // Điều chỉnh lại vị trí hiển thị hợp lệ
  if (viTri >= danhSachHoc.length) {
    viTri = Math.max(0, danhSachHoc.length - 1);
  }
}

/**
 * Xáo trộn ngẫu nhiên thứ tự các thẻ đang học mà không làm thay đổi thứ tự lưu trong localStorage
 */
function xaoTron() {
  if (danhSachHoc.length <= 1) {
    showToast("Cần ít nhất 2 thẻ để xáo trộn!", "info");
    return;
  }

  danhSachHoc = shuffle(danhSachHoc);
  viTri = 0;

  // Đưa thẻ về mặt trước
  const cardElement = document.getElementById("card-element");
  if (cardElement) {
    cardElement.classList.remove("is-flipped");
  }

  showToast("Đã xáo trộn bộ thẻ học!", "info");
  renderHocCard();
}

// ==========================================================================
// 4.8. CHỨC NĂNG 6: THỐNG KÊ
// ==========================================================================
/**
 * Tính toán thống kê: phần trăm đã thuộc và số thẻ theo chủ đề
 * @returns {Object} { soDaThuoc, tongThe, phanTram, theoChuDe }
 */
function tinhThongKe() {
  const tongThe = cards.length;
  const soDaThuoc = cards.filter(c => c.daThuoc).length;
  
  // Phần trăm đã thuộc = số thẻ đã thuộc / tổng số thẻ × 100, làm tròn số nguyên
  const phanTram = tongThe > 0 ? Math.round((soDaThuoc / tongThe) * 100) : 0;

  // Thống kê số thẻ theo từng chủ đề dùng object đếm { JavaScript: 12, HTML: 5, CSS: 3 }
  const theoChuDe = {};
  cards.forEach(c => {
    const cd = c.chuDe ? c.chuDe.trim() : "Khác";
    theoChuDe[cd] = (theoChuDe[cd] || 0) + 1;
  });

  return {
    soDaThuoc,
    tongThe,
    phanTram,
    theoChuDe
  };
}

// ==========================================================================
// 4.9. HÀM RENDER DÙNG CHUNG ĐỂ VẼ LẠI GIAO DIỆN
// ==========================================================================
/**
 * Vẽ lại toàn bộ giao diện từ dữ liệu hiện tại
 */
function render() {
  // 1. Áp dụng bộ lọc để cập nhật danhSachHoc
  locThe();

  // 2. Cập nhật thanh thống kê
  renderThongKe();

  // 3. Cập nhật dropdown bộ lọc chủ đề và datalist form
  renderDanhSachChuDe();

  // 4. Hiển thị chế độ xem tương ứng
  if (cheDo === "hoc") {
    document.getElementById("view-hoc").classList.remove("hidden");
    document.getElementById("view-danh-sach").classList.add("hidden");
    document.getElementById("tab-hoc").classList.add("active");
    document.getElementById("tab-danh-sach").classList.remove("active");
    renderHocCard();
  } else {
    document.getElementById("view-hoc").classList.add("hidden");
    document.getElementById("view-danh-sach").classList.remove("hidden");
    document.getElementById("tab-hoc").classList.remove("active");
    document.getElementById("tab-danh-sach").classList.add("active");
    renderBangDanhSach();
  }
}

/**
 * Hiển thị thẻ ở chế độ Học (xử lý các trạng thái rỗng / đã thuộc hết / không phù hợp)
 */
function renderHocCard() {
  const cardElement = document.getElementById("card-element");
  const statusMsgBox = document.getElementById("hoc-status-msg");
  const statusTitle = document.getElementById("status-title");
  const statusDesc = document.getElementById("status-desc");
  const statusIcon = document.getElementById("status-icon-svg");
  const btnStatusAction = document.getElementById("btn-status-action");
  const counterEl = document.getElementById("card-counter");
  const btnToggleThuoc = document.getElementById("btn-toggle-thuoc");
  const textToggleThuoc = document.getElementById("text-toggle-thuoc");

  // Kiểm tra trường hợp bộ thẻ rỗng hoặc không có thẻ phù hợp
  if (cards.length === 0) {
    // Yêu cầu: Chưa có thẻ nào: hiện “Chưa có thẻ nào, hãy thêm từ mới”.
    cardElement.classList.add("hidden");
    statusMsgBox.classList.remove("hidden");
    statusIcon.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    statusTitle.textContent = "Chưa có thẻ nào, hãy thêm từ mới";
    statusDesc.textContent = "Bạn có thể chuyển sang tab Danh sách để thêm thẻ từ vựng hoặc nạp lại bộ từ mẫu.";
    btnStatusAction.textContent = "Thêm từ mới ngay";
    btnStatusAction.classList.remove("hidden");
    btnStatusAction.onclick = () => chuyenCheDo("danh-sach");

    counterEl.textContent = "Thẻ 0/0";
    btnToggleThuoc.classList.add("hidden");
    return;
  }

  if (danhSachHoc.length === 0) {
    // Có thẻ trong hệ thống nhưng không có thẻ nào khớp bộ lọc
    cardElement.classList.add("hidden");
    statusMsgBox.classList.remove("hidden");
    btnStatusAction.classList.add("hidden");

    // Kiểm tra xem có phải do đã thuộc hết thẻ trong bộ lọc hay không
    if (boLoc.chiChuaThuoc) {
      statusIcon.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      statusTitle.textContent = "Chúc mừng, bạn đã thuộc hết!";
      statusDesc.textContent = "Bạn đã ghi nhớ toàn bộ thẻ trong phạm vi lọc này. Hãy thử bỏ chọn 'Chỉ thẻ chưa thuộc' để ôn lại nhé.";
    } else {
      statusIcon.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      statusTitle.textContent = "Không có thẻ phù hợp";
      statusDesc.textContent = "Không tìm thấy thẻ nào thỏa mãn tiêu chí tìm kiếm hiện tại.";
    }

    counterEl.textContent = "Thẻ 0/0";
    btnToggleThuoc.classList.add("hidden");
    return;
  }

  // Có thẻ hợp lệ để hiển thị
  statusMsgBox.classList.add("hidden");
  cardElement.classList.remove("hidden");
  btnToggleThuoc.classList.remove("hidden");

  // Đảm bảo viTri hợp lệ
  if (viTri >= danhSachHoc.length) viTri = 0;
  const currentCard = danhSachHoc[viTri];

  // Đổ dữ liệu mặt trước
  document.getElementById("card-word").textContent = currentCard.tu;
  document.getElementById("card-topic-front").textContent = currentCard.chuDe;
  document.getElementById("card-status-front").textContent = currentCard.daThuoc ? "Đã thuộc" : "Chưa thuộc";

  // Đổ dữ liệu mặt sau
  document.getElementById("card-meaning").textContent = currentCard.nghia;
  document.getElementById("card-topic-back").textContent = currentCard.chuDe;
  document.getElementById("card-status-back").textContent = currentCard.daThuoc ? "Đã thuộc" : "Chưa thuộc";

  const exampleWrapper = document.getElementById("card-example-wrapper");
  const exampleCode = document.getElementById("card-example");
  if (currentCard.viDu && currentCard.viDu.trim() !== "") {
    exampleWrapper.style.display = "block";
    exampleCode.textContent = currentCard.viDu;
  } else {
    exampleWrapper.style.display = "none";
  }

  // Dấu hiệu nhận biết thẻ đã thuộc: viền xanh và class .is-memorized
  if (currentCard.daThuoc) {
    cardElement.classList.add("is-memorized");
    btnToggleThuoc.classList.add("memorized");
    textToggleThuoc.textContent = "Chưa thuộc";
    btnToggleThuoc.title = "Bấm để đánh dấu thành Chưa thuộc";
  } else {
    cardElement.classList.remove("is-memorized");
    btnToggleThuoc.classList.remove("memorized");
    textToggleThuoc.textContent = "Đã thuộc";
    btnToggleThuoc.title = "Bấm để đánh dấu đã thuộc thẻ này";
  }

  // Cập nhật số thứ tự thẻ: Thẻ x/y
  counterEl.textContent = `Thẻ ${viTri + 1}/${danhSachHoc.length}`;
}

/**
 * Hiển thị bảng dữ liệu ở chế độ Danh sách
 */
function renderBangDanhSach() {
  const tbody = document.getElementById("cards-table-body");
  const emptyMsg = document.getElementById("table-empty-msg");
  const totalCountEl = document.getElementById("total-cards-count");

  totalCountEl.textContent = cards.length;
  tbody.innerHTML = "";

  if (cards.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  cards.forEach((card, index) => {
    const tr = document.createElement("tr");

    // STT
    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;
    tr.appendChild(tdIndex);

    // Từ vựng
    const tdTu = document.createElement("td");
    tdTu.className = "word-cell";
    tdTu.textContent = card.tu;
    tr.appendChild(tdTu);

    // Nghĩa
    const tdNghia = document.createElement("td");
    tdNghia.textContent = card.nghia;
    tr.appendChild(tdNghia);

    // Ví dụ
    const tdViDu = document.createElement("td");
    tdViDu.textContent = card.viDu || "—";
    if (card.viDu) {
      tdViDu.className = "code-font";
    }
    tr.appendChild(tdViDu);

    // Chủ đề
    const tdChuDe = document.createElement("td");
    const tag = document.createElement("span");
    tag.className = "topic-tag";
    tag.textContent = card.chuDe;
    tdChuDe.appendChild(tag);
    tr.appendChild(tdChuDe);

    // Trạng thái
    const tdStatus = document.createElement("td");
    const statusBadge = document.createElement("span");
    statusBadge.className = `table-badge-status ${card.daThuoc ? "thuoc" : "chua"}`;
    statusBadge.textContent = card.daThuoc ? "Đã thuộc" : "Chưa thuộc";
    tdStatus.appendChild(statusBadge);
    tr.appendChild(tdStatus);

    // Thao tác (Sửa, Xóa)
    const tdActions = document.createElement("td");
    tdActions.style.textAlign = "center";
    tdActions.innerHTML = `
      <div class="table-actions">
        <button type="button" class="btn btn-table btn-table-edit" onclick="suaThe(${card.id})" title="Sửa thẻ">
          Sửa
        </button>
        <button type="button" class="btn btn-table btn-table-delete" onclick="xoaThe(${card.id})" title="Xóa thẻ">
          Xóa
        </button>
      </div>
    `;
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

/**
 * Hiển thị số liệu thống kê ở footer
 */
function renderThongKe() {
  const stats = tinhThongKe();

  // Đã thuộc 8/20 (40%)
  const statsTextEl = document.getElementById("stats-memorized-text");
  statsTextEl.textContent = `Đã thuộc ${stats.soDaThuoc}/${stats.tongThe} (${stats.phanTram}%)`;

  const progressFill = document.getElementById("stats-progress-fill");
  progressFill.style.width = `${stats.phanTram}%`;

  // Thống kê theo chủ đề: | JavaScript: 12 | HTML: 5 | CSS: 3
  const topicsContainer = document.getElementById("stats-topics");
  topicsContainer.innerHTML = "";

  const topicsEntries = Object.entries(stats.theoChuDe);
  if (topicsEntries.length > 0) {
    topicsEntries.forEach(([chude, soLuong]) => {
      const chip = document.createElement("span");
      chip.className = "topic-stat-chip";
      chip.innerHTML = `<span class="topic-stat-name">${chude}:</span> <span class="topic-stat-count">${soLuong}</span>`;
      topicsContainer.appendChild(chip);
    });
  } else {
    topicsContainer.innerHTML = `<span class="text-muted">Chưa có chủ đề</span>`;
  }
}

/**
 * Cập nhật danh sách chủ đề trong dropdown bộ lọc và datalist gợi ý của form
 */
function renderDanhSachChuDe() {
  const selectChuDe = document.getElementById("select-chude");
  const datalist = document.getElementById("datalist-chude");

  // Lấy tập hợp các chủ đề duy nhất
  const uniqueTopics = Array.from(new Set(cards.map(c => c.chuDe.trim()))).filter(Boolean);

  // Cập nhật select lọc
  const currentSelected = boLoc.chuDe;
  selectChuDe.innerHTML = `<option value="all">Tất cả</option>`;
  uniqueTopics.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.textContent = topic;
    if (topic.toLowerCase() === currentSelected.toLowerCase()) {
      opt.selected = true;
    }
    selectChuDe.appendChild(opt);
  });

  // Cập nhật datalist gợi ý cho ô nhập chủ đề
  datalist.innerHTML = "";
  uniqueTopics.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic;
    datalist.appendChild(opt);
  });
}

// ==========================================================================
// CÁC HÀM XỬ LÝ FORM & SỰ KIỆN GIAO DIỆN
// ==========================================================================

/**
 * Chuyển đổi giữa chế độ Học và Danh sách
 * @param {'hoc'|'danh-sach'} mode 
 */
function chuyenCheDo(mode) {
  cheDo = mode;
  render();
}

/**
 * Hiển thị lỗi bên dưới các ô nhập liệu tương ứng
 * @param {Object} errors { tu, nghia, chuDe }
 */
function hienThiLoiForm(errors) {
  const errorTu = document.getElementById("error-tu");
  const errorNghia = document.getElementById("error-nghia");
  const errorChuDe = document.getElementById("error-chude");

  const inputTu = document.getElementById("input-tu");
  const inputNghia = document.getElementById("input-nghia");
  const inputChuDe = document.getElementById("input-chude");

  errorTu.textContent = errors.tu || "";
  errorNghia.textContent = errors.nghia || "";
  errorChuDe.textContent = errors.chuDe || "";

  if (errors.tu) inputTu.classList.add("is-invalid"); else inputTu.classList.remove("is-invalid");
  if (errors.nghia) inputNghia.classList.add("is-invalid"); else inputNghia.classList.remove("is-invalid");
  if (errors.chuDe) inputChuDe.classList.add("is-invalid"); else inputChuDe.classList.remove("is-invalid");
}

/**
 * Xóa thông báo lỗi form
 */
function xoaLoiForm() {
  hienThiLoiForm({ tu: "", nghia: "", chuDe: "" });
}

/**
 * Reset form về trạng thái Thêm thẻ ban đầu
 */
function resetForm() {
  dangSuaId = null;
  document.getElementById("form-card").reset();
  document.getElementById("input-card-id").value = "";

  document.getElementById("form-title-text").textContent = "Thêm Thẻ Từ Vựng Mới";
  document.getElementById("badge-form-mode").textContent = "Thêm mới";
  document.getElementById("badge-form-mode").className = "badge-form-mode";
  document.getElementById("btn-submit-text").textContent = "Thêm thẻ";
  document.getElementById("btn-cancel-edit").classList.add("hidden");

  xoaLoiForm();
}

// ==========================================================================
// KHỞI TẠO VÀ LẮNG NGHE SỰ KIỆN (DOM & KEYBOARD)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Đọc dữ liệu từ localStorage khi mở trang
  cards = loadData();

  // 2. Gắn sự kiện chuyển tab
  document.getElementById("tab-hoc").addEventListener("click", () => chuyenCheDo("hoc"));
  document.getElementById("tab-danh-sach").addEventListener("click", () => chuyenCheDo("danh-sach"));

  // 3. Gắn sự kiện bộ lọc chủ đề
  document.getElementById("select-chude").addEventListener("change", (e) => {
    boLoc.chuDe = e.target.value;
    viTri = 0;
    render();
  });

  // 4. Gắn sự kiện checkbox "Chỉ thẻ chưa thuộc"
  document.getElementById("check-chua-thuoc").addEventListener("change", (e) => {
    boLoc.chiChuaThuoc = e.target.checked;
    viTri = 0;
    render();
  });

  // 5. Gắn sự kiện nút "Xáo trộn"
  document.getElementById("btn-xao-tron").addEventListener("click", () => {
    xaoTron();
  });

  // 6. Gắn sự kiện lật thẻ khi bấm vào thẻ
  document.getElementById("card-element").addEventListener("click", () => {
    latThe();
  });

  // 7. Gắn sự kiện nút điều hướng thẻ [<] và [>]
  document.getElementById("btn-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    chuyenThe(-1);
  });

  document.getElementById("btn-next").addEventListener("click", (e) => {
    e.stopPropagation();
    chuyenThe(1);
  });

  // 8. Gắn sự kiện nút "Đã thuộc" / "Chưa thuộc"
  document.getElementById("btn-toggle-thuoc").addEventListener("click", (e) => {
    e.stopPropagation();
    danhDauDaThuoc();
  });

  // 9. Gắn sự kiện gửi form (Thêm / Lưu thẻ)
  document.getElementById("form-card").addEventListener("submit", (e) => {
    e.preventDefault();

    const duLieu = {
      tu: document.getElementById("input-tu").value,
      nghia: document.getElementById("input-nghia").value,
      viDu: document.getElementById("input-vidu").value,
      chuDe: document.getElementById("input-chude").value
    };

    if (dangSuaId) {
      luuThe(duLieu);
    } else {
      themThe(duLieu);
    }
  });

  // 10. Gắn sự kiện nút Hủy sửa
  document.getElementById("btn-cancel-edit").addEventListener("click", () => {
    resetForm();
  });

  // 11. Xóa viền đỏ cảnh báo khi người dùng gõ phím
  ["input-tu", "input-nghia", "input-chude"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      el.classList.remove("is-invalid");
      const errEl = document.getElementById("error-" + id.replace("input-", ""));
      if (errEl) errEl.textContent = "";
    });
  });

  // 12. Lắng nghe sự kiện bàn phím (Mục 4.4)
  // Phím mũi tên trái/phải chuyển thẻ, phím cách để lật thẻ
  document.addEventListener("keydown", (e) => {
    // Không bắt phím khi đang nhập liệu trong ô input/textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
      return;
    }

    // Chỉ thực hiện khi đang ở chế độ học
    if (cheDo === "hoc") {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        chuyenThe(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        chuyenThe(1);
      } else if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        latThe();
      }
    }
  });

  // 13. Vẽ giao diện lần đầu tiên
  render();
});
