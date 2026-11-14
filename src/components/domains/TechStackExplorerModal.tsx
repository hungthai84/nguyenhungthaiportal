'use client';

import React, { useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { Modal } from '@/components/ui/Modal';

export interface TechStackExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TechPlatformItem {
  id: string;
  name: string;
  category: 'CRM & Ticketing' | 'Cloud Contact Center' | 'Data & BI' | 'AI & Automation';
  level: string;
  role: string;
  desc: string;
  highlights: string[];
  color: string;
  icon: string;
}

const TECH_PLATFORMS: TechPlatformItem[] = [
  {
    id: 'zendesk',
    name: 'Zendesk Enterprise Suite',
    category: 'CRM & Ticketing',
    level: 'Chuyên gia Quản trị (98%)',
    role: 'Omnichannel Ticketing & Help Center',
    desc: 'Thiết kế luồng Ticket tự động, Trigger/Automation, SLA đa tầng và Cổng tri thức Self-service phục vụ hàng triệu người dùng.',
    highlights: ['Skill-based Routing', 'Custom Triggers & Macros', 'Omnichannel Workspace'],
    color: '#0284c7',
    icon: 'layers',
  },
  {
    id: 'salesforce',
    name: 'Salesforce Service Cloud',
    category: 'CRM & Ticketing',
    level: 'Quản trị & Tích hợp (92%)',
    role: 'Customer 360 & Case Management',
    desc: 'Quản lý hồ sơ khách hàng 360 độ, đồng bộ lịch sử giao dịch phức tạp và quy trình leo thang (Escalation Matrix) liên phòng ban.',
    highlights: ['Customer 360 View', 'Entitlement & Milestones', 'Omni-Channel Supervisor'],
    color: '#2563eb',
    icon: 'database',
  },
  {
    id: 'genesys',
    name: 'Genesys Cloud CX / Cisco UCCX',
    category: 'Cloud Contact Center',
    level: 'Vận hành Chiến lược (95%)',
    role: 'Cloud PBX, Smart IVR & WFM',
    desc: 'Điều hành hệ thống tổng đài đám mây công suất lớn, kịch bản IVR thông minh, dự báo lưu lượng Erlang-C và giám sát Real-time Queue.',
    highlights: ['Smart IVR Call Flow', 'Real-time Adherence', 'Predictive Auto-Dialer'],
    color: '#059669',
    icon: 'phone',
  },
  {
    id: 'powerbi',
    name: 'Microsoft Power BI & Tableau',
    category: 'Data & BI',
    level: 'Phân tích Chuyên sâu (95%)',
    role: 'Executive CX & Operations Dashboard',
    desc: 'Xây dựng hệ thống báo cáo quản trị thời gian thực đo lường CSAT, NPS, FCR, AHT, SLA và phân tích nguyên nhân gốc rễ (RCA).',
    highlights: ['Realtime Wallboard', 'VoC & Churn Analytics', 'Automated ETL Pipelines'],
    color: '#d97706',
    icon: 'chart',
  },
  {
    id: 'genai',
    name: 'Generative AI Bot & RAG Knowledge',
    category: 'AI & Automation',
    level: 'Tiên phong Ứng dụng (96%)',
    role: 'AI Agent Copilot & 24/7 Chatbot',
    desc: 'Triển khai trợ lý ảo AI ứng dụng LLM + RAG chống ảo giác, hỗ trợ tự động 70% yêu cầu thường gặp và gợi ý câu trả lời cho Agent.',
    highlights: ['RAG Knowledge Base', 'AI Agent Copilot', 'Smart Human Handoff'],
    color: '#7c3aed',
    icon: 'bot',
  },
  {
    id: 'autoqa',
    name: 'AI Speech-to-Text & Auto-QA',
    category: 'AI & Automation',
    level: 'Tiên phong Ứng dụng (94%)',
    role: '100% Automated Quality Assurance',
    desc: 'Chuyển đổi giọng nói tiếng Việt đa vùng miền thành văn bản, phân tích cảm xúc (Sentiment Analysis) và chấm điểm 100% cuộc gọi.',
    highlights: ['100% Call Scoring', 'Sentiment Detection', 'Compliance Alerting'],
    color: '#e11d48',
    icon: 'shield',
  },
];

export const TechStackExplorerModal: React.FC<TechStackExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'CRM & Ticketing',
    'Cloud Contact Center',
    'Data & BI',
    'AI & Automation',
  ];

  const filtered =
    selectedCategory === 'ALL'
      ? TECH_PLATFORMS
      : TECH_PLATFORMS.filter((item) => item.category === selectedCategory);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hệ Sinh Thái Công Nghệ & Nền Tảng Quản Trị CSKH (Tech Stack)"
      maxWidth="4xl"
    >
      <div className="p-4 sm:p-6 font-play text-left space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full typo-button transition-all cursor-pointer border ${
                  active
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả nền tảng (6)' : cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[14px] border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <WebIcon name={item.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className="typo-badge font-mono font-bold px-2 py-0.5 rounded-[14px] inline-block mb-0.5"
                        style={{
                          backgroundColor: `${item.color}18`,
                          color: item.color,
                        }}
                      >
                        {item.category}
                      </span>
                      <h4 className="typo-h4 font-bold text-slate-900 dark:text-white leading-snug">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="typo-caption font-bold text-cyan-700 dark:text-cyan-400 mb-1.5">
                  {item.role} • {item.level}
                </p>
                <p className="typo-body-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {item.highlights.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-[14px] typo-badge font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
