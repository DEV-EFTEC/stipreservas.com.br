export default function maskCNPJ(value) {
  return value
    .replace(/\D/g, "") // Remove tudo que não for dígito
    .replace(/^(\d{2})(\d)/, "$1.$2") // 00.000
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // 00.000.000
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // 00.000.000/0000
    .replace(/(\d{4})(\d)/, "$1-$2") // 00.000.000/0000-00
    .slice(0, 18); // Limita ao tamanho máximo
}
