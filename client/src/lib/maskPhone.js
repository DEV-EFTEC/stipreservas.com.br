export default function maskPhone(value) {
  return value
    .replace(/\D/g, '')                               // Remove tudo que não for dígito
    .replace(/^(\d{2})(\d)/, '+$1 ($2')               // +55 (
    .replace(/\+(\d{2})\s\((\d{2})(\d)/, '+$1 ($2) $3') // +55 (11) 9
    .replace(/(\d{5})(\d)/, '$1-$2')                  // 99999-0000
    .slice(0, 19);                                    // Limita ao tamanho máximo
}
