export default {
  async afterCreate(event) {
    const { result } = event;

    try {
      await strapi.plugin('email').service('email').send({
        to: 'info@dabe.com', // Placeholder for agency email
        from: 'no-reply@dabe.com',
        subject: `New Contact Request: ${result.name}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #051024; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(255, 215, 0, 0.2);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffd700; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Dabe Sport Agency</h1>
            </div>
            
            <div style="background-color: rgba(255, 255, 255, 0.03); padding: 30px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 18px; border-bottom: 1px solid rgba(255, 215, 0, 0.2); padding-bottom: 15px; margin-bottom: 20px;">New Inquiry Received</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #888888; width: 100px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff;"><strong>${result.name}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #888888;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffd700;">
                    <a href="mailto:${result.email}" style="color: #ffd700; text-decoration: none;">${result.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #888888;">Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff;">${result.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #888888;">Type</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff;">${result.type || 'N/A'}</td>
                </tr>
              </table>
              
              <div style="margin-top: 25px;">
                <p style="color: #888888; font-size: 14px; margin-bottom: 10px;">Message:</p>
                <div style="background-color: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; color: #ffffff; line-height: 1.6; border-left: 3px solid #ffd700;">
                  ${result.message}
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666666;">
              <p>This email was generated automatically by the Dabe Sport Agency website.</p>
            </div>
          </div>
        `,
      });
      console.log('Successfully triggered contact email notification.');
    } catch (err) {
      console.error('Failed to send contact email. Setup SMTP provider:', err);
    }
  },
};
