import { MessageCircle } from 'lucide-react';

const DEFAULT_ZALO_LINK = 'https://zalo.me/84867081781';

export function StickyContactButton() {
  const zaloLink = (import.meta.env.VITE_ZALO_LINK as string | undefined) || DEFAULT_ZALO_LINK;

  const handleClick = () => {
    window.open(zaloLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#E62026] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:bg-[#c71d23] transition-all hover:scale-110 flex items-center justify-center group"
      aria-label="Liên hệ qua Zalo"
    >
      <MessageCircle size={28} className="group-hover:animate-pulse" />
    </button>
  );
}
