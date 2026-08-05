'use client';

import { useState } from 'react';

interface ArticleDetailClientProps {
  articleSlug: string;
  articleTitle: string;
}

export default function ArticleDetailClient({
  articleSlug,
  articleTitle,
}: ArticleDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const url = 'https://webdrop.store/help/articles/' + articleSlug;
    const text = articleTitle;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
        break;
      case 'twitter':
        shareUrl = 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl;
        break;
      case 'linkedin':
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div className="help-sidebar-widget">
      <h3 className="hsw-title">Chia sẻ bài viết</h3>
      <div className="hsw-share-buttons">
        <button
          onClick={() => handleShare('facebook')}
          className="share-btn share-facebook"
          aria-label="Chia sẻ trên Facebook"
          title="Facebook"
        >
          f
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="share-btn share-twitter"
          aria-label="Chia sẻ trên Twitter"
          title="Twitter"
        >
          𝕏
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="share-btn share-linkedin"
          aria-label="Chia sẻ trên LinkedIn"
          title="LinkedIn"
        >
          in
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="share-btn share-copy"
          aria-label="Sao chép liên kết"
          title="Sao chép"
        >
          {copied ? '✓' : '🔗'}
        </button>
      </div>

      <div className="hsw-divider" />

      <div className="hsw-cta">
        <h4>Cần thêm giúp đỡ?</h4>
        <p>Liên hệ với chúng tôi để được hỗ trợ trực tiếp.</p>
        <a href="/contact" className="hsw-cta-btn">
          Liên hệ ngay
        </a>
      </div>
    </div>
  );
}