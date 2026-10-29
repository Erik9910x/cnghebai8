# Machining Lab V2.0 — Bài 8: Một Số Phương Pháp Gia Công Cơ Khí (Công nghệ 11)

Mô phỏng 3D WebGL cơ khí chính xác, điều khiển chuyển động, Hand AR (Pinch & Place), Đấu trường tương tác 25 câu hỏi và Xúc xắc Random Picker (Dice Code 1–6).

## Tính năng nổi bật
- **13 Slide trình chiếu chuẩn 16:9:** Thiết kế Dark Industrial Aesthetic, chuẩn kiến thức SGK Kết nối tri thức & Cánh diều.
- **Mô phỏng 3D Máy cơ khí:** Trục tiện 5 bậc CNC, Máy khoan đứng ruột gà, Máy tiện vạn năng, Máy phay đứng.
- **Hand AR Gesture Tracking:** Nhận diện 21 điểm mốc bàn tay qua MediaPipe, cử chỉ chụm ngón tay (Pinch & Place) gắp thả thẻ phôi vào 5 trạm máy (Đúc, Hàn, Khoan, Tiện, Phay).
- **Đấu trường 25 câu hỏi:** 20 câu SGK nền tảng + 5 câu Chuyên gia thực tế đánh dấu đỏ. Hỗ trợ điều hướng câu hỏi linh hoạt bằng nút ‹ / › hoặc nhập trực tiếp số câu.
- **Xúc xắc Random Picker Digital:** 6 chế độ tương tác (Random học sinh theo STT & Họ Tên 43 bạn, F1 Reaction, Dual Duel 1 vs 1, Lucky Escape, Class Rush, Chaos Mode).
- **Phím tắt toàn diện:**
  - `←` / `→` / `Space` / `Backspace`: Chuyển slide
  - `O`: Bật/Tắt tổng quan slide
  - `F`: Toàn màn hình
  - `H`: Ẩn/Hiện thanh điều khiển & công cụ
  - `R`: Lắc xúc xắc 🎲
  - `1`, `2`, `3`, `4`: Chọn đáp án câu hỏi trắc nghiệm

## Hướng dẫn cài đặt & Chạy cục bộ
1. Mở thư mục dự án trong terminal:
```bash
python -m http.server 8000
```
2. Truy cập trình duyệt:
```
http://localhost:8000/
```

## Triển khai (Deploy) lên Vercel
Dự án được xây dựng với cấu trúc tĩnh (Static Web), có thể triển khai trực tiếp lên Vercel chỉ bằng 1 cú click hoặc lệnh:
```bash
vercel
```
