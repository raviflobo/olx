export function openWhatsApp(phone, message) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  if (!digits) return;
  const text = encodeURIComponent(message || '');
  window.open(`https://wa.me/${digits}?text=${text}`, '_blank', 'noopener,noreferrer');
}

export function carInterestMessage(title) {
  return `Hi, I am interested in your ${title} listed on CARONSELL.`;
}

export function formatPriceIN(price) {
  if (price == null || Number.isNaN(Number(price))) return '—';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
