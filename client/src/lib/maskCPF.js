export default function maskCPF(value) {
  return value
    .replace(/\D/g, '')                      // Remove não dígitos
    .replace(/^(\d{3})(\d)/, '$1.$2')        // 123.456...
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // 123.456.789...
    .replace(/\.(\d{3})(\d)/, '.$1-$2')      // 123.456.789-00
    .slice(0, 14);                           // Limita a 14 caracteres
}
