import type { LegalDocument } from "@/lib/legal-document"

export const termsOfService: LegalDocument = {
  title: "Terms of Service & Website Use",
  eyebrow: "Governance · Digital services · Programme participation",
  effectiveLabel: "Effective date",
  effectiveDate: "9 August 2026",
  introduction: "These Terms govern use of MedWHOLE’s website and digital services, and establish baseline terms for programme applications, donations, volunteering, health and education information, safeguarding, intellectual property, security, and related interactions.",
  sections: [
    {
      id: "introduction",
      title: "1. Introduction",
      blocks: [
        { type: "paragraph", text: "Welcome to MedWHOLE Alliance for Health and Development (“MedWHOLE”, “we”, “our” or “us”)." },
        { type: "paragraph", text: "These Terms of Service and Website Use (“Terms”) govern access to and use of the MedWHOLE website, online forms and digital services provided through the website, programme registration interfaces, volunteer and partnership application interfaces, donation-related services, educational resources, event registration facilities, and other digital services operated by or on behalf of MedWHOLE." },
        { type: "paragraph", text: "By accessing or using our website or digital services, you agree to these Terms to the extent applicable to your interaction with MedWHOLE." },
        { type: "paragraph", text: "Some MedWHOLE programmes, partnerships, volunteer engagements, health interventions, grants, sponsorships or events may also have additional terms, consent forms, safeguarding requirements or agreements. Where specific written terms apply to a particular programme or service, those specific terms will apply alongside these Terms and will take precedence where there is a direct conflict relating to that programme." },
      ],
    },
    {
      id: "about",
      title: "2. About MedWHOLE",
      blocks: [
        { type: "paragraph", text: "MedWHOLE Alliance for Health and Development is an organisation advancing whole-person and sustainable community development through health, education, nutrition, empowerment and related interventions." },
        { type: "paragraph", text: "Our activities may include:" },
        { type: "list", items: ["community health programmes;", "health screening and referral;", "educational interventions;", "scholarships and educational support;", "nutrition programmes;", "youth and child development initiatives;", "empowerment programmes;", "training and mentorship;", "volunteering and community outreach;", "partnerships and sponsorships;", "research and programme evaluation; and", "humanitarian and development initiatives."] },
        { type: "callout", label: "Principal contact", text: "MedWHOLE Alliance for Health and Development · 7 Nissi Drive, Fort Royal Airport Road, Abuja, FCT, Nigeria · info@medwhole.org · +234 818 980 0001" },
      ],
    },
    {
      id: "acceptance",
      title: "3. Acceptance of These Terms",
      blocks: [
        { type: "paragraph", text: "By using this website, submitting an online form, registering for a service where these Terms are presented, or otherwise using a MedWHOLE digital service, you acknowledge that you have read and understood these Terms." },
        { type: "paragraph", text: "If you do not agree with these Terms, you should discontinue use of the relevant website or digital service." },
        { type: "paragraph", text: "Simply visiting publicly accessible pages does not create an employment, partnership, medical, fiduciary, agency or other professional relationship between you and MedWHOLE." },
      ],
    },
    {
      id: "children",
      title: "4. Children and Young Persons",
      blocks: [
        { type: "paragraph", text: "MedWHOLE operates programmes that may intentionally serve children and young persons. Accordingly, children are not universally prohibited from accessing publicly available MedWHOLE information." },
        { type: "paragraph", text: "However, a child may not independently enter into a transaction, agreement or provide consent where applicable law requires the involvement of a parent or legal guardian." },
        { type: "paragraph", text: "Where appropriate, MedWHOLE may require:" },
        { type: "list", items: ["parent or guardian consent;", "verification of parental or guardian authority;", "child assent;", "school or institutional authorisation;", "medical consent;", "safeguarding documentation; or", "other approvals before participation."] },
        { type: "paragraph", text: "Children must not falsely represent themselves as adults in order to bypass a parent, guardian or safeguarding requirement. The collection and processing of children’s personal information is governed by our Privacy & Data Protection Policy and applicable safeguarding procedures." },
      ],
    },
    {
      id: "appropriate-use",
      title: "5. Appropriate Use of the Website",
      blocks: [
        { type: "paragraph", text: "You may use our website and publicly available resources for lawful purposes. You agree not to:" },
        { type: "list", items: ["use the website for fraudulent or unlawful activities;", "interfere with the operation or security of our systems;", "attempt to gain unauthorised access to accounts, administrative systems, databases or infrastructure;", "introduce malware, ransomware, viruses or harmful code;", "conduct unauthorised vulnerability scanning, penetration testing or security testing;", "attempt to bypass access controls or authentication mechanisms;", "scrape or harvest personal information in an unauthorised manner;", "impersonate MedWHOLE, its personnel, volunteers, beneficiaries or partners;", "submit deliberately false or misleading information;", "use our services to harass, abuse, threaten or exploit another person;", "infringe intellectual-property rights;", "use automated systems in a manner that places unreasonable demand on our infrastructure;", "interfere with another person’s lawful use of the website; or", "use MedWHOLE’s name, programmes or services to facilitate fraud, exploitation or unlawful fundraising."] },
        { type: "callout", label: "Security research", text: "Security researchers who identify a suspected vulnerability should report it privately to MedWHOLE rather than attempting to exploit it. Authorised security testing requires prior written approval specifying the permitted scope." },
      ],
    },
    {
      id: "information-accuracy",
      title: "6. Accuracy of Information You Provide",
      blocks: [
        { type: "paragraph", text: "Where you submit information to MedWHOLE, you agree, to the best of your knowledge, to provide information that is accurate and not deliberately misleading. This may apply to programme applications, volunteer applications, partnership enquiries, donation records, sponsorship requests, event registration, scholarship applications, beneficiary registration, professional applications and other forms." },
        { type: "paragraph", text: "Providing false information may result in rejection, suspension or termination of an application or programme participation where appropriate. MedWHOLE may request reasonable supporting documentation where verification is necessary." },
      ],
    },
    {
      id: "applications-eligibility",
      title: "7. Programme Applications and Eligibility",
      blocks: [
        { type: "paragraph", text: "Submitting an application or registration form does not automatically guarantee admission, funding, scholarship, employment, volunteer placement, programme participation, sponsorship, partnership, medical assistance, grant support or any other benefit." },
        { type: "paragraph", text: "MedWHOLE may establish eligibility requirements for individual programmes. Programme capacity may be limited." },
        { type: "paragraph", text: "Selection decisions may take into account factors including programme objectives, available resources, eligibility criteria, vulnerability assessments, location, programme capacity and other legitimate considerations." },
        { type: "paragraph", text: "MedWHOLE reserves the right to verify information submitted in connection with an application where lawful and reasonably necessary." },
      ],
    },
    {
      id: "health-information",
      title: "8. Health Information and Health Programmes",
      blocks: [
        { type: "subheading", text: "General Website Information" },
        { type: "paragraph", text: "Health information provided on the MedWHOLE website for public education is intended for general informational and educational purposes." },
        { type: "paragraph", text: "General website content is not a substitute for individual medical assessment, diagnosis, treatment, prescriptions, emergency medical attention or advice from an appropriately qualified healthcare professional." },
        { type: "paragraph", text: "Individuals should not delay necessary medical care solely because of information contained on this website. If you believe you are experiencing a medical emergency, seek appropriate emergency medical care promptly." },
        { type: "subheading", text: "Direct Health Services" },
        { type: "paragraph", text: "This general website disclaimer does not remove or reduce professional responsibilities applicable where MedWHOLE or its authorised healthcare professionals directly provide healthcare services." },
        { type: "paragraph", text: "Clinical services, screenings, consultations, referrals and other medical interventions may be subject to separate clinical protocols, professional duties, consent requirements and programme-specific documentation." },
        { type: "subheading", text: "Screening Results" },
        { type: "paragraph", text: "A screening result does not necessarily constitute a definitive diagnosis. Participants may be advised to obtain further investigation, consultation or treatment from an appropriate healthcare professional." },
      ],
    },
    {
      id: "education",
      title: "9. Educational Information and Programmes",
      blocks: [
        { type: "paragraph", text: "Educational materials made available by MedWHOLE are intended to support learning and development." },
        { type: "paragraph", text: "Unless expressly stated otherwise, participation in a MedWHOLE programme does not guarantee employment, professional licensing, academic admission, certification by an external institution, financial success, particular examination results or any specific professional outcome." },
        { type: "paragraph", text: "Where a programme awards a certificate, the applicable programme requirements will determine eligibility for that certificate. MedWHOLE may require appropriate participation, attendance, assessments, assignments or standards of conduct before issuing programme certificates." },
      ],
    },
    {
      id: "programme-fees",
      title: "10. Programme Fees",
      blocks: [
        { type: "paragraph", text: "Some MedWHOLE activities may be free, subsidised, sponsored or grant-funded, while others may require payment." },
        { type: "paragraph", text: "Where a programme carries a fee, the applicable amount, currency, payment method, deadline, cancellation terms, refund terms and other financial conditions will be communicated in connection with that specific programme." },
        { type: "paragraph", text: "There is no universal requirement that all MedWHOLE programme fees be denominated in United States Dollars. Programme-specific payment and refund conditions take precedence over general website information." },
      ],
    },
    {
      id: "donations",
      title: "11. Donations",
      blocks: [
        { type: "subheading", text: "Donation Intent" },
        { type: "paragraph", text: "Submission of an online donation form may record a donor’s intention to donate but does not itself necessarily constitute completion of a payment. A donation is considered received when funds have been successfully received or confirmed through the relevant financial channel." },
        { type: "subheading", text: "Payment Credentials" },
        { type: "paragraph", text: "MedWHOLE will not request online banking passwords, ATM PINs, card PINs, one-time passwords intended for authentication, or similar confidential banking authentication credentials." },
        { type: "paragraph", text: "Donors should never send such credentials to MedWHOLE personnel." },
        { type: "subheading", text: "Restricted Donations" },
        { type: "paragraph", text: "Where MedWHOLE expressly accepts a donation restricted to a particular programme or purpose, reasonable efforts will be made to apply the donation accordingly. If the designated programme becomes impossible, unlawful, impracticable or fully funded, MedWHOLE may contact the donor where appropriate or apply the funds to a substantially related purpose in accordance with applicable obligations." },
        { type: "subheading", text: "Refunds" },
        { type: "paragraph", text: "Because donations are generally voluntary gifts, confirmed donations are ordinarily not refundable." },
        { type: "paragraph", text: "MedWHOLE may consider a refund where a duplicate payment was made, an incorrect amount was transferred, a payment was made in error, fraud or unauthorised use is established, applicable law requires a refund, or MedWHOLE determines that exceptional circumstances justify one." },
        { type: "paragraph", text: "Any refund may be subject to verification of the original transaction." },
      ],
    },
    {
      id: "volunteering",
      title: "12. Volunteering",
      blocks: [
        { type: "paragraph", text: "Submitting a volunteer application does not guarantee acceptance or placement." },
        { type: "paragraph", text: "MedWHOLE may conduct appropriate interviews, identity verification, reference checks, qualification verification, safeguarding checks, orientation, training or background checks depending on the nature of the role." },
        { type: "paragraph", text: "Volunteers working with children, health information, finances or vulnerable persons may be subject to enhanced requirements." },
        { type: "paragraph", text: "Volunteer participation may also be governed by separate volunteer agreements, codes of conduct, confidentiality obligations, safeguarding policies, health and safety procedures and programme instructions." },
        { type: "paragraph", text: "MedWHOLE may remove a volunteer from an assignment where reasonably necessary to protect participants, beneficiaries, other volunteers, staff, partners or the integrity of the programme." },
      ],
    },
    {
      id: "safeguarding",
      title: "13. Safeguarding",
      blocks: [
        { type: "paragraph", text: "MedWHOLE seeks to maintain programmes in which children and vulnerable persons are treated with dignity and protected from abuse, exploitation and inappropriate conduct." },
        { type: "paragraph", text: "Programme participants, staff, volunteers, contractors and partners may be required to comply with MedWHOLE safeguarding rules." },
        { type: "paragraph", text: "Prohibited conduct may include:" },
        { type: "list", items: ["abuse;", "exploitation;", "sexual misconduct;", "harassment;", "inappropriate relationships;", "unauthorised photography;", "inappropriate communication with children;", "unauthorised disclosure of beneficiary information; and", "conduct that places a child or vulnerable person at unreasonable risk."] },
        { type: "paragraph", text: "MedWHOLE may report safeguarding concerns to appropriate authorities or professionals where required or permitted by law." },
      ],
    },
    {
      id: "media-stories",
      title: "14. Photographs, Videos and Beneficiary Stories",
      blocks: [
        { type: "paragraph", text: "Participation in a MedWHOLE programme does not automatically grant MedWHOLE unrestricted permission to use an identifiable individual’s image or story for publicity." },
        { type: "paragraph", text: "The use of photographs, videos, interviews and beneficiary stories is governed by our Privacy & Data Protection Policy and applicable consent procedures." },
        { type: "paragraph", text: "For children, appropriate parent or guardian permission should ordinarily be obtained where identifiable material is intended for publicity, subject to applicable law. Where appropriate, children should also be informed and their wishes respected." },
        { type: "paragraph", text: "Declining optional publicity consent should not by itself disqualify an otherwise eligible person from receiving a MedWHOLE service." },
      ],
    },
    {
      id: "intellectual-property",
      title: "15. Intellectual Property",
      blocks: [
        { type: "paragraph", text: "Unless otherwise stated, content owned by MedWHOLE, including logos, branding, graphics, photographs, videos, written materials, programme materials, designs, reports, website content and software, is owned by MedWHOLE or used with permission from the relevant rights holder." },
        { type: "paragraph", text: "Such material may be protected by applicable copyright, trademark and other intellectual-property laws." },
      ],
    },
    {
      id: "permitted-use",
      title: "16. Permitted Use of MedWHOLE Content",
      blocks: [
        { type: "paragraph", text: "You may ordinarily view our publicly available website, share links to public webpages, quote reasonable portions of publicly available materials with appropriate attribution, download resources expressly made available for public use, and use materials where MedWHOLE expressly grants permission." },
        { type: "paragraph", text: "Unless otherwise authorised, you may not:" },
        { type: "list", items: ["reproduce substantial portions of our materials commercially;", "sell our content;", "remove ownership or copyright notices;", "falsely suggest that MedWHOLE endorses another organisation;", "reproduce our logo as your organisation’s branding;", "materially alter our content and present it as MedWHOLE’s original publication; or", "use beneficiary images or stories in an exploitative or misleading manner."] },
        { type: "paragraph", text: "Requests for broader use may be submitted to MedWHOLE." },
      ],
    },
    {
      id: "submitted-content",
      title: "17. Content Submitted to MedWHOLE",
      blocks: [
        { type: "paragraph", text: "Where you voluntarily submit content such as feedback, programme reports, testimonials, project information, written contributions, suggestions or other materials, you confirm that you have the authority to submit the material." },
        { type: "paragraph", text: "You retain applicable rights in content that you own." },
        { type: "paragraph", text: "You grant MedWHOLE only such rights as are reasonably necessary to receive, review, process and use the material for the purpose for which it was submitted, subject to applicable privacy, confidentiality and consent requirements." },
        { type: "paragraph", text: "Submitting personal information, photographs or stories does not automatically grant MedWHOLE unrestricted promotional rights." },
      ],
    },
    {
      id: "privacy",
      title: "18. Privacy and Personal Data",
      blocks: [
        { type: "paragraph", text: "Our processing of personal information is governed by the MedWHOLE Privacy & Data Protection Policy." },
        { type: "paragraph", text: "That policy forms an important part of the framework governing use of our digital services. Where these Terms and the Privacy & Data Protection Policy address different matters, each applies to its respective subject." },
      ],
    },
    {
      id: "third-party-services",
      title: "19. Third-Party Services and Links",
      blocks: [
        { type: "paragraph", text: "The MedWHOLE website may link to or integrate services provided by third parties, including banks, payment providers, social-media platforms, cloud providers, email providers, maps, analytics providers, partner organisations and other external websites." },
        { type: "paragraph", text: "A link does not necessarily mean that MedWHOLE controls or endorses every activity of the third-party provider." },
        { type: "paragraph", text: "Third-party websites and services may have their own terms and privacy policies. MedWHOLE is not responsible for the independent content, security or privacy practices of third-party services outside our reasonable control." },
      ],
    },
    {
      id: "external-partners",
      title: "20. External Partners",
      blocks: [
        { type: "paragraph", text: "MedWHOLE may undertake programmes together with governments, healthcare providers, schools, nonprofits, funders, companies, churches, community organisations and other partners." },
        { type: "paragraph", text: "A partnership involving MedWHOLE does not automatically make MedWHOLE responsible for every independent act or omission of the partner. Responsibilities should be determined by the nature of the programme and the relevant partnership agreement." },
      ],
    },
    {
      id: "availability",
      title: "21. Availability of the Website",
      blocks: [
        { type: "paragraph", text: "We seek to maintain reliable access to our website but do not guarantee continuous or error-free availability." },
        { type: "paragraph", text: "Access may occasionally be interrupted because of maintenance, security updates, hosting failures, network problems, third-party service interruptions, force majeure events, upgrades or circumstances outside our reasonable control." },
        { type: "paragraph", text: "MedWHOLE may modify, suspend or discontinue particular online features where reasonably necessary." },
      ],
    },
    {
      id: "security",
      title: "22. Security",
      blocks: [
        { type: "paragraph", text: "Users must not attempt to compromise MedWHOLE systems." },
        { type: "paragraph", text: "If you discover a suspected vulnerability, security weakness or accidental exposure of personal information, please report it privately to info@medwhole.org and provide sufficient information for us to understand the issue." },
        { type: "paragraph", text: "Do not:" },
        { type: "list", items: ["access information beyond what is necessary to identify the suspected issue;", "download beneficiary databases;", "modify or delete records;", "access children’s or health information;", "disrupt our services;", "attempt credential attacks;", "publicly disclose sensitive vulnerability details before MedWHOLE has had a reasonable opportunity to investigate; or", "demand payment by threatening disclosure or exploitation."] },
        { type: "callout", label: "Authorised testing", text: "Permission to report a vulnerability does not constitute permission to perform unrestricted penetration testing. Any penetration test or active security assessment requires prior written authorisation and a defined scope." },
      ],
    },
    {
      id: "disclaimers",
      title: "23. Disclaimers",
      blocks: [
        { type: "paragraph", text: "MedWHOLE seeks to ensure that information on its website is accurate and current but cannot guarantee that every piece of public information will always be complete or free from error." },
        { type: "paragraph", text: "Programme details may change because of funding, operational circumstances, public-health conditions, partner requirements, beneficiary needs, programme capacity or other legitimate reasons." },
        { type: "paragraph", text: "Where information concerns an important decision, users should seek confirmation directly from MedWHOLE where appropriate." },
        { type: "paragraph", text: "Nothing in these Terms excludes obligations that cannot legally be excluded." },
      ],
    },
    {
      id: "liability",
      title: "24. Limitation of Liability",
      blocks: [
        { type: "paragraph", text: "To the maximum extent permitted by applicable law, MedWHOLE will not be liable for indirect, incidental or consequential losses arising solely from use of general website information or circumstances outside our reasonable control." },
        { type: "paragraph", text: "Nothing in these Terms is intended to exclude or limit liability where exclusion or limitation would be unlawful." },
        { type: "paragraph", text: "Nothing in this section removes responsibilities that MedWHOLE, healthcare professionals, staff, volunteers or other persons may separately have under applicable law." },
      ],
    },
    {
      id: "your-responsibility",
      title: "25. Your Responsibility",
      blocks: [
        { type: "paragraph", text: "You are responsible for protecting your own account credentials where accounts are provided, providing accurate information, using our services lawfully, following applicable programme rules, protecting confidential information provided to you, respecting beneficiaries and other participants, and notifying MedWHOLE where you reasonably believe an account or communication has been compromised." },
      ],
    },
    {
      id: "access-restriction",
      title: "26. Suspension or Restriction of Access",
      blocks: [
        { type: "paragraph", text: "MedWHOLE may restrict or suspend access to particular digital services where reasonably necessary because of security risks, suspected fraud, unlawful activity, material breach of these Terms, safeguarding concerns, interference with our systems, abuse of participants or personnel, or protection of MedWHOLE’s legitimate operations." },
        { type: "paragraph", text: "Where practical and appropriate, affected users may be informed of the reason." },
      ],
    },
    {
      id: "impersonation",
      title: "27. Fraudulent Communications and Impersonation",
      blocks: [
        { type: "paragraph", text: "MedWHOLE is not responsible for fraudulent websites, accounts, emails or individuals falsely claiming to represent us where they are outside our reasonable control." },
        { type: "paragraph", text: "If you receive a suspicious communication claiming to come from MedWHOLE, verify it using contact information published on our official website before making payments, providing identification, submitting sensitive information or clicking suspicious links." },
        { type: "paragraph", text: "MedWHOLE personnel should never ask for a banking PIN, password or one-time authentication code." },
      ],
    },
    {
      id: "force-majeure",
      title: "28. Force Majeure",
      blocks: [
        { type: "paragraph", text: "MedWHOLE will not be considered in breach of these Terms solely because performance is delayed or prevented by circumstances reasonably outside our control." },
        { type: "paragraph", text: "These circumstances may include natural disasters, epidemics, pandemics, acts of government, civil disturbances, war, telecommunications outages, major infrastructure failures, labour disruption, severe weather, security emergencies or similar events." },
        { type: "paragraph", text: "Where a programme is affected, MedWHOLE will take reasonable steps appropriate to the circumstances." },
      ],
    },
    {
      id: "complaints",
      title: "29. Complaints and Concerns",
      blocks: [
        { type: "paragraph", text: "We encourage individuals to raise concerns directly with MedWHOLE so they can be appropriately reviewed." },
        { type: "paragraph", text: "Complaints may relate to website content, programme administration, payments, volunteer conduct, beneficiary treatment, safeguarding, privacy, partnerships or other organisational activities." },
        { type: "paragraph", text: "Complaints should be submitted with sufficient information to allow appropriate investigation. Privacy complaints will also be handled in accordance with our Privacy & Data Protection Policy. Safeguarding allegations may require specialised handling and confidentiality." },
      ],
    },
    {
      id: "governing-law",
      title: "30. Governing Law",
      blocks: [
        { type: "paragraph", text: "These Terms are governed by the laws of the Federal Republic of Nigeria." },
        { type: "paragraph", text: "Any rights available to consumers, beneficiaries or other individuals under applicable mandatory Nigerian law remain unaffected." },
      ],
    },
    {
      id: "dispute-resolution",
      title: "31. Dispute Resolution",
      blocks: [
        { type: "paragraph", text: "Where a dispute arises in connection with these Terms, the parties should first make reasonable efforts to resolve the matter through good-faith discussion." },
        { type: "paragraph", text: "Where appropriate, the parties may agree to mediation or another recognised alternative dispute-resolution process." },
        { type: "paragraph", text: "Where a dispute cannot be resolved informally or through an agreed alternative process, it may be submitted to a court of competent jurisdiction in Nigeria." },
        { type: "paragraph", text: "Nothing in this section prevents a person from approaching a competent regulator or authority where they have a statutory right to do so." },
      ],
    },
    {
      id: "terms-changes",
      title: "32. Changes to These Terms",
      blocks: [
        { type: "paragraph", text: "MedWHOLE may update these Terms when our programmes change, our technology changes, legal or regulatory requirements change, new services are introduced or clarification is reasonably required." },
        { type: "paragraph", text: "The latest version will be published on our website with its effective date." },
        { type: "paragraph", text: "Material changes should not be applied retrospectively where doing so would unlawfully remove rights or materially alter a completed transaction." },
      ],
    },
    {
      id: "severability",
      title: "33. Severability",
      blocks: [
        { type: "paragraph", text: "If any provision of these Terms is found to be invalid or unenforceable, that provision will be interpreted or limited to the extent necessary while the remaining provisions continue to apply." },
      ],
    },
    {
      id: "no-waiver",
      title: "34. No Waiver",
      blocks: [
        { type: "paragraph", text: "Failure by MedWHOLE to immediately enforce a provision of these Terms does not necessarily constitute a permanent waiver of that provision or another legal right." },
      ],
    },
    {
      id: "entire-terms",
      title: "35. Entire Website Terms",
      blocks: [
        { type: "paragraph", text: "These Terms, together with the Privacy & Data Protection Policy and any specific terms applicable to a particular programme or transaction, constitute the applicable terms governing use of the relevant MedWHOLE digital service." },
        { type: "paragraph", text: "Programme-specific agreements may impose additional requirements." },
      ],
    },
    {
      id: "contact",
      title: "36. Contact Us",
      blocks: [
        { type: "paragraph", text: "For questions concerning these Terms, please contact MedWHOLE Alliance for Health and Development using the details below." },
        { type: "callout", label: "Official contact", text: "7 Nissi Drive, Fort Royal Airport Road, Abuja, FCT, Nigeria · info@medwhole.org · +234 818 980 0001" },
      ],
    },
  ],
}
