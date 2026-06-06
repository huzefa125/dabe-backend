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

    // --- SEED SINGLE TYPES ---
    
    // Hero
    if (await strapi.db.query('api::hero.hero').count() === 0) {
      await strapi.db.query('api::hero.hero').create({ data: {
        title: "Building Global Football Careers.",
        subtitle: "FIFA Licensed · Est. 2014",
        description: "From Lagos to Toronto to the world's elite leagues — DABE represents the players, manages the deals, and protects the careers that define modern football.",
        primaryButtonText: "Become a Client",
        primaryButtonLink: "/contact",
        primaryButtonStyle: "primary",
        secondaryButtonText: "Get Scouted",
        secondaryButtonLink: "/contact",
        secondaryButtonStyle: "secondary",
        backgroundColor: "transparent",
        textColor: "#ffffff",
        accentColor: "#ffd700",
        parallaxEnabled: true,
        animationStyle: "fade",
        enabled: true,
        publishedAt: new Date()
      }});
    }

    // FifaSection
    if (await strapi.db.query('api::fifa-section.fifa-section').count() === 0) {
      await strapi.db.query('api::fifa-section.fifa-section').create({ data: {
        title: "A higher standard of representation.",
        description: "Every transfer, every contract, every endorsement — executed under the FIFA Football Agent Regulations. Full transparency. Documented compliance. Career-long accountability.",
        buttonText: "Our compliance framework",
        buttonLink: "/fifa-compliance",
        publishedAt: new Date()
      }});
    }

    // GlobalReach
    if (await strapi.db.query('api::global-reach.global-reach').count() === 0) {
      await strapi.db.query('api::global-reach.global-reach').create({ data: {
        title: "Two hubs.<br />One worldwide network.",
        description: "Our Lagos and Toronto offices anchor a network of scouts, lawyers, and partner agencies across 32 countries — placing players in the clubs and leagues where their careers belong.",
        publishedAt: new Date()
      }});
    }

    // CTASection
    if (await strapi.db.query('api::cta-section.cta-section').count() === 0) {
      await strapi.db.query('api::cta-section.cta-section').create({ data: {
        label: "Ready When You Are",
        title: "Your career, |elevated.",
        description: "Whether you're a player, a club, or a brand — let's build something that lasts longer than a season.",
        primaryButtonText: "Become a Client",
        primaryButtonLink: "/contact",
        secondaryButtonText: "Get Scouted",
        secondaryButtonLink: "/contact",
        publishedAt: new Date()
      }});
    }

    // NavbarButton
    if (await strapi.db.query('api::navbar-button.navbar-button').count() === 0) {
      await strapi.db.query('api::navbar-button.navbar-button').create({ data: {
        text: "Become a Client",
        link: "/contact",
        publishedAt: new Date()
      }});
    }

    // AboutAgency
    if (await strapi.db.query('api::about-agency.about-agency').count() === 0) {
      await strapi.db.query('api::about-agency.about-agency').create({ data: {
        label: "About the Agency",
        title: "Who We |Are",
        paragraphs: "Dabe Sport Agency Limited is a premier, private limited liability sports management company built on a foundation of integrity, professionalism, and industry excellence. Operating in Africa, North America and Europe, our agency was founded by a visionary team of corporate and sports professionals—with a shared commitment to elevating athletic talent onto the global stage.\n\nWe serve as a vital bridge between exceptional football talent and world-class sporting opportunities. By blending regulatory expertise with a deep passion for the beautiful game, Dabe Sport Agency Limited provides elite representation and comprehensive career lifecycle management for professional football players, coaches, and clubs worldwide.",
        publishedAt: new Date()
      }});
    }

    // Mission
    if (await strapi.db.query('api::mission.mission').count() === 0) {
      await strapi.db.query('api::mission.mission').create({ data: {
        label: "Our Core Mission",
        title: "At Dabe Sport Agency Limited, we believe an athlete's focus should remain entirely on their performance.",
        description: "Our approach is holistic; we don't just negotiate contracts—we build enduring brands, safeguard financial futures, and protect the personal development of the individuals who trust us with their careers. We operate with a strict global mindset, ensuring our clients have access to international markets while remaining fully anchored in elite professional standards.",
        publishedAt: new Date()
      }});
    }

    // Site Config
    if (await strapi.db.query('api::site-config.site-config').count() === 0) {
      await strapi.db.query('api::site-config.site-config').create({ data: {
        phone1: "+234 806 618 1783",
        phone2: "+1 709 853 5992",
        whatsappUrl: "https://wa.me/2348066181783",
        addressNigeria: "Victoria Island, Lagos, Nigeria",
        addressNorthAmerica: "157 Higgins Line, St John's, NL Canada A1B 2Y8",
        linkedinUrl: "https://linkedin.com/company/dabe-sport-agency",
        instagramUrl: "https://instagram.com/dabe_sport",
        twitterUrl: "#",
        youtubeUrl: "#",
        footerAboutText: "A FIFA-licensed football agency building global careers for elite talent. Headquartered between Lagos and Toronto, representing players across four continents.",
        copyrightText: "DABE Sport Agency. All rights reserved.",
        publishedAt: new Date()
      }});
    }


    // --- SEED COLLECTION TYPES ---

    // Players
    if (await strapi.db.query('api::player.player').count() === 0) {
      const players = [
        { slug: "emeka-okafor", name: "Emeka Okafor", position: "Forward", nationality: "Nigeria", club: "Stade Rennais FC", league: "Ligue 1", age: 22, apps: 87, goals: 41, assists: 18, achievements: "U-20 AFCON Top Scorer, Ligue 1 Young Player Nominee 2024", isFeatured: true },
        { slug: "marcus-adeyemi", name: "Marcus Adeyemi", position: "Midfielder", nationality: "Canada", club: "Toronto FC", league: "MLS", age: 24, apps: 134, goals: 22, assists: 47, achievements: "MLS All-Star 2024, Canadian Championship Winner", isFeatured: true },
        { slug: "luca-bertoni", name: "Luca Bertoni", position: "Goalkeeper", nationality: "Italy", club: "FC Lugano", league: "Swiss Super League", age: 26, apps: 198, goals: 0, assists: 2, achievements: "Golden Glove 2023, 21 Clean Sheets — Season Record", isFeatured: true },
        { slug: "kofi-mensah", name: "Kofi Mensah", position: "Defender", nationality: "Ghana", club: "Royal Antwerp FC", league: "Belgian Pro League", age: 23, apps: 76, goals: 6, assists: 9, achievements: "AFCON Bronze 2023, Team of the Season 2024", isFeatured: true },
      ];
      for (const p of players) await strapi.db.query('api::player.player').create({ data: { ...p, publishedAt: new Date() } });
    }

    // Posts
    if (await strapi.db.query('api::post.post').count() === 0) {
      const posts = [
        { slug: "summer-window-2025", title: "Summer Window 2025: The African Talent Reshaping Europe", excerpt: "Why scouts across Ligue 1, Bundesliga and the Eredivisie are flying to Lagos this summer.", category: "Transfers", readTime: "6 min", publishedAtDate: "2026-05-20" },
        { slug: "fifa-agent-regulations", title: "Inside the New FIFA Agent Regulations", excerpt: "What the latest reforms mean for players, clubs and the agencies who represent them.", category: "Regulation", readTime: "8 min", publishedAtDate: "2026-05-12" },
        { slug: "canada-rising", title: "Canada Rising: Building a North American Football Pipeline", excerpt: "Our Toronto office on the MLS boom, Canadian internationals, and the road to 2026.", category: "Insight", readTime: "5 min", publishedAtDate: "2026-04-30" },
        { slug: "image-rights", title: "Image Rights in the Streaming Era", excerpt: "How the modern athlete builds — and protects — a global commercial identity.", category: "Commercial", readTime: "7 min", publishedAtDate: "2026-04-18" },
      ];
      for (const p of posts) await strapi.db.query('api::post.post').create({ data: { ...p, publishedAt: new Date() } });
    }

    // Services
    if (await strapi.db.query('api::service.service').count() === 0) {
      const services = [
        { title: "Player Representation", description: "End-to-end career management — from grassroots to elite competition.", icon: "Trophy", order: 1 },
        { title: "Contract Negotiation", description: "FIFA-compliant deal-making that protects long-term value and earnings.", icon: "FileSignature", order: 2 },
        { title: "International Transfers", description: "Cross-border moves across Europe, North America, Africa and the Gulf.", icon: "Globe", order: 3 },
        { title: "Sponsorship & Brand", description: "Endorsements, image rights, and commercial partnerships built to last.", icon: "Sparkles", order: 4 },
        { title: "Talent Scouting", description: "Identifying future stars across academies and emerging markets.", icon: "Search", order: 5 },
        { title: "Mentorship & Performance", description: "Personal development, media training, and elite performance coaching.", icon: "HeartHandshake", order: 6 },
        { title: "Financial Advisory", description: "Wealth structuring, tax planning, and post-career investment.", icon: "Landmark", order: 7 },
        { title: "Legal Counsel", description: "Disputes, image rights, and contract enforcement worldwide.", icon: "Scale", order: 8 },
      ];
      for (const s of services) await strapi.db.query('api::service.service').create({ data: { ...s, publishedAt: new Date() } });
    }

    // Testimonials
    if (await strapi.db.query('api::testimonial.testimonial').count() === 0) {
      const testimonials = [
        { name: "Emeka Okafor", role: "Forward · Ligue 1", quote: "DABE didn't just negotiate a contract — they architected a career. The move to Europe felt seamless.", order: 1 },
        { name: "Marcus Adeyemi", role: "Midfielder · MLS", quote: "Transparent, ethical, and relentless. Exactly the kind of representation modern players deserve.", order: 2 },
        { name: "Kofi Mensah", role: "Defender · Belgian Pro League", quote: "Their global network opened doors I didn't know existed. True professionals at every level.", order: 3 },
      ];
      for (const t of testimonials) await strapi.db.query('api::testimonial.testimonial').create({ data: { ...t, publishedAt: new Date() } });
    }

    // Staff
    if (await strapi.db.query('api::staff.staff').count() === 0) {
      const staff = [
        { name: "Emmanuel Oluwole", role: "Managing Director and Lead Agent", bio: "Licensed football agent with over six years of business experience...", order: 1 },
        { name: "Daniel Ikuromo", role: "Talent Scout and Recruitment Strategist", bio: "Analytical and detail-oriented talent scout leveraging a strong background in Economics...", order: 2 },
        { name: "Anetemoh Etiuzale", role: "Marketing and Media Relations", bio: "Data-driven marketing professional with a Master's in Business Analytics...", order: 3 },
        { name: "Segun Afolabi", role: "Player Liaison and Scout", bio: "Experienced player liaison with over 23 years in solution design and technical consultancy...", order: 4 },
      ];
      for (const s of staff) await strapi.db.query('api::staff.staff').create({ data: { ...s, publishedAt: new Date() } });
    }

    // Stats
    if (await strapi.db.query('api::stat.stat').count() === 0) {
      const stats = [
        { value: "120+", label: "Players Represented", order: 1 },
        { value: "32", label: "Countries Active", order: 2 },
        { value: "€480M", label: "Transfer Value Negotiated", order: 3 },
        { value: "11", label: "Years FIFA Licensed", order: 4 },
      ];
      for (const s of stats) await strapi.db.query('api::stat.stat').create({ data: { ...s, publishedAt: new Date() } });
    }

    // Offices
    if (await strapi.db.query('api::office.office').count() === 0) {
      const offices = [
        { city: "Lagos", country: "Nigeria", note: "HQ · West Africa", mapX: "50%", mapY: "50%", isHub: true },
        { city: "Toronto", country: "Canada", note: "North America", mapX: "30%", mapY: "35%", isHub: true },
        { city: "London", mapX: "65%", mapY: "30%", isHub: false },
        { city: "Paris", mapX: "70%", mapY: "45%", isHub: false },
        { city: "Milan", mapX: "75%", mapY: "55%", isHub: false },
        { city: "Accra", mapX: "45%", mapY: "65%", isHub: false },
        { city: "Dubai", mapX: "85%", mapY: "40%", isHub: false },
        { city: "New York", mapX: "20%", mapY: "55%", isHub: false },
      ];
      for (const o of offices) await strapi.db.query('api::office.office').create({ data: { ...o, publishedAt: new Date() } });
    }

    console.log('✅ Database fully seeded with dynamic content defaults.');
  },
};
