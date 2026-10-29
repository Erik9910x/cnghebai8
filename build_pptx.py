# -*- coding: utf-8 -*-
"""
Script to generate Bai_8_Machining_Lab_AR_IR.pptx
High-end dark mechanical industrial presentation for Cong nghe 11 - Bai 8.
14 Slides, 16:9 Widescreen, custom cards, vector shapes, full speaker notes.
"""

import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# 1. Initialize Presentation
prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# 2. Color Palette Tokens
C_BG = RGBColor(10, 13, 18)         # #0a0d12
C_PANEL = RGBColor(18, 24, 32)      # #121820
C_LINE = RGBColor(38, 51, 68)       # #263344
C_AMBER = RGBColor(245, 158, 11)    # #f59e0b
C_CYAN = RGBColor(0, 229, 255)      # #00e5ff
C_VIOLET = RGBColor(139, 92, 246)   # #8b5cf6
C_CORAL = RGBColor(239, 68, 68)     # #ef4444
C_EMERALD = RGBColor(16, 185, 129)  # #10b981
C_TEXT = RGBColor(240, 244, 248)    # #f0f4f8
C_MUTED = RGBColor(148, 163, 184)   # #94a3b8

FONT_HEADING = "Be Vietnam Pro"
FONT_BODY = "Be Vietnam Pro"

def set_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG
    bg.line.fill.background()
    return bg

def add_header(slide, badge_text, badge_color, title_text, subtitle_text=None):
    # Badge
    badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(8), Inches(0.4))
    tf_b = badge_box.text_frame
    tf_b.word_wrap = True
    p_b = tf_b.paragraphs[0]
    p_b.text = "● " + badge_text.upper()
    p_b.font.name = FONT_BODY
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = badge_color

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.9))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.name = FONT_HEADING
    p_t.font.size = Pt(28)
    p_t.font.bold = True
    p_t.font.color.rgb = C_TEXT

    # Subtitle
    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(0.6))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle_text
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(14)
        p_s.font.color.rgb = C_MUTED

def add_card(slide, left, top, width, height, title, subtitle="", items=[], border_color=C_LINE, fill_color=C_PANEL):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = fill_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.2)

    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_right = Inches(0.2)
    tf.margin_top = Inches(0.2)
    tf.margin_bottom = Inches(0.2)

    p0 = tf.paragraphs[0]
    p0.text = title
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(16)
    p0.font.bold = True
    p0.font.color.rgb = C_TEXT

    if subtitle:
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.name = FONT_BODY
        p_sub.font.size = Pt(12)
        p_sub.font.color.rgb = C_AMBER
        p_sub.space_after = Pt(8)

    for item in items:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.name = FONT_BODY
        p.font.size = Pt(13)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(4)

    return card

def set_speaker_notes(slide, notes_text):
    notes_slide = slide.notes_slide
    text_frame = notes_slide.notes_text_frame
    text_frame.text = notes_text


# ==============================================================================
# SLIDE 01: COVER
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1)

tb1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.8), Inches(4.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "● BÀI 8 · CÔNG NGHỆ 11 (CƠ KHÍ CHẾ TẠO)"
p.font.name = FONT_BODY
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = C_AMBER

p = tf1.add_paragraph()
p.text = "MỘT SỐ PHƯƠNG PHÁP\nGIA CÔNG CƠ KHÍ"
p.font.name = FONT_HEADING
p.font.size = Pt(40)
p.font.bold = True
p.font.color.rgb = C_TEXT
p.space_before = Pt(14)
p.space_after = Pt(14)

p = tf1.add_paragraph()
p.text = "Nhìn nguyên lí · Điều khiển chuyển động · Chọn đúng phương pháp chế tạo chi tiết kim loại"
p.font.name = FONT_BODY
p.font.size = Pt(16)
p.font.color.rgb = C_MUTED

p = tf1.add_paragraph()
p.text = "Trải nghiệm tương tác 3D Web & Hand AR tại: Bai_8_Machining_Lab.html"
p.font.name = FONT_BODY
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_CYAN
p.space_before = Pt(24)

s1.shapes.add_picture(r"c:\Users\Luu Gia Bao\Downloads\Powerpoint\assets\images\cover.jpg", Inches(7.8), Inches(1.6), Inches(4.7), Inches(4.5))

set_speaker_notes(s1, "Dẫn nhập: Từ động cơ phản lực, khung xe máy đến bu lông siêu nhỏ đều là sản phẩm của ngành cơ khí chế tạo. Hôm nay chúng ta bước vào Machining Lab để giải mã 5 phương pháp gia công cốt lõi trong chương trình Công nghệ 11.")


# ==============================================================================
# SLIDE 02: HOOK / ĐẶT VẤN ĐỀ
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "Tình huống thực tế", C_CYAN, "Bạn sẽ chọn phương pháp gia công nào?", "Mỗi chi tiết kim loại có hình dạng hình học và cơ tính riêng biệt quyết định phương pháp chế tạo tối ưu.")

add_card(s2, Inches(0.8), Inches(2.6), Inches(3.6), Inches(4.2), "TÌNH HUỐNG 01: TRỤC XE MÁY", "Đề xuất: GIA CÔNG TIỆN", [
    "Đặc điểm: Chi tiết trục bậc tròn xoay, có đầu côn và ren vít.",
    "Nguyên lí: Phôi quay tròn (Vc), dao tịnh tiến (S) cắt gọt kim loại thừa.",
    "Đạt độ đồng tâm trục và độ nhẵn bề mặt rất cao."
], C_AMBER)

add_card(s2, Inches(4.8), Inches(2.6), Inches(3.6), Inches(4.2), "TÌNH HUỐNG 02: THÂN ĐỘNG CƠ", "Đề xuất: GIA CÔNG ĐÚC", [
    "Đặc điểm: Kết cấu phức tạp, có nhiều khoang rỗng và áo nước làm mát.",
    "Nguyên lí: Rót kim loại lỏng vào lòng khuôn có sẵn để đông đặc tạo hình.",
    "Không loại dao cắt gọt nào thò vào gia công khoang rỗng bên trong được."
], C_VIOLET)

add_card(s2, Inches(8.8), Inches(2.6), Inches(3.7), Inches(4.2), "TÌNH HUỐNG 03: BÀN MÁY CƠ KHÍ", "Đề xuất: GIA CÔNG PHAY", [
    "Đặc điểm: Bề mặt phẳng lớn và các rãnh chữ T song song để gá kẹp êtô.",
    "Nguyên lí: Dao phay quay tròn (V), bàn máy mang phôi tịnh tiến.",
    "Phương pháp tối ưu để tạo mặt phẳng, rãnh then và rãnh chữ T."
], C_CYAN)

set_speaker_notes(s2, "Hỏi lớp: Nhìn 3 chi tiết trên, em sẽ chọn cách chế tạo nào? Bật mí: Trục bậc dùng Tiện, Thân máy rỗng dùng Đúc, Bàn máy có rãnh dùng Phay.")


# ==============================================================================
# SLIDE 03: BẢN ĐỒ 5 PHƯƠNG PHÁP
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "Bản đồ kiến thức SGK", C_VIOLET, "Năm phương pháp gia công cơ khí trọng tâm", "Phân chia thành nhóm gia công không phoi (Đúc, Hàn) và gia công cắt gọt có phoi (Khoan, Tiện, Phay).")

add_card(s3, Inches(0.8), Inches(2.6), Inches(2.1), Inches(4.2), "1. ĐÚC", "Gia công không phoi", [
    "Rót kim loại lỏng vào khuôn.",
    "Nhận hình dạng lòng khuôn sau đông đặc.",
    "Tạo phôi kết cấu phức tạp."
])
add_card(s3, Inches(3.2), Inches(2.6), Inches(2.1), Inches(4.2), "2. HÀN", "Tạo mối liên kết", [
    "Nung chảy mép tiếp xúc.",
    "Tạo mối liên kết không thể tháo rời.",
    "Hàn hồ quang & hàn khí."
])
add_card(s3, Inches(5.6), Inches(2.6), Inches(2.1), Inches(4.2), "3. KHOAN", "Tạo lỗ tròn", [
    "Mũi khoan ruột gà.",
    "Mũi khoan vừa quay vừa tiến.",
    "Tạo lỗ từ phôi đặc."
])
add_card(s3, Inches(8.0), Inches(2.6), Inches(2.1), Inches(4.2), "4. TIỆN", "Mặt tròn xoay", [
    "Phôi quay tròn quanh trục.",
    "Dao tiện tịnh tiến.",
    "Gia công mặt trụ, côn, ren."
], C_AMBER)
add_card(s3, Inches(10.4), Inches(2.6), Inches(2.1), Inches(4.2), "5. PHAY", "Mặt phẳng & rãnh", [
    "Dao phay quay tròn.",
    "Phôi tịnh tiến theo 3 phương.",
    "Mặt phẳng, rãnh chữ T."
], C_CYAN)

set_speaker_notes(s3, "Giáo viên nhấn mạnh: Bài 8 bao gồm 5 phương pháp chính. Hãy nhớ nguyên tắc phân loại: Đúc và Hàn là tạo phôi/liên kết; Khoan, Tiện, Phay là cắt gọt bằng dao.")


# ==============================================================================
# SLIDE 04: I. GIA CÔNG ĐÚC
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "Phương pháp I · Gia công không phoi", C_AMBER, "Gia công đúc — Nguyên lí & Quy trình 2 nhánh", "SGK Công nghệ 11 trang 40 — Chế tạo phôi bằng cách điền đầy kim loại lỏng vào lòng khuôn.")

add_card(s4, Inches(0.8), Inches(2.6), Inches(5.6), Inches(4.2), "ĐẶC ĐIỂM CÔNG NGHỆ ĐÚC", "Ưu điểm & Hạn chế", [
    "Đúc được hầu hết mọi kim loại và hợp kim khác nhau.",
    "Tạo được vật đúc có kết cấu bên trong rất phức tạp hoặc rỗng ruột.",
    "Khối lượng vật đúc từ vài gam đến hàng trăm tấn.",
    "Các phương pháp: Đúc khuôn cát, đúc mẫu chảy, đúc áp lực, đúc li tâm, đúc liên tục.",
    "HẠN CHẾ: Độ chính xác và độ nhẵn bề mặt nhìn chung không cao; thường dùng làm phôi cho gia công cắt gọt tinh tiếp theo."
])

add_card(s4, Inches(6.8), Inches(2.6), Inches(5.7), Inches(4.2), "SƠ ĐỒ QUY TRÌNH 2 NHÁNH (SGK HÌNH 8.2)", "Trình tự chuẩn bị song song", [
    "Nhánh 1: Chuẩn bị / Làm khuôn đúc (khuôn cát, lõi cát)",
    "Nhánh 2: Chuẩn bị / Nấu chảy kim loại",
    "--> NHẬP 2 NHÁNH: Rót kim loại lỏng vào lòng khuôn",
    "--> Làm nguội và kết tinh đông đặc",
    "--> Dỡ khuôn, phá lõi, lấy vật đúc ra",
    "--> Cắt bỏ đậu ngót, làm sạch bavia và kiểm tra kích thước",
    "Thực hành game Module 3: Xếp quy trình đúc trên website."
], C_AMBER)

set_speaker_notes(s4, "Lưu ý sư phạm: Nhấn mạnh 2 nhánh chuẩn bị khuôn và nấu chảy kim loại phải tiến hành song song trước khi rót vào khuôn.")


# ==============================================================================
# SLIDE 05: II. GIA CÔNG HÀN
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "Phương pháp II · Tạo liên kết kim loại", C_CORAL, "Gia công hàn — Nguyên lí & Hai phương pháp trọng tâm", "SGK Công nghệ 11 trang 41 — Nối các chi tiết kim loại bằng cách nung nóng chảy cục bộ mép nối.")

add_card(s5, Inches(0.8), Inches(2.6), Inches(5.6), Inches(4.2), "HÀN HỒ QUANG (ARC WELDING)", "Nguồn nhiệt điện cực", [
    "Nguồn nhiệt: Hồ quang điện giữa que hàn và vật hàn.",
    "Nhiệt độ hồ quang lên đến 3000°C - 6000°C làm chảy kim loại mép nối và lõi que hàn.",
    "Que hàn bọc thuốc: Thuốc hàn cháy sinh khí bảo vệ và tạo xỉ phủ che chắn mối hàn khỏi oxy hóa.",
    "Rất phổ biến trong xây dựng kết cấu thép và cơ khí chế tạo."
])

add_card(s5, Inches(6.8), Inches(2.6), Inches(5.7), Inches(4.2), "HÀN HƠI / HÀN KHÍ (GAS WELDING)", "Nguồn nhiệt ngọn lửa khí", [
    "Nguồn nhiệt: Đốt cháy hỗn hợp khí Oxy và Axetylen (O2 + C2H2).",
    "Ngọn lửa hàn đạt nhiệt độ khoảng 3150°C làm nóng chảy que hàn phụ và mép chi tiết hàn.",
    "Thích hợp hàn các chi tiết mỏng, ống kim loại mỏng hoặc kim loại màu.",
    "Mở rộng công nghệ cao: Hàn MAG/MIG (khí bảo vệ CO2/Argon) và hàn TIG (điện cực Vonfram không chảy)."
], C_CORAL)

set_speaker_notes(s5, "Phân biệt rõ: Hàn hồ quang dùng điện, hàn hơi dùng khí cháy Oxy-Axetylen. Cả hai đều đạt nhiệt độ trên 3000°C để nấu chảy kim loại.")


# ==============================================================================
# SLIDE 06: NĂM KIỂU LIÊN KẾT HÀN
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "Bố cục kết cấu mối hàn", C_CORAL, "Năm kiểu liên kết hàn tiêu biểu (SGK Hình 8.4)", "Dựa theo vị trí tương đối giữa các mép tấm kim loại khi ghép nối.")

add_card(s6, Inches(0.8), Inches(2.6), Inches(2.1), Inches(2.4), "1. GIÁP MỐI", "Butt Joint", [
    "Hai mép tấm đặt phẳng đối đầu nhau.",
    "Mối hàn chịu lực kéo/nén đều."
])
add_card(s6, Inches(3.2), Inches(2.6), Inches(2.1), Inches(2.4), "2. HÀN CHỒNG", "Lap Joint", [
    "Hai tấm xếp gối mép lên nhau.",
    "Dễ gá đặt, hàn 2 mép góc."
])
add_card(s6, Inches(5.6), Inches(2.6), Inches(2.1), Inches(2.4), "3. HÀN CHỮ T", "T-Joint", [
    "Một tấm dựng vuông góc mặt tấm kia.",
    "Tạo vách ngăn, dầm chữ I."
], C_AMBER)
add_card(s6, Inches(8.0), Inches(2.6), Inches(2.1), Inches(2.4), "4. HÀN GÓC", "Corner Joint", [
    "Hai tấm ghép tạo góc nhọn hoặc vuông.",
    "Hàn thành hộp kín, vỏ máy."
])
add_card(s6, Inches(10.4), Inches(2.6), Inches(2.1), Inches(2.4), "5. GẤP MÉP", "Edge Joint", [
    "Mép tấm mỏng uốn gập lại và hàn kín.",
    "Hàn thùng, bồn chứa mỏng."
])

add_card(s6, Inches(0.8), Inches(5.2), Inches(11.7), Inches(1.6), "CẢNH BÁO KỸ THUẬT QUAN TRỌNG (SGK TRANG 41)", "", [
    "ƯU ĐIỂM: Tiết kiệm kim loại, giảm khối lượng kết cấu so với tán đinh, mối hàn kín khít tuyệt đối.",
    "HẠN CHẾ CỐT LÕI: Nhiệt độ nung nóng không đều gây ứng suất dư cục bộ, DỄ LÀM CONG VÊNH, BIẾN DẠNG HÌNH HỌC chi tiết sau khi nguội."
], C_CORAL)

set_speaker_notes(s6, "Khắc sâu cho học sinh: 5 kiểu liên kết (Giáp mối, Chồng, Chữ T, Góc, Gấp mép). Chú ý nhược điểm nung nóng không đều gây cong vênh chi tiết.")


# ==============================================================================
# SLIDE 07: III. GIA CÔNG KHOAN
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "Phương pháp III · Gia công cắt gọt", C_CYAN, "Gia công khoan — Mũi khoan ruột gà & 4 nguyên công lỗ", "SGK Công nghệ 11 trang 41 — Chuyển động cắt gồm 2 chuyển động đồng thời của mũi khoan.")

add_card(s7, Inches(0.8), Inches(2.6), Inches(6.6), Inches(4.2), "HAI CHUYỂN ĐỘNG & 4 NGUYÊN CÔNG LỖ", "Mũi khoan ruột gà (Twist Drill)", [
    "Chuyển động chính (Quay tròn): Mũi khoan quay với vận tốc cắt Vc (m/phút).",
    "Chuyển động chạy dao (Tịnh tiến): Mũi khoan tịnh tiến dọc trục (S mm/vòng).",
    "Phoi xoắn ruột gà thoát ra ngoài theo rãnh xoắn ốc của thân mũi khoan.",
    "• KHOAN (Drilling): Tạo lỗ ban đầu trên phôi đặc nguyên khối.",
    "• KHOÉT (Counterboring): Mở rộng đường kính lỗ đã có sẵn sau khi đúc.",
    "• DOA (Reaming): Gia công tinh bề mặt lỗ đạt độ bóng và chính xác cao.",
    "• TARO (Tapping): Cắt ren trong của lỗ trụ."
], C_CYAN)

s7.shapes.add_picture(r"c:\Users\Luu Gia Bao\Downloads\Powerpoint\assets\images\drilling.jpg", Inches(7.7), Inches(2.6), Inches(4.8), Inches(4.2))

set_speaker_notes(s7, "Nhấn mạnh mũi khoan thực hiện cả 2 chuyển động: quay tròn (Vc) và tịnh tiến (S). Phân biệt khoan (tạo lỗ), khoét (mở rộng), doa (gia công tinh), taro (tạo ren trong).")


# ==============================================================================
# SLIDE 08: IV. GIA CÔNG TIỆN
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "Phương pháp IV · Gia công mặt tròn xoay", C_AMBER, "Gia công tiện — Máy tiện vạn năng & 3 chiều chạy dao", "SGK Công nghệ 11 trang 42-43 — Phương pháp cắt gọt chiếm 30-40% khối lượng gia công cơ khí.")

add_card(s8, Inches(0.8), Inches(2.6), Inches(6.6), Inches(4.2), "CẤU TẠO MÁY TIỆN & QUY TẮC CHUYỂN ĐỘNG", "Phôi quay là chuyển động chính", [
    "5 Bộ phận máy tiện: Hộp tốc độ, Mâm cặp 3 chấu, Bàn gá dao, Ụ động, Thân máy.",
    "Chuyển động chính: PHÔI QUAY TRÒN (Vc m/phút) kẹp trên mâm cặp.",
    "Chuyển động chạy dao: DAO TIỆN TỊNH TIẾN gồm 3 phương:",
    "• Chạy dao dọc (Sd): Dao tiến song song tâm phôi --> Tiện mặt trụ.",
    "• Chạy dao ngang (Sng): Dao tiến vuông góc tâm phôi --> Tiện mặt đầu.",
    "• Chạy dao chéo (Sch): Dao tiến nghiêng góc --> Tiện mặt côn.",
    "Dấu hiệu nhận biết: Chi tiết có dạng tròn xoay (trục, ống, côn, ren)."
], C_AMBER)

s8.shapes.add_picture(r"c:\Users\Luu Gia Bao\Downloads\Powerpoint\assets\images\lathe.jpg", Inches(7.7), Inches(2.6), Inches(4.8), Inches(4.2))

set_speaker_notes(s8, "Quy tắc nằm lòng: Ở máy tiện, PHÔI QUAY TRÒN, DAO TỊNH TIẾN. Dao chạy dọc tiện mặt trụ, dao chạy ngang tiện mặt đầu, dao chạy chéo tiện mặt côn.")


# ==============================================================================
# SLIDE 09: V. GIA CÔNG PHAY
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "Phương pháp V · Mặt phẳng và rãnh", C_CYAN, "Gia công phay — Máy phay đứng & Khả năng công nghệ", "SGK Công nghệ 11 trang 44 — Đối nghịch với tiện: Dao phay quay tròn, phôi tịnh tiến.")

add_card(s9, Inches(0.8), Inches(2.6), Inches(6.6), Inches(4.2), "NGUYÊN LÍ CHUYỂN ĐỘNG & KHẢ NĂNG CÔNG NGHỆ", "Dao quay là chuyển động chính", [
    "Chuyển động chính: DAO PHAY QUAY TRÒN với vận tốc cắt V (m/phút).",
    "Chuyển động chạy dao: PHÔI TỊNH TIẾN kẹp trên bàn máy theo 3 phương (dọc, ngang, đứng).",
    "Cấu tạo máy phay đứng: Trục chính, động cơ, tay quay 3 chiều, bàn máy, thân đế.",
    "Khả năng công nghệ vượt trội:",
    "• Mặt phẳng: Nằm ngang, đứng, nghiêng bằng dao phay mặt đầu.",
    "• Rãnh các loại: Rãnh then, rãnh chữ T, rãnh mang cá.",
    "• Bề mặt định hình phức tạp trên máy phay CNC."
], C_CYAN)

s9.shapes.add_picture(r"c:\Users\Luu Gia Bao\Downloads\Powerpoint\assets\images\milling.jpg", Inches(7.7), Inches(2.6), Inches(4.8), Inches(4.2))

set_speaker_notes(s9, "Điểm cốt lõi: Phay ngược lại với Tiện: Dao phay quay tròn, phôi tịnh tiến theo các phương. Ứng dụng phay mặt phẳng và rãnh chữ T.")


# ==============================================================================
# SLIDE 10: BẢNG SO SÁNH 5 PHƯƠNG PHÁP
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10)
add_header(s10, "Bảng tổng hợp công nghệ", C_VIOLET, "So sánh năm phương pháp gia công cơ khí", "Chìa khóa nhận diện chuyển động và mục đích sử dụng từng phương pháp.")

table_shape = s10.shapes.add_table(6, 4, Inches(0.8), Inches(2.4), Inches(11.7), Inches(4.5))
table = table_shape.table

headers = ["PHƯƠNG PHÁP", "CHUYỂN ĐỘNG / CƠ CHẾ", "MỤC ĐÍCH TIÊU BIỂU", "DẤU HIỆU NHẬN BIẾT"]
for col_idx, h in enumerate(headers):
    cell = table.cell(0, col_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_PANEL
    p = cell.text_frame.paragraphs[0]
    p.text = h
    p.font.name = FONT_HEADING
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_AMBER

data = [
    ("1. ĐÚC", "Kim loại lỏng rót vào khuôn --> Đông đặc", "Tạo phôi kết cấu phức tạp, khoang rỗng", "Có bavia, đậu ngót, bề mặt thô nhám"),
    ("2. HÀN", "Nung nóng chảy mép nối --> Kết tinh", "Tạo mối liên kết kim loại vĩnh cửu", "Đường hàn vảy cá, gân liên kết"),
    ("3. KHOAN", "Mũi khoan quay (Vc) + tịnh tiến (S)", "Tạo lỗ hình trụ tròn từ phôi đặc", "Lỗ trụ tròn, phoi xoắn ruột gà"),
    ("4. TIỆN", "PHÔI QUAY TRÒN, Dao tịnh tiến", "Mặt tròn xoay (trục, ống, côn, ren)", "Vết vân tiện tròn xoay quanh tâm"),
    ("5. PHAY", "DAO QUAY TRÒN, Phôi tịnh tiến", "Mặt phẳng, rãnh chữ T, rãnh then", "Vết vân dao phay dạng vòm sóng")
]

for row_idx, row_data in enumerate(data, start=1):
    for col_idx, text in enumerate(row_data):
        cell = table.cell(row_idx, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_BG
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.name = FONT_BODY
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT if col_idx == 0 else C_MUTED
        if col_idx == 0:
            p.font.bold = True

set_speaker_notes(s10, "Bảng tổng hợp này giúp học sinh ôn tập nhanh và phân biệt dứt khoát 5 phương pháp trước khi bước vào minigame kiểm tra.")


# ==============================================================================
# SLIDE 11: GAME 01 - ĐẤU TRƯỜNG RINH ĐIỂM LIỀN TAY & DICE RANDOM PICKER
# ==============================================================================
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11)
add_header(s11, "Đấu trường tương tác · Game Module 1", C_CYAN, "Đấu trường: Rinh điểm liền tay 🎲 Dice Random Picker", "25 câu hỏi (20 SGK + 5 Chuyên gia đánh dấu đỏ) cùng Xúc Xắc 3D 6 chế độ tương tác.")

add_card(s11, Inches(0.8), Inches(2.6), Inches(7.5), Inches(4.2), "HỆ THỐNG 25 CÂU HỎI & XÚC XẮC 3D (DICE CODE 1-6)", "20 câu SGK nền tảng + 5 câu Tư duy / Thực nghiệm cao cấp", [
    "20 câu hỏi SGK: Phân loại từ Dễ, Trung bình đến Khá bao quát toàn diện 5 phương pháp.",
    "5 câu Chuyên gia (Đỏ): Tình huống thực nghiệm, tư duy phân tích biến dạng, tính toán chế độ cắt.",
    "Dice Code 1 — Random Student: Quay số ngẫu nhiên 1–47 (không trùng lặp, hiệu ứng Shuffle 3.5s).",
    "Dice Code 2 — F1 Reaction Challenge: Dàn 5 đèn đỏ F1 tắt chuyển xanh, thi phản xạ nhanh.",
    "Dice Code 3 — DUAL DUEL: Đối đầu 1 vs 1 giữa 2 học sinh trả lời nhanh trong 15s.",
    "Dice Code 4 — LUCKY ESCAPE: Quyền tự trả lời nhận x2 điểm hoặc chuyển quyền cho bạn.",
    "Dice Code 5 — CLASS RUSH: Thử thách toàn lớp trong 20s, ai giơ tay trước ghi điểm cho tổ.",
    "Dice Code 6 — CHAOS MODE: Mini-game bất ngờ (5s chớp nhoáng, trợ giúp đồng đội, x2 điểm)."
], C_CYAN)

add_card(s11, Inches(8.7), Inches(2.6), Inches(3.8), Inches(4.2), "CÂU HỎI CHUYÊN GIA ĐIỂN HÌNH", "Thực nghiệm & Tư duy sâu", [
    "🔥 Đúc vỏ động cơ mỏng hay bị rỗ khí/ngậm xỉ do đâu? --> Thoát khí khuôn & nhiệt độ rót.",
    "🔥 Hàn kết cấu dầm cầu bị cong vênh nghiêm trọng? --> Ứng suất nhiệt co ngót không đều.",
    "🔥 Tiện trục thon dài bị rung gằn và côn đầu? --> Thiếu ụ động & luynet chống uốn.",
    "🔥 Phay hỏng góc dao vì sao? --> Nhiệt tích tụ do thiếu dung dịch tưới nguội."
], C_CORAL)

set_speaker_notes(s11, "Đấu trường gồm 25 câu hỏi, không đếm ngược thời gian, tích hợp Xúc Xắc 3D gọi học sinh tương tác game show.")


# ==============================================================================
# SLIDE 12: HAND AR - PINCH & PLACE
# ==============================================================================
s12 = prs.slides.add_slide(blank_layout)
set_slide_background(s12)
add_header(s12, "Gesture Tracking · Hand AR Module 4", C_CYAN, "Hand AR: Pinch & Place dụng cụ gia công", "Sử dụng bàn tay thật nhận diện qua webcam để gắp dụng cụ ảo thả vào đúng máy gia công.")

add_card(s12, Inches(0.8), Inches(2.6), Inches(5.6), Inches(4.2), "CƠ CHẾ THEO DÕI BÀN TAY (HAND TRACKING)", "Tích hợp MediaPipe Hands 21 điểm mốc", [
    "Camera nhận diện 21 điểm khớp trên bàn tay theo thời gian thực.",
    "Cử chỉ chụm ngón (PINCH): Khoảng cách giữa đầu ngón cái và ngón trỏ < ngưỡng để GẮP thẻ dụng cụ.",
    "Cử chỉ mở tay: Thả thẻ vào trạm máy.",
    "Thẻ dụng cụ: Mũi khoan ruột gà, Dao tiện hợp kim, Dao phay ngón, Gáo rót kim loại, Mỏ hàn.",
    "QUYỀN RIÊNG TƯ: Toàn bộ xử lý hình ảnh thực hiện cục bộ trong trình duyệt, không gửi video ra ngoài."
], C_CYAN)

add_card(s12, Inches(6.8), Inches(2.6), Inches(5.7), Inches(4.2), "FALLBACK CHUỘT & CẢM ỨNG ĐẦY ĐỦ", "Không bắt buộc camera", [
    "Nếu máy tính không có webcam hoặc không ở chế độ HTTPS/localhost, hệ thống tự động duy trì 100% chế độ chuột kéo-thả.",
    "Học sinh có thể dùng chuột hoặc cảm ứng trên màn hình laptop/máy tính bảng.",
    "Trải nghiệm hoàn toàn mượt mà, không bao giờ bị lỗi khóa bài học khi thiếu thiết bị.",
    "--> Mở thử nghiệm ngay tại Slide 12 trên file HTML."
], C_AMBER)

set_speaker_notes(s12, "Giới thiệu công nghệ Hand AR. Nhấn mạnh nếu không có camera vẫn dùng chuột kéo thả bình thường.")


# ==============================================================================
# SLIDE 13: CẢM ƠN VÀ KẾT THÚC
# ==============================================================================
s13 = prs.slides.add_slide(blank_layout)
set_slide_background(s13)

tb_end = s13.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(3.2))
tf_end = tb_end.text_frame
tf_end.word_wrap = True

p = tf_end.paragraphs[0]
p.text = "CẢM ƠN MỌI NGƯỜI VÀ CÁC BẠN\nĐÃ LẮNG NGHE!"
p.font.name = FONT_HEADING
p.font.size = Pt(54)
p.font.bold = True
p.font.color.rgb = C_TEXT
p.alignment = PP_ALIGN.CENTER

set_speaker_notes(s13, "Cảm ơn quý Thầy Cô và các bạn học sinh đã chú ý lắng nghe bài thuyết trình!")


# 3. Save Presentation
output_path = r"c:\Users\Luu Gia Bao\Downloads\Powerpoint\Bai_8_Machining_Lab_AR_IR.pptx"
prs.save(output_path)
print(f"Successfully generated PowerPoint presentation: {output_path}")
