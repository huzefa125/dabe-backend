// import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }) {
    // Automatically set Public permissions for all our custom APIs so the frontend can fetch them
    try {
      const roleService = strapi.plugin('users-permissions').service('role');
      const roles = await roleService.find();
      const publicRole = roles.find((r) => r.type === 'public');

      if (publicRole) {
        const publicRoleWithPermissions = await roleService.findOne(publicRole.id);
        const permissionsToEnable = [
          'api::player.player.find',
          'api::player.player.findOne',
          'api::service.service.find',
          'api::service.service.findOne',
          'api::staff.staff.find',
          'api::staff.staff.findOne',
          'api::hero.hero.find',
          'api::testimonial.testimonial.find',
          'api::stat.stat.find',
          'api::office.office.find',
          'api::mission.mission.find',
          'api::global-reach.global-reach.find',
          'api::fifa-section.fifa-section.find',
          'api::cta-section.cta-section.find',
          'api::about-agency.about-agency.find',
          'api::navbar-button.navbar-button.find',
          'api::post.post.find',
          'api::post.post.findOne',
          'api::site-config.site-config.find',
          'api::contact-message.contact-message.create',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
        ];

        let permissionsUpdated = false;
        
        for (const action of permissionsToEnable) {
          const [api, controller, actionName] = action.split('.');
          if (!publicRoleWithPermissions.permissions[api]) {
            publicRoleWithPermissions.permissions[api] = { controllers: {} };
          }
          if (!publicRoleWithPermissions.permissions[api].controllers[controller]) {
            publicRoleWithPermissions.permissions[api].controllers[controller] = {};
          }
          
          if (!publicRoleWithPermissions.permissions[api].controllers[controller][actionName]) {
             publicRoleWithPermissions.permissions[api].controllers[controller][actionName] = { enabled: true };
             permissionsUpdated = true;
          } else if (publicRoleWithPermissions.permissions[api].controllers[controller][actionName].enabled !== true) {
             publicRoleWithPermissions.permissions[api].controllers[controller][actionName].enabled = true;
             permissionsUpdated = true;
          }
        }

        if (permissionsUpdated) {
          await roleService.updateRole(publicRole.id, publicRoleWithPermissions);
          console.log('✅ Automatically enabled Public permissions for DABE APIs.');
        }
      }
    } catch (err) {
      console.log('Could not auto-configure permissions:', err.message);
    }

    // Seed FAQs if empty
    try {
      const faqCount = await strapi.entityService.count('api::faq.faq');
      if (faqCount === 0) {
        const defaultFaqs = [
          {
            question: 'How do I apply for representation or scouting?',
            answer: 'You can submit your CV, Transfermarkt profile link, and video highlights via our contact form. Our scouting team reviews submissions weekly and will reach out if there is a potential fit.',
            order: 1,
            publishedAt: new Date(),
          },
          {
            question: 'What services does DABE provide to players?',
            answer: 'We offer end-to-end career management including contract negotiation, international transfer advisory, brand sponsorships, legal support, financial planning, and personal lifestyle management.',
            order: 2,
            publishedAt: new Date(),
          },
          {
            question: 'Are your agents licensed by FIFA?',
            answer: 'Yes. All principal agents at DABE Sport Agency hold active FIFA Football Agent licenses and operate strictly under the FIFA Football Agent Regulations (FFAR).',
            order: 3,
            publishedAt: new Date(),
          },
          {
            question: 'Which leagues and regions do you operate in?',
            answer: 'We have active offices in Lagos, Nigeria and Toronto, Canada, establishing a global network across Europe (Ligue 1, Belgian Pro League), North America (MLS), Africa, and the Gulf region.',
            order: 4,
            publishedAt: new Date(),
          },
        ];

        for (const faq of defaultFaqs) {
          await strapi.entityService.create('api::faq.faq', { data: faq });
        }
        console.log('✅ Seeded default FAQs in the database.');
      }
    } catch (err) {
      console.log('Could not seed default FAQs:', err.message);
    }
  },
};
