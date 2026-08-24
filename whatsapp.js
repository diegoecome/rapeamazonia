import { formatPrice } from '@/lib/format';

export function buildWhatsAppLink({ number, items, total, customer }) {
  const lines = [];
  lines.push('Olá! Gostaria de fazer um pedido.');
  lines.push('');
  lines.push('*Produtos:*');
  items.forEach((i) => {
    lines.push(`• ${i.name} — Qtd: ${i.qty} — ${formatPrice(i.price * i.qty)}`);
  });
  lines.push('');
  lines.push(`*Total: ${formatPrice(total)}*`);

  if (customer) {
    lines.push('');
    if (customer.name) lines.push(`Nome: ${customer.name}`);
    if (customer.phone) lines.push(`Telefone: ${customer.phone}`);
    if (customer.address) lines.push(`Endereço: ${customer.address}`);
    if (customer.notes) lines.push(`Observações: ${customer.notes}`);
  }

  lines.push('');
  lines.push('Gostaria de receber informações sobre pagamento e envio.');

  const text = encodeURIComponent(lines.join('\n'));
  const cleanNumber = (number || '').replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${text}`;
}
