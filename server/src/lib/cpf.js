export function calculateVerifyDigits(cpf) {
    let plus, rest;
    plus = cpf.split('').reduce((acc, cur, i) => acc + cur * (10 - i), 0);
    rest = (plus * 10) % 11;
    let firstDigit = rest === 10 ? 0 : rest;
    plus = cpf.split('').reduce((acc, cur, i) => acc + cur * (11 - i), firstDigit * 2);
    rest = (plus * 10) % 11;
    let secondDigit = rest === 10 ? 0 : rest;
    return `${firstDigit}${secondDigit}`;
}

export function generateValidCPF() {
    let cpf = Array.from({length: 9}, () => Math.floor(Math.random() * 9)).join('');
    cpf += calculateVerifyDigits(cpf);
    return cpf;
}

export function formatCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}