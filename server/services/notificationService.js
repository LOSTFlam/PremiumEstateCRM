const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const verifyEmailConnection = async () => {
  if (!resend) {
    // Console statement removed
    return false;
  }
  try {
    // Console statement removed
    return true;
  } catch (error) {
    // Console statement removed
    return false;
  }
};

const createUserConfirmationTemplate = (data) => ({
  subject: '✅ Ваша заявка принята | Premium Estate CRM',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><style>
      body { font-family: 'Inter', sans-serif; background: #f8f9fa; padding: 20px; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #D4AF37, #F5D076); padding: 30px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 24px; }
      .content { padding: 30px; }
      .info-box { background: #FFF9E6; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 0 12px 12px 0; }
      .footer { background: #1a1a2e; color: #9CA3AF; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h1>✨ Premium Estate CRM</h1></div>
        <div class="content">
          <h2>Здравствуйте, ${data.userName || data.fullName}! 👋</h2>
          <p>Ваша заявка успешно принята и уже в работе.</p>
          <div class="info-box">
            <strong>📋 Детали заявки:</strong><br>
            ${data.propertyName ? `• Объект: ${data.propertyName}<br>` : ''}
            • Имя: ${data.userName || data.fullName}<br>
            • Телефон: ${data.userPhone || data.phoneNumber}<br>
            • Email: ${data.userEmail || data.email}<br>
            • Сообщение: ${data.message || 'Не указано'}<br>
            • Дата: ${new Date().toLocaleString('ru-RU')}
          </div>
          <p>🎯 Наш менеджер свяжется с вами в течение <strong>15 минут</strong>.</p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} Premium Estate CRM. Все права защищены.</div>
      </div>
    </body>
    </html>`,
});

const createAdminNotificationTemplate = (data) => ({
  subject: `🔔 Новая заявка от ${data.userName || data.fullName} | Premium Estate`,
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><style>
      body { font-family: monospace; background: #0F172A; color: #E2E8F0; padding: 20px; margin: 0; }
      .container { max-width: 700px; margin: 0 auto; background: #1E293B; border-radius: 16px; padding: 25px; border: 1px solid #334155; }
      .header { border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; }
      .header h2 { color: #F5D076; margin: 0; }
      .alert { background: #DC2626; color: white; padding: 10px 15px; border-radius: 8px; margin: 15px 0; font-weight: 600; }
      .data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155; }
      .label { color: #94A3B8; }
      .value { font-weight: 600; color: #F1F5F9; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h2>🔔 НОВАЯ ЗАЯВКА</h2><p style="margin:5px 0 0;color:#94A3B8;">${new Date().toLocaleString('ru-RU')}</p></div>
        <div class="alert">⚡ Требует внимания!</div>
        <div class="data-row"><span class="label">Имя:</span><span class="value">${data.userName || data.fullName}</span></div>
        <div class="data-row"><span class="label">Телефон:</span><span class="value">${data.userPhone || data.phoneNumber}</span></div>
        <div class="data-row"><span class="label">Email:</span><span class="value">${data.userEmail || data.email}</span></div>
        ${data.propertyName ? `<div class="data-row"><span class="label">Объект:</span><span class="value">${data.propertyName}</span></div>` : ''}
        <div class="data-row"><span class="label">Сообщение:</span><span class="value">${data.message || '—'}</span></div>
        <div class="data-row"><span class="label">IP:</span><span class="value">${data.ipAddress || 'Не определён'}</span></div>
      </div>
    </body>
    </html>`,
});

const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    // Console statement removed
    return { success: true, mock: true };
  }
  try {
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const { data, error } = await resend.emails.send({
      from: `Premium Estate CRM <${fromEmail}>`,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Console statement removed
    return { success: true, id: data?.id };
  } catch (error) {
    // Console statement removed
    return { success: false, error: error.message };
  }
};

const sendUserConfirmation = async (data) => {
  const template = createUserConfirmationTemplate(data);
  return sendEmail({ to: data.userEmail || data.email, ...template });
};

const sendAdminNotification = async (data) => {
  const template = createAdminNotificationTemplate(data);
  return sendEmail({ to: process.env.ADMIN_EMAIL || 'cahek1234500000@gmail.com', ...template });
};

const sendUserSms = async (phoneNumber, data) => {
  const message = `✅ Premium Estate: Ваша заявка принята! Менеджер свяжется с вами в течение 15 минут. ${data.propertyName ? `Объект: ${data.propertyName}` : ''}`;
  if (!process.env.TWILIO_ACCOUNT_SID && !process.env.SMSC_LOGIN) {
    // Console statement removed
    return { success: true, mock: true };
  }
  // Console statement removed
  return { success: true, mock: true };
};

module.exports = {
  verifyEmailConnection,
  sendEmail,
  sendUserConfirmation,
  sendAdminNotification,
  sendUserSms,
};
