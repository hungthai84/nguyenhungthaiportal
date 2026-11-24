import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Dữ liệu 8 Quẻ Bát Quái cho cửa sổ Bát Quái Đồ
 */
export const BAGUA_LIST = [
  { glyph: '☰', name: 'Càn', elem: 'Trời · Kim' },
  { glyph: '☱', name: 'Đoài', elem: 'Đầm · Kim' },
  { glyph: '☲', name: 'Ly', elem: 'Lửa · Hỏa' },
  { glyph: '☳', name: 'Chấn', elem: 'Sấm · Mộc' },
  { glyph: '☴', name: 'Tốn', elem: 'Gió · Mộc' },
  { glyph: '☵', name: 'Khảm', elem: 'Nước · Thủy' },
  { glyph: '☶', name: 'Cấn', elem: 'Núi · Thổ' },
  { glyph: '☷', name: 'Khôn', elem: 'Đất · Thổ' },
];

/**
 * Thành phần SVG Definitions chứa 8 quẻ Bát Quái dùng chung
 */
export function BaguaDefs() {
  return (
    <svg className="nat-defs" aria-hidden="true">
      <defs>
        <g id="q-can" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-khon" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" /><line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" /><line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-kham" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" /><line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" /><line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-ly" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-chan" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" /><line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-ton" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" /><line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-can2" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="-2" y2="6" /><line x1="2" y1="6" x2="10" y2="6" />
        </g>
        <g id="q-doai" strokeWidth="2.2" strokeLinecap="square">
          <line x1="-10" y1="-6" x2="-2" y2="-6" /><line x1="2" y1="-6" x2="10" y2="-6" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="6" x2="10" y2="6" />
        </g>
        <path
          id="nat-scritta"
          d="M310 310 m-282 0 a282 282 0 1 1 564 0 a282 282 0 1 1 -564 0"
        />
      </defs>
    </svg>
  );
}

/**
 * Vòng la bàn Bát Quái & Thiên Can Địa Chi xoay phía sau sách
 */
export function CompassBackdrop() {
  return (
    <div className="nat-cerchio">
      <BaguaDefs />
      <svg className="nat-strato" viewBox="0 0 620 620" aria-hidden="true">
        <g fill="none" style={{ stroke: 'var(--nat-incisione)' }} opacity="0.75">
          {/* Vòng 1: Thiên Can & Địa Chi */}
          <g className="nat-anello nat-a2">
            <text
              fontSize="11"
              fontWeight="700"
              stroke="none"
              fontFamily="'Play', sans-serif"
              style={{ fill: 'var(--nat-incisione)' }}
            >
              <textPath href="#nat-scritta" textLength="1765" lengthAdjust="spacing">
                ☯ CÀN · KHẢM · CẤN · CHẤN · TỐN · LY · KHÔN · ĐOÀI ☯ TÝ · SỬU · DẦN · MÃO · THÌN · TỴ · NGỌ · MÙI · THÂN · DẬU · TUẤT · HỢI ☯ GIÁP TÝ · HẢI TRUNG KIM ☯ THÁI CỰC SINH LƯỠNG NGHI ☯
              </textPath>
            </text>
            <circle cx="310" cy="310" r="270" strokeWidth="1" />
            <circle cx="310" cy="310" r="295" strokeWidth="0.6" strokeDasharray="3 5" />
          </g>

          {/* Vòng 2: 8 Quẻ Bát Quái */}
          <g className="nat-anello nat-a3">
            <circle cx="310" cy="310" r="245" strokeWidth="0.8" />
            <circle cx="310" cy="310" r="215" strokeWidth="0.8" />
            <use href="#q-ly" transform="translate(310, 80) rotate(0)" />
            <use href="#q-khon" transform="translate(472, 148) rotate(45)" />
            <use href="#q-doai" transform="translate(540, 310) rotate(90)" />
            <use href="#q-can" transform="translate(472, 472) rotate(135)" />
            <use href="#q-kham" transform="translate(310, 540) rotate(180)" />
            <use href="#q-can2" transform="translate(148, 472) rotate(225)" />
            <use href="#q-chan" transform="translate(80, 310) rotate(270)" />
            <use href="#q-ton" transform="translate(148, 148) rotate(315)" />
          </g>

          {/* Vòng 3: Bát Môn */}
          <g className="nat-anello nat-a4" strokeWidth="0.8">
            <circle cx="310" cy="310" r="190" strokeDasharray="4 4" />
            {[
              { label: 'HƯU', transform: 'translate(310, 134)' },
              { label: 'SINH', transform: 'translate(434, 186) rotate(45)' },
              { label: 'THƯƠNG', transform: 'translate(486, 310) rotate(90)' },
              { label: 'ĐỖ', transform: 'translate(434, 434) rotate(135)' },
              { label: 'CẢNH', transform: 'translate(310, 486) rotate(180)' },
              { label: 'TỬ', transform: 'translate(186, 434) rotate(225)' },
              { label: 'KINH', transform: 'translate(134, 310) rotate(270)' },
              { label: 'KHAI', transform: 'translate(186, 186) rotate(315)' },
            ].map((item) => (
              <text
                key={item.label}
                transform={item.transform}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                stroke="none"
                fontFamily="'Play', sans-serif"
                style={{ fill: 'var(--nat-incisione)' }}
              >
                {item.label}
              </text>
            ))}
          </g>

          {/* Vòng 4: Bát Giác Đồ */}
          <g className="nat-anello nat-a5" strokeWidth="0.9">
            <polygon points="310,150 423,197 470,310 423,423 310,470 197,423 150,310 197,197" />
            <polygon points="310,150 470,310 310,470 150,310" opacity="0.5" />
            <polygon points="423,197 423,423 197,423 197,197" opacity="0.5" />
            <circle cx="310" cy="310" r="150" />
          </g>
        </g>

        {/* Lớp phát sáng Kim Quang */}
        <g className="nat-brilla" fill="none">
          <g className="nat-anello nat-a3">
            <use href="#q-ly" transform="translate(310, 80) rotate(0)" />
            <use href="#q-can" transform="translate(472, 472) rotate(135)" />
            <use href="#q-kham" transform="translate(310, 540) rotate(180)" />
            <use href="#q-chan" transform="translate(80, 310) rotate(270)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Biểu tượng Thái Cực Song Ngư & Bát Quái trên bìa sách (nhấp để mở sách 3D)
 */
export function YinYangBaguaEmblem({
  onClick,
  size = 158,
  interactive = true,
}: {
  onClick?: (e?: React.MouseEvent) => void;
  size?: number;
  interactive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={interactive ? 'book-yinyang-btn' : 'book-yinyang-static'}
      title={interactive ? 'Bấm vào Bát Quái để lật mở sách 3D' : undefined}
      aria-label="Mở sách Tử Vi bằng biểu tượng Bát Quái"
      style={{ width: size, height: size }}
    >
      <svg className="book-yinyang-svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="94" fill="none" stroke="var(--nat-vang)" strokeWidth="0.9" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="var(--nat-vang)" strokeWidth="1.6" />
        <circle cx="100" cy="100" r="64" fill="none" stroke="var(--nat-vang)" strokeWidth="0.8" opacity="0.65" />

        {/* 8 Quẻ nhỏ quanh Thái Cực */}
        <g stroke="var(--nat-vang-sang)" strokeWidth="1.6">
          <use href="#q-ly" transform="translate(100, 25) scale(0.65)" />
          <use href="#q-khon" transform="translate(153, 47) rotate(45) scale(0.65)" />
          <use href="#q-doai" transform="translate(175, 100) rotate(90) scale(0.65)" />
          <use href="#q-can" transform="translate(153, 153) rotate(135) scale(0.65)" />
          <use href="#q-kham" transform="translate(100, 175) rotate(180) scale(0.65)" />
          <use href="#q-can2" transform="translate(47, 153) rotate(225) scale(0.65)" />
          <use href="#q-chan" transform="translate(25, 100) rotate(270) scale(0.65)" />
          <use href="#q-ton" transform="translate(47, 47) rotate(315) scale(0.65)" />
        </g>

        {/* Hình Thái Cực Song Ngư ở tâm */}
        <g transform="translate(100, 100)">
          <circle r="54" style={{ fill: 'var(--yin-fill)' }} stroke="var(--nat-vang)" strokeWidth="1.5" />
          <path d="M0 -54 A54 54 0 0 1 0 54 A27 27 0 0 1 0 0 A27 27 0 0 0 0 -54 Z" style={{ fill: 'var(--yang-fill)' }} />
          <path d="M0 -54 A54 54 0 0 0 0 54 A27 27 0 0 1 0 0 A27 27 0 0 0 0 -54 Z" style={{ fill: 'var(--yin-fill)' }} />
          <circle cx="0" cy="-27" r="7" style={{ fill: 'var(--yin-fill)' }} stroke="#fff" strokeWidth="1" />
          <circle cx="0" cy="27" r="7" style={{ fill: 'var(--yang-fill)' }} stroke="#fff" strokeWidth="1" />
          <path d="M-14 -32 Q-24 -22 -18 -10" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          <path d="M14 32 Q24 22 18 10" fill="none" style={{ stroke: 'var(--yang-fill)' }} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </button>
  );
}

/**
 * Cột 3 thẻ bài bên trái bung ra khi di chuột vào bìa sách đóng
 */
export function LeftTalismanCards() {
  return (
    <div className="nat-gif">
      {/* Thẻ 1: Song Ngư Âm Dương */}
      <div className="nat-talisman-card">
        <svg className="talisman-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--nat-vang)" strokeWidth="1.2" opacity="0.7" />
          <path d="M50 10 A40 40 0 0 1 50 90 A20 20 0 0 1 50 50 A20 20 0 0 0 50 10 Z" style={{ fill: 'var(--yang-fill)' }} />
          <path d="M50 10 A40 40 0 0 0 50 90 A20 20 0 0 1 50 50 A20 20 0 0 0 50 10 Z" style={{ fill: 'var(--yin-fill)' }} stroke="var(--nat-vang)" strokeWidth="0.8" />
          <circle cx="50" cy="30" r="5" style={{ fill: 'var(--yin-fill)' }} />
          <circle cx="50" cy="70" r="5" style={{ fill: 'var(--yang-fill)' }} />
        </svg>
        <div className="talisman-info">
          <span className="talisman-han">SONG NGƯ</span>
          <span className="talisman-vi">Âm Dương Thái Cực</span>
        </div>
      </div>

      {/* Thẻ 2: Bát Quái Huyền Cơ */}
      <div className="nat-talisman-card">
        <svg className="talisman-svg" viewBox="0 0 100 100">
          <polygon points="50,8 80,20 92,50 80,80 50,92 20,80 8,50 20,20" fill="none" stroke="var(--nat-vang)" strokeWidth="1.4" />
          <polygon points="50,18 72,28 82,50 72,72 50,82 28,72 18,50 28,28" fill="none" stroke="var(--nat-chu-sa)" strokeWidth="1.1" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="var(--nat-vang-sang)" strokeWidth="1.2" />
          <line x1="50" y1="8" x2="50" y2="92" stroke="var(--nat-vang)" strokeWidth="0.6" opacity="0.5" />
          <line x1="8" y1="50" x2="92" y2="50" stroke="var(--nat-vang)" strokeWidth="0.6" opacity="0.5" />
        </svg>
        <div className="talisman-info">
          <span className="talisman-han">BÁT QUÁI</span>
          <span className="talisman-vi">Tiên Hậu Thiên Đồ</span>
        </div>
      </div>

      {/* Thẻ 3: Bản Mệnh Giáp Tý */}
      <div className="nat-talisman-card">
        <svg className="talisman-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--nat-vang)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M28 62 C22 45, 38 25, 58 26 C48 34, 45 48, 52 58 C42 62, 34 65, 28 62 Z" fill="none" stroke="var(--nat-vang-sang)" strokeWidth="1.6" />
          <path d="M72 38 C78 55, 62 75, 42 74 C52 66, 55 52, 48 42 C58 38, 66 35, 72 38 Z" fill="none" stroke="var(--nat-chu-sa)" strokeWidth="1.6" />
          <circle cx="48" cy="31" r="2" fill="var(--nat-vang-sang)" />
          <circle cx="52" cy="69" r="2" fill="var(--nat-chu-sa)" />
        </svg>
        <div className="talisman-info">
          <span className="talisman-han">GIÁP TÝ 1984</span>
          <span className="talisman-vi">Hải Trung Kim</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Thẻ luận giải Tử Vi nổi bên phải khi di chuột vào bìa sách đóng
 */
export function RightSummaryCard({ onOpenModal }: { onOpenModal: (modal: string) => void }) {
  return (
    <div className="nat-scatola nat-box-testo">
      <div className="nat-testo">
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--nat-vang-sang)', fontWeight: 700 }}>— ☯ LÁ SỐ TỬ VI —</span>
          <br />
          <span className="nat-nome">NGUYỄN HÙNG THÁI</span>
          <span className="tv-meta">
            Dương lịch: <b>22/06/1984</b> · Giờ: <b>17h00 (Giờ Dậu)</b>
          </span>
          <br />
          <button type="button" className="nws-link" onClick={() => onOpenModal('taichi')}>
            ☯ Thái Cực Song Ngư · Khai Quẻ ☯
          </button>
        </div>

        <div className="chart-grid">
          <div className="chart-item"><b>Âm Lịch</b>23/05/Giáp Tý</div>
          <div className="chart-item"><b>Âm Dương</b>Dương Nam</div>
          <div className="chart-item"><b>Nạp Âm Mệnh</b>Hải Trung Kim</div>
          <div className="chart-item"><b>Giờ Sinh</b>Quý Dậu (17h00)</div>
        </div>

        <div>
          Đương số <span className="tv-highlight">Nguyễn Hùng Thái</span> sinh năm <span className="tv-gold">Giáp Tý (1984)</span>, bản mệnh <span className="tv-red">Hải Trung Kim</span> (Vàng trong biển lớn) — tượng trưng cho trí tuệ thâm trầm, nội lực mạnh mẽ và khí chất kiên định ẩn sau vẻ ngoài điềm đạm.
          <br /><br />
          Sinh vào tháng <span className="tv-highlight">Canh Ngọ</span>, ngày <span className="tv-highlight">Bính Thân</span>, giờ <span className="tv-highlight">Quý Dậu</span>: Hỏa Kim tương luyện, tạo nên thế cách người có tư duy sắc bén, trọng chữ tín và có duyên với các lĩnh vực đòi hỏi tầm nhìn chiến lược. Khi vận hành thuận theo lẽ <span className="tv-gold">Âm Dương Bát Quái</span>, biết nhu cương đúng lúc, sự nghiệp ắt tựa cá chép vượt vũ môn, công thành danh toại.
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span className="tv-meta">~ Mật Khẩu Mệnh Bàn ~</span>
          <br />
          <span className="tv-blur tv-gold">
            Vàng trong biển đợi thời triều dâng, rồng ẩn mây chờ sấm dậy.
          </span>
        </div>
      </div>

      <div className="nat-link">
        <button type="button" className="nat-link-btn" onClick={() => onOpenModal('nguhanh')}>Ngũ Hành</button>
        {' · '}
        <button type="button" className="nat-link-btn" onClick={() => onOpenModal('batquai')}>Bát Quái</button>
        {' · '}
        <button type="button" className="nat-link-btn" onClick={() => onOpenModal('menhly')}>Mệnh Lý 1984</button>
        <span className="nat-onair">CÀN ☰ KHÔN ☷ KHẢM ☵ LY ☲</span>
      </div>
    </div>
  );
}

/**
 * Cửa sổ Modal hiển thị 4 nội dung cổ thư chi tiết
 */
export function BookModal({
  activeModal,
  onClose,
  isDark = false,
}: {
  activeModal: string | null;
  onClose: () => void;
  isDark?: boolean;
}) {
  const [showKhauQuyet, setShowKhauQuyet] = useState(false);

  // Đặt lại trạng thái khẩu quyết khi đóng/mở modal khác
  useEffect(() => {
    setShowKhauQuyet(false);
  }, [activeModal]);

  // Hỗ trợ bấm phím Escape để đóng modal
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`tuvi-modal-root ${isDark ? 'dark-theme' : ''}`}>
      <div className="nws-modal is-open" role="dialog" aria-modal="true">
        <div className="nws-backdrop" onClick={onClose} />
        <div className="nws-window">
        <button type="button" className="nws-close" onClick={onClose} aria-label="Đóng cửa sổ">
          ×
        </button>

        {/* MODAL 1: THÁI CỰC SONG NGƯ */}
        {activeModal === 'taichi' && (
          <div className="nlg">
            <div className="nlg-visual-box">
              <svg width="130" height="130" viewBox="0 0 120 120" className="spin-slow">
                <circle cx="60" cy="60" r="56" fill="none" stroke="var(--nat-vang)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M60 8 A52 52 0 0 1 60 112 A26 26 0 0 1 60 60 A26 26 0 0 0 60 8 Z" style={{ fill: 'var(--yang-fill)' }} />
                <path d="M60 8 A52 52 0 0 0 60 112 A26 26 0 0 1 60 60 A26 26 0 0 0 60 8 Z" style={{ fill: 'var(--yin-fill)' }} stroke="var(--nat-vang)" strokeWidth="1" />
                <circle cx="60" cy="34" r="6.5" style={{ fill: 'var(--yin-fill)' }} />
                <circle cx="60" cy="86" r="6.5" style={{ fill: 'var(--yang-fill)' }} />
                <path d="M44 26 Q32 36 38 48" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M76 94 Q88 84 82 72" fill="none" style={{ stroke: 'var(--yang-fill)' }} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="nlg-title">Thái Cực Đồ</h3>
            <p className="nlg-sub">Song Ngư Giao Hòa · Dương Nam Giáp Tý</p>
            <p className="nlg-text">
              Hình tượng <b>Song Ngư Âm Dương</b> biểu trưng cho sự cân bằng giữa hai thái cực trong vũ trụ. Với đương số <b>Nguyễn Hùng Thái</b> sinh năm Giáp Tý (1984), thiên can <b>Giáp</b> thuộc Dương Mộc, địa chi <b>Tý</b> thuộc Dương Thủy, tạo nên cách cục <b>Dương Nam</b>.
              <br /><br />
              Trên lá số Tử Vi, người mang cách cục Dương Nam có đại vận đi thuận theo chiều kim đồng hồ qua 12 cung, biểu thị khí chất chủ động, dám nghĩ dám làm và tự tay gây dựng cơ đồ.
            </p>
            <div className="nlg-more">
              <button
                type="button"
                className="khau-quyet-btn"
                onClick={() => setShowKhauQuyet((prev) => !prev)}
                title="Xem khẩu quyết Thái Cực"
              >
                <div className="book-seal" style={{ margin: '0 auto', width: 82 }}>KHẨU QUYẾT</div>
              </button>
              {showKhauQuyet && (
                <div className="nlg-more-box">
                  <p className="nlg-text" style={{ color: 'var(--nat-chu-sa)', fontWeight: 700, height: 'auto' }}>
                    "Âm cực thì Dương sinh, Dương cực thì Âm sinh. Giữ tâm tĩnh lặng giữa biến động chính là đạo của người quân tử."
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: NGŨ HÀNH BẢN MỆNH */}
        {activeModal === 'nguhanh' && (
          <div className="nlg nlg-plain">
            <div className="nlg-visual-box">
              <svg width="145" height="145" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="65" fill="none" stroke="var(--book-border)" strokeWidth="1" />
                <polygon points="80,22 115,126 26,61 134,61 45,126" fill="none" stroke="var(--nat-chu-sa)" strokeWidth="1" opacity="0.8" />
                <g fontFamily="'Play', sans-serif" fontWeight="700" fontSize="10" textAnchor="middle" dominantBaseline="central">
                  <circle cx="80" cy="22" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#d94e3f" strokeWidth="1.4" />
                  <text x="80" y="22" style={{ fill: 'var(--nat-chiaro)' }}>HỎA</text>
                  <circle cx="134" cy="61" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#d4a853" strokeWidth="1.4" />
                  <text x="134" y="61" style={{ fill: 'var(--nat-chiaro)' }}>THỔ</text>
                  <circle cx="115" cy="126" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#9e6b1b" strokeWidth="1.8" />
                  <text x="115" y="126" style={{ fill: 'var(--nat-chu-sa)' }}>KIM</text>
                  <circle cx="45" cy="126" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#2b7a9e" strokeWidth="1.4" />
                  <text x="45" y="126" style={{ fill: 'var(--nat-chiaro)' }}>THỦY</text>
                  <circle cx="26" cy="61" r="15" style={{ fill: 'var(--modal-bg)' }} stroke="#3d8c52" strokeWidth="1.4" />
                  <text x="26" y="61" style={{ fill: 'var(--nat-chiaro)' }}>MỘC</text>
                </g>
              </svg>
            </div>
            <h3 className="nlg-title">Ngũ Hành Bản Mệnh</h3>
            <p className="nlg-sub">Hải Trung Kim · Vàng Trong Biển</p>
            <p className="nlg-text">
              Tuổi <b>Giáp Tý 1984</b> nạp âm là <b>Hải Trung Kim</b> (Kim dưới đáy biển). Khác với các hành Kim lộ thiên dễ bị lửa nung chảy, Hải Trung Kim được nước biển bao bọc nên giữ được sự tinh khiết, kín đáo và bền bỉ.
              <br /><br />
              <b>Tương sinh:</b> Thổ sinh Kim, Kim sinh Thủy — rất hợp với yếu tố Đất đai (Thổ) và Giao thương, luân chuyển (Thủy). Khi gặp vận hội tốt, viên ngọc quý dưới đáy biển sẽ tỏa sáng rực rỡ.
            </p>
          </div>
        )}

        {/* MODAL 3: BÁT QUÁI ĐỒ */}
        {activeModal === 'batquai' && (
          <div className="nlg nlg-plain">
            <h3 className="nlg-title" style={{ marginTop: 10 }}>Bát Quái Đồ</h3>
            <p className="nlg-sub">Tám Quẻ Tượng Trưng Cho Vũ Trụ</p>
            <div className="nlg-gallery">
              {BAGUA_LIST.map((item) => (
                <div className="bagua-cell" key={item.name}>
                  <span className="bagua-glyph">{item.glyph}</span>
                  <span className="bagua-name">{item.name}</span>
                  <span className="bagua-elem">{item.elem}</span>
                </div>
              ))}
            </div>
            <p className="nlg-text" style={{ height: 'auto', marginTop: 12, textAlign: 'center' }}>
              Nam mệnh sinh năm 1984 (Giáp Tý) thuộc cung phi <b>Đoài (Kim)</b> — Tây Tứ Mệnh, tượng trưng cho sự khéo léo, giao tiếp tốt và tinh thần lạc quan.
            </p>
          </div>
        )}

        {/* MODAL 4: MỆNH LÝ 1984 */}
        {activeModal === 'menhly' && (
          <div className="nlg nlg-plain">
            <div className="nlg-visual-box">
              <svg width="145" height="145" viewBox="0 0 140 140">
                <rect x="6" y="6" width="128" height="128" fill="none" stroke="var(--nat-vang)" strokeWidth="1.3" />
                <rect x="38" y="38" width="64" height="64" fill="rgba(184,139,70,0.08)" stroke="var(--nat-vang)" strokeWidth="0.9" />
                <line x1="38" y1="6" x2="38" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="102" y1="6" x2="102" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="6" y1="38" x2="134" y2="38" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="6" y1="102" x2="134" y2="102" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="70" y1="6" x2="70" y2="38" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="70" y1="102" x2="70" y2="134" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="6" y1="70" x2="38" y2="70" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <line x1="102" y1="70" x2="134" y2="70" stroke="var(--nat-vang)" strokeWidth="0.7" />
                <text x="70" y="65" textAnchor="middle" fontFamily="'Play', sans-serif" fontWeight="700" fontSize="11" fill="var(--nat-vang-sang)">TỬ VI</text>
                <text x="70" y="81" textAnchor="middle" fontFamily="'Play', sans-serif" fontWeight="700" fontSize="8.5" fill="var(--nat-chu-sa)">17H00 · DẬU</text>
              </svg>
            </div>
            <h3 className="nlg-title">Mệnh Lý 1984</h3>
            <p className="nlg-sub">Nguyễn Hùng Thái · Giờ Quý Dậu</p>
            <p className="nlg-text">
              <b>Thông tin lá số:</b> Dương lịch <b>22/06/1984</b> lúc <b>17h00</b> (tức ngày 23/05 năm Giáp Tý, giờ Quý Dậu).
              <br /><br />
              <b>Tổng quan vận trình:</b> Người sinh giờ Dậu thường có chí tiến thủ cao, càng trưởng thành càng vững vàng. Trung vận từ sau tuổi 35–40 mở ra nhiều cơ hội khẳng định vị thế, công danh và tài lộc hanh thông nhờ sự kiên trì và quý nhân phù trợ.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export interface TuViBookCardProps {
  isDark?: boolean;
  fitToHeight?: boolean;
}

/**
 * Thành phần chính: Bìa Sách Tử Vi Đẩu Số - Âm Dương Bát Quái 3D
 */
export default function TuViBookCard({ isDark: isDarkProp, fitToHeight = false }: TuViBookCardProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isDarkState, setIsDarkState] = useState(() => {
    if (typeof document === 'undefined') return false;
    return (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      (document.documentElement.getAttribute('data-card-style') || '').includes('dark')
    );
  });

  useEffect(() => {
    const checkDark = () => {
      const dark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (document.documentElement.getAttribute('data-card-style') || '').includes('dark');
      setIsDarkState(dark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-card-style'],
    });
    return () => observer.disconnect();
  }, []);

  const isDark = isDarkProp ?? isDarkState;

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const natCardRef = useRef<HTMLDivElement>(null);
  void fitToHeight;

  // Đóng sách / tắt trạng thái active khi bấm ra ngoài khu vực sách
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        natCardRef.current &&
        target &&
        !natCardRef.current.contains(target) &&
        !target.closest('.nat-lettore') &&
        !target.closest('.nws-modal')
      ) {
        setIsBookOpen(false);
        setIsActive(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Tạo âm thanh chuông đồng / cổ cầm ngũ cung bằng Web Audio API
  const playZenChime = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const pentatonic = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 2.9);
      overtone.stop(now + 2.9);
    } catch {
      // Bỏ qua nếu trình duyệt hạn chế phát âm thanh
    }
  }, []);

  // Bấm vào biểu tượng Bát Quái trên bìa để lật mở sách 3D
  const handleToggleBook = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playZenChime();
    setIsBookOpen((prev) => {
      const next = !prev;
      if (next) setIsActive(false);
      return next;
    });
  };

  // Bấm vào bìa sách (ngoài Bát Quái) để bung thẻ trên thiết bị cảm ứng
  const handlePortraitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isBookOpen) {
      setIsActive((prev) => !prev);
      playZenChime();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`tuvi-app-root ${isDark ? 'dark-theme' : ''} ${fitToHeight ? 'tuvi-fit-height' : ''}`}
      style={
        fitToHeight
          ? {
              height: '100%',
              minHeight: 0,
              flex: '1 1 0%',
              padding: 0,
              overflow: 'hidden',
            }
          : undefined
      }
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');

        .tuvi-app-root, .tuvi-app-root *,
        .tuvi-modal-root, .tuvi-modal-root * {
          box-sizing: border-box;
          font-family: 'Play', sans-serif;
        }

        /* ================= BIẾN MÀU GIAO DIỆN SÁNG (MẶC ĐỊNH) ================= */
        .tuvi-app-root,
        .tuvi-modal-root {
          --bg-page: radial-gradient(circle at center, #fbf6ec 0%, #eadcc3 100%);
          --dot-gold: rgba(168, 121, 42, 0.12);
          --dot-red: rgba(168, 50, 40, 0.08);
          --text-body: #3d3226;
          --nat-testo: #4a3d2f;
          --nat-chiaro: #1c140c;
          --nat-spento: #7a6855;
          --nat-vang: #9e6b1b;
          --nat-vang-sang: #7d4e08;
          --nat-chu-sa: #b52b20;
          --nat-fondo: #fcf8f0;
          --nat-incisione: #9e6b1b;
          --circle-bg: radial-gradient(circle closest-side, rgba(252, 247, 238, 0.96) 0, rgba(242, 231, 211, 0.9) 78%, transparent 100%);
          --circle-shadow: 0 0 50px 10px rgba(158, 107, 27, 0.16), 0 0 130px 40px rgba(181, 43, 32, 0.08);
          --book-bg: linear-gradient(135deg, #fffdf8 0%, #f3e6cf 60%, #e8d5b5 100%);
          --book-page-bg: linear-gradient(90deg, #f7ecd6 0%, #fffdf8 14%, #fcf6ea 100%);
          --book-left-page-bg: linear-gradient(270deg, #f3e4c8 0%, #fffcf5 18%, #f8eedc 100%);
          --book-border: #b88b46;
          --book-shadow: -8px 0 18px rgba(74, 56, 33, 0.25), 0 14px 32px rgba(58, 43, 24, 0.28), inset 0 0 35px rgba(184, 139, 70, 0.18);
          --title-box-bg: #fffaf0;
          --card-bg: linear-gradient(145deg, #fffdf9, #f2e5ce);
          --card-shadow: 0 8px 25px rgba(68, 51, 30, 0.22), inset 0 0 18px rgba(158, 107, 27, 0.06);
          --link-bar-bg: rgba(240, 227, 204, 0.85);
          --modal-backdrop: rgba(45, 34, 22, 0.65);
          --modal-bg: #fdf9f2;
          --visual-box-bg: radial-gradient(circle at center, #f6ead4 0%, #e5d2b0 100%);
          --cell-bg: #f7eedc;
          --cell-hover-bg: #efe0c4;
          --btn-bg: rgba(255, 250, 240, 0.92);
          --yin-fill: #241c14;
          --yang-fill: #c98a26;

          width: 100%;
          min-height: auto;
          overflow-x: clip;
          overflow-y: visible;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 0 4px;
          color: var(--text-body);
          position: relative;
          transition: background 0.5s ease, color 0.5s ease;
        }

        /* ================= BIẾN MÀU GIAO DIỆN TỐI ================= */
        .tuvi-app-root.dark-theme,
        .tuvi-modal-root.dark-theme {
          --bg-page: radial-gradient(circle at center, #14110e 0%, #070605 100%);
          --dot-gold: rgba(212, 168, 83, 0.06);
          --dot-red: rgba(180, 70, 50, 0.04);
          --text-body: #c5b8a5;
          --nat-testo: #9e9384;
          --nat-chiaro: #e6dac8;
          --nat-spento: #7a6e5e;
          --nat-vang: #d4a853;
          --nat-vang-sang: #f3d285;
          --nat-chu-sa: #c9453a;
          --nat-fondo: #0d0b0a;
          --nat-incisione: #c89d54;
          --circle-bg: radial-gradient(circle closest-side, rgba(18, 14, 10, .95) 0, rgba(10, 8, 6, .88) 78%, transparent 100%);
          --circle-shadow: 0 0 50px 10px rgba(212, 168, 83, .12), 0 0 130px 40px rgba(168, 50, 40, .06);
          --book-bg: linear-gradient(135deg, #181411 0%, #0c0a09 60%, #16110d 100%);
          --book-page-bg: linear-gradient(90deg, #130f0c 0%, #1b1612 14%, #15110e 100%);
          --book-left-page-bg: linear-gradient(270deg, #120e0b 0%, #1a1511 18%, #130f0c 100%);
          --book-border: #523e23;
          --book-shadow: -8px 0 15px rgba(0,0,0,0.9), 0 12px 30px #000, inset 0 0 40px rgba(0,0,0,0.85);
          --title-box-bg: #0a0908;
          --card-bg: linear-gradient(145deg, #120f0c, #080706);
          --card-shadow: 0 8px 25px #000, inset 0 0 20px rgba(212, 168, 83, 0.04);
          --link-bar-bg: rgba(18, 15, 12, 0.85);
          --modal-backdrop: rgba(0, 0, 0, .86);
          --modal-bg: #0d0b0a;
          --visual-box-bg: radial-gradient(circle at center, #1c1611 0%, #090807 100%);
          --cell-bg: #120f0c;
          --cell-hover-bg: #1d1712;
          --btn-bg: rgba(18, 15, 12, 0.9);
          --yin-fill: #14110e;
          --yang-fill: #d4a853;
        }

        .tuvi-app-root::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image:
            radial-gradient(var(--dot-gold) 1px, transparent 0),
            radial-gradient(var(--dot-red) 1px, transparent 0);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        .nat-stage {
          width: 100%;
          overflow-x: auto;
          overflow-y: visible;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .nat {
          position: relative;
          width: 820px;
          height: 600px;
          margin: 0 auto;
          outline: none;
          flex-shrink: 0;
          transform-origin: center center;
          transition: transform 0.2s ease;
        }

        /* ================= LA BÀN BÁT QUÁI PHÍA SAU ================= */
        .nat-cerchio {
          position: absolute;
          z-index: 0;
          left: 90px;
          top: -30px;
          width: 640px;
          height: 640px;
          opacity: 0.22;
          transform: scale(.94) rotate(-8deg);
          transition: opacity 1.4s ease, transform 1.8s ease;
          pointer-events: none;
        }
        .nat-cerchio::before {
          content: "";
          position: absolute;
          inset: 4%;
          border-radius: 50%;
          background: var(--circle-bg);
          box-shadow: var(--circle-shadow);
        }
        .nat-cerchio svg { position: absolute; }
        .nat-cerchio .nat-defs { width: 0; height: 0; }
        .nat-cerchio .nat-strato { inset: 0; width: 100%; height: 100%; overflow: visible; }

        .nat-anello { transform-origin: 310px 310px; animation: nat-gira 110s linear infinite; }
        .nat-a2 { animation-direction: reverse; animation-duration: 150s; }
        .nat-a3 { animation-duration: 95s; }
        .nat-a4 { animation-direction: reverse; animation-duration: 120s; }
        .nat-a5 { animation-duration: 80s; }
        @keyframes nat-gira { to { transform: rotate(360deg); } }

        .nat-brilla {
          stroke: var(--nat-vang-sang);
          filter: drop-shadow(0 0 3px rgba(212, 168, 83, .75)) drop-shadow(0 0 8px rgba(181, 43, 32, .4));
        }
        .nat-brilla > g > * { animation: nat-respira 6s ease-in-out infinite alternate; }
        .nat-brilla > g > *:nth-child(2n) { animation-delay: -2s; animation-duration: 8s; }
        @keyframes nat-respira { from { opacity: .4; } to { opacity: .95; } }

        .nat:hover .nat-cerchio,
        .nat.is-active .nat-cerchio,
        .nat.is-book-open .nat-cerchio {
          opacity: .95;
          transform: none;
          transition: opacity 1.2s ease .2s, transform 1.6s ease .2s;
        }

        /* ================= SÁCH 3D & HIỆU ỨNG MỞ BÌA ================= */
        .book-3d-scene {
          position: absolute;
          z-index: 6;
          left: 240px;
          top: 40px;
          width: 340px;
          height: 500px;
          perspective: 2000px;
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.22, 0.85, 0.25, 1);
        }

        /* Khi mở sách: dịch chuyển phần sách sang phải nửa khổ để 2 trang mở nằm chính giữa */
        .nat.is-book-open .book-3d-scene {
          transform: translateX(170px) scale(1.02);
        }

        /* Ánh hào quang tỏa ra từ gáy sách khi mở bìa */
        .book-open-glow {
          position: absolute;
          left: -120px;
          top: 40px;
          width: 240px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(243, 210, 133, 0.55) 0%, rgba(212, 168, 83, 0.2) 45%, transparent 72%);
          filter: blur(18px);
          opacity: 0;
          transform: scale(0.4);
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.9s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nat.is-book-open .book-open-glow {
          opacity: 1;
          transform: scale(1.15);
        }

        /* Mép dày các trang giấy bên phải tạo chiều sâu cuốn sách */
        .book-pages-edge {
          position: absolute;
          top: 6px;
          bottom: 6px;
          right: -7px;
          width: 8px;
          border-radius: 0 5px 5px 0;
          background: repeating-linear-gradient(
            to right,
            #e8d7b8 0px,
            #fbf5e8 1.5px,
            #cbb287 2.5px
          );
          border: 1px solid var(--book-border);
          border-left: none;
          box-shadow: 4px 8px 16px rgba(58, 43, 24, 0.22);
          z-index: 0;
          transition: opacity 0.5s ease;
        }

        /* Trang phải (nền sách bên trong) */
        .book-right-page {
          position: absolute;
          inset: 0;
          background: var(--book-page-bg);
          border: 1.5px solid var(--book-border);
          border-radius: 3px 10px 10px 3px;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28), inset 18px 0 26px rgba(120, 88, 42, 0.16);
          padding: 18px 18px 16px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          z-index: 1;
        }

        /* Các tờ giấy lót lật nối tiếp tạo hiệu ứng mở sách nhiều lớp chân thực */
        .book-flip-sheet {
          position: absolute;
          inset: 3px 3px 3px 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          border-radius: 2px 9px 9px 2px;
          background: linear-gradient(90deg, #ecdcc0 0%, #fffcf5 22%, #f7ebd4 100%);
          border: 1px solid rgba(184, 139, 70, 0.45);
          box-shadow: 2px 6px 16px rgba(58, 43, 24, 0.16);
          pointer-events: none;
        }
        .book-flip-sheet.sheet-1 {
          z-index: 2;
          transition: transform 1.1s cubic-bezier(0.28, 0.82, 0.25, 1) 0.14s, opacity 0.4s ease 0.75s;
        }
        .book-flip-sheet.sheet-2 {
          z-index: 2;
          transition: transform 1.15s cubic-bezier(0.28, 0.82, 0.25, 1) 0.24s, opacity 0.4s ease 0.85s;
        }
        .nat.is-book-open .book-flip-sheet.sheet-1 {
          transform: rotateY(-176deg);
          opacity: 0;
        }
        .nat.is-book-open .book-flip-sheet.sheet-2 {
          transform: rotateY(-172deg);
          opacity: 0;
        }

        /* Bìa trước 3D (gồm mặt bìa ngoài & trang trái bên trong) */
        .book-cover-wrapper {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.22, 0.85, 0.25, 1);
          z-index: 4;
        }

        .nat.is-book-open .book-cover-wrapper {
          transform: rotateY(-180deg);
        }

        .book-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border: 1.5px solid var(--book-border);
        }

        /* Mặt bìa ngoài */
        .book-cover-front {
          border-radius: 3px 10px 10px 3px;
          background: var(--book-bg);
          box-shadow: var(--book-shadow);
          cursor: pointer;
          overflow: hidden;
          transition: box-shadow 0.8s ease, border-color 0.8s ease;
        }

        .nat:hover .book-cover-front,
        .nat.is-active .book-cover-front {
          border-color: var(--nat-vang);
          box-shadow: 0 15px 38px rgba(0, 0, 0, 0.35), 0 0 24px rgba(212, 168, 83, 0.25);
        }

        /* Gáy sách chỉ khâu cổ điển */
        .book-cover-front::before {
          content: "";
          position: absolute;
          left: 16px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: repeating-linear-gradient(
            to bottom,
            var(--nat-vang) 0px,
            var(--nat-vang) 14px,
            transparent 14px,
            transparent 22px
          );
          box-shadow: -3px 0 0 rgba(0, 0, 0, 0.25);
          z-index: 4;
        }

        /* Mặt trong bìa (Trang trái khi mở sách) */
        .book-cover-back {
          transform: rotateY(180deg);
          border-radius: 10px 3px 3px 10px;
          background: var(--book-left-page-bg);
          box-shadow: -10px 14px 34px rgba(0, 0, 0, 0.26), inset -14px 0 24px rgba(120, 88, 42, 0.16);
          padding: 20px 20px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .book-frame {
          position: absolute;
          inset: 14px 14px 14px 28px;
          border: 1px solid rgba(184, 139, 70, 0.45);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 20px 14px;
        }
        .book-frame::after {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(184, 139, 70, 0.2);
          pointer-events: none;
        }

        .book-title-box {
          position: relative;
          background: var(--title-box-bg);
          border: 1px solid var(--book-border);
          padding: 12px 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15), inset 0 0 10px rgba(184, 139, 70, 0.12);
          text-align: center;
          z-index: 3;
        }
        .book-title-main {
          font-weight: 700;
          font-size: 16px;
          line-height: 1.35;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--nat-vang-sang);
        }
        .book-subtitle {
          margin-top: 6px;
          font-size: 10px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: var(--nat-chu-sa);
          font-weight: 700;
        }

        /* Nút Bát Quái trên bìa sách */
        .book-yinyang-btn {
          background: transparent;
          border: none;
          padding: 0;
          position: relative;
          z-index: 5;
          cursor: pointer;
          border-radius: 50%;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease;
        }
        .book-yinyang-btn:hover {
          transform: scale(1.06) rotate(45deg);
          filter: drop-shadow(0 0 16px rgba(212, 168, 83, 0.65));
        }
        .book-yinyang-static {
          background: transparent;
          border: none;
          padding: 0;
          pointer-events: none;
        }
        .book-yinyang-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .click-bagua-hint {
          font-size: 9.5px;
          letter-spacing: 1px;
          color: var(--nat-spento);
          text-transform: uppercase;
          z-index: 3;
          animation: nat-respira 3s ease-in-out infinite alternate;
        }

        .book-seal {
          font-weight: 700;
          font-size: 9px;
          line-height: 1.2;
          color: var(--nat-chu-sa);
          border: 1.5px solid var(--nat-chu-sa);
          padding: 4px 6px;
          background: rgba(181, 43, 32, 0.08);
          letter-spacing: 1px;
          text-transform: uppercase;
          z-index: 3;
          text-align: center;
        }

        /* Nội dung trang bên trong sách mở */
        .inner-page-border {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(184, 139, 70, 0.38);
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .inner-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(184, 139, 70, 0.35);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .inner-close-btn {
          background: rgba(181, 43, 32, 0.1);
          border: 1px solid var(--nat-chu-sa);
          color: var(--nat-chu-sa);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.25s ease;
        }
        .inner-close-btn:hover {
          background: var(--nat-chu-sa);
          color: #fff;
        }
        .inner-scroll-body {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none;
          font-size: 11.5px;
          line-height: 1.55;
          text-align: justify;
          color: var(--nat-testo);
          padding-right: 2px;
        }
        .inner-scroll-body::-webkit-scrollbar { display: none; }

        /* ================= CHỮ PHÁT SÁNG BÊN GÁY SÁCH ================= */
        .nat-netanel, .nat-netanel-oriz {
          position: absolute;
          z-index: 4;
          font-weight: 700;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--nat-vang-sang);
          white-space: nowrap;
          pointer-events: none;
          animation: nat-luce 5s ease-in-out infinite alternate;
        }
        .nat-netanel {
          left: 214px;
          top: 45px;
          writing-mode: vertical-rl;
          text-orientation: upright;
          transition: opacity .6s ease, transform .8s ease;
        }
        .nat-netanel-oriz {
          left: 50%;
          top: 12px;
          transform: translate(-50%, 14px);
          opacity: 0;
          transition: opacity .7s ease, transform .9s ease;
        }
        .nat:hover .nat-netanel,
        .nat.is-active .nat-netanel,
        .nat.is-book-open .nat-netanel {
          opacity: 0;
          transform: translateX(20px);
        }
        .nat:hover .nat-netanel-oriz,
        .nat.is-active .nat-netanel-oriz,
        .nat.is-book-open .nat-netanel-oriz {
          opacity: 1;
          transform: translate(-50%, 0);
        }
        @keyframes nat-luce {
          from { text-shadow: 0 0 2px rgba(212, 168, 83, .35); }
          to   { text-shadow: 0 0 8px rgba(212, 168, 83, .75), 0 0 14px rgba(181, 43, 32, .3); }
        }

        /* ================= THẺ NỔI HAI BÊN (CHỈ HIỆN KHI SÁCH ĐÓNG) ================= */
        .nat-scatola {
          position: absolute;
          background: var(--nat-fondo);
          border: 1px solid var(--book-border);
          box-shadow: var(--card-shadow);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.8s ease, transform 0.8s ease, left 0.8s ease, top 0.8s ease;
        }
        .nat:not(.is-book-open):hover .nat-scatola,
        .nat:not(.is-book-open).is-active .nat-scatola {
          opacity: 1;
          pointer-events: auto;
          transition-delay: 0.35s;
        }

        .nat-box-testo {
          z-index: 2;
          left: 330px;
          top: 120px;
          width: 278px;
          height: 355px;
          display: flex;
          flex-direction: column;
          border-radius: 6px;
        }
        .nat:not(.is-book-open):hover .nat-box-testo,
        .nat:not(.is-book-open).is-active .nat-box-testo {
          z-index: 7;
          left: 525px;
          top: 112px;
          transform: rotate(-2deg);
        }

        .nat-testo {
          flex: 1;
          min-height: 0;
          padding: 15px 16px 12px;
          overflow-y: auto;
          scrollbar-width: none;
          font-size: 12px;
          line-height: 1.5;
          text-align: justify;
          color: var(--nat-testo);
        }
        .nat-testo::-webkit-scrollbar { display: none; }

        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          margin: 8px 0 10px;
          padding: 7px;
          background: rgba(184, 139, 70, 0.08);
          border: 1px solid rgba(184, 139, 70, 0.28);
          border-radius: 4px;
          text-align: left;
          font-size: 10.5px;
        }
        .chart-item b {
          color: var(--nat-vang-sang);
          display: block;
          font-size: 9.5px;
          text-transform: uppercase;
        }

        .nat-link {
          flex: none;
          padding: 9px 10px 10px;
          border-top: 1px solid rgba(184, 139, 70, 0.3);
          background: var(--link-bar-bg);
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          line-height: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--nat-spento);
          border-radius: 0 0 6px 6px;
        }
        .nat-link-btn {
          background: none;
          border: none;
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: var(--nat-vang-sang);
          cursor: pointer;
          padding: 3px 4px;
          transition: color .25s ease;
        }
        .nat-link-btn:hover {
          color: var(--nat-chu-sa);
        }
        .nat-onair {
          display: block;
          margin-top: 4px;
          font-size: 9.5px;
          letter-spacing: 1.5px;
          color: var(--nat-chu-sa);
        }

        /* Cột 3 thẻ bài bên trái */
        .nat-gif {
          position: absolute;
          z-index: 1;
          left: 290px;
          top: 140px;
          width: 155px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.8s ease, left 0.8s ease, top 0.8s ease;
        }
        .nat:not(.is-book-open):hover .nat-gif,
        .nat:not(.is-book-open).is-active .nat-gif {
          z-index: 7;
          left: 112px;
          top: 105px;
          opacity: 1;
          transition-delay: 0.35s;
        }

        .nat-talisman-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 148px;
          height: 78px;
          margin: 0 auto 20px;
          padding: 8px 10px;
          border: 1px solid var(--book-border);
          border-radius: 5px;
          background: var(--card-bg);
          box-shadow: var(--card-shadow);
          position: relative;
        }
        .nat-talisman-card::before {
          content: "";
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(184, 139, 70, 0.22);
          border-radius: 3px;
          pointer-events: none;
        }
        .nat-talisman-card:nth-child(1) { transform: rotate(4deg); }
        .nat-talisman-card:nth-child(2) { transform: rotate(-3deg); }
        .nat-talisman-card:nth-child(3) { transform: rotate(3.5deg); }

        .talisman-svg { width: 48px; height: 48px; flex-shrink: 0; }
        .talisman-info { text-align: right; }
        .talisman-han { display: block; font-size: 11px; font-weight: 700; color: var(--nat-vang-sang); }
        .talisman-vi { display: block; font-size: 9px; color: var(--nat-spento); margin-top: 3px; }

        .nat-nome {
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--nat-chu-sa);
        }
        .tv-meta { font-size: 10px; letter-spacing: 0.6px; color: var(--nat-spento); }
        .tv-highlight { color: var(--nat-chiaro); font-weight: 700; }
        .tv-gold { color: var(--nat-vang-sang); font-weight: 700; }
        .tv-red { color: var(--nat-chu-sa); font-weight: 700; }
        .tv-blur { filter: blur(1.2px); transition: filter 0.4s ease; cursor: help; }
        .tv-blur:hover { filter: blur(0); }

        .nws-link {
          display: inline-block;
          margin-top: 6px;
          padding: 5px 10px;
          border: 1px solid var(--book-border);
          border-radius: 4px;
          background: rgba(184, 139, 70, 0.12);
          cursor: pointer;
          font-weight: 700;
          font-size: 10.5px;
          letter-spacing: 0.5px;
          color: var(--nat-vang-sang);
          transition: all .25s ease;
        }
        .nws-link:hover {
          background: rgba(184, 139, 70, 0.25);
          border-color: var(--nat-chu-sa);
          color: var(--nat-chu-sa);
        }

        /* ================= THANH GỢI Ý DƯỚI SÁCH ================= */
        .nat-lettore {
          width: 100%;
          max-width: 480px;
          margin: 10px auto 6px;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        .nat-hint {
          display: inline-block;
          margin-top: 4px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: var(--btn-bg);
          border: 1px solid var(--book-border);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: var(--nat-chiaro);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        /* ================= MODAL CỔ THƯ ================= */
        .nws-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .nws-backdrop {
          position: absolute;
          inset: 0;
          background: var(--modal-backdrop);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }
        .nws-window {
          position: relative;
          width: 375px;
          max-width: calc(100% - 24px);
          max-height: 92vh;
          overflow-y: auto;
          scrollbar-width: none;
          padding: 16px 18px;
          background: var(--modal-bg);
          border: 1.5px solid var(--book-border);
          border-radius: 8px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
          z-index: 2;
        }
        .nws-window::-webkit-scrollbar { display: none; }
        .nws-close {
          position: absolute;
          top: 8px;
          right: 12px;
          z-index: 3;
          background: none;
          border: none;
          padding: 4px 8px;
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
          color: var(--nat-spento);
          cursor: pointer;
        }
        .nws-close:hover { color: var(--nat-chu-sa); }

        .nlg {
          width: 330px;
          max-width: 100%;
          margin: 0 auto;
          padding: 10px 0 14px;
          text-align: center;
        }
        .nlg-visual-box {
          height: 155px;
          margin: 6px 14px 0;
          overflow: hidden;
          border: 3px double var(--book-border);
          border-radius: 6px;
          background: var(--visual-box-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nlg-title {
          margin: 14px 0 0;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: var(--nat-vang-sang);
        }
        .nlg-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0 0;
          padding: 0 14px;
          font-size: 11px;
          letter-spacing: 0.8px;
          color: var(--nat-chu-sa);
          font-weight: 700;
        }
        .nlg-sub::before, .nlg-sub::after { content: ''; flex: 1; height: 1px; }
        .nlg-sub::before { background: linear-gradient(to right, transparent, var(--book-border)); }
        .nlg-sub::after  { background: linear-gradient(to left, transparent, var(--book-border)); }

        .nlg-text {
          margin: 12px 0 0;
          padding: 0 16px;
          font-size: 12.5px;
          line-height: 1.55;
          text-align: justify;
          color: var(--nat-testo);
        }
        .nlg-text b { color: var(--nat-vang-sang); }

        .khau-quyet-btn {
          background: none;
          border: none;
          margin-top: 12px;
          cursor: pointer;
          transition: transform 0.25s ease;
        }
        .khau-quyet-btn:hover { transform: scale(1.06); }
        .nlg-more-box {
          margin: 10px 16px 0;
          padding-top: 10px;
          border-top: 1px solid rgba(184, 139, 70, 0.35);
        }

        .nlg-gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 16px 14px 0;
        }
        .bagua-cell {
          aspect-ratio: 1 / 1;
          border: 1px solid var(--book-border);
          border-radius: 5px;
          background: var(--cell-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: all 0.25s ease;
        }
        .bagua-cell:hover {
          border-color: var(--nat-chu-sa);
          background: var(--cell-hover-bg);
          transform: translateY(-2px);
        }
        .bagua-glyph { font-size: 20px; line-height: 1; color: var(--nat-vang-sang); }
        .bagua-name { font-size: 9px; font-weight: 700; color: var(--nat-chiaro); margin-top: 4px; text-transform: uppercase; }
        .bagua-elem { font-size: 8.5px; color: var(--nat-spento); }

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          transform-origin: center;
          animation: slowSpin 35s linear infinite;
        }
      `}</style>

      {/* ================= SÂN KHẤU BÌA SÁCH TỬ VI ================= */}
      <div className="nat-stage" style={{ height: '600px' }}>
        <div
          ref={natCardRef}
          className={`nat ${isActive ? 'is-active' : ''} ${isBookOpen ? 'is-book-open' : ''}`}
          style={{ transform: 'none' }}
          tabIndex={0}
        >
          {/* Vòng la bàn Bát Quái xoay phía sau */}
          <CompassBackdrop />

          {/* 3 Thẻ bài bên trái & Thẻ luận giải bên phải (bung ra khi hover bìa đóng) */}
          <LeftTalismanCards />
          <RightSummaryCard onOpenModal={setActiveModal} />

          {/* ================= KHỐI SÁCH 3D CÓ HIỆU ỨNG MỞ BÌA ================= */}
          <div className="book-3d-scene">
            {/* Hào quang tỏa sáng khi mở bìa sách */}
            <div className="book-open-glow" aria-hidden="true" />

            {/* Mép dày các trang giấy bên phải */}
            <div className="book-pages-edge" aria-hidden="true" />

            {/* TRANG PHẢI BÊN TRONG SÁCH */}
            <div className="book-right-page">
              <div className="inner-page-border">
                <div className="inner-page-header">
                  <div>
                    <span className="nat-nome" style={{ fontSize: 12.5 }}>NGUYỄN HÙNG THÁI</span>
                    <span className="tv-meta">22/06/1984 · 17h00 (Quý Dậu)</span>
                  </div>
                  <button
                    type="button"
                    className="inner-close-btn"
                    onClick={handleToggleBook}
                  >
                    Đóng ✕
                  </button>
                </div>

                <div className="inner-scroll-body">
                  <div className="chart-grid" style={{ marginTop: 2 }}>
                    <div className="chart-item"><b>Âm Lịch</b>23/05/Giáp Tý</div>
                    <div className="chart-item"><b>Âm Dương</b>Dương Nam</div>
                    <div className="chart-item"><b>Nạp Âm Mệnh</b>Hải Trung Kim</div>
                    <div className="chart-item"><b>Cung Phi</b>Đoài (Tây Tứ)</div>
                  </div>

                  <p style={{ marginBottom: 10 }}>
                    Đương số <span className="tv-highlight">Nguyễn Hùng Thái</span> sinh năm{' '}
                    <span className="tv-gold">Giáp Tý (1984)</span>, bản mệnh{' '}
                    <span className="tv-red">Hải Trung Kim</span> (Vàng trong biển lớn) — tượng trưng cho trí tuệ thâm trầm, nội lực vững vàng và khí chất kiên định ẩn sau vẻ ngoài điềm đạm.
                  </p>
                  <p style={{ marginBottom: 10 }}>
                    Tứ trụ: Năm <span className="tv-highlight">Giáp Tý</span>, tháng{' '}
                    <span className="tv-highlight">Canh Ngọ</span>, ngày{' '}
                    <span className="tv-highlight">Bính Thân</span>, giờ{' '}
                    <span className="tv-highlight">Quý Dậu</span>. Hỏa Kim tương luyện tạo nên tư duy sắc bén, trọng chữ tín, hậu vận từ trung niên trở đi càng thêm hanh thông.
                  </p>

                  <div style={{ textAlign: 'center', marginTop: 6 }}>
                    <button type="button" className="nws-link" onClick={() => setActiveModal('taichi')}>
                      ☯ Khai Quẻ Thái Cực Song Ngư ☯
                    </button>
                  </div>
                </div>

                <div className="nat-link" style={{ borderRadius: 4, marginTop: 8 }}>
                  <button type="button" className="nat-link-btn" onClick={() => setActiveModal('nguhanh')}>Ngũ Hành</button>
                  {' · '}
                  <button type="button" className="nat-link-btn" onClick={() => setActiveModal('batquai')}>Bát Quái</button>
                  {' · '}
                  <button type="button" className="nat-link-btn" onClick={() => setActiveModal('menhly')}>Mệnh Lý</button>
                </div>
              </div>
            </div>

            {/* Các lớp trang giấy lót lật nối tiếp khi mở sách */}
            <div className="book-flip-sheet sheet-1" aria-hidden="true" />
            <div className="book-flip-sheet sheet-2" aria-hidden="true" />

            {/* BÌA SÁCH LẬT 3D (MẶT NGOÀI + TRANG TRÁI BÊN TRONG) */}
            <div className="book-cover-wrapper">
              {/* MẶT BÌA NGOÀI */}
              <div className="book-face book-cover-front" onClick={handlePortraitClick}>
                <div className="book-frame">
                  <div className="book-title-box">
                    <div className="book-title-main">TỬ VI ĐẨU SỐ</div>
                    <div className="book-subtitle">Nguyễn Hùng Thái · 1984</div>
                  </div>

                  {/* Biểu tượng Bát Quái: Bấm vào đây để mở bìa sách 3D */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <YinYangBaguaEmblem onClick={handleToggleBook} size={158} interactive />
                    <span className="click-bagua-hint">✦ Bấm Bát Quái để mở sách ✦</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 3 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: 'var(--nat-vang-sang)' }}>
                      22/06/1984 · 17H00
                    </span>
                    <div className="book-seal">GIÁP TÝ<br />BÍ TRUYỀN</div>
                  </div>
                </div>
              </div>

              {/* MẶT TRONG BÌA (TRANG TRÁI KHI MỞ SÁCH) */}
              <div
                className="book-face book-cover-back"
                onClick={handleToggleBook}
                title="Bấm vào trang trái để đóng sách"
              >
                <div className="inner-page-border" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--nat-chu-sa)', fontWeight: 700 }}>
                      THIÊN CƠ BÍ LỤC
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: 'var(--nat-vang-sang)', marginTop: 4 }}>
                      ÂM DƯƠNG BÁT QUÁI
                    </div>
                  </div>

                  <div className="spin-slow" style={{ margin: '6px 0' }}>
                    <YinYangBaguaEmblem size={150} interactive={false} />
                  </div>

                  <div style={{ padding: '0 8px' }}>
                    <p style={{ fontSize: 11.5, lineHeight: 1.6, color: 'var(--nat-testo)', fontStyle: 'italic' }}>
                      "Vàng trong biển đợi thời triều dâng, rồng ẩn mây chờ sấm dậy. Giữ tâm tĩnh lặng giữa biến động chính là đạo của người quân tử."
                    </p>
                    <div className="book-seal" style={{ display: 'inline-block', marginTop: 12 }}>
                      HẢI TRUNG KIM · 1984
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--nat-spento)', marginTop: 10 }}>
                      (Bấm vào trang này để gấp sách lại)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chữ phát sáng bên gáy sách */}
          <div className="nat-netanel">ÂM DƯƠNG BÁT QUÁI</div>
          <div className="nat-netanel-oriz">☯ THÁI CỰC SINH LƯỠNG NGHI · GIÁP TÝ 1984 ☯</div>
        </div>
      </div>

      {/* ================= GỢI Ý TƯƠNG TÁC ================= */}
      <div className="nat-lettore">
        <div className="nat-hint">
          {isBookOpen
            ? 'Đang mở cổ thư · Chọn Ngũ Hành / Bát Quái / Mệnh Lý để luận giải chi tiết'
            : 'Bấm vào biểu tượng Bát Quái trên bìa để lật mở sách 3D'}
        </div>
      </div>

      {/* ================= CỬA SỔ MODAL LUẬN GIẢI ================= */}
      <BookModal activeModal={activeModal} onClose={() => setActiveModal(null)} isDark={isDark} />
    </div>
  );
}
