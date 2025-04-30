const utcCreatedOn = new Date(); // agora, em UTC
const expiresAt = new Date(utcCreatedOn.getTime() + 30 * 60 * 1000); // soma 30 minutos

console.log({
  utc_created_on: utcCreatedOn.toISOString(),
  expires_at: expiresAt.toISOString()
});
