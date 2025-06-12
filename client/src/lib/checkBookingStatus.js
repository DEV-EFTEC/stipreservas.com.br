export function checkBookingStatus(booking, dependents = [], guests = [], children = []) {
  const issues = {
    neutral: [],
    refused: [],
  };

  // Campos principais
  const mainFields = [
    { path: 'word_card_file_status', label: 'Carteira de Trabalho Digital' },
    { path: 'receipt_picture_status', label: 'Holerite recente' }
  ];

  mainFields.forEach(field => {
    const value = booking[field.path];
    if (value === 'neutral') issues.neutral.push(field.label);
    else if (value === 'refused') issues.refused.push(field.label);
  });

  // Função auxiliar para verificar cada grupo
  const checkGroup = (group, groupName) => {
    group.forEach(item => {
      if (item.medical_report_status === 'neutral' && item.disability === true) {
        issues.neutral.push(`${item.name} - Laudo médico`);
      } else if (item.medical_report_status === 'refused') {
        issues.refused.push(`${item.name} - Laudo médico`);
      }

      if (item.document_picture_status === 'neutral') {
        issues.neutral.push(`${item.name} - Documento com foto`);
      } else if (item.document_picture_status === 'refused') {
        issues.refused.push(`${item.name} - Documento com foto`);
      }
    });
  };

  checkGroup(children, 'children');
  checkGroup(guests, 'guests');
  checkGroup(dependents, 'dependents');

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

  return {
    status: 'neutral',
    message: 'Você esqueceu de revisar os seguintes documentos:',
    details: issues.neutral,
  };
}
