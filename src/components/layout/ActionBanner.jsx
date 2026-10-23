import React, { useState } from 'react';

export default function ActionBanner({ description }) {
  const [copied, setCopied] = useState(false);

  // Copy current URL to clipboard with fallback confirmation
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Open WhatsApp Web/App prefilled with tournament link
  const handleShareWhatsApp = () => {
    const shareMessage = encodeURIComponent(`View tournament pairings and live standings: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${shareMessage}`, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-6 border-b border-[#E8E2D9] text-stone-600 text-sm">
      <p className="max-w-3xl leading-relaxed">
        {description || (
          "Before the start of each round, pairings will be announced promptly to ensure fair matchups and exciting encounters. After the completion of each round, we will promptly publish detailed results on our website, including individual game outcomes and overall standings."
        )}
      </p>

      <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-stone-800 rounded-full font-medium transition-colors text-xs border border-[#DFD7CA]"
        >
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* WhatsApp Share Button */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-stone-800 rounded-full font-medium transition-colors text-xs border border-[#DFD7CA]"
        >
          <span>Share on WhatsApp</span>
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.18-.543-1.613-.67-2.616-2.316-2.696-2.423-.08-.107-.648-.862-.648-1.644 0-.782.408-1.168.552-1.328.144-.16.312-.2.416-.2.104 0 .208.001.3.006.096.005.224-.037.35.265.129.312.44 1.072.48 1.152.04.08.064.174.016.273-.048.099-.072.16-.144.246-.072.086-.153.193-.217.26-.072.072-.148.15-.064.294.084.144.372.613.799.993.548.488 1.01.639 1.154.711.144.072.228.064.312-.033.084-.096.36-.42.456-.564.096-.144.192-.12.32-.072.128.048.816.384.957.456.14.072.234.108.268.168.034.06.034.348-.11.753z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}