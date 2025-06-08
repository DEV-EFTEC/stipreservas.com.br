export function checkBookingStatus(booking) {
  const issues = {
    neutral: [],
    refused: [],
  };

  // Lista de campos principais
  const mainFields = [
    { path: 'word_card_file_status', label: 'Carteira de Trabalho Digital' },
    { path: 'receipt_picture_status', label: 'Holerite recente' }
  ];

  mainFields.forEach(field => {
    const value = booking[field.path];
    if (value === 'neutral') issues.neutral.push(field.label);
    else if (value === 'refused') issues.refused.push(field.label);
  });

  // Checa os filhos, convidados e dependentes
  const subGroups = ['children', 'guests', 'dependents'];

  subGroups.forEach(group => {
    const items = booking[group] || [];
    items.forEach((item, index) => {
      if (item.medical_report_status === 'neutral' && item.disability === true) {
        issues.neutral.push(`${group}[${index}] - Laudo médico`);
      } else if (item.medical_report_status === 'refused') {
        issues.refused.push(`${group}[${index}] - Laudo médico`);
      }

      if (item.document_picture_status === 'neutral') {
        issues.neutral.push(`${group}[${index}] - Documento com foto`);
      } else if (item.document_picture_status === 'refused') {
        issues.refused.push(`${group}[${index}] - Documento com foto`);
      }
    });
  });

  // Decide qual cenário temos
  if (issues.neutral.length === 0 && issues.refused.length === 0) {
    return { status: 'approved', message: 'Todos os documentos foram aprovados.' };
  }

  if (issues.refused.length > 0) {
    return {
      status: 'refused',
      message: 'Alguns documentos foram recusados.',
      details: issues.refused,
    };
  }

  if (issues.neutral.length > 0) {
    return {
      status: 'neutral',
      message: 'Você esqueceu de revisar os seguintes documentos:',
      details: issues.neutral,
    };
  }
}
