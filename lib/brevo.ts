import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: Number(process.env.BREVO_SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
  }
  return transporter;
}

function wrapTemplate(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f7f8fa;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f8fa;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#091f46;padding:32px;text-align:center;">
                <span style="color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Luzon Prime</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 12px;color:#111827;font-size:20px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#f7f8fa;text-align:center;">
                <span style="color:#9ca3af;font-size:12px;">
                  &copy; Luzon Prime Realtors &middot; info@luzonprime.com
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const paragraph = (text: string) =>
  `<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">${text}</p>`;

export interface InquiryConfirmationParams {
  name: string;
  propertyTitle?: string;
}

export interface BookingConfirmationParams {
  name: string;
  propertyTitle?: string;
  scheduledAt: string;
}

export interface WelcomeEmailParams {
  name?: string;
}

export interface AdminLeadAlertParams {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyTitle?: string;
}

export type EmailTemplateMap = {
  inquiry_confirmation: InquiryConfirmationParams;
  booking_confirmation: BookingConfirmationParams;
  welcome_email: WelcomeEmailParams;
  admin_lead_alert: AdminLeadAlertParams;
};

function renderTemplate<T extends keyof EmailTemplateMap>(
  templateId: T,
  params: EmailTemplateMap[T]
): { subject: string; html: string } {
  switch (templateId) {
    case "inquiry_confirmation": {
      const p = params as InquiryConfirmationParams;
      return {
        subject: "We received your inquiry",
        html: wrapTemplate(
          "We received your inquiry",
          paragraph(
            `Hi ${p.name}, thanks for reaching out${
              p.propertyTitle ? ` about <strong>${p.propertyTitle}</strong>` : ""
            }. One of our agents will get back to you shortly.`
          )
        ),
      };
    }
    case "booking_confirmation": {
      const p = params as BookingConfirmationParams;
      return {
        subject: "Your consultation is confirmed",
        html: wrapTemplate(
          "Your consultation is confirmed",
          paragraph(
            `Hi ${p.name}, your consultation${
              p.propertyTitle ? ` for <strong>${p.propertyTitle}</strong>` : ""
            } is scheduled for <strong>${p.scheduledAt}</strong>. We look forward to speaking with you.`
          )
        ),
      };
    }
    case "welcome_email": {
      const p = params as WelcomeEmailParams;
      return {
        subject: "Welcome to Luzon Prime Realtors",
        html: wrapTemplate(
          "Welcome to Luzon Prime Realtors",
          paragraph(
            `Hi ${p.name ?? "there"}, you're now subscribed to Luzon Prime Realtors updates. Expect new listings, market insights, and off-market opportunities in your inbox.`
          )
        ),
      };
    }
    case "admin_lead_alert": {
      const p = params as AdminLeadAlertParams;
      return {
        subject: "New lead received",
        html: wrapTemplate(
          "New lead received",
          [
            paragraph(`<strong>${p.name}</strong> (${p.email}${p.phone ? `, ${p.phone}` : ""}) just submitted an inquiry${p.propertyTitle ? ` about <strong>${p.propertyTitle}</strong>` : ""}.`),
            p.message ? paragraph(p.message) : "",
          ].join("")
        ),
      };
    }
    default:
      throw new Error(`Unknown email template: ${String(templateId)}`);
  }
}

export async function sendEmail<T extends keyof EmailTemplateMap>(
  to: string,
  templateId: T,
  params: EmailTemplateMap[T]
) {
  const { subject, html } = renderTemplate(templateId, params);

  await getTransporter().sendMail({
    from: `"Luzon Prime Realtors" <${process.env.SMTP_FROM_EMAIL ?? "info@luzonprime.com"}>`,
    to,
    subject,
    html,
  });
}
