'use client';

import React, { useEffect, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useLanguage } from '@/context/LanguageContext';
import { useFirebase, InquiryTopic, CloudInquiryItem } from '@/context/FirebaseContext';
import { BLUEPRINT_LIMITS, sanitizeInquiryTags } from '@/firebase';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

const TOPIC_OPTIONS: Array<{ id: InquiryTopic; labelVi: string; labelEn: string }> = [
  { id: 'recruitment', labelVi: 'Tuyển dụng & Điều hành', labelEn: 'Executive Recruitment' },
  { id: 'cx_advisory', labelVi: 'Tư vấn CX & CSKH', labelEn: 'CX & CS Advisory' },
  { id: 'project_collab', labelVi: 'Hợp tác Dự án', labelEn: 'Project Collaboration' },
  { id: 'other', labelVi: 'Trao đổi khác', labelEn: 'General Inquiry' },
];

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'liquid-glass' }) => {
  void currentTheme;
  const { language } = useLanguage();
  const isEn = language === 'en';
  const contactBannerVideo = getDefaultBannerVideoConfig('contact');
  const {
    user,
    isSigningIn,
    inquiries,
    signInWithGoogle,
    logout,
    submitInquiry,
    updateInquiryContent,
    archiveInquiry,
    deleteInquiry,
  } = useFirebase();

  const [activeMode, setActiveMode] = useState<'calendar' | 'message'>('calendar');
  const [senderName, setSenderName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [topic, setTopic] = useState<InquiryTopic>('cx_advisory');
  const [message, setMessage] = useState<string>('');
  const [tagsText, setTagsText] = useState<string>('');
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.displayName && !senderName) {
      setSenderName(user.displayName.slice(0, BLUEPRINT_LIMITS.SENDER_NAME_MAX));
    }
  }, [user?.displayName, senderName]);

  const resetForm = () => {
    setSenderName((user?.displayName || '').slice(0, BLUEPRINT_LIMITS.SENDER_NAME_MAX));
    setOrganization('');
    setTopic('cx_advisory');
    setMessage('');
    setTagsText('');
    setEditingInquiryId(null);
  };

  const handleEditInquiry = (item: CloudInquiryItem) => {
    setEditingInquiryId(item.id);
    setSenderName(item.senderName);
    setOrganization(item.organization);
    setTopic(item.topic);
    setMessage(item.message);
    setTagsText(item.tags.join(', '));
    setFeedbackMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanName = senderName.trim();
    const cleanMsg = message.trim();
    if (!cleanName) {
      setFeedbackMsg(isEn ? 'Please enter your name.' : 'Vui lòng nhập họ và tên.');
      return;
    }
    if (cleanMsg.length < BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN) {
      setFeedbackMsg(
        isEn
          ? `Message must be at least ${BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN} characters.`
          : `Nội dung lời nhắn cần tối thiểu ${BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN} ký tự.`
      );
      return;
    }

    const parsedTags = sanitizeInquiryTags(
      tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    );

    setSubmitting(true);
    setFeedbackMsg(null);
    try {
      if (editingInquiryId) {
        await updateInquiryContent(editingInquiryId, {
          senderName: cleanName,
          organization: organization.trim(),
          topic,
          message: cleanMsg,
          tags: parsedTags,
        });
        setFeedbackMsg(isEn ? 'Updated inquiry successfully.' : 'Đã cập nhật lời nhắn thành công.');
      } else {
        await submitInquiry({
          senderName: cleanName,
          organization: organization.trim(),
          topic,
          message: cleanMsg,
          tags: parsedTags,
        });
        setFeedbackMsg(isEn ? 'Inquiry sent and saved.' : 'Đã gửi và lưu lời nhắn thành công.');
      }
      resetForm();
    } catch (err: any) {
      setFeedbackMsg(err?.message || (isEn ? 'Could not save inquiry.' : 'Không thể lưu lời nhắn.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="contact-page-container"
      data-element-name="Trang Liên Hệ Kết Nối"
      data-element-type="container"
      data-element-page="contact"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play text-left rounded-none box-border"
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div
        id="contact-cards-track"
        data-element-name="Track căn giữa Liên Hệ"
        data-element-type="container"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="page-cards-track"
      >
        <div
          id="contact-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Liên Hệ"
          data-element-type="card"
          data-element-page="contact"
          data-element-parent="contact-cards-track"
          className="page-main-card relative flex flex-col items-stretch p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play text-left box-border"
        >
          <div
            id="contact-main-scroll-viewport"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch justify-start gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
            {/* 1. HERO BANNER TRANG LIÊN HỆ */}
            <section
              id="contact-hero-banner"
              data-element-name="Banner Liên Hệ & Kết Nối"
              data-element-type="banner-card"
              data-section-card="true"
              data-element-page="contact"
              data-element-parent="contact-main-card"
              className="banner-card bento-card glass-card group w-full lg:w-[235px] lg:min-w-[235px] lg:max-w-[235px] lg:flex-[0_0_235px] xl:w-[255px] xl:min-w-[255px] xl:max-w-[255px] xl:flex-[0_0_255px] lg:self-stretch rounded-[14px] border relative overflow-hidden text-[var(--text-primary)] z-30 flex flex-col justify-between p-[15px] box-border shadow-xl transition-all duration-300"
              style={{
                padding: '15px',
                borderRadius: 'var(--radius-banner, 14px)',
                boxSizing: 'border-box',
              }}
            >
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0">
                <VideoBanner
                  videoId={contactBannerVideo.videoId}
                  title={contactBannerVideo.title}
                  className="rounded-[inherit]"
                />
              </div>
              <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

              <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
                <div className="card-header-sync flex items-center gap-2 w-full min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                  <WebIcon name="contact" className="w-[22px] h-[22px] shrink-0" />
                  <h1
                    id="contact-banner-h1"
                    className="typo-h3 card-title-synced font-play not-italic tracking-tight leading-tight whitespace-normal min-w-0"
                    data-card-title="true"
                  >
                    Thông tin liên hệ
                  </h1>
                </div>
                <p
                  id="contact-banner-quote"
                  className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left w-full whitespace-normal leading-snug"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                    fontWeight: 600,
                    fontStyle: 'normal',
                  }}
                >
                  &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
                </p>
              </div>
            </section>

            {/* 2. KHUNG NỘI DUNG CHÍNH */}
            <div
              id="contact-info-container"
              data-element-name="Khung đặt lịch hẹn & gửi lời nhắn"
              data-element-type="card"
              data-section-card="true"
              data-element-page="contact"
              data-element-parent="contact-main-card"
              className="bento-card glass-card w-full flex-1 min-w-0 min-h-[480px] lg:min-h-0 h-full lg:self-stretch flex flex-col rounded-[14px] shadow-xl gap-[15px] overflow-hidden relative p-[15px] box-border transition-all duration-300"
              style={{
                padding: '15px',
                gap: '15px',
                borderRadius: 'var(--radius-card, 14px)',
                boxSizing: 'border-box',
              }}
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              {/* Mode Switcher (Box Tabs) + User Controls */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 shrink-0 pb-2 border-b" style={{ borderColor: 'var(--border-subcard)' }}>
                <div
                  role="tablist"
                  aria-label={isEn ? 'Contact mode selection' : 'Chế độ liên hệ'}
                  className="inline-flex items-center gap-1.5 p-1 rounded-[12px] border"
                  style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
                >
                  <button
                    id="contact-tab-calendar"
                    type="button"
                    role="tab"
                    aria-selected={activeMode === 'calendar'}
                    onClick={() => setActiveMode('calendar')}
                    className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-[9px] border typo-label font-bold cursor-pointer transition-all duration-200"
                    style={
                      activeMode === 'calendar'
                        ? {
                            background: 'var(--bg-button-primary)',
                            borderColor: 'var(--color-primary, transparent)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                          }
                        : {
                            background: 'transparent',
                            borderColor: 'transparent',
                            color: 'var(--text-secondary)',
                          }
                    }
                  >
                    <WebIcon name="calendar" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Book Appointment' : 'Đặt lịch hẹn'}</span>
                  </button>
                  <button
                    id="contact-tab-message"
                    type="button"
                    role="tab"
                    aria-selected={activeMode === 'message'}
                    onClick={() => setActiveMode('message')}
                    className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-[9px] border typo-label font-bold cursor-pointer transition-all duration-200"
                    style={
                      activeMode === 'message'
                        ? {
                            background: 'var(--bg-button-primary)',
                            borderColor: 'var(--color-primary, transparent)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                          }
                        : {
                            background: 'transparent',
                            borderColor: 'transparent',
                            color: 'var(--text-secondary)',
                          }
                    }
                  >
                    <WebIcon name="messages-square" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Direct Inquiry' : 'Gửi lời nhắn trực tiếp'}</span>
                  </button>
                </div>

                {activeMode === 'message' && (
                  <div className="flex items-center gap-2">
                    {user ? (
                      <button
                        type="button"
                        onClick={() => void logout()}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border typo-caption font-bold cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                      >
                        {user.photoURL && (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        )}
                        <span className="max-w-[140px] truncate">{user.displayName}</span>
                        <WebIcon name="log-out" className="w-3.5 h-3.5 opacity-75" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isSigningIn}
                        onClick={() => void signInWithGoogle()}
                        style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-label font-bold cursor-pointer disabled:opacity-60 shadow-sm hover:opacity-95 transition"
                      >
                        <WebIcon name="log-in" className="w-3.5 h-3.5" />
                        <span>{isSigningIn ? (isEn ? 'Signing in...' : 'Đang đăng nhập...') : isEn ? 'Sign in with Google' : 'Đăng nhập Google'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {activeMode === 'calendar' ? (
                <div
                  id="contact-calendar-viewport"
                  className="relative z-10 flex-1 w-full h-full min-h-[460px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[var(--radius-subcard,14px)] border border-[var(--border-subcard)] bg-transparent shadow-none flex flex-col p-0 m-0"
                  style={{ padding: '0px', margin: '0px', scrollbarWidth: 'none' }}
                >
                  <iframe
                    id="contact-calendar-iframe"
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
                    style={{
                      display: 'block',
                      border: 0,
                      borderRadius: 'var(--radius-subcard, 14px)',
                      width: '100%',
                      height: '100%',
                      minHeight: '700px',
                      padding: '0px',
                      margin: '0px',
                    }}
                    width="100%"
                    height="100%"
                    scrolling="no"
                    frameBorder="0"
                    title="Đặt lịch hẹn Google Calendar"
                    className="w-full h-full flex-1 min-h-[700px] rounded-[var(--radius-subcard,14px)] p-0 m-0 block"
                  />
                </div>
              ) : (
                <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-[15px] pr-1">
                  {/* Left: Inquiry Composer */}
                  <div
                    data-subcard="true"
                    className="sub-card p-[15px] rounded-[14px] border flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                    style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
                  >
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                    <h3
                      className="subcard-header-sync subcard-title-synced typo-h5 font-bold flex items-center gap-2 relative z-10"
                      data-subcard-title="true"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <WebIcon name="edit" className="w-4 h-4 shrink-0" />
                      <span>
                        {editingInquiryId
                          ? isEn
                            ? 'Edit Inquiry'
                            : 'Chỉnh sửa lời nhắn'
                          : isEn
                            ? 'Send Consultation / Recruitment Inquiry'
                            : 'Gửi lời nhắn trao đổi công việc'}
                      </span>
                    </h3>

                    {!user ? (
                      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
                        <p className="typo-body-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
                          {isEn
                            ? 'Sign in with Google to send a verified inquiry directly and track your submitted messages.'
                            : 'Đăng nhập bằng Google để gửi lời nhắn trực tiếp đã xác thực và theo dõi lịch sử trao đổi của bạn.'}
                        </p>
                        <button
                          type="button"
                          disabled={isSigningIn}
                          onClick={() => void signInWithGoogle()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full typo-button font-bold text-white bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] cursor-pointer disabled:opacity-60 shadow-md hover:shadow-lg transition-all"
                        >
                          <WebIcon name="log-in" className="w-4 h-4" />
                          <span>{isSigningIn ? (isEn ? 'Signing in...' : 'Đang đăng nhập...') : isEn ? 'Sign in with Google' : 'Đăng nhập với Google'}</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => void handleSubmit(e)} className="relative z-10 flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="flex flex-col gap-1">
                            <label className="typo-caption font-bold" style={{ color: 'var(--text-secondary)' }}>
                              {isEn ? 'Full Name *' : 'Họ và tên *'}
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={BLUEPRINT_LIMITS.SENDER_NAME_MAX}
                              value={senderName}
                              onChange={(e) => setSenderName(e.target.value)}
                              placeholder={isEn ? 'Your full name' : 'Nhập họ tên của bạn'}
                              className="w-full px-3 py-2 rounded-[10px] border typo-input transition-colors duration-200 focus:outline-none"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="typo-caption font-bold" style={{ color: 'var(--text-secondary)' }}>
                              {isEn ? 'Organization' : 'Công ty / Tổ chức'}
                            </label>
                            <input
                              type="text"
                              maxLength={BLUEPRINT_LIMITS.ORGANIZATION_MAX}
                              value={organization}
                              onChange={(e) => setOrganization(e.target.value)}
                              placeholder={isEn ? 'Optional company name' : 'Không bắt buộc'}
                              className="w-full px-3 py-2 rounded-[10px] border typo-input transition-colors duration-200 focus:outline-none"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="flex flex-col gap-1">
                            <label className="typo-caption font-bold" style={{ color: 'var(--text-secondary)' }}>
                              {isEn ? 'Topic' : 'Chủ đề trao đổi'}
                            </label>
                            <select
                              value={topic}
                              onChange={(e) => setTopic(e.target.value as InquiryTopic)}
                              className="w-full px-3 py-2 rounded-[10px] border typo-input transition-colors duration-200 focus:outline-none"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                            >
                              {TOPIC_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {isEn ? opt.labelEn : opt.labelVi}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="typo-caption font-bold" style={{ color: 'var(--text-secondary)' }}>
                              {isEn ? 'Tags (comma separated, max 5)' : 'Thẻ từ khóa (tối đa 5)'}
                            </label>
                            <input
                              type="text"
                              maxLength={160}
                              value={tagsText}
                              onChange={(e) => setTagsText(e.target.value)}
                              placeholder={isEn ? 'e.g. FinTech, Contact Center' : 'VD: FinTech, CSKH, AI'}
                              className="w-full px-3 py-2 rounded-[10px] border typo-input transition-colors duration-200 focus:outline-none"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="typo-caption font-bold" style={{ color: 'var(--text-secondary)' }}>
                            {isEn ? 'Message *' : 'Nội dung lời nhắn *'}
                          </label>
                          <textarea
                            required
                            rows={4}
                            minLength={BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MIN}
                            maxLength={BLUEPRINT_LIMITS.INQUIRY_MESSAGE_MAX}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={isEn ? 'Share details about your opportunity or project...' : 'Chia sẻ nhu cầu hợp tác, vị trí điều hành hoặc tư vấn vận hành...'}
                            className="w-full px-3 py-2 rounded-[10px] border typo-input resize-none transition-colors duration-200 focus:outline-none"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                          />
                        </div>

                        {feedbackMsg && (
                          <p className="typo-caption font-semibold" style={{ color: 'var(--color-primary)' }}>
                            {feedbackMsg}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          {editingInquiryId && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-3.5 py-2 rounded-full border typo-label font-bold cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-primary)' }}
                            >
                              {isEn ? 'Cancel' : 'Hủy'}
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-button font-bold text-white bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] cursor-pointer disabled:opacity-60 shadow-md hover:shadow-lg transition-all"
                          >
                            <WebIcon name="send" className="w-3.5 h-3.5" />
                            <span>
                              {submitting
                                ? isEn
                                  ? 'Sending...'
                                  : 'Đang gửi...'
                                : editingInquiryId
                                  ? isEn
                                    ? 'Save Changes'
                                    : 'Cập nhật lời nhắn'
                                  : isEn
                                    ? 'Send Inquiry'
                                    : 'Gửi lời nhắn'}
                            </span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Right: User's Submitted Inquiries */}
                  <div
                    data-subcard="true"
                    className="sub-card p-[15px] rounded-[14px] border flex flex-col gap-3 min-h-[260px] relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                    style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
                  >
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <h3
                        className="subcard-header-sync subcard-title-synced typo-h5 font-bold flex items-center gap-2 min-w-0"
                        data-subcard-title="true"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <WebIcon name="mail" className="w-4 h-4 shrink-0" />
                        <span className="truncate">{isEn ? 'Your Sent Inquiries' : 'Lời nhắn đã gửi của bạn'}</span>
                      </h3>
                      {user && (
                        <span className="typo-badge px-2.5 py-0.5 rounded-full border shrink-0 font-bold" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}>
                          {inquiries.length}
                        </span>
                      )}
                    </div>

                    {!user ? (
                      <p className="relative z-10 typo-body-sm" style={{ color: 'var(--text-muted)' }}>
                        {isEn
                          ? 'Your sent messages are private to your signed-in Google account.'
                          : 'Danh sách lời nhắn được bảo mật riêng tư theo tài khoản Google của bạn.'}
                      </p>
                    ) : inquiries.length === 0 ? (
                      <p className="relative z-10 typo-body-sm" style={{ color: 'var(--text-muted)' }}>
                        {isEn ? 'No inquiries submitted yet.' : 'Bạn chưa gửi lời nhắn nào.'}
                      </p>
                    ) : (
                      <div className="relative z-10 flex flex-col gap-2.5 overflow-y-auto glass-scrollbar pr-1">
                        {inquiries.map((item) => {
                          const topicMeta = TOPIC_OPTIONS.find((tOpt) => tOpt.id === item.topic);
                          return (
                            <div
                              key={item.id}
                              className="p-3 rounded-[12px] border flex flex-col gap-2 transition-all duration-200 hover:border-purple-400/30"
                              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="typo-body-sm font-bold truncate">
                                    {isEn ? topicMeta?.labelEn : topicMeta?.labelVi}
                                    {item.organization ? ` · ${item.organization}` : ''}
                                  </p>
                                  <p className="typo-caption flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                    <span>{item.senderName}</span>
                                    <span>·</span>
                                    <span className="inline-flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'archived' ? 'bg-gray-400' : 'bg-emerald-400'}`} />
                                      {item.status === 'archived'
                                        ? isEn
                                          ? 'Archived'
                                          : 'Đã lưu trữ'
                                        : isEn
                                          ? 'Submitted'
                                          : 'Đã gửi'}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {item.status !== 'archived' && (
                                    <>
                                      <button
                                        type="button"
                                        title={isEn ? 'Edit' : 'Chỉnh sửa'}
                                        onClick={() => handleEditInquiry(item)}
                                        className="p-1.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ borderColor: 'var(--border-subcard)' }}
                                      >
                                        <WebIcon name="edit" className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        title={isEn ? 'Archive' : 'Lưu trữ'}
                                        onClick={() => void archiveInquiry(item.id)}
                                        className="p-1.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ borderColor: 'var(--border-subcard)' }}
                                      >
                                        <WebIcon name="archive" className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    title={isEn ? 'Delete' : 'Xóa'}
                                    onClick={() => void deleteInquiry(item.id)}
                                    className="p-1.5 rounded-full border cursor-pointer text-rose-500 hover:opacity-80 transition-opacity"
                                    style={{ borderColor: 'var(--border-subcard)' }}
                                  >
                                    <WebIcon name="trash-2" className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="typo-body-sm whitespace-pre-wrap break-words">{item.message}</p>
                              {item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {item.tags.map((tag, idx) => (
                                    <span
                                      key={`${item.id}-tag-${idx}`}
                                      className="typo-badge px-2 py-0.5 rounded-full border font-medium"
                                      style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
