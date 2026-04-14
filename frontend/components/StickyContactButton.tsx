import { MessageCircle } from 'lucide-react';

export function StickyContactButton() {
  const handleClick = () => {
    // This would link to Zalo or Messenger in production
    window.open('[YOUR_ZALO_OR_MESSENGER_LINK_HERE]', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#E62026] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:bg-[#c71d23] transition-all hover:scale-110 flex items-center justify-center group"
      aria-label="Liên hệ ngay"
    >
      <MessageCircle size={28} className="group-hover:animate-pulse" />
    </button>
  );
}
