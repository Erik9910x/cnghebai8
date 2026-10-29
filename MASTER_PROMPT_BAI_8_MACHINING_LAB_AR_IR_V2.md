# MASTER PROMPT V2.0 — MACHINING LAB
## POWERPOINT HIGH-END + INTERACTIVE ARTIFACT + HAND AR + MOTION REMOTE

**Môn học:** Công nghệ 11 — Công nghệ cơ khí  
**Bài:** Bài 8 — Một số phương pháp gia công cơ khí  
**Mục tiêu đầu ra:** Một bộ trình bày có thể dạy học thật, kết hợp PowerPoint biên tập chỉn chu với một artifact tương tác để học sinh tự chơi, mô phỏng và thực hành.  
**Ngôn ngữ:** Tiếng Việt.  
**Phiên bản đặc tả:** 2.0 — nâng cấp từ prompt PowerPoint Bài 8, bổ sung game engine nhẹ, Hand AR và Motion Remote.

---

# PHẦN A — KẾT QUẢ PHÂN TÍCH NGUỒN ĐƯỢC CUNG CẤP

## A1. Nguồn và cơ chế đã quan sát được

### 1. `index.html` — presentation HTML đã dùng trước đây

Các cơ chế đáng tái sử dụng về mặt ý tưởng và kỹ thuật:

- Stage trình chiếu 1280 × 720 có scale theo viewport.
- Điều hướng qua lại, thanh tiến trình, bộ đếm slide, phím tắt, chế độ toàn màn hình, bảng overview và speaker notes.
- Chuyển cảnh dạng wipe, reveal nội dung theo nhịp, nền động tinh tế và hỗ trợ giảm chuyển động.
- Game trắc nghiệm nhiều lựa chọn: tính điểm, chuỗi trả lời đúng, phản hồi theo câu, hiệu ứng ăn mừng, màn hình kết quả và chơi lại.
- Game kéo-thả thẻ vào vùng phân loại: kiểm tra đúng/sai, giải thích, trạng thái hoàn thành và khởi động lại.
- Game kéo-thả có lựa chọn bật camera; cử chỉ chụm ngón cái và ngón trỏ được dùng để cầm/thả thẻ.
- Có layout demo nhúng nội dung web qua iframe với hướng xử lí khi nội dung ngoài không mở được.

Đây là những pattern kiến trúc và tương tác, không phải lí do để sao chép chủ đề, tên riêng, logo, ảnh hay nội dung không liên quan đến Bài 8. Khi xây bài mới, thay toàn bộ nội dung game mẫu bằng kiến thức cơ khí.

### 2. `Hand AR/Hand AR ( Demo).html` — hand tracking

Những gì code đang thể hiện:

- Camera chạy trong trình duyệt.
- Dùng MediaPipe Hands, nhận diện tối đa một bàn tay và 21 điểm mốc.
- Vẽ skeleton/các điểm mốc trên lớp phủ, hiển thị trạng thái tracking và cử chỉ.
- Nhận biết trạng thái mở tay và pinch/chụm ngón cái–ngón trỏ dựa trên khoảng cách hai điểm.
- Có bật/tắt camera, reset, bật/tắt skeleton và phản hồi trực quan khi pinch.

Giới hạn phải giữ đúng khi mô tả:

- Code hiện tại là hand tracking kết hợp overlay 2D. Nó **không** tự động định vị mặt bàn/vật thể trong thế giới thật, không phải hệ thống AR world-anchoring hoàn chỉnh, không có nhận dạng vật thể cơ khí thực tế.
- Camera thường yêu cầu `localhost` hoặc HTTPS, sự cho phép rõ ràng của người dùng và thư viện/model có thể tải được. Không được giả vờ camera sẽ hoạt động trong mọi môi trường Artifact hoặc khi mở trực tiếp từ `file://`.
- Cần một phương thức thay thế bằng chuột, bàn phím hoặc cảm ứng khi camera không khả dụng.

### 3. `Remote IR/` — OpenWii-style Remote Link Demo

Những gì project cung cấp:

- Dashboard trên máy tính; điện thoại mở trang controller.
- Ghép nối bằng QR/địa chỉ mạng nội bộ.
- Nút điều khiển vật lý dạng số trên màn hình: D-pad, A, B/back, −, HOME, +, 1 và 2.
- Dữ liệu orientation (alpha/beta/gamma), một số dữ liệu accelerometer/motion và button commands được gửi qua Socket.IO.
- Relay LAN bằng Node.js, Express, Socket.IO và QRCode; hỗ trợ tối đa bốn controller/player slots.
- Báo trạng thái kết nối, slot người chơi, sensor/latency và chế độ chỉ dùng nút khi motion không khả dụng.
- Motion sensor trên điện thoại thường cần HTTPS/secure context; quyền sensor có thể cần thao tác tương tác trên điện thoại.

**Làm rõ thuật ngữ:** dù thư mục có tên `Remote IR`, code đang đọc cảm biến chuyển động/độ nghiêng của điện thoại và truyền qua Wi-Fi/LAN; không thấy hồng ngoại (infrared emitter/receiver) được dùng làm đường truyền. Trong prompt, gọi chế độ này là **IR-style Motion Remote** theo cách đặt tên của nhóm, đồng thời diễn giải đúng là remote điều khiển bằng cảm biến quán tính/chuyển động. Không tạo game dựa trên giả định có phần cứng hồng ngoại.

**Giới hạn quan trọng:** remote demo hiện là lớp ghép nối và chuyển tiếp input, không phải game engine. Cần tạo dashboard/game state nhận input và định nghĩa luật chơi. Không được tuyên bố game đã chạy end-to-end với điện thoại nếu chưa thực sự khởi động server và kiểm tra.

## A2. Kết luận thiết kế

Có thể phát triển **5 game/module chính và 1 chế độ mô phỏng thực hành**. Không nhất thiết phải tạo sáu ứng dụng riêng biệt; tốt nhất là một artifact có menu chọn chế độ, dùng chung scoring, visual system, hướng dẫn, trạng thái và nút chơi lại.

| Module | Cơ chế lấy cảm hứng | Học sinh làm gì? | Mức triển khai |
|---|---|---|---|
| 1. Quiz “Ca làm 60 giây” | Quiz trong `index.html` | Trả lời nhanh, tích điểm và chuỗi đúng | Core — luôn chạy bằng chuột/bàn phím |
| 2. “Chuyển phôi đúng trạm” | Drag-and-drop trong `index.html` | Kéo tình huống/dụng cụ về Đúc, Hàn, Khoan, Tiện hoặc Phay | Core — chuột/cảm ứng; có thể bật pinch |
| 3. “Xếp quy trình đúc” | Pattern kéo-thả và phản hồi | Sắp các bước theo thứ tự, xem giải thích | Core — chạy độc lập |
| 4. “Pinch & Place — Hand AR” | MediaPipe hand tracking | Chụm ngón tay để gắp thẻ và thả vào trạm máy phù hợp | Enhanced — camera/HTTPS hoặc localhost; có fallback |
| 5. “Điều khiển xưởng — Motion Remote” | Remote Link, QR, button và sensor relay | Nghiêng điện thoại để điều khiển con trỏ/chọn trạm; dùng A/B/D-pad để xác nhận | Enhanced — Node.js + cùng LAN + HTTPS cho motion; có fallback |
| 6. “Motion Lab — Khoan/Tiện/Phay” | Mô phỏng 2D/2.5D mới | Bật/tắt chuyển động quay/tiến, tìm sơ đồ chuyển động đúng và quan sát kết quả | Core — mô phỏng, không điều khiển máy thật |

Đây là bản đồ tích hợp đề xuất dựa trên cơ chế trong code, không có nghĩa tất cả game đã được xây sẵn trong file nguồn.

---

# PHẦN B — MASTER PROMPT THỰC THI

## 0. VAI TRÒ

Bạn là một nhóm sản phẩm đa chuyên môn gồm:

1. **Instructional designer:** xây mạch bài học, kiểm tra mức độ hiểu và thiết kế hoạt động lớp học.
2. **Industrial art director:** tạo ngôn ngữ thị giác cơ khí cao cấp, không giống template bài giảng phổ thông.
3. **PowerPoint engineer:** xây slide chỉnh sửa được, kiểm soát typography, spacing, layer, speaker notes, transitions và render.
4. **Frontend/game developer:** tạo artifact HTML tương tác có trạng thái, luật chơi, tính điểm, phản hồi và khả năng reset.
5. **Computer-vision integrator:** triển khai pinch-to-grab dựa trên hand landmarks nếu môi trường cho phép.
6. **Realtime-input engineer:** tích hợp điện thoại làm motion remote qua LAN khi có thể chạy server.
7. **QA reviewer:** xác minh kiến thức, kiểm thử luồng chơi, kiểm tra khả năng truy cập và báo cáo trung thực các giới hạn.

Nhiệm vụ là tạo một bộ tài liệu thực hành bài **“Bài 8 — Một số phương pháp gia công cơ khí”** cho học sinh Công nghệ 11. Bài học phải vừa có PowerPoint trình bày, vừa có nơi để học sinh thực sự tương tác, thử sai, nhận phản hồi và nhìn thấy chuyển động được mô phỏng.

**Không chỉ viết ý tưởng hoặc mô tả thiết kế.** Trong môi trường có khả năng tạo file, hãy tạo các artifact và mã nguồn yêu cầu bên dưới. Nếu một chức năng không thể chạy trong runtime hiện tại, hãy tạo phiên bản fallback trung thực và ghi rõ điều kiện triển khai nâng cao.

## 1. DELIVERABLES BẮT BUỘC

### 1.1. PowerPoint

Tên gợi ý:

`Bai_8_Machining_Lab_AR_IR.pptx`

Yêu cầu:

- 14 slide, tỷ lệ 16:9.
- Có thể chỉnh sửa text, shapes, sơ đồ, bảng và phần lớn thành phần bố cục.
- Có speaker notes cho người thuyết trình.
- Gồm điểm dừng tương tác có chủ ý; không nhồi mọi game lên cùng một slide.
- Có link/QR tới artifact khi URL thật đã sẵn sàng. Không tạo QR giả, không đưa `localhost` hoặc URL chưa triển khai vào QR rồi gọi là dùng được.
- PowerPoint vẫn có nội dung sư phạm hoàn chỉnh nếu không có internet, không mở được iframe, camera hoặc điện thoại.

### 1.2. Interactive Artifact

Tên gợi ý:

`Bai_8_Machining_Lab.html`

Đây là deliverable tương tác quan trọng nhất bên cạnh PowerPoint.

Yêu cầu:

- Một giao diện web responsive có menu game/lab, hướng dẫn ngắn, màn hình chơi, feedback, điểm số, kết quả và nút chơi lại.
- Các module Core chạy bằng chuột, cảm ứng và bàn phím, không cần camera hoặc server.
- Hand AR và Motion Remote là chế độ tăng cường, không phải điều kiện để chơi các module cơ bản.
- Có chế độ “Trình chiếu” (mở game toàn vùng nội dung, ít chrome UI) và “Thực hành” (menu, hướng dẫn, điểm và reset).
- Dữ liệu người chơi/chấm điểm có thể lưu cục bộ trong phiên hoặc localStorage tùy thích hợp; không gửi dữ liệu cá nhân lên dịch vụ ngoài.
- Có màn hình kết quả cuối: câu đúng, điểm, những kiến thức cần xem lại và nút chơi lại.
- Tối thiểu 5 game/module chính và 1 mô phỏng Motion Lab được mô tả ở Phần 5.
- Nếu dùng thư viện ngoài cho camera, ghi rõ nguồn, điều kiện mạng và phương án khi thư viện không tải được. Không để core game phụ thuộc thư viện camera.

### 1.3. Gói Motion Remote (nếu runtime cho phép tạo nhiều file)

Tên gợi ý:

`Bai_8_Motion_Remote/` hoặc `Bai_8_Motion_Remote.zip`

Bộ file nên gồm:

- `server.js`
- `package.json` và lockfile tương ứng
- `public/index.html` — game dashboard
- `public/controller.html` — phone controller
- `public/controller.js` và `public/controller.css` nếu tách riêng
- `README.md` — cách cài, khởi chạy, ghép nối, xử lí lỗi
- `start.bat` và `start-http.bat` nếu môi trường Windows là mục tiêu
- `QA_REPORT.md` — trạng thái test thật và những phần chưa thể test

Không bao gồm `node_modules/` trong gói bàn giao, trừ khi có lí do cụ thể. Không tái sử dụng hoặc phát hành private key/certificate của bản ZIP người dùng gửi. Tạo certificate phát triển mới khi khởi chạy, hoặc yêu cầu người dùng tự thiết lập certificate phù hợp. Không nhúng secret vào HTML, JS hoặc output.

### 1.4. Preview và báo cáo

Nếu công cụ hỗ trợ, xuất thêm:

- `Bai_8_Machining_Lab.pdf` — preview tĩnh của slide.
- `Bai_8_Machining_Lab_QA.md` — các kiểm tra đã chạy, giới hạn còn lại và cách chạy artifact.
- Contact sheet hình ảnh các slide hoặc screenshot artifact nếu có thể thực sự render được.

Không nói rằng đã chạy slide show, camera, LAN remote, animation hoặc QR end-to-end nếu chưa kiểm thử thực tế.

## 2. NGUỒN ƯU TIÊN VÀ QUY TẮC TRUNG THỰC

### 2.1. Nguồn nội dung

1. **Nguồn kiến thức:** SGK *Công nghệ 11 — Công nghệ cơ khí*, Bài 8, trang in 40–44 và các hình 8.1–8.10 được người dùng cung cấp trước đó.
2. **Nguồn UX/UI:** `index.html` hiện có.
3. **Nguồn Hand AR:** `Hand AR ( Demo).html` trong ZIP.
4. **Nguồn Motion Remote:** project `Remote IR/` trong ZIP.
5. Mọi kiến thức hoặc phần mở rộng ngoài các file trên phải được đánh dấu rõ là mở rộng/đề xuất, không gán cho SGK hoặc code gốc.

### 2.2. Nội dung SGK phải xuất hiện

**Đúc**
- Rót vật liệu lỏng vào khuôn; khi nguội và đông đặc, vật đúc nhận hình dạng lòng khuôn.
- Quy trình minh họa có chuẩn bị/làm khuôn, chuẩn bị vật liệu nóng chảy, rót, làm nguội và lấy vật đúc.
- Đặc điểm: tạo được hình dạng/kết cấu phức tạp; có thể tạo vật đúc ở nhiều quy mô; thường dùng tạo phôi; độ chính xác nhìn chung không cao bằng các phương pháp gia công tinh.
- Các phương pháp được nêu trong bài gồm khuôn cát, mẫu chảy, đúc áp lực, đúc li tâm và đúc liên tục.

**Hàn**
- Nối các chi tiết bằng cách nung nóng vùng nối để hình thành mối hàn sau khi vật liệu đông đặc/kết tinh.
- Hàn hồ quang và hàn hơi/hàn khí là hai phương pháp được mô tả trọng tâm.
- Có năm kiểu liên kết: chồng, giáp mối, chữ T, góc, gấp mép.
- Ưu điểm: có thể nối chi tiết/vật liệu phù hợp, tạo kết cấu phức tạp và mối nối kín; hạn chế cần nhắc là nhiệt không đều có thể gây cong vênh.
- MAG/TIG chỉ đưa vào phần mở rộng nhỏ nếu có chỗ; không lấn át nội dung chính.

**Khoan**
- Dụng cụ thông dụng là mũi khoan ruột gà.
- Chuyển động: mũi khoan quay đồng thời tịnh tiến.
- `V_c` — vận tốc cắt, m/phút; `S` — lượng chạy dao, mm/vòng, theo nội dung đã xác định từ bài.
- Khái niệm có liên quan: khoét mở rộng lỗ, doa gia công chính xác lỗ, taro tạo ren trong.
- Không nhầm các nguyên công liên quan này thành cùng một thao tác.

**Tiện**
- Chuyển động đặc trưng trong bài: phôi quay, dao tịnh tiến.
- Máy tiêu biểu: máy tiện vạn năng/CNC.
- Nhãn máy tiện vạn năng ở sơ đồ: hộp tốc độ trục chính, mâm cặp, bàn gá dao, ụ động và đế máy.
- Thông số gồm vận tốc cắt `V_c`; chạy dao ngang `S_ng`, dọc `S_d`, chéo `S_ch` theo ký hiệu được sử dụng trong bản SGK.
- Công thức chạy dao chéo cần đối chiếu cách in trong bản SGK trước khi đưa lên slide; nếu dùng dạng vector vuông góc thì ghi đúng công thức đã được xác minh. Không tự đổi ký hiệu hoặc bịa công thức.
- Có thể gia công các bề mặt tròn xoay, mặt đầu, mặt côn, ren và một số hình dạng phù hợp với máy/dao.

**Phay**
- Dao quay; phôi tịnh tiến theo phương dọc/ngang/thẳng đứng.
- Thông số trong SGK gồm tốc độ cắt `V`, chiều sâu cắt `t` và lượng chạy dao `S`. Giữ **đơn vị đúng như bản SGK đã cung cấp**, không tự sửa theo thói quen kỹ thuật khác; nếu đơn vị không thể xác nhận khi thực hiện, đánh dấu cần kiểm tra chứ không đoán.
- Máy phay đứng vạn năng có các bộ phận được chỉ trên Hình 8.9: trục chính, động cơ, tay quay bàn trượt ngang, bảng điều khiển, tay quay bàn trượt dọc, tay quay bàn trượt đứng và đế máy.
- Ví dụ khả năng gia công: mặt phẳng, rãnh chữ nhật/bán nguyệt/chữ T, bề mặt định hình; một số nguyên công khác tùy máy, gồm khoan/khoét/doa và các khả năng CNC được sách nêu.

Nếu bản nguồn hoặc hình sách đọc được khác bất kì dòng nào ở trên, **nguồn SGK trực tiếp được ưu tiên**, ghi nhận sai khác và chỉnh prompt/spec theo nguồn. Không dùng bản tóm tắt làm lí do lấn át trang sách gốc.

### 2.3. Tránh bịa

- Không bịa mức độ chính xác, tốc độ cắt, lượng chạy dao, dung sai, công suất, thời gian sản xuất hoặc dữ liệu năng suất.
- Không giả vờ mô phỏng nhiệt, lực cắt, phoi hay động lực học máy thật nếu chỉ dùng animation 2D.
- Gắn nhãn cho mô phỏng: **“Minh họa nguyên lí — không phải điều khiển máy thật.”**
- Không gọi Hand AR là AR định vị không gian 3D.
- Không gọi Motion Remote là thiết bị hồng ngoại.
- Không tuyên bố kết nối bốn điện thoại thành công nếu chưa chạy thử bốn controller thực tế.

## 3. CREATIVE DIRECTION — MACHINING LAB

### 3.1. Ý tưởng

**Tên trải nghiệm:** `MACHINING LAB — Xưởng cơ khí tương tác`  
**Thông điệp:** `Nhìn nguyên lí. Điều khiển chuyển động. Chọn đúng phương pháp.`

Cảm giác thiết kế: industrial editorial, technical instrument panel, cinematic workshop, precision tools, high-end exhibit kiosk. Trông như một phòng lab công nghệ được thiết kế chỉn chu, không phải bài thuyết trình mặc định hoặc game arcade quá rối.

Nhịp trình bày: mở đầu tạo tò mò → nhìn thấy 5 phương pháp → phân tích nguyên lí → tương tác → mô phỏng → nhiệm vụ vận dụng.

### 3.2. Palette thống nhất

Đây là palette đề xuất cho thiết kế mới, **không phải mã màu được trích từ file nguồn**.

| Token | Màu | Vai trò |
|---|---|---|
| `Graphite` | `#101318` | Nền tối, bề mặt panel |
| `Off-white` | `#F5F4F1` | Nền sáng, nội dung dài |
| `Violet` | `#7546A3` | Nhận diện chương/phương pháp |
| `Amber` | `#F3B43F` | Điểm quan trọng, quy trình, đáp án đúng |
| `Sensor cyan` | `#63E8FF` | Dữ liệu live, tracking, motion remote |
| `Coral` | `#D96B55` | Sai/hạn chế/cảnh báo |
| `Muted` | `#AEB5C0` | Chú thích, text phụ trên nền tối |
| `Line` | `#303640` | Lưới, viền và phân vùng |

Không dùng toàn bộ accent đồng thời. Amber là điểm nhấn kiến thức; cyan chỉ dành cho sensor/live input; coral cho sai/lỗi; violet là màu định danh chương/nhóm card.

### 3.3. Typography

- Ưu tiên Be Vietnam Pro hoặc Aptos/Arial tương thích.
- Tiêu đề slide: 28–36 pt; cover 38–48 pt.
- Nội dung: 18–24 pt; chú thích không dưới 14–16 pt nếu không bắt buộc.
- Kí hiệu/công thức đặt trong vùng rõ ràng, không để chỉ số dưới vỡ dòng.
- Artifact: dùng system sans-serif dễ đọc, chữ UI tối thiểu 14 px; khu vực chơi tối ưu cho màn chiếu và màn laptop.
- Tối đa 2 font family; không dùng font giả sci-fi khó đọc.

### 3.4. Hình ảnh

- Ưu tiên ảnh SGK khi cần giữ đúng mô hình/bộ phận; có thể vẽ lại bằng vector nếu nhãn và hình học vẫn đúng.
- Dùng ảnh máy thật/ảnh minh họa công nghiệp cho hero visual, không giao cho ảnh AI trách nhiệm hiển thị đúng nhãn cơ khí.
- Tất cả nhãn, số callout, mũi tên, trục và kí hiệu cần dựng bằng text/vector riêng để chỉnh sửa được.
- Mô phỏng chuyển động nên dùng SVG/Canvas/DOM shapes có trục, hướng quay, mũi tên tiến dao và trạng thái bật/tắt có thể nhìn ra ngay.
- Tránh ảnh “cyberpunk factory”, tia lửa trang trí quá mức, sai cấu tạo máy hoặc ảnh nền lấn nội dung.

## 4. STORYBOARD POWERPOINT — 14 SLIDE

Mục tiêu thời lượng 10–12 phút nếu có demo AR/IR trực tiếp. Nếu thiết bị không sẵn sàng, chuyển sang fallback 8–10 phút. Không để một game chiếm quá nhiều thời gian lớp.

### Slide 01 — Cover: “MACHINING LAB”

- Text: `BÀI 8` / `MỘT SỐ PHƯƠNG PHÁP GIA CÔNG CƠ KHÍ` / `Công nghệ 11 · Công nghệ cơ khí`.
- Hero image: chi tiết kim loại/bánh răng được gia công, bề mặt kim loại chân thực, nền graphite, ánh sáng amber tinh tế.
- Subtitle: `Nhìn nguyên lí. Điều khiển chuyển động. Chọn đúng phương pháp.`
- Animation: reveal tên bài và một đường sáng chạy dọc chi tiết; không dùng fly-in rối.
- Notes: dẫn nhập bằng câu hỏi “Nhìn một chi tiết hoàn chỉnh, làm sao biết nó được tạo hình và gia công bằng cách nào?”.

### Slide 02 — Hook: “Bạn chọn phương pháp nào?”

- Hiển thị một tình huống thực tế: lỗ trên phôi, trục tròn xoay, rãnh chữ T, hai thanh kim loại cần nối hoặc vật có hình dạng tạo bằng khuôn.
- Mời lớp chọn một trong các phương pháp; chỉ reveal đáp án sau khi nhận phản hồi.
- Thể hiện nút `MỞ GAME 01` mở đúng module trong `Bai_8_Machining_Lab.html` hoặc một QR/link đã xác minh.
- Không dùng QR giả khi chưa có URL cuối.

### Slide 03 — Map: năm phương pháp chính

Năm tile: `ĐÚC` · `HÀN` · `KHOAN` · `TIỆN` · `PHAY`.

Mô tả ngắn:
- Đúc — rót vật liệu lỏng vào khuôn.
- Hàn — tạo mối nối.
- Khoan — tạo lỗ.
- Tiện — phôi quay, dao tiến.
- Phay — dao quay, phôi tiến.

Dùng 5 icon/sơ đồ khác nhau; nhãn không được chỉ phân biệt bằng màu.

### Slide 04 — I. Gia công đúc

- Định nghĩa ngắn và sơ đồ quy trình.
- Thể hiện hai nhánh chuẩn bị: khuôn và vật liệu nóng chảy, rồi nhập vào bước rót, nguội/đông đặc, lấy vật đúc.
- Nêu đặc điểm và ví dụ phương pháp đúc được SGK đề cập.
- Callout “Hình dạng phức tạp — độ chính xác nhìn chung không cao”.
- Button/QR `THỬ: XẾP QUY TRÌNH ĐÚC` mở module 3.

### Slide 05 — II. Gia công hàn

- Định nghĩa hàn.
- So sánh hai vùng minh họa: hàn hồ quang và hàn hơi/hàn khí.
- Nhấn đúng nguồn nhiệt/nguyên lí ở mức phổ thông.
- Nếu nhắc MAG/TIG, đặt vào box “Mở rộng” nhỏ.

### Slide 06 — Năm kiểu liên kết hàn

- Sơ đồ vector: chồng, giáp mối, chữ T, góc, gấp mép.
- Ưu điểm/hạn chế tóm gọn; nhấn cong vênh do nhiệt không đều.
- Mini-poll: “Kiểu liên kết nào có hình dạng gần chữ T?”; reveal ngắn.

### Slide 07 — III. Gia công khoan

- Hình máy khoan/mũi khoan ruột gà, callout các bộ phận cần thiết.
- Animation hai chuyển động: quay và tịnh tiến của mũi khoan.
- Chip thông số `V_c` và `S` với đúng đơn vị của SGK.
- Dải phân biệt: khoan / khoét / doa / taro.

### Slide 08 — IV. Gia công tiện

- Hình máy tiện vạn năng, đánh số năm bộ phận trong bài: hộp tốc độ trục chính, mâm cặp, bàn gá dao, ụ động, đế máy.
- Chuyển động: phôi quay; dao tiến dọc/ngang/chéo.
- Hiện thông số `V_c`, `S_ng`, `S_d`, `S_ch` theo nguồn.
- Công thức chỉ xuất hiện sau khi giải thích từng kí hiệu; công thức phải được đối chiếu với bản SGK thật trước khi xuất.

### Slide 09 — V. Gia công phay

- Hình máy phay đứng vạn năng; callout đủ các bộ phận được sách đánh số.
- Chuyển động: dao quay, phôi tiến theo trục thích hợp.
- Chip `V`, `t`, `S` giữ đúng đơn vị SGK.
- Ví dụ hình học: mặt phẳng, rãnh chữ T, rãnh bán nguyệt, bề mặt định hình.

### Slide 10 — So sánh năm phương pháp

Tạo ma trận dễ đọc với cột:

`Phương pháp` | `Điều gì chuyển động/thay đổi?` | `Mục đích điển hình` | `Dấu hiệu nhận biết`.

- Đúc: vật liệu lỏng đi vào khuôn, sau đó đông đặc.
- Hàn: tạo mối nối.
- Khoan: mũi khoan quay và tiến.
- Tiện: phôi quay, dao tiến.
- Phay: dao quay, phôi tiến.

Không biến bảng thành trang văn bản; một ô tối đa 2–3 dòng.

### Slide 11 — Game arena: “Ca làm 60 giây”

- Giới thiệu scoring, câu hỏi tốc độ, chuỗi trả lời đúng.
- Mở module 1 trong artifact; nếu có thể nhúng bằng webview/iframe trong môi trường trình chiếu thì vẫn phải có nút mở tab mới.
- PowerPoint fallback: trình bày một tình huống và dùng click để hiện đáp án.

### Slide 12 — Hand AR: “Pinch & Place”

- Hình minh họa 21 điểm bàn tay và một thẻ ảo được gắp.
- Kịch bản demo: dùng cử chỉ chụm để chọn thẻ “mũi khoan”, “dao tiện” hoặc “dao phay” và thả vào đúng trạm.
- Cảnh báo nhỏ: `Camera là tùy chọn · luôn có chế độ chuột/cảm ứng`.
- Có nút `MỞ HAND AR LAB` và hướng dẫn xin quyền camera.
- Không tuyên bố đây là AR world tracking.

### Slide 13 — Motion Remote: “Điều khiển xưởng bằng điện thoại”

- Minh họa QR pairing, điện thoại, dashboard và các trạm Đúc/Hàn/Khoan/Tiện/Phay.
- Điều khiển đề xuất: nghiêng điện thoại di chuyển tâm ngắm; D-pad chọn/navigate; A xác nhận; B/back quay lại hoặc reset; +/- đổi mức mô phỏng nếu có ý nghĩa.
- Chỉ cho hoạt động nếu app remote đã được cấu hình và test. Nếu chưa, hiển thị demo local bằng bàn phím/chuột, không dựng QR giả.
- Ghi rõ: `Điều khiển mô phỏng học tập, không điều khiển máy thật.`

### Slide 14 — Challenge cuối: “Chọn tuyến gia công hợp lí”

- Tình huống: đề xuất phương án cho một chiếc giá sách treo tường bằng kim loại, hoặc một trong các nhiệm vụ đơn giản đã học.
- Học sinh cần xác định mục tiêu từng công đoạn và giải thích lựa chọn; không ép một quy trình duy nhất nếu đề không quy định đủ chi tiết.
- Chốt 5 dấu hiệu nhận diện và một exit ticket: `Khác nhau cốt lõi giữa tiện và phay là gì?`
- QR/link đến artifact nếu đã triển khai; lời cảm ơn và credits nguồn.

### Luật chung cho PowerPoint

- Mỗi slide có một ý chính và tối đa 3–5 nhóm thông tin.
- Speaker notes khoảng 2–4 câu, tự nhiên, không đọc lại toàn bộ chữ.
- Transition 0,4–0,7 giây; dùng Fade/Morph/Wipe có chủ đích, không phải slide nào cũng đổi hiệu ứng.
- Không sử dụng animation làm nội dung khó đọc khi xuất PDF.
- Không đặt nguyên game engine hoặc toàn bộ code vào slide.

## 5. SPEC CHI TIẾT CHO 6 MODULE TƯƠNG TÁC

## MODULE 1 — QUIZ “CA LÀM 60 GIÂY”

**Mục tiêu:** nhận diện nhanh phương pháp qua tình huống và chuyển động.

### Luật chơi

- 6–8 câu trong một vòng; câu ngắn, mỗi câu 4 đáp án tối đa.
- Gợi ý scoring: 100 điểm cho đáp án đúng, bonus streak +20 mỗi lần đúng liên tục sau đáp án đúng đầu tiên; có thể đặt giới hạn thời gian 15–20 giây/câu, nhưng thời gian phải đủ để đọc trên màn chiếu.
- Hiện trạng thái câu, tổng điểm, chuỗi đúng, feedback và lời giải ngắn.
- Có nút “Câu tiếp”, “Chơi lại” và “Về menu”.
- Phím 1–4 chọn đáp án, Enter đi tiếp, Escape quay lại menu nếu phù hợp.

### Ví dụ câu hỏi

1. “Mục tiêu là rót vật liệu lỏng vào khuôn để tạo hình.” → Đúc.
2. “Mục tiêu là nối hai chi tiết bằng mối hàn.” → Hàn.
3. “Mũi khoan quay đồng thời tịnh tiến.” → Khoan.
4. “Phôi quay trong khi dao tịnh tiến.” → Tiện.
5. “Dao quay, phôi tiến theo phương được chọn.” → Phay.
6. “Cần tạo ren trong lỗ đã chuẩn bị.” → Taro, không gọi là khoan.
7. “Cần tạo rãnh chữ T trên bề mặt.” → Phay, theo tình huống trong bài.

Câu hỏi phải có một đáp án đúng rõ theo ngữ cảnh. Không dùng mẹo đánh đố hoặc thông số chưa học.

## MODULE 2 — DRAG & DROP “CHUYỂN PHÔI ĐÚNG TRẠM”

**Mục tiêu:** kết nối mô tả nhiệm vụ với đúng phương pháp gia công.

### UI/luật chơi

- Màn hình có năm trạm được gắn nhãn rõ: `ĐÚC`, `HÀN`, `KHOAN`, `TIỆN`, `PHAY`.
- Các thẻ nhiệm vụ được đặt ở khu vực chờ. Người chơi kéo từng thẻ đến trạm phù hợp.
- Khi đúng: thẻ khóa vào trạm, có phản hồi trực quan và giải thích 1 câu.
- Khi sai: thẻ quay về vị trí chờ hoặc được hoàn lại; nêu một gợi ý ngắn, không chỉ báo màu.
- Có progress `x/n`, reset, hiển thị hoàn thành và play again.
- Hỗ trợ pointer/mouse, touch và keyboard; không bắt buộc camera.

### Thẻ nhiệm vụ gợi ý

- “Tạo hình bằng cách rót vật liệu lỏng vào khuôn.”
- “Tạo mối nối giữa hai thanh kim loại.”
- “Tạo một lỗ trên phôi.”
- “Gia công bề mặt tròn xoay của chi tiết dạng trục.”
- “Gia công một rãnh chữ T.”
- “Làm rộng một lỗ đã có.”
- “Tạo ren trong lỗ.”

Với “khoét” và “taro”, đừng ép chúng vào cùng thẻ “khoan”: nếu game yêu cầu chọn chính xác nguyên công, hãy dùng vùng phân loại phụ `Nguyên công liên quan` hoặc giải thích rằng đó là hoạt động liên quan chứ không đồng nghĩa.

## MODULE 3 — “XẾP QUY TRÌNH ĐÚC”

**Mục tiêu:** hiểu quan hệ trình tự và nhánh chuẩn bị.

### Tương tác

- Cho 5–6 thẻ bước bị xáo trộn; người chơi sắp xếp thành quy trình.
- Hỗ trợ kéo-thả và nút lên/xuống cho keyboard accessibility.
- Khi submit, so sánh thứ tự với một trình tự hướng dẫn đã được xác minh theo SGK.
- Giải thích vì sao cần chuẩn bị khuôn và vật liệu trước khi rót.
- Có thể biểu diễn 2 nhánh chuẩn bị song song — khuôn và kim loại/vật liệu lỏng — nhập vào bước rót, rồi nguội/đông đặc và lấy vật đúc. Nếu sách không quy định một chi tiết thao tác cụ thể thì không thêm như sự thật bắt buộc.
- Nút `Xem sơ đồ đúng` có thể hiện ra sau lần thử hoặc khi người dùng yêu cầu trợ giúp.

## MODULE 4 — HAND AR “PINCH & PLACE”

**Mục tiêu:** dùng bàn tay thật làm phương thức nhập liệu để gắp/thả thẻ ảo.

### Trạng thái

1. `Camera off` — trang giới thiệu, xin quyền rõ ràng.
2. `Searching` — đang nhận diện tay.
3. `Hand detected` — hiển thị overlay/skeleton và con trỏ.
4. `Pinch started` — gắp thẻ nếu con trỏ đang nằm trên thẻ.
5. `Pinch held` — thẻ theo con trỏ đã được làm mượt.
6. `Pinch released` — thả vào vùng phân loại, chạy đúng/sai.
7. `Fallback` — nếu camera/libraries không chạy được, đổi sang chuột/cảm ứng.

### Yêu cầu cảm biến/UX

- Chỉ bật camera sau khi người dùng nhấn nút đồng ý. Không bật camera tự động khi mở trang.
- Hiển thị trạng thái camera/hand tracking, nút tắt camera, nút reset, tùy chọn bật/tắt skeleton.
- Dùng ngưỡng pinch có hysteresis/debounce để tránh nhấp liên tục; dùng smoothing cho con trỏ.
- Hỗ trợ thao tác chụm để bắt thẻ, mở ngón để thả; không cần nhận diện động tác phức tạp hơn nếu chưa thật sự triển khai.
- Nếu không nhận diện bàn tay, hướng dẫn thay đổi khoảng cách/đưa tay vào khung, nhưng không che nội dung chính.
- Xử lí tọa độ khi camera bị mirror và object-fit cover đúng; không để điểm ngắm lệch khỏi ngón tay.
- Camera frames được xử lí trong trình duyệt; không gửi hình lên server hoặc lưu video. Thể hiện dòng thông báo quyền riêng tư.
- Có thể sử dụng MediaPipe Hands từ CDN theo mô hình file nguồn, nhưng phải báo cần internet để tải thư viện/model. Nếu không tải được, chuyển sang fallback; không giả lập trạng thái `Hand detected`.
- Điều kiện camera: localhost/HTTPS và quyền camera. Giải thích dễ hiểu trong README.
- Nếu Artifact sandbox không cho camera, không cố vượt hạn chế; giữ mouse/touch input và cung cấp code/module camera cho runtime được hỗ trợ.

### Bài tập AR đề xuất

Một thẻ ghi “Mũi khoan ruột gà”, “Dao tiện”, “Dao phay” hoặc “Mối hàn” xuất hiện ở vùng chờ; người chơi dùng pinch để gắp thẻ và thả vào đúng trạm. Sau mỗi lần thả, card hiển thị phản hồi và giải thích. Cử chỉ là một phương thức nhập liệu, không phải bằng chứng có AR định vị không gian.

## MODULE 5 — “IR-STYLE MOTION REMOTE”

**Mục tiêu:** để một hoặc nhiều học sinh sử dụng điện thoại làm controller điều khiển game trên laptop/màn chiếu.

### Kiến trúc mong muốn

- PC chạy một dashboard/game page và local relay Node.js/Socket.IO.
- Điện thoại cùng mạng Wi-Fi/LAN mở controller qua QR do server tạo tại runtime.
- Remote gửi button commands và orientation/motion samples. Dashboard/game diễn giải dữ liệu thành chuyển động con trỏ/chọn trạm.
- Có player slot, trạng thái link, cập nhật sensor, latency và log lỗi cơ bản.
- Tối đa bốn controller nếu được kế thừa/triển khai và test; nếu chỉ kiểm tra một điện thoại thì báo chính xác chỉ mới test một điện thoại.
- Reuse code patterns/protocol đã tìm thấy trong project; không đổi tên event/shape giao tiếp tùy tiện nếu đó làm hỏng controller. Nếu có đổi, cập nhật cả hai đầu và kiểm tra lại.

### Mapping điều khiển trong game

- Nghiêng điện thoại theo beta/gamma → di chuyển aim/cursor qua năm trạm trên dashboard.
- `A` → chọn/confirm trạm hoặc đáp án.
- `B · BACK` → cancel/quay lại/reset bước hiện tại.
- D-pad → di chuyển con trỏ từng nấc hoặc chuyển đáp án.
- `+ / −` → thay đổi một thông số mô phỏng hiển thị (ví dụ mức chạy dao minh họa), không áp thông số đó lên máy thật và không giả vờ mô phỏng chính xác thông số cắt.
- `1 / 2` → action phụ như chuyển chế độ hoặc yêu cầu gợi ý, nếu được giải thích rõ trên UI.
- Phải có nút “Calibrate / Center” để xác định điểm giữa trước khi chơi.
- Dead zone, smoothing, clamp và rate limiting để con trỏ không rung/nhảy khỏi màn hình.
- Tối ưu cho cả chế độ `motion + buttons` và `buttons only`.

### Ghép nối và bảo mật

- QR/URL phải được sinh từ địa chỉ LAN thật mà server phát hiện hoặc người dùng chọn; không hard-code IP giả.
- Điện thoại và PC cần cùng mạng LAN không bị client isolation.
- Motion sensor thường cần HTTPS/secure context; xử lí cấp quyền sensor bằng user gesture theo quy định trình duyệt.
- HTTP có thể dùng làm chế độ chẩn đoán nút nếu phù hợp; ghi rõ không đảm bảo motion sensor trên HTTP LAN.
- Không đưa private key/certificate từ ZIP nguồn vào output. Có thể phát sinh certificate phát triển mới hoặc hướng dẫn TLS/certificate phù hợp.
- Chỉ định server listen trên LAN trong hướng dẫn; không mở public internet, không thêm cloud/analytics/account.
- Validate mọi input từ controller; kiểm tra role, player slot, kiểu dữ liệu, finite numbers và giới hạn giá trị. Không dùng eval/Function, không chạy shell command từ input client.
- Không ghi nhận hoặc gửi dữ liệu cảm biến ngoài mục đích điều khiển trong phiên.
- Có hướng dẫn Windows Firewall/địa chỉ LAN nếu cần, nhưng không yêu cầu người dùng tắt firewall như giải pháp mặc định.

### Màn hình lỗi và fallback

- `Chưa kết nối` → hiển thị URL server/QR nếu có và bước khắc phục.
- `Đã kết nối, chưa có controller` → dashboard chờ.
- `Controller đã kết nối, motion chưa cấp quyền` → cho phép dùng nút.
- `Motion unavailable` → nút D-pad/A/B vẫn điều khiển.
- Nếu server không thể chạy trong môi trường tạo artifact, vẫn tạo chế độ keyboard/touch giả lập trên cùng dashboard, nhưng gắn nhãn `DEMO LOCAL — không dùng cảm biến điện thoại`. Không tuyên bố đó là dữ liệu remote thật.

## MODULE 6 — “MOTION LAB: KHOAN / TIỆN / PHAY”

**Mục tiêu:** biến khái niệm chuyển động thành mô phỏng thao tác trực quan.

### Giao diện

- Một bàn làm việc 2D/2.5D với ba mode chọn được: `KHOAN`, `TIỆN`, `PHAY`.
- Dùng SVG/Canvas/native shapes, không nhất thiết phải dùng 3D. Quan trọng là hướng quay/hướng tịnh tiến chính xác và rõ.
- Luôn có nhãn tĩnh `Chuyển động quay` và `Chuyển động tịnh tiến`; mũi tên không chỉ dựa trên màu.
- Cụm điều khiển: `Start/Stop`, `Reset`, `Hiện gợi ý`, `Kiểm tra nguyên lí`.
- Có thử thách “Sửa cấu hình sai”: game đưa ra một sơ đồ chuyển động bị đặt sai, học sinh bật/tắt chuyển động để chọn cấu hình đúng.

### Trạng thái kiến thức

- **Khoan:** mũi khoan quay và tịnh tiến.
- **Tiện:** phôi quay; dao tịnh tiến.
- **Phay:** dao quay; phôi tịnh tiến.

Khi chọn đúng, mô phỏng cho thấy hướng quay/tiến hợp lí và giải thích ngắn. Khi chọn sai, cho phép người chơi thử lại và chỉ ra mâu thuẫn với quy tắc trong bài. Không tạo ảo giác rằng đây là phần mềm CAM/CNC hoặc mô hình vật lí chính xác.

### Cấu trúc thử thách

1. Chọn máy/nguyên công.
2. Bật chuyển động quay.
3. Bật chuyển động tịnh tiến cho đúng bộ phận.
4. Nhấn `Kiểm tra`.
5. Nhận phản hồi, biểu đồ trạng thái nhỏ và điểm.
6. Thử câu kế tiếp hoặc đổi phương pháp.

Có thể dùng Motion Remote ở Module 5 điều khiển con trỏ trong Motion Lab; nhưng Motion Lab vẫn phải chạy bình thường bằng chuột/keyboard nếu remote không sẵn.

---

## 6. HỆ THỐNG ĐIỂM, FEEDBACK VÀ ĐỘ KHÓ

- Tạo một `GameState` thống nhất: player/team, module, question index, score, streak, correctness, elapsed time và trạng thái hoàn thành.
- Quy tắc tính điểm phải hiển thị trước khi bắt đầu; không thay đổi scoring âm thầm giữa vòng chơi.
- Feedback gồm cả trạng thái thị giác và giải thích kiến thức; không chỉ xanh/đỏ hoặc âm thanh.
- Âm thanh click/chime là tùy chọn, âm lượng nhẹ, có nút mute. Không tự phát âm thanh khi người dùng chưa tương tác.
- Có tùy chọn `Chế độ lớp học`: font lớn, nút dễ bấm, không cần hover, trạng thái rõ trên màn chiếu.
- Có `Chế độ luyện tập`: không bắt buộc đếm giờ, có hint và giải thích nhiều hơn.
- Có `Chế độ thử thách`: timer/score/streak, sau khi người chơi đã hiểu cách thao tác.
- Không tạo leaderboard online, tài khoản, thu thập tên thật hoặc dữ liệu cá nhân. Team name là tuỳ chọn và lưu cục bộ.
- Nút reset phải reset cả DOM state và game state, không để lại card ẩn, điểm cũ hoặc event handlers trùng lặp.

## 7. KIẾN TRÚC ARTIFACT VÀ MÃ NGUỒN

### 7.1. Core Artifact

- Ưu tiên một file HTML có CSS/JS nội tuyến hoặc ít file dễ mở, để dễ chuyển giao.
- Nếu dùng nhiều file/module, bàn giao đúng cấu trúc thư mục và README đầy đủ.
- Core games phải hoạt động không cần backend. Không phụ thuộc vào CDN để tải menu, quiz, drag-drop hoặc motion simulator.
- Dữ liệu câu hỏi đặt trong một mảng/object rõ ràng tách khỏi rendering; không rải câu hỏi trong event handler.
- Các game dùng chung thành phần card, button, progress, feedback, score, empty/error states.
- Không viết một hàm duy nhất quá lớn làm mọi module không thể bảo trì.
- Sử dụng semantic HTML; button thật cho thao tác; label có thể đọc bằng screen reader; focus ring không bị xóa.
- Hỗ trợ `prefers-reduced-motion`; animation không cần thiết phải tắt hoặc giảm chuyển động.
- Canvas/SVG cần resize đúng và không làm hỏng tọa độ khi đổi viewport/độ phân giải.

### 7.2. Tách mode theo khả năng

`CORE` — luôn hoạt động: quiz, drag-drop bằng chuột/touch, sequence builder, machining motion simulator.  
`HAND AR` — camera gesture nếu browser/HTTPS/library hỗ trợ.  
`MOTION REMOTE` — controller điện thoại nếu local relay/server đã chạy.  
`PRESENTATION FALLBACK` — bản câu hỏi/click-to-reveal trong PPT nếu artifact/thiết bị không sẵn sàng.

Không được để `HAND AR` hoặc `MOTION REMOTE` làm crash hay khóa menu core khi thất bại. Mọi chế độ tăng cường đều có nút thoát quay về core.

### 7.3. Liên kết PowerPoint ↔ Artifact

- Bản `.pptx` hiển thị nút/QR đưa người xem tới module cụ thể, ví dụ `?mode=quiz`, `?mode=sequence`, `?mode=hand-ar`, `?mode=motion-lab` hoặc tương đương.
- Chỉ dùng URL/query param mà artifact thật sự hỗ trợ.
- Nếu artifact được mở qua local file và URL không có đường dẫn chia sẻ ổn định, đừng bịa QR; dùng hướng dẫn mở file trên máy trình chiếu và cung cấp QR sau khi deploy.
- Trong PowerPoint có thể có screenshot/previews của module để slide vẫn minh họa khi link không chạy.
- Không hứa nội dung HTML tự nhúng trong mọi phiên bản PowerPoint; cung cấp hyperlink mở browser làm phương án tương thích hơn.

## 8. NỘI DUNG HỌC TẬP VÀ SƯ PHẠM

- Học sinh cần hiểu nguyên lí, không chỉ ghi nhớ từ khóa.
- Mỗi câu hỏi có một mục tiêu: nhận diện phương pháp, phân biệt chuyển động, nhận diện bộ phận, nhận biết công dụng hoặc sắp xếp quy trình.
- Không hỏi kiến thức ngoài bài mà chưa giải thích.
- Mỗi đáp án cần feedback giải thích tại sao đúng hoặc sai; ít nhất một câu ngắn.
- Tránh xây game chỉ hỏi thuộc lòng định nghĩa. Xen kẽ tình huống và hình minh họa.
- Bài cuối có thể là “thiết kế giá sách treo tường bằng kim loại”: học sinh phân tích nhiệm vụ, xác định các công đoạn nào cần nối, tạo lỗ, gia công mặt phẳng/rãnh hoặc bề mặt tròn xoay. Mọi câu trả lời là phương án suy luận chứ không phải một quy trình công nghiệp duy nhất khi đề chưa đủ dữ kiện.
- Khi đề cập thông số kỹ thuật, dùng đúng kí hiệu và đơn vị của SGK. Không có hệ thống cắt vật liệu vật lý hoặc thông số G-code trong game này.

## 9. ĐỊNH HƯỚNG KỊCH BẢN TRÌNH BÀY TRỰC TIẾP

### Gợi ý nhịp 10–12 phút

1. Cover + câu hỏi mở: 45 giây.
2. Bản đồ 5 phương pháp: 30 giây.
3. Đúc + xếp quy trình: 60–75 giây.
4. Hàn + liên kết hàn: 60 giây.
5. Khoan: 40 giây.
6. Tiện: 50 giây.
7. Phay: 50 giây.
8. Bảng so sánh: 40 giây.
9. Quiz nhanh: 60 giây.
10. Hand AR demo: 45–60 giây, nếu camera chạy.
11. Motion Remote: 60–90 giây, nếu thiết bị đã kết nối.
12. Motion Lab / câu vận dụng: 60 giây.

Phải chuẩn bị một “fast path” bỏ qua demo phần cứng nếu cần. Giáo viên vẫn có thể hiểu trọn bài khi mọi tương tác nâng cao bị bỏ qua.

## 10. QA — TIÊU CHUẨN NGHIỆM THU

### 10.1. Kiến thức

- [ ] Có đủ đúc, hàn, khoan, tiện, phay.
- [ ] Đúng nguyên lí và mục đích của từng phương pháp.
- [ ] Đủ năm kiểu liên kết hàn.
- [ ] Khoan: mũi khoan quay + tịnh tiến.
- [ ] Tiện: phôi quay + dao tịnh tiến.
- [ ] Phay: dao quay + phôi tịnh tiến.
- [ ] Các kí hiệu/đơn vị/công thức được đối chiếu SGK.
- [ ] Phân biệt khoan, khoét, doa, taro; không nhập nhằng.
- [ ] Không có thông số công nghiệp tự bịa.

### 10.2. Quiz/drag-drop/sequence/simulator

- [ ] Mỗi câu có đáp án xác định và feedback đúng.
- [ ] Điểm, streak, timer và progress không lệch sau khi restart.
- [ ] Drag-drop hoạt động với mouse và touch.
- [ ] Có cách dùng bằng keyboard cho các phần thiết yếu.
- [ ] Các thẻ đúng được xử lí một lần; không tính điểm lặp khi click nhiều lần.
- [ ] Sequence builder chấm theo thứ tự logic đã xác minh.
- [ ] Simulator biểu diễn đúng bộ phận nào quay và bộ phận nào tiến.
- [ ] Tất cả game core chạy mà không cần camera, CDN hoặc backend.

### 10.3. Hand AR

- [ ] Camera chỉ bật sau thao tác đồng ý.
- [ ] Có trạng thái permission/loading/error/active.
- [ ] Pinch start/hold/release không nhấp nháy liên tục.
- [ ] Con trỏ khớp với bàn tay sau khi mirror/cover.
- [ ] Thẻ chỉ được gắp khi pinch bắt đầu trên vùng có thể tương tác.
- [ ] Thả thẻ gọi đúng luật phân loại và chỉ tính một lần.
- [ ] Camera off/permission denied/library failure không làm chết core game.
- [ ] Mô tả quyền riêng tư đúng theo cách code xử lí frame.

### 10.4. Motion Remote

- [ ] Dashboard mở và báo trạng thái server.
- [ ] QR/URL được sinh từ địa chỉ thật, không hard-code IP.
- [ ] Controller đăng ký và nhận player slot hợp lệ.
- [ ] Button events cập nhật game state đúng.
- [ ] Orientation values được clamp/smooth và không làm con trỏ nhảy ngoài màn.
- [ ] Sensor permission failure chuyển sang button-only mode.
- [ ] Disconnect/reconnect được xử lí và có feedback.
- [ ] Input được validate; không dùng code execution từ dữ liệu client.
- [ ] Nếu chỉ test local/mock hoặc một điện thoại, báo đúng phạm vi test.

### 10.5. PowerPoint và liên kết

- [ ] Render hoặc mở xem đủ 14 slide; không chỉ xem slide đầu.
- [ ] Kiểm tra tràn chữ, sai dấu tiếng Việt, hình mờ, công thức và bảng.
- [ ] Tất cả link đều trỏ tới artifact thật hoặc placeholder được gắn nhãn.
- [ ] QR có URL đích kiểm tra được; nếu chưa deploy, không mã hóa URL đoán.
- [ ] Speaker notes có nội dung hữu ích.
- [ ] File PPTX mở lại được sau khi xuất.

### 10.6. Báo cáo trung thực

Trong `QA_REPORT.md`, dùng nhãn:

- **Verified:** đã thực sự mở/chạy/kiểm tra.
- **Rendered:** đã render hình/preview, chưa test tương tác đầy đủ.
- **Code-reviewed:** đã đọc mã, chưa chạy chức năng.
- **Not tested:** chưa xác minh.
- **Blocked by environment:** bị chặn bởi quyền camera, HTTPS, mạng hoặc runtime.

Không dùng “100% working”, “fully integrated”, “AR/IR tested” nếu không có kiểm chứng tương ứng.

## 11. ĐẦU RA CUỐI — CÁCH BÀN GIAO

Sau khi thực thi, trả lời gọn nhưng đủ đường dẫn:

1. Link PowerPoint `.pptx`.
2. Link artifact `.html` hoặc thư mục/ZIP chứa artifact.
3. Link gói Motion Remote và README nếu có.
4. PDF preview/contact sheet nếu đã tạo.
5. Bảng ngắn 3 cột: deliverable, đã kiểm tra, giới hạn còn lại.

Nếu không thể tạo một trong các deliverable, nói rõ lí do và vẫn bàn giao phần thực sự tạo được. Không chỉ phản hồi bằng mô tả ý tưởng khi có thể xuất file.

---

# PHẦN C — LỆNH THỰC THI CUỐI CÙNG

Hãy bắt đầu bằng cách liệt kê file nguồn thực sự đọc được và vai trò của từng file. Sau đó tạo hệ thống sản phẩm thống nhất theo trình tự:

1. Chốt nội dung Bài 8 theo SGK.
2. Tạo design system chung cho slide và artifact.
3. Xây core artifact trước: quiz, drag-drop, sequence builder, motion simulator.
4. Thêm Hand AR dưới dạng enhancement, giữ fallback.
5. Thêm Motion Remote và local relay nếu runtime/công cụ cho phép; không sao chép certificate/private key từ project nguồn.
6. Dựng 14-slide PowerPoint, gắn các điểm dừng tương tác và link/QR chỉ khi đích đã thực sự tồn tại.
7. Render, mở lại và test những gì môi trường cho phép.
8. Xuất `QA_REPORT.md` trung thực.

**Nguyên tắc ưu tiên cuối:** Kiến thức đúng → game chạy thật → fallback đáng tin cậy → trải nghiệm trực quan → hiệu ứng đẹp. Không hi sinh tính đúng đắn của nội dung hoặc sự trung thực kỹ thuật để tạo cảm giác rằng sản phẩm có nhiều công nghệ hơn thực tế.
