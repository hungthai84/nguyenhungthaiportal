import React, { Component, ErrorInfo, ReactNode } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let readable = error.message || 'Unexpected application error';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed.error === 'string') {
        readable = parsed.error;
      }
    } catch {
      // keep raw message
    }
    return {
      hasError: true,
      message: readable,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isEn =
        typeof document !== 'undefined' &&
        document.documentElement.lang?.toLowerCase().startsWith('en');

      return (
        <div
          role="alert"
          className="w-screen h-screen flex items-center justify-center p-6 font-play"
          style={{ background: 'var(--bg-main, #f8fafc)', color: 'var(--text-primary, #0f172a)' }}
        >
          <div
            className="bento-card glass-card max-w-md w-full p-6 rounded-[var(--radius-global,16px)] border flex flex-col gap-4 shadow-xl"
            style={{
              background: 'var(--bg-card, rgba(255,255,255,0.92))',
              borderColor: 'var(--border-color, rgba(148,163,184,0.3))',
            }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="card-header-sync flex items-center gap-2 text-rose-500">
                <WebIcon name="alert-circle" className="w-5 h-5 shrink-0" />
                <h2
                  className="typo-h4 card-title-synced font-bold text-rose-500 m-0"
                  data-card-title="true"
                  style={{ textTransform: 'none' }}
                >
                  {isEn ? 'Something went wrong' : 'Đã xảy ra sự cố hiển thị'}
                </h2>
              </div>
              <p className="typo-caption m-0" style={{ color: 'var(--text-muted, #64748b)' }}>
                {isEn
                  ? 'An unexpected error occurred while rendering this section.'
                  : 'Hệ thống gặp sự cố ngoài ý muốn khi xử lý nội dung này.'}
              </p>
            </div>
            {this.state.message && (
              <p
                className="typo-body-sm p-3 rounded-[var(--radius-subcard,12px)] border break-words m-0"
                style={{
                  background: 'var(--bg-subcard, rgba(241,245,249,0.8))',
                  borderColor: 'var(--border-subcard, rgba(148,163,184,0.25))',
                }}
              >
                {this.state.message}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-full typo-button font-semibold border border-[var(--border-subcard)] text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-all cursor-pointer"
                style={{ background: 'var(--bg-subcard)' }}
              >
                {isEn ? 'Reload Page' : 'Tải lại trang'}
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: 'var(--bg-button-primary)',
                  color: 'var(--text-button-primary, #FFFFFF)',
                }}
                className="px-4 py-2 rounded-full typo-button font-bold shadow-sm hover:brightness-110 transition-all cursor-pointer"
              >
                {isEn ? 'Try Again' : 'Thử lại'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
