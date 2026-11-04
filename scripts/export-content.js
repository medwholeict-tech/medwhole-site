const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ children: [new TextRun({ text, bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 22, font: 'Calibri' })], heading: level, spacing: { before: 300, after: 120 } });
}

function para(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 22, font: 'Calibri' })], spacing: { after: 120 } });
}

function bold(text) {
  return new Paragraph({ children: [new TextRun({ text, bold: true, size: 22, font: 'Calibri' })], spacing: { after: 80 } });
}

function bullet(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 22, font: 'Calibri' })], bullet: { level: 0 }, spacing: { after: 60 } });
}

function divider() {
  return new Paragraph({ children: [new TextRun({ text: '────────────────────────────────', size: 18, font: 'Calibri', color: '999999' })], spacing: { before: 200, after: 200 } });
}

const sections = [];

// ============ HEADER / NAVIGATION ============
sections.push(heading('MedWHOLE Alliance — Website Content Export'));
sections.push(para('Exported from the live website at www.medwhole.org'));
sections.push(para('This document contains all visible text content from every public page, arranged in site order.'));
sections.push(divider());

// ============ NAVIGATION ============
sections.push(heading('Site Navigation', HeadingLevel.HEADING_2));
sections.push(para('Primary Navigation: About | What We Do | Our Journey | Impact | Get Involved | Contact'));
sections.push(para('About submenu: Who We Are | Our Team'));
sections.push(para('What We Do submenu: All Programmes | Health | Literacy | Empowerment'));
sections.push(para('Get Involved submenu: Volunteer | Partner With Us | Careers'));
sections.push(divider());

// ============ HOMEPAGE ============
sections.push(heading('Homepage', HeadingLevel.HEADING_1));
sections.push(heading('Hero Section', HeadingLevel.HEADING_2));
sections.push(bold('MedWHOLE Alliance'));
sections.push(para('Whole people create lasting impact.'));
sections.push(para('A Christ-centred development organisation making people whole through faith-centred Health, Literacy, and Empowerment.'));
sections.push(para('CTAs: Learn about MedWHOLE | Explore our work'));
sections.push(para('Tagline overlay: Whole People. Lasting Impact.'));
sections.push(para('Supporting text: Restoration is not only what people receive. It is also what they are equipped to carry forward.'));

sections.push(heading('Why We Exist', HeadingLevel.HEADING_2));
sections.push(bold('Making room for people to become whole.'));
sections.push(para('MedWHOLE equips, disciples, deploys, and supports people so they can create lasting transformation in themselves, their communities, and society.'));
sections.push(para('Our work brings faith, learning, health, empowerment, service, and accountability into one practical path toward sustainable community impact.'));
sections.push(para('CTA: Read our story'));

sections.push(heading('Our Foundation — Three Connected Pathways to Wholeness', HeadingLevel.HEADING_2));
sections.push(para('Health, Literacy, and Empowerment work together. Each pathway builds capacity for the others.'));
sections.push(bold('Health'));
sections.push(para('We support physical wellbeing, nutrition, care, and practical health knowledge that help people live and serve well.'));
sections.push(bold('Literacy'));
sections.push(para('We create pathways for learning, training, understanding, and the knowledge people need to participate with confidence.'));
sections.push(bold('Empowerment'));
sections.push(para('We develop human capacity, skills, leadership, and agency so people can contribute to lasting change in their communities.'));

sections.push(heading('The Made Whole Journey', HeadingLevel.HEADING_2));
sections.push(para('A pathway from engagement to sustained support.'));
sections.push(para('Our programmes are designed to meet people where they are and support them as they grow into service, leadership, and participation.'));
sections.push(bold('01 — Engagement'));
sections.push(para('We meet people at their point of need and build trust through Health, Literacy, and Empowerment.'));
sections.push(bold('02 — Discipleship'));
sections.push(para('We develop character, faith, knowledge, skills, responsibility, and purpose.'));
sections.push(bold('03 — Deployment'));
sections.push(para('People apply what they have learned through service, leadership, and community participation.'));
sections.push(bold('04 — Support'));
sections.push(para('Mentorship, accountability, resources, networks, and guidance help progress continue.'));

sections.push(heading('Updates from the Work', HeadingLevel.HEADING_2));
sections.push(para('Stay informed'));
sections.push(bold('Latest news'));
sections.push(para('[Dynamically loaded from Payload — news articles with titles, excerpts, categories, and dates]'));
sections.push(bold('Upcoming events'));
sections.push(para('[Dynamically loaded from Payload — events with titles, descriptions, categories, dates, and locations]'));
sections.push(para('CTA: View all updates'));

sections.push(heading('In Practice — Gallery', HeadingLevel.HEADING_2));
sections.push(bold('People, learning, service.'));
sections.push(para('[Dynamically loaded gallery images from Payload]'));
sections.push(para('CTA: View gallery'));

sections.push(heading('Take Part', HeadingLevel.HEADING_2));
sections.push(para('Wholeness grows when people serve together.'));
sections.push(para('Learn, volunteer, partner, or support the work of building people and communities with dignity.'));
sections.push(para('CTAs: Get involved | Contact us'));
sections.push(divider());

// ============ ABOUT PAGE ============
sections.push(heading('About Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('We are MedWHOLE Alliance'));
sections.push(para('A Christ-centred development organisation making people whole through faith-centred Health, Literacy, and Empowerment.'));
sections.push(para('Badge: About MedWHOLE'));

sections.push(heading('Why We Exist', HeadingLevel.HEADING_2));
sections.push(bold('Whole people create lasting impact.'));
sections.push(para('MedWHOLE embodies the Made Whole Philosophy. Wholeness refers to complete restoration and empowerment of individuals, encompassing all aspects of their lives: health, education, skills, spiritual growth, and social participation.'));
sections.push(para('MedWHOLE engages individuals through a structured journey, the outcome of which is transformation, not dependency. Individuals emerge restored, empowered, and positioned to become light and solution bearers to their communities and beyond.'));

sections.push(heading('Mission, Vision, Values', HeadingLevel.HEADING_2));
sections.push(bold('Our Mission'));
sections.push(para('To improve human development through faith-centred engagement in Health, Literacy, and Empowerment, guiding individuals through discipleship and deployment toward sustainable community impact.'));
sections.push(bold('Our Vision'));
sections.push(para('A society transformed by whole individuals who serve as light within their communities.'));
sections.push(bold('Our Values'));
sections.push(para('Trust, Excellence, Compassion, Teamwork, Innovation, Integrity, and Accountability guide how we operate, relate, and grow.'));

sections.push(heading('Our Story', HeadingLevel.HEADING_2));
sections.push(bold('Faith expressed through practical restoration.'));
sections.push(para('MedWHOLE envisions communities where people are not only supported, but equipped; where restored individuals become leaders, teachers, caregivers, and catalysts for positive change.'));
sections.push(para('Our distinguishing feature is an integrated development model. Rather than running isolated projects, we work across multiple determinants of wellbeing, linking health services with education, nutrition, mentorship, community engagement, and institutional strengthening.'));
sections.push(para('This approach enables us to address immediate needs while simultaneously building the social, behavioural, and institutional conditions required for longer-term, sustainable impact.'));

sections.push(heading('How We Work — Connected Pathways to Wholeness', HeadingLevel.HEADING_2));
sections.push(para('Health, Literacy, and Empowerment reinforce one another through service, leadership, and accountable partnership.'));
sections.push(bold('Health'));
sections.push(para('Health service delivery and health systems strengthening: medical outreaches, referral support, behaviour change communication, and community patient care.'));
sections.push(bold('Education'));
sections.push(para('Restoring hope and expanding opportunity through summer lessons, scholarships, exam coaching, and character-building mentorship.'));
sections.push(bold('Nutrition'));
sections.push(para('Protecting vulnerable children and households through targeted food support, life-saving nutrition interventions, and community feeding.'));
sections.push(bold('Capacity Development'));
sections.push(para('Growing local human capital through the ComPart Programme: crafts workshops, BLS and CPR training, digital literacy, and mentorship.'));

sections.push(heading('People Behind the Work — Meet Our Leadership', HeadingLevel.HEADING_2));
sections.push(para('[Dynamically loaded leadership team profiles from Payload — names, roles, bios, and photos]'));
sections.push(para('CTA: Contact the team'));
sections.push(divider());

// ============ HEALTH SERVICES PAGE ============
sections.push(heading('Health Services Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('MedWHOLE Health'));
sections.push(para('Health service delivery and health systems strengthening, combining direct community service with broader health systems support.'));
sections.push(para('Badge: Health Service Delivery'));
sections.push(para('CTAs: Partner With Us | Explore Services'));

sections.push(heading('Our Approach to Health', HeadingLevel.HEADING_2));
sections.push(para("MedWHOLE's health service portfolio combines direct community service with broader health systems support. Our integrated approach links health services with education, nutrition, mentorship, community engagement, and institutional strengthening."));
sections.push(bold('Accessibility'));
sections.push(para('We make health services available to rural communities'));
sections.push(bold('Affordability'));
sections.push(para('We offer optimum care at affordable rates'));
sections.push(bold('Compassionate care'));
sections.push(para('We treat everyone with care and respect'));
sections.push(bold('Faith-based values'));
sections.push(para('We offer services as faithful stewards'));

sections.push(heading('Our Core Health Services', HeadingLevel.HEADING_2));
sections.push(para('Health in practice'));
sections.push(para('We provide a comprehensive range of clinical and community-based health services'));

sections.push(bold('Medical Outreaches'));
sections.push(para('Direct community medical outreaches that bring essential health services to people at their point of need.'));
sections.push(para('Components: Community consultations | Basic treatments and screenings | Health education | Referral pathways'));

sections.push(bold('Specialist Referral Support'));
sections.push(para('Connecting community members who need further care with appropriate specialist services and follow-through.'));
sections.push(para('Components: Needs identification | Referral coordination | Follow-up support | Care navigation'));

sections.push(bold('Behaviour Change Communication'));
sections.push(para('Practical health communication that helps families and communities adopt behaviours that protect and improve health.'));
sections.push(para('Components: Health education sessions | Community dialogues | Caregiver education | Preventive health messaging'));

sections.push(bold('Preventive Chemotherapy'));
sections.push(para('Preventive chemotherapy interventions that protect vulnerable communities from preventable disease.'));
sections.push(para('Components: Community distribution campaigns | Disease prevention | Health worker coordination | Follow-up monitoring'));

sections.push(bold('Community Patient Care (CPC) Programme'));
sections.push(para('Structured community-based patient care that extends support beyond facilities into homes and neighbourhoods.'));
sections.push(para('Components: Patient follow-up | Home-based care support | Caregiver guidance | Community health linkages'));

sections.push(bold('Health Systems Strengthening'));
sections.push(para('Supporting the structured improvement of health systems and institutions, including facility revitalisation and optimisation.'));
sections.push(para('Components: Systems assessment | Institutional support | Service delivery improvement | Community engagement'));

sections.push(heading('Our Approach (Detail)', HeadingLevel.HEADING_2));
sections.push(para('Patient-centered care that prioritizes accessibility, quality, and community engagement'));
sections.push(bold('Community-based care'));
sections.push(para('We bring healthcare directly to communities, removing barriers to access and ensuring services reach those who need them most.'));
sections.push(para('Features: Mobile health clinics | Home-based care programs | Community health worker networks | Local health education initiatives'));
sections.push(bold('Integrated services'));
sections.push(para('Our holistic approach addresses multiple health needs simultaneously, improving outcomes and efficiency.'));
sections.push(para('Features: Preventive and curative care | Health education and counseling | Referral and follow-up systems | Linkages to social services'));

sections.push(heading('CTA', HeadingLevel.HEADING_2));
sections.push(bold('Support health and wholeness.'));
sections.push(para('Help strengthen health access, learning, and community capacity.'));
sections.push(para('CTAs: Donate Now | Partner With Us'));
sections.push(divider());

// ============ PROGRAMMES PAGE ============
sections.push(heading('Programmes Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Strategic Areas of Work'));
sections.push(bold('Programmes that make people whole.'));
sections.push(para('MedWHOLE functions in four principal service areas: health service delivery and health systems strengthening, education, nutrition, and human capacity development.'));
sections.push(para('CTAs: Get Involved | Request Information'));

sections.push(heading('Category Filters', HeadingLevel.HEADING_2));
sections.push(para('All | Health | Education | Nutrition | Human Capacity Development'));

sections.push(heading('Health Programmes', HeadingLevel.HEADING_2));

sections.push(bold('Medical Outreaches'));
sections.push(para('Category: Health | Subcategory: Service Delivery | Duration: Periodic | Level: Community-wide | Format: Community-based'));
sections.push(para('Direct community medical outreaches that bring essential health services to people at their point of need.'));
sections.push(para('Components: Community consultations | Basic treatments and screenings | Health education | Referral pathways'));
sections.push(para('Outcomes: Improved access to essential health services | Earlier identification of health needs | Stronger community trust in health services'));

sections.push(bold('Specialist Referral Support'));
sections.push(para('Category: Health | Subcategory: Service Delivery | Duration: Ongoing | Level: Referred patients | Format: Coordinated care'));
sections.push(para('Connecting community members who need further care with appropriate specialist services and follow-through.'));
sections.push(para('Components: Needs identification | Referral coordination | Follow-up support | Care navigation'));
sections.push(para('Outcomes: Patients reach the right level of care | Continuity of care for vulnerable people | Reduced drop-off after referral'));

sections.push(bold('Behaviour Change Communication'));
sections.push(para('Category: Health | Subcategory: Prevention | Duration: Ongoing | Level: Community-wide | Format: Community engagement'));
sections.push(para('Practical health communication that helps families and communities adopt behaviours that protect and improve health.'));
sections.push(para('Components: Health education sessions | Community dialogues | Caregiver education | Preventive health messaging'));
sections.push(para('Outcomes: Healthier everyday practices | Greater community ownership of health | Prevention of avoidable illness'));

sections.push(bold('Preventive Chemotherapy'));
sections.push(para('Category: Health | Subcategory: Prevention | Duration: Campaign-based | Level: At-risk populations | Format: Community distribution'));
sections.push(para('Preventive chemotherapy interventions that protect vulnerable communities from preventable disease.'));
sections.push(para('Components: Community distribution campaigns | Disease prevention | Health worker coordination | Follow-up monitoring'));
sections.push(para('Outcomes: Reduced burden of preventable disease | Protection for at-risk groups | Stronger community health resilience'));

sections.push(bold('Community Patient Care (CPC) Programme'));
sections.push(para('Category: Health | Subcategory: Service Delivery | Duration: Ongoing | Level: Patients and families | Format: Community-based'));
sections.push(para('Structured community-based patient care that extends support beyond facilities into homes and neighbourhoods.'));
sections.push(para('Components: Patient follow-up | Home-based care support | Caregiver guidance | Community health linkages'));
sections.push(para('Outcomes: Consistent care beyond the clinic | Supported recovery at home | Stronger family participation in care'));

sections.push(bold('Health Systems Strengthening'));
sections.push(para('Category: Health | Subcategory: Systems | Duration: Ongoing | Level: Health institutions | Format: Partnership-based'));
sections.push(para('Supporting the structured improvement of health systems and institutions, including facility revitalisation and optimisation.'));
sections.push(para('Components: Systems assessment | Institutional support | Service delivery improvement | Community engagement'));
sections.push(para('Outcomes: Stronger health systems | Better-functioning facilities | Sustainable institutional capacity'));

sections.push(heading('Education Programmes', HeadingLevel.HEADING_2));

sections.push(bold('Back-to-School Scholarship Programme'));
sections.push(para('Category: Education | Subcategory: Access to Education | Duration: Ongoing | Level: School-age children | Format: Scholarship support'));
sections.push(para('Scholarship support that has helped over 50 school dropouts return to formal education.'));
sections.push(para('Components: Student identification | Tuition and exam fee support | Uniforms and learning materials | Mentorship and follow-up'));
sections.push(para('Outcomes: Dropouts return to formal education | Academic stability for vulnerable children | Restored hope and confidence'));

sections.push(bold('Summer Holiday Lessons'));
sections.push(para('Category: Education | Subcategory: Academic Support | Duration: School holidays | Level: Children and adolescents | Format: Intensive classes'));
sections.push(para('Holiday lessons that have impacted hundreds of children since 2021, bridging learning gaps between academic sessions.'));
sections.push(para('Components: Subject-focused classes | Remedial tutoring | Learning assessments | Confidence building'));
sections.push(para('Outcomes: Bridged learning gaps | Academic consistency | Readiness for new sessions'));

sections.push(bold('Exam Coaching (WAEC & JAMB)'));
sections.push(para('Category: Education | Subcategory: Exam Preparation | Duration: Pre-exam period | Level: Senior secondary | Format: One-on-one tutoring'));
sections.push(para('Students with particular needs are identified and supported through one-on-one tutoring for WAEC and JAMB. Success stories have been recorded.'));
sections.push(para('Components: Needs identification | One-on-one tutoring | Past-question practice | Study guidance'));
sections.push(para('Outcomes: Improved exam performance | Pathways to higher education | Recorded student success stories'));

sections.push(bold('Good News Club'));
sections.push(para('Category: Education | Subcategory: Character & Mentorship | Duration: Weekly sessions | Level: Children | Format: Group sessions'));
sections.push(para("An avenue for character-building and mentorship, forming the discipleship heart of MedWHOLE's education work."));
sections.push(para('Components: Character-building lessons | Mentorship | Values formation | Group activities'));
sections.push(para('Outcomes: Godly character formed | Purpose and identity strengthened | Caring mentor relationships'));

sections.push(heading('Nutrition Programmes', HeadingLevel.HEADING_2));

sections.push(bold('Targeted Nutrition Support'));
sections.push(para('Category: Nutrition | Subcategory: Household Support | Duration: Ongoing | Level: Vulnerable families | Format: Distribution'));
sections.push(para('Supporting vulnerable families with raw food packs to protect children and households at risk of malnutrition.'));
sections.push(para('Components: Household identification | Raw food pack distribution | Nutrition guidance | Follow-up'));
sections.push(para('Outcomes: Improved household food security | Reduced malnutrition risk | Dignified family support'));

sections.push(bold('Life-Saving Nutrition Interventions'));
sections.push(para('Category: Nutrition | Subcategory: Therapeutic Care | Duration: As needed | Level: Severely malnourished children | Format: Clinical support'));
sections.push(para('Provision of specialized meals and supplements for severely malnourished children to restore health and vitality.'));
sections.push(para('Components: Nutrition assessment | Specialized meals | Therapeutic supplements | Recovery monitoring'));
sections.push(para('Outcomes: Restored health and vitality | Saved young lives | Supported child development'));

sections.push(bold('Community Feeding Initiative'));
sections.push(para('Category: Nutrition | Subcategory: Community Support | Duration: Outreach periods | Level: Community-wide | Format: Distribution events'));
sections.push(para('Distribution of raw food packs and nutritional supplies during outreach and holiday events.'));
sections.push(para('Components: Event-based distribution | Nutritional supplies | Volunteer mobilisation | Community engagement'));
sections.push(para('Outcomes: Nutrition needs met during outreaches | Wider reach to vulnerable households | Stronger community participation'));

sections.push(heading('Human Capacity Development Programmes', HeadingLevel.HEADING_2));

sections.push(bold('ComPart Programme'));
sections.push(para("Category: Human Capacity Development | Subcategory: Flagship Programme | Duration: Ongoing | Level: Community members | Format: Community-based"));
sections.push(para("MedWHOLE's branded human capacity development programme, growing local human capital and building the skills base communities need for sustainability."));
sections.push(para('Components: Skills development | Community actor development | Sustainability planning | Local leadership growth'));
sections.push(para('Outcomes: Local capacity for lasting change | People equipped as drivers of change | Sustainable community skills base'));

sections.push(bold('Income-Generating Crafts Workshops'));
sections.push(para('Category: Human Capacity Development | Subcategory: Livelihoods | Duration: Periodic | Level: Youth and adults | Format: Hands-on workshops'));
sections.push(para('Practical crafts training that gives participants income-generating skills for household stability.'));
sections.push(para('Components: Crafts production training | Starter guidance | Basic entrepreneurship | Product development'));
sections.push(para('Outcomes: New income streams | Practical vocational skills | Household economic resilience'));

sections.push(bold('BLS & CPR Training'));
sections.push(para('Category: Human Capacity Development | Subcategory: Emergency Skills | Duration: Periodic sessions | Level: All levels | Format: Hands-on training'));
sections.push(para('Basic Life Support (BLS) and cardiopulmonary resuscitation (CPR) training that builds community first responders.'));
sections.push(para('Components: CPR technique | Basic Life Support | Emergency response | Practical drills'));
sections.push(para('Outcomes: Community first responders | Lives saved through quick intervention | Increased emergency readiness'));

sections.push(bold('Digital Literacy'));
sections.push(para('Category: Human Capacity Development | Subcategory: Digital Skills | Duration: Term-based | Level: Beginners | Format: Practical classes'));
sections.push(para('Digital literacy training that prepares children and community members to participate confidently in a digital world.'));
sections.push(para('Components: Basic computer skills | Safe internet use | Hands-on practice | Everyday digital tasks'));
sections.push(para('Outcomes: Digital confidence | Participation in modern learning and work | Reduced digital exclusion'));

sections.push(bold('Mentorship & Volunteer Capacity Building'));
sections.push(para('Category: Human Capacity Development | Subcategory: People Development | Duration: Ongoing | Level: Volunteers and mentees | Format: Relational'));
sections.push(para('Professional mentorship and volunteer capacity building that grow the people who carry the mission forward.'));
sections.push(para('Components: Professional mentorship | Volunteer training | Leadership development | Ongoing support'));
sections.push(para('Outcomes: Equipped volunteers | Guided professional growth | A sustainable mission workforce'));

sections.push(heading('Take Part', HeadingLevel.HEADING_2));
sections.push(bold('Whole people create lasting impact.'));
sections.push(para('Partner, volunteer, give, sponsor, mentor, or support a community. There is a place for you in this work.'));
sections.push(para('CTAs: Get Involved | Contact Us'));
sections.push(divider());

// ============ ACADEMY PAGE ============
sections.push(heading('Academy Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('MedWHOLE Academy'));
sections.push(para('Building the next generation of godly, purpose-driven children to transform communities through quality education, character development, and wholistic support.'));
sections.push(para('Badge: Education & Training'));
sections.push(para('CTA: Enroll Now'));

sections.push(heading('What We Offer', HeadingLevel.HEADING_2));
sections.push(para('Learning in practice'));
sections.push(bold('Learning that develops knowledge, character, and capacity.'));
sections.push(para('MedWHOLE sees education as a major pathway to restoring hope and expanding opportunity. This work is designed to shape confidence, discipline, leadership potential, and long-term life outcomes among children and adolescents in underserved communities.'));
sections.push(bold('Summer Holiday Lessons'));
sections.push(para('Holiday lessons that have impacted hundreds of children since 2021, bridging learning gaps between academic sessions.'));
sections.push(bold('Back-to-School Scholarships'));
sections.push(para('Scholarship support that has helped over 50 school dropouts return to formal education.'));
sections.push(bold('Exam Coaching (WAEC & JAMB)'));
sections.push(para('Students with particular needs are identified and supported through one-on-one tutoring. Success stories have been recorded.'));
sections.push(bold('Good News Club'));
sections.push(para('An avenue for character-building and mentorship, forming the discipleship heart of our education work.'));
sections.push(bold('Nutrition Support'));
sections.push(para('Child survival, learning, and development are inseparable from nutritional wellbeing. MedWHOLE treats nutrition as both a humanitarian and developmental priority.'));
sections.push(bold('Community Outreach'));
sections.push(para('Education that goes beyond the classroom, reaching into communities where children need support most.'));

sections.push(heading('The Made Whole Journey', HeadingLevel.HEADING_2));
sections.push(bold('From engagement to sustained support.'));
sections.push(para('MedWHOLE engages individuals through a structured journey. The outcome is transformation, not dependency.'));
sections.push(bold('1 — Engagement'));
sections.push(para('Meeting individuals and communities at their point of need, building trust through Health, Literacy, and Empowerment.'));
sections.push(bold('2 — Discipleship'));
sections.push(para('Building character, values, knowledge, faith, and responsibility. People grow in identity and purpose.'));
sections.push(bold('3 — Deployment'));
sections.push(para('Equipping individuals to apply what they have received through service, leadership, and community participation.'));
sections.push(bold('4 — Support'));
sections.push(para('Mentorship, accountability, resources, networks, and guidance help progress continue.'));

sections.push(heading('How We Teach', HeadingLevel.HEADING_2));
sections.push(bold('Education that shapes the whole person.'));
sections.push(bold('1 — Faith and Character'));
sections.push(para('Education rooted in biblical values, forming identity, godly character, and purpose-driven living.'));
sections.push(bold('2 — Knowledge and Skills'));
sections.push(para('Academic support, exam coaching, and practical learning that build confidence and competence.'));
sections.push(bold('3 — Service and Leadership'));
sections.push(para('Students learn to apply what they receive, becoming participants in the transformation of their communities.'));

sections.push(heading('Academy Gallery', HeadingLevel.HEADING_2));
sections.push(para('Transforming Lives Through Education'));
sections.push(para('See our students thrive through quality education, character development, and wholistic support'));
sections.push(para('[Dynamically loaded gallery images from Payload]'));
sections.push(para('CTA: View Complete Academy Gallery'));

sections.push(heading('Academy Events', HeadingLevel.HEADING_2));
sections.push(para('Stay updated with the latest training programs, workshops, and educational events from MedWHOLE Academy'));
sections.push(para('[Dynamically loaded events from Payload]'));
sections.push(para('CTA: View All Academy Events'));

sections.push(heading('CTA', HeadingLevel.HEADING_2));
sections.push(bold('Support learning, character, and opportunity.'));
sections.push(para("Learn how to support MedWHOLE's education and training work."));
sections.push(para('CTAs: Enroll Your Child | Learn More'));
sections.push(divider());

// ============ IMPACT PAGE ============
sections.push(heading('Impact Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Impact and accountability'));
sections.push(bold('Evidence of people and communities becoming whole.'));
sections.push(para('We are building a clearer account of the work, the people served, the learning gained, and the outcomes that can be responsibly evidenced.'));

sections.push(heading('Principles', HeadingLevel.HEADING_2));
sections.push(bold('Measure what matters'));
sections.push(para('We connect reporting to Health, Literacy, Empowerment, and the Made Whole journey rather than presenting numbers without context.'));
sections.push(bold('Respect people'));
sections.push(para("Impact stories should preserve dignity, agency, consent, and the full context of people's participation."));
sections.push(bold('Report honestly'));
sections.push(para('Published statistics, testimonials, partnerships, and outcomes require a source, date, and responsible explanation.'));

sections.push(heading('Made Whole Journey', HeadingLevel.HEADING_2));
sections.push(bold('A journey that can be followed.'));
sections.push(para('1. Engagement: building trust at the point of need.'));
sections.push(para('2. Discipleship: developing character, faith, knowledge, and responsibility.'));
sections.push(para('3. Deployment: applying learning through service and leadership.'));
sections.push(para('4. Support: sustaining progress through mentorship and accountability.'));

sections.push(heading('Impact Stories', HeadingLevel.HEADING_2));
sections.push(bold('Impact stories are being prepared with care.'));
sections.push(para("The public impact archive will be published as stories and reports are verified through the organisation's programme and administrative systems."));
sections.push(para('CTA: Ask about our work'));
sections.push(divider());

// ============ FAQ PAGE ============
sections.push(heading('FAQ Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Help Center'));
sections.push(bold('Frequently Asked Questions'));
sections.push(para('Find answers to common questions about our programs, services, and organization'));

sections.push(heading('General', HeadingLevel.HEADING_2));
sections.push(bold('What is MedWHOLE Alliance?'));
sections.push(para('MedWHOLE Alliance for Health and Development (MedWHOLE) is a Christ-centred development organisation dedicated to making people whole through faith-centred Health, Literacy, and Empowerment. We equip, disciple, deploy, and support people so they can create lasting transformation in themselves, their communities, and society. Our integrated development model links health services with education, nutrition, mentorship, community engagement, and institutional strengthening.'));
sections.push(bold('Where does MedWHOLE Alliance operate?'));
sections.push(para('We operate primarily in FCT Abuja and across other states in Nigeria, reaching communities through direct service delivery, education, nutrition support, and human capacity development programmes.'));
sections.push(bold('How is MedWHOLE Alliance funded?'));
sections.push(para('MedWHOLE Alliance is funded through a combination of sources including grants from donors and foundations, programme fees, and partnerships with organisations that share our commitment to wholeness and sustainable community impact. We maintain financial transparency and accountability.'));
sections.push(bold('How can my organization partner with MedWHOLE Alliance?'));
sections.push(para('We welcome partnerships with organizations that share our commitment to improving health outcomes in Africa. Partnership opportunities include collaborative program implementation, technical assistance arrangements, training and capacity building partnerships, and research collaborations. Please contact us through our website to discuss potential partnership opportunities.'));

sections.push(heading('Training Programs', HeadingLevel.HEADING_2));
sections.push(bold('Who can enroll in MedWHOLE Academy programs?'));
sections.push(para('Our programmes serve children, adolescents, families, and communities. We provide summer holiday lessons, Back-to-School scholarships, exam coaching, Good News Club mentorship, nutrition support, and human capacity development through the ComPart Programme.'));
sections.push(bold('Are the training programs accredited?'));
sections.push(para('Yes, MedWHOLE Academy programs are accredited by relevant professional bodies and educational authorities. Participants receive certificates upon successful completion. Some programs also offer continuing education credits for licensed professionals.'));
sections.push(bold('What is the format of the training programs?'));
sections.push(para('We offer programs in three formats: fully online (accessible from anywhere with internet), hybrid (combination of online learning and in-person workshops), and in-person (intensive workshops at our training centers). The format for each program is clearly indicated in the program description.'));
sections.push(bold('How much do training programs cost?'));
sections.push(para('Program fees vary depending on the duration, format, and content. Contact us for more details.'));
sections.push(bold('Do you offer scholarships or financial assistance?'));
sections.push(para('Yes, we offer partial and full scholarships based on financial need and merit. We also provide payment plans and group discounts for organizations enrolling multiple participants.'));

sections.push(heading('Careers', HeadingLevel.HEADING_2));
sections.push(bold('How do I apply for jobs at MedWHOLE Alliance?'));
sections.push(para("Current job openings are posted on our Careers page. To apply, click on the position you're interested in and follow the application instructions. You'll typically need to submit your CV, cover letter, and references through our online application portal."));
sections.push(bold('What is the recruitment process like?'));
sections.push(para('Our recruitment process typically includes: application review (1-2 weeks), initial screening interview (phone or video), technical interview or assessment, reference checks, and final interview with hiring manager. The entire process usually takes 4-6 weeks from application to offer.'));
sections.push(bold('Do you offer internships or volunteer opportunities?'));
sections.push(para('Yes, we offer volunteer and internship opportunities for people who want to serve through Health, Literacy, and Empowerment. Check our Volunteer and Careers pages for current opportunities.'));
sections.push(bold('What benefits do MedWHOLE employees receive?'));
sections.push(para('At MedWHOLE Alliance, you can drive real change, advance your skills, work alongside a passionate, mission-focused team, engage in a variety of impactful projects, and receive recognition for your contributions.'));

sections.push(heading('Still Have Questions?', HeadingLevel.HEADING_2));
sections.push(para("Can't find the answer you're looking for? Our team is here to help. Reach out to us and we'll get back to you as soon as possible."));
sections.push(para('CTA: Contact Us'));
sections.push(divider());

// ============ CONTACT PAGE ============
sections.push(heading('Contact Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('Get in Touch'));
sections.push(para("Whether you're interested in our programs, seeking partnership opportunities, or want to support our work, we'd love to hear from you."));
sections.push(para('Badge: Contact Us'));

sections.push(heading('Contact Information', HeadingLevel.HEADING_2));
sections.push(bold('Email'));
sections.push(para('medwholealliance@gmail.com'));
sections.push(bold('Phone'));
sections.push(para('+234 818 980 0001'));
sections.push(para('+234 818 980 0002'));
sections.push(bold('Location'));
sections.push(para('Abuja, Nigeria'));

sections.push(heading('Send Us a Message', HeadingLevel.HEADING_2));
sections.push(para('[Contact form with fields for name, email, phone, subject, and message]'));

sections.push(heading('Partner With Us', HeadingLevel.HEADING_2));
sections.push(para('Interested in collaborating with MedWHOLE Alliance? Fill out the form below and we\'ll get back to you soon.'));
sections.push(para('[Partnership application form — see Partner page for full fields]'));

sections.push(heading('Donation Section', HeadingLevel.HEADING_2));
sections.push(para('[Donation section with giving options]'));
sections.push(divider());

// ============ CAREERS PAGE ============
sections.push(heading('Careers Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Join Our Team'));
sections.push(bold('Serve through your vocation.'));
sections.push(para('Join a mission-driven organisation making people whole through Health, Literacy, and Empowerment.'));
sections.push(para('CTA: View Open Positions'));

sections.push(heading('Why Work With Us', HeadingLevel.HEADING_2));
sections.push(bold('Meaningful impact'));
sections.push(para('Contribute directly to programs that improve health, education, and community well-being.'));
sections.push(bold('Professional Growth'));
sections.push(para('Continuous learning opportunities, mentorship, and career advancement paths across Health, Literacy, and Empowerment.'));
sections.push(bold('Collaborative Environment'));
sections.push(para('Join a dynamic, mission-driven team that values innovation, excellence, and faith-based principles.'));
sections.push(bold('Competitive Package'));
sections.push(para('Attractive salary, performance bonuses, and recognition programs.'));
sections.push(bold('Work-Life Balance'));
sections.push(para('Flexible working arrangements and supportive environment.'));

sections.push(heading('Our Values', HeadingLevel.HEADING_2));
sections.push(bold('Faith-based'));
sections.push(para('Our purpose and actions are founded in biblical principles'));
sections.push(bold('Excellence'));
sections.push(para('We strive for the highest standards in everything we do'));
sections.push(bold('Innovation'));
sections.push(para('We embrace creative solutions to complex health challenges'));
sections.push(bold('Collaboration'));
sections.push(para('We work together across disciplines and borders'));

sections.push(heading('Open Positions', HeadingLevel.HEADING_2));
sections.push(para('Explore current opportunities across our three arms'));
sections.push(para('[Job postings are managed from the admin panel. Currently no open positions listed.]'));

sections.push(heading('CTA', HeadingLevel.HEADING_2));
sections.push(bold("Don't See the Right Role?"));
sections.push(para("We're always looking for talented individuals. Send us your CV and we'll keep you in mind for future opportunities."));
sections.push(para('CTA: Submit Your CV'));
sections.push(divider());

// ============ CAREERS [SLUG] PAGE ============
sections.push(heading('Career Detail Pages', HeadingLevel.HEADING_1));
sections.push(para('Sample job listings include:'));
sections.push(divider());

const sampleJobs = [
  { title: 'Senior Public Health Advisor', dept: 'Consulting', location: 'Abuja, Nigeria', type: 'Full-time', level: 'Senior', salary: '$45,000 - $60,000' },
  { title: 'Training Coordinator', dept: 'Academy', location: 'Accra, Ghana', type: 'Full-time', level: 'Mid-level', salary: '$28,000 - $38,000' },
  { title: 'Community Health Officer', dept: 'Health Services', location: 'Lagos, Nigeria', type: 'Full-time', level: 'Entry-level', salary: '$18,000 - $24,000' },
  { title: 'Monitoring & Evaluation Specialist', dept: 'Consulting', location: 'Remote', type: 'Contract', level: 'Senior', salary: '$50,000 - $65,000' },
  { title: 'Research Assistant', dept: 'Academy', location: 'Kampala, Uganda', type: 'Full-time', level: 'Entry-level', salary: '$15,000 - $20,000' },
  { title: 'Clinical Nurse - Maternal Health', dept: 'Health Services', location: 'Dar es Salaam, Tanzania', type: 'Full-time', level: 'Mid-level', salary: '$22,000 - $30,000' },
];

sampleJobs.forEach(job => {
  sections.push(bold(job.title));
  sections.push(para(`Department: ${job.dept} | Location: ${job.location} | Type: ${job.type} | Level: ${job.level} | Salary: ${job.salary}`));
});
sections.push(divider());

// ============ NEWS PAGE ============
sections.push(heading('News & Events Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('News & Events'));
sections.push(para('Stay updated with the latest news, announcements, and events from MedWHOLE Alliance'));
sections.push(para('Badge: Latest Updates'));

sections.push(heading('Featured News', HeadingLevel.HEADING_2));
sections.push(para('[Dynamically loaded from Payload — featured news article with image, title, excerpt, category, date, author]'));

sections.push(heading('Recent News', HeadingLevel.HEADING_2));
sections.push(para('[Dynamically loaded news grid from Payload — cards with images, titles, excerpts, categories, dates]'));

sections.push(heading('Events', HeadingLevel.HEADING_2));
sections.push(para('Tabs: Upcoming | Past Events'));
sections.push(para('[Dynamically loaded events from Payload — with titles, descriptions, categories, dates, locations, and pricing]'));

sections.push(heading('Stay Informed', HeadingLevel.HEADING_2));
sections.push(para('Subscribe to our newsletter to receive the latest news, updates, and insights from MedWHOLE Alliance.'));
sections.push(para('CTA: Subscribe Now'));
sections.push(divider());

// ============ VOLUNTEER PAGE ============
sections.push(heading('Volunteer Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Volunteer'));
sections.push(bold('Volunteer with Us'));
sections.push(para('Make a difference in your community. Join our team of dedicated volunteers transforming lives across Nigeria.'));

sections.push(heading('Volunteer Application Form', HeadingLevel.HEADING_2));
sections.push(bold('Personal Information'));
sections.push(para('Fields: Full Name | Email Address | Phone Number | State | City | Age Range | Current Occupation | Highest Education Level'));
sections.push(bold('Areas of Interest'));
sections.push(para('Options: Health Services | Education/Teaching | Community Outreach | Administrative Support | Event Planning | Communications/Media | Fundraising | Research'));
sections.push(bold('Skills & Experience'));
sections.push(para('Fields: Relevant Skills & Experience (min 50 chars) | Why do you want to volunteer with MedWHOLE? (min 50 chars) | Previous Volunteer Experience'));
sections.push(bold('Availability'));
sections.push(para('Fields: How often can you volunteer? (Once a week / Twice a month / Once a month / Occasionally / For specific events) | Commitment Duration (1-3 months / 3-6 months / 6-12 months / 1+ year)'));
sections.push(para('CTA: Submit Application'));
sections.push(divider());

// ============ PARTNER PAGE ============
sections.push(heading('Partner Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(para('Partnership'));
sections.push(bold('Partner with Us'));
sections.push(para('Join us in transforming communities across Nigeria through strategic partnerships and collaboration.'));

sections.push(heading('Partnership Application Form', HeadingLevel.HEADING_2));
sections.push(bold('Organization Information'));
sections.push(para('Fields: Organization Name | Organization Type (NGO/Non-Profit | Corporate/Business | Faith-Based Organization | Academic Institution | Healthcare Facility | Other) | Organization Website'));
sections.push(bold('Contact Person'));
sections.push(para('Fields: Full Name | Job Title | Email | Phone Number'));
sections.push(bold('Partnership Interest'));
sections.push(para('Options: Health Services | Education/Academy | Research Collaboration | Funding/Sponsorship | Technical Support | Community Programs'));
sections.push(bold('Collaboration Details'));
sections.push(para('Fields: Proposed Collaboration (min 50 chars) | Organization Capacity | Geographic Focus'));
sections.push(para('CTA: Submit Application'));
sections.push(divider());

// ============ NEWS [SLUG] PAGE ============
sections.push(heading('News Article Detail Page', HeadingLevel.HEADING_1));
sections.push(para('[Dynamically loaded from Payload — article with title, category, date, author, featured image, excerpt, and full body content]'));
sections.push(para('Sidebar: About the Author | Stay Updated (newsletter signup) | Related Articles'));
sections.push(para('Share options: Facebook | Twitter | LinkedIn | Copy Link'));
sections.push(para('CTA: Explore More News → View All News'));
sections.push(divider());

// ============ EVENTS [SLUG] PAGE ============
sections.push(heading('Event Detail Page', HeadingLevel.HEADING_1));
sections.push(para('[Dynamically loaded from Payload — event with title, category, date, time, location, description, content, featured image]'));
sections.push(para('Sidebar: Registration/Price Card (free or paid, capacity, registration deadline, register button) | Event Details Card (date & time, venue, organizer, contact email, contact phone)'));
sections.push(para('[Custom registration form when applicable]'));
sections.push(divider());

// ============ GALLERY PAGE ============
sections.push(heading('Gallery Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('Photo Gallery'));
sections.push(para('Explore moments from our programs, events, and community impact across Nigeria'));
sections.push(para('Badge: Our Impact'));

sections.push(heading('Gallery Tabs', HeadingLevel.HEADING_2));
sections.push(para('Tabs: All Photos | Health Services | Academy'));
sections.push(para('[Dynamically loaded gallery images from Payload with filtering by category]'));
sections.push(divider());

// ============ RESOURCES PAGE ============
sections.push(heading('Resources & Publications Page', HeadingLevel.HEADING_1));
sections.push(heading('Hero', HeadingLevel.HEADING_2));
sections.push(bold('Resources & Publications'));
sections.push(para('Access our library of toolkits, research publications, guidelines, and training materials'));
sections.push(para('Badge: Knowledge Hub'));
sections.push(para('Search bar: "Search resources..."'));

sections.push(heading('Downloadable Resources', HeadingLevel.HEADING_2));
sections.push(para('[Resources are managed from the admin panel. Currently no resources listed.]'));

sections.push(heading('Recent Publications', HeadingLevel.HEADING_2));
sections.push(para('[Publications are managed from the admin panel. Currently no publications listed.]'));

sections.push(heading('CTA', HeadingLevel.HEADING_2));
sections.push(bold('Need Custom Resources?'));
sections.push(para('Our team can develop tailored toolkits, guidelines, and training materials for your organization.'));
sections.push(para('CTA: Contact Us'));
sections.push(divider());

// ============ TERMS PAGE ============
sections.push(heading('Terms of Service', HeadingLevel.HEADING_1));
sections.push(para('Last updated: March 15, 2024'));
sections.push(heading('Agreement to Terms', HeadingLevel.HEADING_2));
sections.push(para('By accessing or using the MedWHOLE Alliance website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.'));
sections.push(heading('Use of Services', HeadingLevel.HEADING_2));
sections.push(bold('Eligibility'));
sections.push(para('You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.'));
sections.push(bold('Account Registration'));
sections.push(para('To access certain services, you may need to create an account. You agree to:'));
sections.push(bullet('Provide accurate, current, and complete information'));
sections.push(bullet('Maintain and update your information as necessary'));
sections.push(bullet('Maintain the security of your account credentials'));
sections.push(bullet('Accept responsibility for all activities under your account'));
sections.push(bullet('Notify us immediately of any unauthorized use'));
sections.push(bold('Acceptable Use'));
sections.push(para('You agree not to:'));
sections.push(bullet('Use our services for any unlawful purpose'));
sections.push(bullet('Violate any applicable laws or regulations'));
sections.push(bullet('Infringe on intellectual property rights'));
sections.push(bullet('Transmit harmful code or malware'));
sections.push(bullet('Interfere with or disrupt our services'));
sections.push(bullet('Attempt to gain unauthorized access to our systems'));
sections.push(bullet('Harass, abuse, or harm other users'));
sections.push(bullet('Impersonate any person or entity'));
sections.push(heading('Training Programs and Services', HeadingLevel.HEADING_2));
sections.push(bold('Enrollment and Fees'));
sections.push(para('Enrollment in training programs requires payment of applicable fees. All fees are stated in US Dollars and must be paid in full before program commencement unless alternative arrangements have been made. Fees are non-refundable except as specified in our refund policy.'));
sections.push(bold('Refund Policy'));
sections.push(bullet('Full refund if cancellation occurs more than 30 days before program start'));
sections.push(bullet('50% refund if cancellation occurs 15-30 days before program start'));
sections.push(bullet('No refund for cancellations less than 15 days before program start'));
sections.push(bullet('No refund after program commencement'));
sections.push(para('We reserve the right to cancel programs due to insufficient enrollment or other circumstances. In such cases, participants will receive a full refund or the option to transfer to another program.'));
sections.push(bold('Program Completion and Certification'));
sections.push(para('Certificates are awarded upon successful completion of program requirements, including attendance, assignments, and assessments. We reserve the right to withhold certificates if requirements are not met or if there are violations of our code of conduct.'));
sections.push(heading('Intellectual Property', HeadingLevel.HEADING_2));
sections.push(bold('Our Content'));
sections.push(para('All content on our website and in our programs, including text, graphics, logos, images, videos, and software, is the property of MedWHOLE Alliance or our licensors and is protected by copyright, trademark, and other intellectual property laws.'));
sections.push(bold('Limited License'));
sections.push(para('We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works without our express written permission.'));
sections.push(bold('User Content'));
sections.push(para('By submitting content to our services (such as assignments, forum posts, or feedback), you grant us a worldwide, royalty-free license to use, reproduce, and display such content for the purposes of providing and improving our services.'));
sections.push(heading('Disclaimers and Limitations of Liability', HeadingLevel.HEADING_2));
sections.push(bold('Service Availability'));
sections.push(para('We strive to maintain continuous availability of our services but do not guarantee uninterrupted access. We may suspend or terminate services for maintenance, updates, or other reasons without liability.'));
sections.push(bold('Disclaimer of Warranties'));
sections.push(para('Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.'));
sections.push(bold('Limitation of Liability'));
sections.push(para('To the maximum extent permitted by law, MedWHOLE Alliance shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, even if we have been advised of the possibility of such damages.'));
sections.push(heading('Indemnification', HeadingLevel.HEADING_2));
sections.push(para('You agree to indemnify and hold harmless MedWHOLE Alliance, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services or violation of these Terms.'));
sections.push(heading('Governing Law and Dispute Resolution', HeadingLevel.HEADING_2));
sections.push(para('These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of our services shall be resolved through good faith negotiations. If negotiations fail, disputes shall be submitted to binding arbitration in Abuja, Nigeria.'));
sections.push(heading('Changes to Terms', HeadingLevel.HEADING_2));
sections.push(para('We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the modified Terms.'));
sections.push(heading('Termination', HeadingLevel.HEADING_2));
sections.push(para('We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use our services will immediately cease.'));
sections.push(heading('Severability', HeadingLevel.HEADING_2));
sections.push(para('If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.'));
sections.push(heading('Contact Information', HeadingLevel.HEADING_2));
sections.push(para('For questions about these Terms of Service, please contact us at:'));
sections.push(para('MedWHOLE Alliance'));
sections.push(para('Email: legal@medwholealliance.org'));
sections.push(para('Phone: +254 20 1234567'));
sections.push(para('Address: Abuja, Nigeria'));
sections.push(divider());

// ============ PRIVACY PAGE ============
sections.push(heading('Privacy Policy', HeadingLevel.HEADING_1));
sections.push(para('Last updated: March 15, 2024'));
sections.push(heading('Introduction', HeadingLevel.HEADING_2));
sections.push(para('MedWHOLE Alliance ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or participate in our programs.'));
sections.push(heading('Information We Collect', HeadingLevel.HEADING_2));
sections.push(bold('Personal Information'));
sections.push(para('We may collect personal information that you voluntarily provide to us, including:'));
sections.push(bullet('Name, email address, phone number, and mailing address'));
sections.push(bullet('Professional information (job title, organization, credentials)'));
sections.push(bullet('Educational background and qualifications'));
sections.push(bullet('Payment information for program fees'));
sections.push(bullet('Application materials (CV, cover letters, references)'));
sections.push(bullet('Program participation data and assessment results'));
sections.push(bold('Automatically Collected Information'));
sections.push(para('When you visit our website, we may automatically collect:'));
sections.push(bullet('IP address and browser type'));
sections.push(bullet('Device information and operating system'));
sections.push(bullet('Pages visited and time spent on pages'));
sections.push(bullet('Referring website addresses'));
sections.push(bullet('Cookies and similar tracking technologies'));
sections.push(heading('How We Use Your Information', HeadingLevel.HEADING_2));
sections.push(para('We use the information we collect to:'));
sections.push(bullet('Provide and manage our training programs and services'));
sections.push(bullet('Process applications and registrations'));
sections.push(bullet('Communicate with you about programs, services, and opportunities'));
sections.push(bullet('Process payments and maintain financial records'));
sections.push(bullet('Improve our website, programs, and services'));
sections.push(bullet('Conduct research and evaluation'));
sections.push(bullet('Comply with legal obligations'));
sections.push(bullet('Send newsletters and marketing communications (with your consent)'));
sections.push(heading('Information Sharing and Disclosure', HeadingLevel.HEADING_2));
sections.push(para('We may share your information with:'));
sections.push(bullet('Service Providers: Third-party vendors who assist with website hosting, payment processing, email delivery, and other services'));
sections.push(bullet('Partners: Organizations we collaborate with for program delivery, with your consent'));
sections.push(bullet('Legal Requirements: When required by law or to protect our rights and safety'));
sections.push(bullet('Aggregated Data: De-identified, aggregated data for research and reporting purposes'));
sections.push(para('We do not sell your personal information to third parties.'));
sections.push(heading('Data Security', HeadingLevel.HEADING_2));
sections.push(para('We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:'));
sections.push(bullet('Encryption of sensitive data in transit and at rest'));
sections.push(bullet('Regular security assessments and updates'));
sections.push(bullet('Access controls and authentication procedures'));
sections.push(bullet('Staff training on data protection'));
sections.push(para('However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'));
sections.push(heading('Your Rights and Choices', HeadingLevel.HEADING_2));
sections.push(para('You have the right to:'));
sections.push(bullet('Access the personal information we hold about you'));
sections.push(bullet('Request correction of inaccurate information'));
sections.push(bullet('Request deletion of your information (subject to legal requirements)'));
sections.push(bullet('Object to or restrict certain processing of your information'));
sections.push(bullet('Withdraw consent for marketing communications'));
sections.push(bullet('Request a copy of your information in a portable format'));
sections.push(para('To exercise these rights, please contact us at privacy@medwholealliance.org. We will respond to your request within 30 days.'));
sections.push(heading('Cookies and Tracking Technologies', HeadingLevel.HEADING_2));
sections.push(para('We use cookies and similar technologies to enhance your experience on our website. You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.'));
sections.push(heading('International Data Transfers', HeadingLevel.HEADING_2));
sections.push(para('Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.'));
sections.push(heading("Children's Privacy", HeadingLevel.HEADING_2));
sections.push(para('Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.'));
sections.push(heading('Changes to This Privacy Policy', HeadingLevel.HEADING_2));
sections.push(para('We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.'));
sections.push(heading('Contact Us', HeadingLevel.HEADING_2));
sections.push(para('If you have questions or concerns about this Privacy Policy, please contact us at:'));
sections.push(para('MedWHOLE Alliance'));
sections.push(para('Email: privacy@medwholealliance.org'));
sections.push(para('Phone: +254 20 1234567'));
sections.push(para('Address: Abuja, Nigeria'));
sections.push(divider());

// ============ ACADEMY EVENTS [SLUG] ============
sections.push(heading('Academy Event Detail Pages', HeadingLevel.HEADING_1));
sections.push(para('Hardcoded events include:'));
sections.push(bold('Public Health Leadership Summit 2025'));
sections.push(para('Category: Workshop | Date: October 15-17, 2025 | Location: Abuja, Nigeria | Capacity: 300 participants'));
sections.push(para('Description: A gathering of health leaders and practitioners to discuss the future of community health and service delivery.'));
sections.push(bold('Epidemiology Masterclass Series'));
sections.push(para('Category: Training | Date: September 22-25, 2025 | Location: MedWHOLE Academy Campus, Kampala | Capacity: 150 participants'));
sections.push(para('Description: An intensive four-day masterclass covering advanced epidemiological methods, disease surveillance systems, and outbreak investigation techniques.'));
sections.push(bold('Research Methods & Grant Writing Workshop'));
sections.push(para('Category: Conference | Date: August 10-12, 2025 | Location: Accra International Conference Centre, Ghana | Capacity: 200 participants'));
sections.push(para('Description: A practical workshop designed to enhance research capabilities and grant writing skills for community health practitioners.'));
sections.push(divider());

// ============ HEALTH SERVICES EVENTS [SLUG] ============
sections.push(heading('Health Services Event Detail Pages', HeadingLevel.HEADING_1));
sections.push(para('Hardcoded events include:'));
sections.push(bold('World Heart Day Campaign'));
sections.push(para('Category: Campaign | Date: October 5-12, 2025 | Location: FCT Abuja, Nigeria | Capacity: 2,000+ residents'));
sections.push(para('Description: A cardiovascular health awareness and screening campaign reaching underserved communities, providing free heart health checkups and education.'));
sections.push(bold('Maternal & Child Health Week'));
sections.push(para('Category: Maternal Health | Date: September 18-25, 2025 | Location: Rural Communities, Uganda | Capacity: 1,500+ mothers and children'));
sections.push(para('Description: Comprehensive maternal and child health services delivered to rural communities, including prenatal care, immunizations, and health education for mothers and children.'));
sections.push(bold('Mobile Vaccination Drive'));
sections.push(para('Category: Vaccination | Date: August 15-22, 2025 | Location: Remote Villages, Tanzania | Capacity: 3,000+ individuals'));
sections.push(para('Description: Door-to-door vaccination campaign using mobile health units to reach remote and underserved populations with essential immunizations.'));
sections.push(divider());

// ============ FOOTER ============
sections.push(heading('Site Footer', HeadingLevel.HEADING_1));
sections.push(bold('MedWHOLE Alliance'));
sections.push(para('A Christ-centred development organisation making people whole through Health, Literacy, and Empowerment.'));
sections.push(para('Whole People. Lasting Impact.'));
sections.push(heading('Footer Navigation', HeadingLevel.HEADING_2));
sections.push(bold('Explore'));
sections.push(bullet('About MedWHOLE → /about'));
sections.push(bullet('What We Do → /programs'));
sections.push(bullet('Our Journey → /programs#made-whole'));
sections.push(bullet('Our Impact → /impact'));
sections.push(bold('Take Part'));
sections.push(bullet('Volunteer → /volunteer'));
sections.push(bullet('Partner With Us → /partner'));
sections.push(bullet('Careers → /careers'));
sections.push(bullet('Resources → /resources'));
sections.push(bold('Contact'));
sections.push(para('Connect with MedWHOLE to learn, serve, partner, or support the work.'));
sections.push(para('Email: info@medwhole.org'));
sections.push(para('Social: Instagram | YouTube'));
sections.push(heading('Footer Legal', HeadingLevel.HEADING_2));
sections.push(para('© 2026 MedWHOLE Alliance for Health and Development. All rights reserved.'));
sections.push(para('Links: Privacy Policy | Terms of Service'));


async function main() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = 'C:\\Users\\NEWUSER\\Documents\\medwhole-website\\MedWHOLE-Website-Content.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log(`Exported to ${outputPath}`);
}

main().catch(console.error);
