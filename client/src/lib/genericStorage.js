export async function sendDocument(
  file,
  userId,
  associationId,
  documentsAssociation,
  documentType
) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  formData.append('association_id', associationId);
  formData.append('documents_association', documentsAssociation);
  formData.append('document_type', documentType);

  const response = await fetch(`http://localhost:3301/storage/send-document`, {
    headers: { 'Authorization': `Bearer ${token}` },
    method: "POST",
    body: formData
  }).then(res => res.json());

  return response;
}