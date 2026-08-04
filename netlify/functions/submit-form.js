const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse form data
    const params = new URLSearchParams(event.body);

    const data = {
      name:       params.get('name')    || '',
      email:      params.get('email')   || '',
      phone:      params.get('phone')   || '',
      budget:     params.get('budget')  || '',
      services:   params.getAll('service'),
      message:    params.get('message') || '',
      source:     params.get('form-name') || 'unknown',
      submittedAt: new Date(),
    };

    // ── 1. Save to MongoDB ──────────────────────────────────────────
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('mathanlal_website');
    await db.collection('inquiries').insertOne(data);
    await client.close();

    // ── 2. Send Email to Gmail ──────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const servicesText = data.services.length > 0
      ? data.services.join(', ')
      : 'Not specified';

    await transporter.sendMail({
      from: `"Mathanlal Website" <${process.env.GMAIL_USER}>`,
      to:   process.env.NOTIFY_EMAIL,
      subject: `🔔 New Inquiry from ${data.name} — Mathanlal Website`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
            .body { padding: 30px; }
            .field { margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 16px; }
            .field:last-child { border-bottom: none; }
            .label { font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .value { font-size: 15px; color: #1e1e2e; line-height: 1.5; }
            .services-pill { display: inline-block; background: #ede9fe; color: #6366f1; border-radius: 20px; padding: 4px 12px; font-size: 13px; margin: 3px 3px 0 0; }
            .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; font-size: 13px; color: #888; }
            .reply-btn { display: inline-block; margin-top: 20px; background: #6366f1; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Project Inquiry!</h1>
              <p>Someone just submitted a form on your website</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone / WhatsApp</div>
                <div class="value">${data.phone || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Budget Range</div>
                <div class="value">${data.budget || 'Not specified'}</div>
              </div>
              <div class="field">
                <div class="label">Services Needed</div>
                <div class="value">
                  ${data.services.length > 0
                    ? data.services.map(s => `<span class="services-pill">${s}</span>`).join('')
                    : 'Not specified'}
                </div>
              </div>
              <div class="field">
                <div class="label">Project Details</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="field">
                <div class="label">Form Source</div>
                <div class="value">${data.source}</div>
              </div>
              <div class="field">
                <div class="label">Submitted At</div>
                <div class="value">${data.submittedAt.toUTCString()}</div>
              </div>
              <div style="text-align:center;">
                <a href="mailto:${data.email}?subject=Re: Your Project Inquiry" class="reply-btn">
                  Reply to ${data.name} →
                </a>
              </div>
            </div>
            <div class="footer">
              This email was sent automatically from your website contact form.<br>
              Data is also saved in your MongoDB Atlas database.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // ── 3. Redirect to Thank You page ───────────────────────────────
    return {
      statusCode: 302,
      headers: { Location: '/thank-you.html' },
      body: '',
    };

  } catch (error) {
    console.error('Form submission error:', error);
    return {
      statusCode: 302,
      headers: { Location: '/thank-you.html?error=1' },
      body: '',
    };
  }
};
