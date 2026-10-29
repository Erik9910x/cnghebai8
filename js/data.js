/**
 * MACHINING LAB V2.0 — DATA MODULE (js/data.js)
 * Nội dung học tập & dữ liệu 6 minigame chuẩn SGK Công nghệ 11 Bài 8.
 */

const SLIDES_COUNT = 13;

// 1. Dữ liệu 13 Slide theo Storyboard SGK
const SLIDES_DATA = [
  {
    id: 1,
    badge: "BÀI 8 · CÔNG NGHỆ CƠ KHÍ 11",
    badgeType: "amber",
    title: "MỘT SỐ PHƯƠNG PHÁP<br><em>GIA CÔNG CƠ KHÍ</em>",
    subtitle: "Nhìn nguyên lí · Điều khiển chuyển động · Chọn đúng phương pháp chế tạo chi tiết kim loại trong công nghiệp.",
    note: "Dẫn nhập: Từ động cơ máy bay, khung xe máy đến những chiếc ốc vít siêu nhỏ đều là sản phẩm của ngành cơ khí chế tạo. Hôm nay chúng ta cùng bước vào Machining Lab để giải mã 5 phương pháp gia công cơ bản nhất trong chương trình Công nghệ 11."
  },
  {
    id: 2,
    badge: "TÌNH HUỐNG THỰC TẾ",
    badgeType: "cyan",
    title: "Bạn sẽ chọn <em>phương pháp nào?</em>",
    subtitle: "Mỗi chi tiết có hình dạng hình học và yêu cầu kỹ thuật đặc trưng. Hãy bấm chọn phương pháp tối ưu cho từng trường hợp:",
    note: "Hãy bắt đầu bằng một bài toán thực tế: Khi các kỹ sư nhận được bản vẽ một chi tiết cụ thể, tiêu chí nào quyết định phương pháp gia công? Hãy cùng thử thách trực giác kỹ thuật của các em."
  },
  {
    id: 3,
    badge: "BẢN ĐỒ KIẾN THỨC BÀI 8",
    badgeType: "violet",
    title: "Năm phương pháp <em>gia công cơ khí trọng tâm</em>",
    subtitle: "Học sinh cần nắm chắc bản chất vật lí và chuyển động cơ bản của từng phương pháp:",
    note: "SGK Bài 8 chia các phương pháp gia công cơ khí thành 5 nhóm lớn. Đúc và hàn thuộc nhóm gia công phôi và tạo liên kết, trong khi khoan, tiện, phay thuộc nhóm gia công cắt gọt kim loại bằng dao có phoi."
  },
  {
    id: 4,
    badge: "PHƯƠNG PHÁP I · GIA CÔNG KHÔNG PHOI",
    badgeType: "amber",
    title: "Gia công đúc — <em>Nguyên lí & Quy trình</em>",
    subtitle: "SGK Công nghệ 11 trang 40 — Chế tạo phôi bằng cách điền đầy kim loại lỏng vào lòng khuôn.",
    note: "Đúc là phương pháp chế tạo phôi bằng cách rót kim loại lỏng vào lòng khuôn. Hãy chú ý quy trình đúc gồm 2 nhánh chuẩn bị độc lập trước khi rót kim loại: làm khuôn và nấu chảy kim loại."
  },
  {
    id: 5,
    badge: "PHƯƠNG PHÁP II · TẠO LIÊN KẾT KIM LOẠI",
    badgeType: "coral",
    title: "Gia công hàn — <em>Nguyên lí & Phân loại</em>",
    subtitle: "SGK Công nghệ 11 trang 41 — Nối các chi tiết kim loại bằng cách nung nóng chảy cục bộ mép nối.",
    note: "Hàn là phương pháp nối các chi tiết kim loại với nhau bằng nhiệt. Lưu ý SGK tập trung vào hai phương pháp phổ biến là hàn hồ quang và hàn hơi."
  },
  {
    id: 6,
    badge: "BỐ CỤC MỐI HÀN",
    badgeType: "coral",
    title: "Năm kiểu <em>liên kết hàn tiêu biểu</em>",
    subtitle: "Dựa theo vị trí tương đối giữa các mép nối kim loại (SGK Hình 8.4):",
    note: "SGK nêu rõ 5 kiểu liên kết hàn cơ bản. Một câu hỏi hay gặp: Liên kết chữ T và liên kết góc khác nhau ở điểm nào? Hãy chú ý hiện tượng nhiệt không đều dễ làm cong vênh chi tiết."
  },
  {
    id: 7,
    badge: "PHƯƠNG PHÁP III · GIA CÔNG CẮT GỌT",
    badgeType: "cyan",
    title: "Gia công khoan — <em>Tạo lỗ & Chuyển động cắt</em>",
    subtitle: "SGK Công nghệ 11 trang 41 — Chuyển động cắt gồm 2 chuyển động đồng thời của mũi khoan.",
    note: "Khoan là phương pháp tạo lỗ. Chuyển động cắt gồm 2 chuyển động đồng thời: mũi khoan quay tròn (Vc) và tịnh tiến dọc trục (S). Hãy phân biệt rõ khoan, khoét, doa, taro."
  },
  {
    id: 8,
    badge: "PHƯƠNG PHÁP IV · GIA CÔNG MẶT TRÒN XOAY",
    badgeType: "amber",
    title: "Gia công tiện — <em>Máy tiện & Chuyển động</em>",
    subtitle: "SGK Công nghệ 11 trang 42-43 — Phương pháp cắt gọt chiếm 30-40% khối lượng gia công cơ khí.",
    note: "Tiện là phương pháp gia công cắt gọt thông dụng nhất, chiếm 30-40% khối lượng gia công xưởng. Cốt lõi: Phôi quay tròn (Vc), dao tịnh tiến (S dọc, S ngang, S chéo)."
  },
  {
    id: 9,
    badge: "PHƯƠNG PHÁP V · MẶT PHẲNG VÀ RÃNH",
    badgeType: "cyan",
    title: "Gia công phay — <em>Máy phay & Khả năng công nghệ</em>",
    subtitle: "SGK Công nghệ 11 trang 44 — Đối nghịch với tiện: Dao phay quay tròn, phôi tịnh tiến.",
    note: "Phay đối nghịch với tiện: ở máy phay, dao phay quay tròn là chuyển động chính, còn phôi được kẹp trên bàn máy tịnh tiến. Nhớ callout các tay quay bàn trượt dọc, ngang, đứng."
  },
  {
    id: 10,
    badge: "BẢNG TỔNG HỢP CÔNG NGHỆ",
    badgeType: "violet",
    title: "So sánh <em>năm phương pháp gia công cơ khí</em>",
    subtitle: "Chìa khóa nhận diện chuyển động và mục đích sử dụng từng phương pháp.",
    note: "Bảng so sánh này là chìa khóa để trả lời mọi câu hỏi thi và bài tập vận dụng. Nhấn mạnh sự khác biệt cốt lõi giữa Tiện (Phôi quay) và Phay (Dao quay)."
  },
  {
    id: 11,
    badge: "ĐẤU TRƯỜNG TƯƠNG TÁC · GAME MODULE 1",
    badgeType: "cyan",
    title: "Đấu trường: <em>Rinh điểm liền tay</em>",
    subtitle: "25 câu hỏi thử thách (20 câu SGK + 5 câu Chuyên gia) tích hợp Xúc xắc Random Picker 🎲!",
    note: "Chào mừng các em đến với Đấu trường: Rinh điểm liền tay! Hệ thống gồm 25 câu hỏi phân bậc cùng xúc xắc tương tác mini-game lớp học."
  },
  {
    id: 12,
    badge: "GESTURE TRACKING · HAND AR MODULE 4",
    badgeType: "cyan",
    title: "Hand AR: <em>Pinch & Place dụng cụ gia công</em>",
    subtitle: "Chụm ngón cái & ngón trỏ để gắp dụng cụ ảo và thả vào trạm máy phù hợp (hoặc dùng chuột kéo thả bình thường):",
    note: "Tại Slide 12, chúng ta có công nghệ Hand AR tương tác không chạm! Các em có thể bật webcam để nhận diện cử chỉ chụm ngón tay (pinch) gắp dụng cụ đặt vào đúng trạm gia công. Nếu không có camera, chuột và cảm ứng vẫn hoạt động 100%."
  },
  {
    id: 13,
    badge: "",
    badgeType: "emerald",
    title: "CẢM ƠN MỌI NGƯỜI<br>& CÁC BẠN <em>ĐÃ LẮNG NGHE!</em>",
    subtitle: "",
    note: "Cảm ơn Thầy Cô và các bạn học sinh đã chú ý lắng nghe bài thuyết trình!"
  }
];

// 2. Dữ liệu Hook Scenario (Slide 2)
const HOOK_DATA = [
  {
    title: "Phương pháp đề xuất: TIỆN",
    desc: "Trục truyền động xe máy gồm các bậc tròn xoay và ren vít. <b>Tiện</b> là phương pháp hoàn hảo nhất: phôi quay tròn quanh tâm và các lưỡi dao tiện dọc ($S_d$), ngang ($S_{ng}$) gọt bỏ kim loại thừa để đạt độ đồng tâm rất cao.",
    rule: "NGUYÊN LÍ: PHÔI QUAY + DAO TIẾN"
  },
  {
    title: "Phương pháp đề xuất: ĐÚC",
    desc: "Thân máy động cơ có nhiều vách ngăn phức tạp và áo nước làm mát rỗng bên trong. Không có loại dao cắt gọt nào thò vào gia công khoang rỗng này được; chỉ có <b>Đúc</b> mới điền đầy kim loại lỏng vào lòng khuôn để tạo hình toàn khối.",
    rule: "NGUYÊN LÍ: RÓT KIM LOẠI LỎNG VÀO LÒNG KHUÔN"
  },
  {
    title: "Phương pháp đề xuất: PHAY",
    desc: "Bàn máy cần bề mặt phẳng rộng và các rãnh chữ T để trượt gá êtô. <b>Phay</b> sử dụng dao phay mặt đầu và dao phay rãnh chữ T quay tròn tốc độ cao, phối hợp bàn máy mang phôi tịnh tiến để tạo rãnh phẳng hoàn hảo.",
    rule: "NGUYÊN LÍ: DAO PHAY QUAY + PHÔI TIẾN"
  }
];

// 3. Dữ liệu Module 1: Đấu trường "Rinh điểm liền tay" (Slide 11 - 25 câu hỏi: 20 SGK + 5 Chuyên gia thực nghiệm)
const QUIZ_QUESTIONS = [
  // --- PHẦN 1: 20 CÂU TRONG SÁCH GIÁO KHOA (DỄ - TRUNG BÌNH - KHÁ) ---
  {
    level: "DỄ",
    q: "Phương pháp chế tạo chi tiết bằng cách rót kim loại lỏng vào khuôn để sau khi đông đặc nhận được hình dạng lòng khuôn là gì?",
    opts: ["Gia công Đúc", "Gia công Hàn", "Gia công Tiện", "Gia công Phay"],
    correct: 0,
    exp: "Đúc là rót kim loại lỏng vào lòng khuôn có sẵn; sau khi nguội đông đặc sẽ thu được vật đúc (SGK trang 40)."
  },
  {
    level: "DỄ",
    q: "Đặc điểm chuyển động cắt cốt lõi của phương pháp TIỆN là gì?",
    opts: ["Dao quay tròn, phôi tịnh tiến", "Phôi quay tròn, dao tịnh tiến", "Cả phôi và dao cùng quay", "Dao vừa quay vừa tịnh tiến"],
    correct: 1,
    exp: "Ở máy Tiện: Chuyển động chính là PHÔI QUAY TRÒN quanh trục (Vc), dao tịnh tiến dọc/ngang/chéo (S) (SGK trang 42)."
  },
  {
    level: "DỄ",
    q: "Ở phương pháp PHAY, bộ phận nào thực hiện chuyển động quay tròn chính?",
    opts: ["Phôi gia công", "Bàn trượt dọc", "Dao phay", "Ụ động"],
    correct: 2,
    exp: "Đối với Phay: Chuyển động chính là DAO PHAY QUAY TRÒN (V), phôi kẹp trên bàn máy thực hiện chuyển động tịnh tiến."
  },
  {
    level: "DỄ",
    q: "Mũi khoan ruột gà khi hoạt động thực hiện các chuyển động nào đồng thời?",
    opts: ["Chỉ quay tròn", "Quay tròn quanh trục và tịnh tiến dọc trục", "Chỉ tịnh tiến", "Phôi quay quanh mũi khoan"],
    correct: 1,
    exp: "Mũi khoan ruột gà vừa quay tròn để tạo vận tốc cắt Vc, vừa tịnh tiến dọc trục với lượng chạy dao S để ăn sâu vào phôi."
  },
  {
    level: "DỄ",
    q: "Phương pháp gia công nào dùng nhiệt nung nóng mép chi tiết đến chảy để tạo mối liên kết kim loại vĩnh cửu?",
    opts: ["Gia công Hàn", "Gia công Đúc", "Gia công Phay", "Gia công Tiện"],
    correct: 0,
    exp: "Hàn là phương pháp nối các chi tiết kim loại bằng cách nung nóng cục bộ vùng tiếp xúc đến trạng thái chảy (SGK trang 41)."
  },
  {
    level: "DỄ",
    q: "Dụng cụ dùng để cắt gọt kim loại trên máy tiện vạn năng được gọi là gì?",
    opts: ["Mũi khoan", "Đá mài", "Dao tiện", "Dao phay ngón"],
    correct: 2,
    exp: "Trên máy tiện, dụng cụ cắt gọt là dao tiện (gồm thân dao kẹp trên đài gá và phần lưỡi cắt gọt kim loại)."
  },
  {
    level: "DỄ",
    q: "Sản phẩm hình học đặc trưng và chiếm khối lượng lớn nhất của phương pháp TIỆN là gì?",
    opts: ["Các mặt phẳng rộng", "Các mặt tròn xoay (trụ, côn, ren, định hình)", "Các rãnh chữ T", "Các khoang rỗng áo nước"],
    correct: 1,
    exp: "Tiện chiếm 30-40% khối lượng gia công trong xưởng, chuyên tạo ra các bề mặt tròn xoay đồng tâm (trụ ngoài, trụ trong, mặt côn, ren)."
  },
  {
    level: "TRUNG BÌNH",
    q: "Nguyên công nào dùng để TẠO REN TRONG một lỗ trụ đã được khoan trước?",
    opts: ["Khoét", "Doa", "Taro", "Tiện rãnh"],
    correct: 2,
    exp: "Taro là nguyên công cắt tạo ren trong lỗ trụ; không nhầm lẫn với khoan (tạo lỗ mới), khoét (mở rộng lỗ) hay doa (làm nhẵn tinh)."
  },
  {
    level: "TRUNG BÌNH",
    q: "Năm kiểu liên kết hàn (giáp mối, chồng, chữ T, góc, gấp mép) được phân loại chủ yếu dựa vào tiêu chí nào?",
    opts: ["Loại que hàn sử dụng", "Vị trí tương đối giữa các mép nối chi tiết", "Nhiệt độ ngọn lửa hàn", "Thời gian làm nguội"],
    correct: 1,
    exp: "SGK Hình 8.4 phân loại 5 kiểu liên kết hàn dựa theo sự bố trí hình học và vị trí tương đối giữa các mép nối kim loại."
  },
  {
    level: "TRUNG BÌNH",
    q: "Tại sao thân động cơ đốt trong nhiều khoang rỗng phức tạp luôn được chế tạo phôi bằng ĐÚC thay vì cắt gọt?",
    opts: ["Vì đúc rẻ tiền nhất", "Vì dao cắt gọt không thể thò vào gia công các khoang áo nước rỗng bên trong", "Vì kim loại đúc cứng hơn kim loại rèn", "Vì đúc không sinh nhiệt"],
    correct: 1,
    exp: "Các khoang rỗng áo nước làm mát có hình dáng bên trong cực kỳ ngoằn ngoèo; chỉ có dòng kim loại lỏng điền đầy lòng khuôn mới tạo khối được."
  },
  {
    level: "TRUNG BÌNH",
    q: "Nguyên công nào dùng để MỞ RỘNG ĐƯỜNG KÍNH của một lỗ đã có sẵn sau khi đúc hoặc rèn?",
    opts: ["Khoan", "Khoét", "Taro", "Cắt đứt"],
    correct: 1,
    exp: "Khoét dùng mũi khoét nhiều lưỡi cắt hơn mũi khoan, chuyên dùng mở rộng đường kính lỗ có sẵn để tăng độ chính xác."
  },
  {
    level: "TRUNG BÌNH",
    q: "Để tiện được một đoạn trục côn (mặt nón) trên máy tiện, người thợ thường sử dụng chuyển động chạy dao nào?",
    opts: ["Chạy dao dọc song song tâm phôi", "Chạy dao ngang vuông góc tâm phôi", "Chạy dao chéo nghiêng góc so với tâm phôi", "Chỉ quay mâm cặp không chạy dao"],
    correct: 2,
    exp: "Chạy dao dọc tạo mặt trụ (Sd), chạy dao ngang tạo mặt đầu phẳng (Sng), chạy dao chéo nghiêng góc (Sch) tạo mặt côn."
  },
  {
    level: "TRUNG BÌNH",
    q: "Nhược điểm lớn nhất cần lưu ý khi chế tạo phôi bằng phương pháp ĐÚC TRONG KHUÔN CÁT là gì?",
    opts: ["Không đúc được kim loại màu", "Độ chính xác kích thước và độ bóng bề mặt thấp, thường lẫn xỉ và bavia", "Làm chi tiết bị nhiễm từ", "Khuôn chỉ dùng được 1 lần và rất đắt"],
    correct: 1,
    exp: "Khuôn cát cho độ nhám bề mặt lớn và sai số kích thước cao, do đó vật đúc chỉ là phôi thô, bắt buộc phải qua gia công cắt gọt tinh."
  },
  {
    level: "TRUNG BÌNH",
    q: "Để gia công rãnh chữ T trên bàn máy cơ khí, ta sử dụng dụng cụ và phương pháp nào?",
    opts: ["Dùng máy tiện với dao tiện rãnh", "Dùng máy phay với dao phay rãnh chữ T chuyên dụng", "Dùng máy hàn đắp", "Dùng mũi khoan tâm"],
    correct: 1,
    exp: "Phay rãnh chữ T: đầu tiên phay rãnh đứng bằng dao phay ngón, sau đó dùng dao phay rãnh chữ T (T-slot cutter) để phay mở rộng phần đáy."
  },
  {
    level: "KHÁ",
    q: "Bộ phận nào trên máy tiện vạn năng dùng để đỡ các chi tiết dạng trục dài tránh bị cong khi cắt gọt hoặc dùng để gá mũi khoan?",
    opts: ["Mâm cặp 3 chấu", "Hộp tốc độ trục chính", "Ụ động (ụ sau)", "Bàn trượt dao ngang"],
    correct: 2,
    exp: "Ụ động (ụ sau) lắp mũi tâm đỡ đầu trục dài chống rung và võng khi tiện, hoặc có lỗ côn Morse để lắp mũi khoan tạo lỗ tâm."
  },
  {
    level: "KHÁ",
    q: "Quy tắc an toàn lao động nào là BẮT BUỘC TUYỆT ĐỐI khi người thợ đứng vận hành máy tiện và máy khoan?",
    opts: ["Bắt buộc phải đeo găng tay len/vải dày", "Tuyệt đối KHÔNG đeo găng tay và phải cuốn gọn tóc/áo bảo hộ", "Đeo kính râm khi tiện", "Tắt máy ngay khi mũi khoan đang kẹp trong phôi"],
    correct: 1,
    exp: "Tuyệt đối không đeo găng tay khi làm việc với máy có trục quay (tiện, khoan, phay) vì sợi găng tay rất dễ bị mâm cặp hoặc mũi khoan cuốn vào gây tai nạn nghiêm trọng."
  },
  {
    level: "KHÁ",
    q: "Hai nhánh công việc chuẩn bị ĐỘC LẬP trong quy trình sản xuất đúc trước khi rót kim loại là gì?",
    opts: ["Chuẩn bị mẫu gỗ và Chuẩn bị khuôn kim loại", "Chuẩn bị khuôn đúc và Chuẩn bị kim loại lỏng nóng chảy", "Gia công bavia và Làm nguội vật đúc", "Nhiệt luyện và Kiểm tra khuyết tật"],
    correct: 1,
    exp: "Quy trình đúc gồm 2 nhánh chuẩn bị song song độc lập: (1) Làm khuôn đúc + lõi cát; (2) Nấu chảy kim loại; sau đó mới hợp lại ở bước rót kim loại lỏng."
  },
  {
    level: "KHÁ",
    q: "Trong phương pháp hàn hồ quang tay, nguồn nhiệt sinh ra để làm nóng chảy kim loại mối hàn là do đâu?",
    opts: ["Ngọn lửa cháy giữa khí axetylen và oxy", "Nhiệt lượng cực lớn từ tia hồ quang điện giữa que hàn và vật hàn", "Ma sát quay tốc độ cao", "Tia laser công suất cao"],
    correct: 1,
    exp: "Hàn hồ quang tay tận dụng nhiệt độ cực cao (tới 3000-4000°C) của hồ quang điện phóng giữa đầu que hàn và kim loại cơ bản để làm nóng chảy cục bộ mép nối."
  },
  {
    level: "KHÁ",
    q: "Để tiện khỏa mặt đầu phẳng vuông góc với đường tâm trục của phôi, thợ máy phải sử dụng chuyển động nào?",
    opts: ["Chạy dao dọc song song trục phôi", "Chạy dao ngang vuông góc với tâm phôi", "Chạy dao chéo góc 45 độ", "Đứng yên dao và đẩy ụ động"],
    correct: 1,
    exp: "Chạy dao ngang (Sng) đưa dao di chuyển vuông góc với tâm quay của phôi, gọt bỏ kim loại ở đầu trục để tạo mặt phẳng đầu vuông góc."
  },
  {
    level: "KHÁ",
    q: "Nguyên công nào dùng để GIA CÔNG TINH lỗ trụ đạt độ chính xác kích thước cao và độ nhẵn bóng bề mặt tốt nhất?",
    opts: ["Khoan", "Khoét", "Doa", "Hàn đắp"],
    correct: 2,
    exp: "Doa dùng dao doa có nhiều lưỡi cắt rất mảnh và chính xác, là bước gia công tinh sau khi khoan và khoét để đạt độ bóng cao (Ra nhỏ) và dung sai chặt chẽ."
  },

  // --- PHẦN 2: 5 CÂU HỎI KHÓ - CHUYÊN GIA / THỰC NGHIỆM XƯỞNG (ĐÁNH DẤU ĐỎ) ---
  {
    level: "CHUYÊN GIA",
    isExpert: true,
    q: "[CHUYÊN GIA] Vùng ảnh hưởng nhiệt (HAZ - Heat-Affected Zone) trong mối hàn thép kết cấu dày thường dễ bị nứt nguội và biến giòn cục bộ do nguyên nhân cốt lõi nào?",
    opts: [
      "Do kim loại cơ bản bị cháy hết cacbon",
      "Do gradient nhiệt độ dốc làm nguội nhanh sinh cấu trúc Martensite giòn kèm ứng suất dư co ngót cực lớn",
      "Do điện áp máy hàn hồ quang quá thấp",
      "Do khí trơ bảo vệ Argon bị bay hơi hoàn toàn"
    ],
    correct: 1,
    exp: "🔥 KỸ THUẬT HÀN: Năng lượng hàn nung nóng cục bộ trên 1000°C trong khi khối kim loại xung quanh lạnh đóng vai trò bộ tản nhiệt khổng lồ, làm nguội cực nhanh (tôi tự nhiên) tạo pha Martensite giòn và tích tụ ứng suất dư nguy hiểm gây nứt nguội."
  },
  {
    level: "CHUYÊN GIA",
    isExpert: true,
    q: "[CHUYÊN GIA] Khi tiện tinh đoạn trục thép hợp kim C45 có đường kính D = 50 mm với vận tốc cắt yêu cầu Vc = 157 m/phút, người thợ cần gạt cần số của hộp tốc độ trục chính về giá trị n (vòng/phút) xấp xỉ bằng bao nhiêu?",
    opts: [
      "n ≈ 500 vòng/phút",
      "n ≈ 1000 vòng/phút",
      "n ≈ 1500 vòng/phút",
      "n ≈ 2000 vòng/phút"
    ],
    correct: 1,
    exp: "🔥 ĐỘNG HỌC CẮT GỌT: Áp dụng công thức Vc = (pi * D * n) / 1000 => n = (1000 * Vc) / (pi * D) = (1000 * 157) / (3.1416 * 50) = 157000 / 157.08 ≈ 1000 vòng/phút."
  },
  {
    level: "CHUYÊN GIA",
    isExpert: true,
    q: "[CHUYÊN GIA] Mảnh dao tiện CNC hiện đại (Insert) bằng hợp kim cứng Carbide phủ đa lớp (TiCN + Al2O3 + TiN màu vàng) vượt trội hơn hẳn dao thép gió HSS truyền thống ở đặc tính mấu chốt nào?",
    opts: [
      "Độ dẻo dai chống va đập cao hơn thép gió gấp 10 lần",
      "Duy trì độ cứng nóng (red hardness) đến trên 1000°C và giảm hệ số ma sát mài mòn, cho phép tăng vận tốc cắt lên gấp 4–6 lần",
      "Có từ tính mạnh giúp mút chặt mâm cặp tiện",
      "Có thể mài bén lại dễ dàng bằng dũa cầm tay"
    ],
    correct: 1,
    exp: "🔥 VẬT LIỆU DỤNG CỤ CẮT: Thép gió HSS mất độ cứng ở 550-600°C. Mảnh hợp kim cứng Carbide phủ PVD/CVD (TiN, Al2O3) giữ độ cứng đến 1000-1100°C, cho phép tiện ở tốc độ cắt 200-400 m/phút với tuổi bền dao vượt trội."
  },
  {
    level: "CHUYÊN GIA",
    isExpert: true,
    q: "[CHUYÊN GIA] Để gia công một lỗ trụ chính xác trên phôi thép đặc đạt cấp chính xác cao IT6 và độ nhám bề mặt Ra ≤ 0.4 µm, chuỗi nguyên công gia công cơ khí tối ưu bắt buộc phải là:",
    opts: [
      "Khoan lỗ -> Taro ren -> Đánh bóng bằng giấy ráp",
      "Khoan -> Khoét mở rộng -> Doa thô -> Doa tinh (hoặc Mài lỗ tròn trong)",
      "Khoan một lần duy nhất với mũi khoan ruột gà bước tiến cực chậm",
      "Đúc trực tiếp lỗ đạt IT6 không cần gia công"
    ],
    correct: 1,
    exp: "🔥 TIẾN TRÌNH CÔNG NGHỆ LỖ: Khoan chỉ đạt IT11-IT12 (thô) -> Khoét sửa sai lệch tâm và đạt IT9-IT10 -> Doa thô đạt IT7-IT8 -> Doa tinh hoặc mài tròn trong đạt IT6 với Ra ≤ 0.4 µm."
  },
  {
    level: "CHUYÊN GIA",
    isExpert: true,
    q: "[CHUYÊN GIA] Trong thực tế gia công phay rãnh sâu, khi dao phay ngón phải vươn dài (chiều dài nhô L / đường kính dao D > 4) thường xuất hiện hiện tượng rung động tự kích (Chatter). Biện pháp kỹ thuật xưởng nào sau đây xử lý triệt để và khoa học nhất?",
    opts: [
      "Tăng lượng chạy dao lên gấp đôi để đè nén phôi",
      "Rút ngắn tối đa chiều dài vươn dao L, giảm chiều sâu cắt mỗi lớp ap, chọn dao phay bước răng không đều và hiệu chỉnh tốc độ quay trục chính để tránh vùng cộng hưởng",
      "Tắt hoàn toàn dung dịch tưới nguội làm mát",
      "Nới lỏng êtô kẹp phôi để hấp thụ rung động"
    ],
    correct: 1,
    exp: "🔥 THỰC NGHIỆM RUNG ĐỘNG CẮT (CHATTER): Độ cứng vững uốn của dao tỷ lệ nghịch với L^3. Rút ngắn chuôi kẹp, giảm ap, dùng dao bước me cắt so le (variable helix) và dò tìm vùng tốc độ ổn định (Stability Lobe Diagram) giúp loại trừ hoàn toàn hiện tượng rung chatter."
  }
];

// 4. Dữ liệu Module 2: Drag & Drop "Chuyển phôi đúng trạm"
const DND_CARDS = [
  { id: 1, text: "Thân động cơ rỗng có nhiều khoang áo nước", type: "duc", exp: "ĐÚC: Thân động cơ có kết cấu khoang rỗng phức tạp chỉ tạo hình được bằng lòng khuôn đúc." },
  { id: 2, text: "Dầm thép nhà xưởng nối vĩnh cửu", type: "han", exp: "HÀN: Nối các thanh thép hình thành khung kết cấu bền vững, chịu lực lớn." },
  { id: 3, text: "Trục truyền động xe máy bậc tròn xoay", type: "tien", exp: "TIỆN: Bề mặt tròn xoay đồng tâm là sản phẩm điển hình của phương pháp tiện." },
  { id: 4, text: "Tấm đế máy có rãnh chữ T gá êtô", type: "phay", exp: "PHAY: Dao phay ngón T-slot chuyên dùng phay các rãnh dẫn hướng và rãnh kẹp." },
  { id: 5, text: "Tạo 4 lỗ bu lông xuyên qua tấm thép đặc", type: "khoan", exp: "KHOAN: Mũi khoan ruột gà tạo lỗ tròn hình trụ ban đầu từ phôi đặc." },
  { id: 6, text: "Taro tạo ren M10 trong lỗ có sẵn", type: "khoan", exp: "KHOAN (Taro): Nguyên công taro gia công tạo ren trong lỗ trụ sau khi khoan." },
  { id: 7, text: "Cắt đứt thanh thép tròn và khỏa mặt đầu", type: "tien", exp: "TIỆN: Chạy dao ngang ($S_{ng}$) vuông góc với tâm phôi để tiện khỏa mặt đầu và cắt đứt." },
  { id: 8, text: "Phay phẳng mặt nắp hộp giảm tốc", type: "phay", exp: "PHAY: Dao phay mặt đầu gia công mặt phẳng đạt độ nhẵn cao phục vụ lắp ghép kín khít." }
];

// 5. Dữ liệu Module 3: Sequence Builder "Xếp quy trình đúc"
const SEQUENCE_STEPS = [
  { id: "A", order: 1, branch: 1, text: "Nhánh 1: Chuẩn bị / Làm khuôn đúc & lõi cát" },
  { id: "B", order: 2, branch: 2, text: "Nhánh 2: Chuẩn bị / Nấu chảy kim loại lỏng" },
  { id: "C", order: 3, branch: 0, text: "Bước 3: Rót kim loại lỏng vào lòng khuôn" },
  { id: "D", order: 4, branch: 0, text: "Bước 4: Làm nguội và kết tinh đông đặc trong khuôn" },
  { id: "E", order: 5, branch: 0, text: "Bước 5: Phá khuôn, lấy vật đúc ra ngoài" },
  { id: "F", order: 6, branch: 0, text: "Bước 6: Cắt bỏ đậu rót, bavia, làm sạch và kiểm tra" }
];

// 6. Dữ liệu Module 5: Motion Remote Missions (Slide 13)
const REMOTE_MISSIONS = [
  { id: 1, targetIdx: 3, name: "TIỆN", task: "Gia công trục truyền động xe máy bậc tròn xoay", hint: "Chi tiết có bề mặt tròn xoay quanh trục chính." },
  { id: 2, targetIdx: 0, name: "ĐÚC", task: "Tạo phôi thân động cơ rỗng có khoang áo nước", hint: "Kết cấu rỗng phức tạp, thành mỏng cần rót kim loại lỏng." },
  { id: 3, targetIdx: 1, name: "HÀN", task: "Nối vĩnh cửu 2 dầm thép chữ I tạo khung kết cấu", hint: "Tạo mối liên kết kim loại bền vững không thể tháo rời." },
  { id: 4, targetIdx: 4, name: "PHAY", task: "Gia công mặt phẳng bàn máy và rãnh chữ T gá kẹp", hint: "Dao phay quay tròn tạo mặt phẳng và rãnh trượt." },
  { id: 5, targetIdx: 2, name: "KHOAN", task: "Tạo 4 lỗ bu lông xuyên tâm và taro ren trong", hint: "Mũi khoan ruột gà tạo lỗ trụ tròn ban đầu từ phôi đặc." }
];

// 7. Dữ liệu Module 6: Motion Lab Kinematics Rules
const KINEMATICS_RULES = {
  tien: {
    name: "TIỆN (LATHE)",
    workpieceRot: true,
    toolRot: false,
    workpieceFeed: false,
    toolFeed: true,
    desc: "ĐÚNG NGUYÊN LÍ: Ở máy tiện, PHÔI QUAY TRÒN ($V_c$), DAO TỊNH TIẾN ($S$). Dao có thể chạy dọc, ngang, chéo."
  },
  phay: {
    name: "PHAY (MILLING)",
    workpieceRot: false,
    toolRot: true,
    workpieceFeed: true,
    toolFeed: false,
    desc: "ĐÚNG NGUYÊN LÍ: Ở máy phay, DAO PHAY QUAY TRÒN ($V$), PHÔI KẸP TRÊN BÀN MÁY TỊNH TIẾN ($S$)."
  },
  khoan: {
    name: "KHOAN (DRILLING)",
    workpieceRot: false,
    toolRot: true,
    workpieceFeed: false,
    toolFeed: true,
    desc: "ĐÚNG NGUYÊN LÍ: Ở máy khoan, MŨI KHOAN vừa QUAY TRÒN ($V_c$) vừa TỊNH TIẾN DỌC TRỤC ($S$)."
  }
};

// 8. Danh sách học sinh lớp học chính thức (Đã loại bỏ hòa nhập & nghỉ học)
const CLASS_ROSTER = [
  { id: 1, name: "Lê Đỗ Hồng An" },
  { id: 2, name: "Đoàn Ngọc Trâm Anh" },
  { id: 3, name: "Nguyễn Lê Hải Anh" },
  { id: 4, name: "Nguyễn Lê Tố Anh" },
  { id: 5, name: "Nguyễn Mai Anh" },
  { id: 8, name: "Lưu Gia Bảo" },
  { id: 10, name: "Trương Hạ Minh Châu" },
  { id: 11, name: "Phan Thị Kim Dung" },
  { id: 12, name: "Đào Đức Đạt" },
  { id: 13, name: "Nguyễn Hải Đăng" },
  { id: 14, name: "Hồ Bảo Hân" },
  { id: 15, name: "Trần Gia Hân" },
  { id: 16, name: "Phạm Thị Thu Hiền" },
  { id: 17, name: "Nguyễn Vương Hoàng" },
  { id: 19, name: "Phan Thị Thanh Huyền" },
  { id: 20, name: "Trần Đặng Anh Khoa" },
  { id: 21, name: "Phạm Bảo Khuê" },
  { id: 22, name: "Nguyễn Trần Thiên Kim" },
  { id: 23, name: "Cao Nguyễn Ngọc Linh" },
  { id: 24, name: "Nguyễn Ngọc Thanh Loan" },
  { id: 25, name: "Nguyễn Kim Sa Ly" },
  { id: 26, name: "Nguyễn Ngọc Minh" },
  { id: 27, name: "Nguyễn Gia Nghi" },
  { id: 28, name: "Đặng Hoàng Bảo Ngọc" },
  { id: 29, name: "Huỳnh Cẩm Thiên Ngọc" },
  { id: 30, name: "Vũ Việt Chân Nguyên" },
  { id: 31, name: "Nguyễn Thành Bảo Nhân" },
  { id: 32, name: "Dương Phạm Ngân Phúc" },
  { id: 33, name: "Phạm Nguyên Phước" },
  { id: 34, name: "Nguyễn Trần Đông Phương" },
  { id: 35, name: "Trần Ngọc Bảo Phương" },
  { id: 36, name: "Võ Việt Khánh Quỳnh" },
  { id: 37, name: "Lê Thanh Tâm" },
  { id: 38, name: "Mai Phạm Khai Tâm" },
  { id: 40, name: "Lê Thu Thủy" },
  { id: 41, name: "Nguyễn Anh Thư" },
  { id: 42, name: "Vũ Hà Thương" },
  { id: 43, name: "Lê Ngọc Thủy Tiên" },
  { id: 44, name: "Lưu Ngọc Bảo Tiên" },
  { id: 45, name: "Nguyễn Thị Thủy Tiên" },
  { id: 46, name: "Trần Thủy Tiên" },
  { id: 47, name: "Lê Trần Thu Trang" },
  { id: 48, name: "Dương Tường Vy" }
];

