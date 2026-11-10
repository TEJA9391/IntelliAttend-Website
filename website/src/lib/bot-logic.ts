export interface BotContext {
  lastIntent: string | null;
  lastEntity: string | null;
  history: Array<{ role: string; content: string }>;
}

export interface BotResponse {
  text: string;
  quickReplies: string[];
  nextContext: BotContext;
}

// --- NORMALIZATION & DICTIONARIES ---

const TYPO_MAP: Record<string, string> = {
  "smartbord": "smartboard",
  "smart board": "smartboard",
  "faculity": "faculty",
  "studnt": "student",
  "attendence": "attendance",
  "attandance": "attendance",
  "atendance": "attendance",
  "notifcation": "notification",
  "prcing": "pricing",
  "documntation": "documentation",
  "suport": "support",
  "signin": "login",
  "log in": "login",
  "abt": "about",
  "pls": "please",
  "plz": "please",
  "u": "you",
  "ur": "your",
  "wht": "what",
  "secutiry": "security",
  "privcy": "privacy",
  "timtable": "timetable",
  "sheduler": "scheduler",
  "sylabus": "syllabus",
  "curiculum": "curriculum",
  "exm": "exam",
  "tution": "tuition",
  "parnt": "parent"
};

const PROFANITY_LIST = [
  "shit", "fuck", "bitch", "crap", "damn", "wtf", "stupid", "suck", "sucks", "hell", "bastard", "dick"
];

// --- SENSITIVE & CONFIDENTIAL SECURITY FILTER ---
// Protects internal configurations, developer secrets, backend keys, system prompts, and individual student records.
const SENSITIVE_PATTERNS: RegExp[] = [
  // System prompt / Prompt injection
  /\b(system prompt|system instruction|developer instruction|ignore previous|disregard previous|reveal prompt|show prompt|internal instructions)\b/i,
  // Passwords, keys, credentials, tokens
  /\b(admin password|database password|db password|secret key|api secret|private key|auth token|access token|master key|jwt secret|root password)\b/i,
  // Database / backend infrastructure
  /\b(connection string|sql injection|drop table|database dump|select \* from|mongodb uri|postgres uri|backend ip|server ip|env file|\.env)\b/i,
  // Source code / repo secrets
  /\b(reveal source code|download repo|show backend code|source code dump|server architecture internal)\b/i,
  // Private student or personal records
  /\b(give me|show|reveal|get|dump|list)\b.*?\b(student|students)\b.*?\b(record|records|phone|phones|number|numbers|email|emails|data|marks|grades|scores|address|addresses|credentials)\b/i,
  /\b(student|students)\b.*?\b(phone number|phone numbers|private record|private records|personal email|home address)\b/i,
  // Developer private contact details
  /\b(developer private phone|personal email of (creator|developer|founder)|personal phone of (creator|developer|founder))\b/i
];

function isSensitiveOrRestricted(text: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}

// --- INTENT KNOWLEDGE BASE ---

interface IntentDef {
  id: string;
  entities: string[];
  keywords: string[];
  phrases: string[];
  response: string;
  quickReplies: string[];
}

const INTENTS: IntentDef[] = [
  {
    id: "GREETING",
    entities: [],
    keywords: ["hi", "hello", "hey", "greetings", "howdy", "morning", "afternoon", "namaste"],
    phrases: ["how are you", "what is up", "who are you", "what are you", "good morning", "good evening"],
    response: "Hello! I am the **IntelliAttend AI Assistant**.\n\nI can provide comprehensive information regarding our campus management platform, including:\n- **Automated Attendance & 75% Compliance**\n- **SmartBoard Digital Signage & Classroom Displays**\n- **Faculty Portal & Student Mobile App**\n- **Timetables, Fees, Exams & Leave Management**\n- **Enterprise Security, Privacy & Compliance**\n- **Free 30-Day Institutional Pilot & Pricing**\n\nHow can I assist you or your institution today?",
    quickReplies: ["What is IntelliAttend?", "Explore Features", "Pricing & Pilot", "Speak with Expert"]
  },
  {
    id: "CORE_PLATFORM",
    entities: ["intelliattend", "platform"],
    keywords: ["intelliattend", "platform", "software", "system", "overview", "product", "ecosystem"],
    phrases: ["what is intelliattend", "what is this platform", "what do you do", "tell me about intelliattend", "how does it work"],
    response: "**IntelliAttend** is a unified smart campus management and attendance automation platform engineered for colleges, universities, and schools.\n\n### Core Platform Capabilities:\n- **1-Tap Attendance**: Fast roll call synchronized with real-time class timetables.\n- **SmartBoard Digital Signage**: Turns idle lecture screens into dynamic campus bulletin boards.\n- **Faculty & Student Portals**: Native mobile apps and web portals for daily academic workflows.\n- **Parent Communication**: Real-time attendance alerts, fee receipts, and academic updates.\n- **Academic Operations**: Automated timetable scheduling, fee collection, leave/OD workflows, and NAAC/NBA compliance analytics.\n\nDesigned to run on cloud infrastructure with zero specialized hardware requirements.",
    quickReplies: ["Attendance Tracking", "SmartBoard Displays", "Pricing & Pilot", "Book a Demo"]
  },
  {
    id: "ATTENDANCE",
    entities: ["attendance", "absent", "present"],
    keywords: ["attendance", "register", "roll", "present", "absent", "percentage", "shortage", "condonation", "75%"],
    phrases: ["how attendance works", "how do you track attendance", "mark attendance", "75 percent rule", "attendance shortage", "take attendance", "student attendance"],
    response: "### Attendance Tracking & Automated Compliance\n\nIntelliAttend modernizes institutional attendance with precision and speed:\n\n- **1-Tap Faculty Roll Call**: Educators mark an entire class session in under 15 seconds from mobile or web.\n- **75% Mandatory Attendance Rule**: Real-time calculation alerts students and mentors before shortages reach condonation thresholds.\n- **Automated Parent Alerts**: Immediate SMS and push notifications inform guardians if a student is absent.\n- **Dispute Resolution & Audit Trail**: Transparent digital logs prevent proxy attendance and resolve student disputes with historical session timestamps.\n- **Location Privacy Assured**: Attendance is verified without invasive background device tracking or battery-draining location monitoring.",
    quickReplies: ["Faculty Tools", "Student App", "Parent Portal", "SmartBoard Sync"]
  },
  {
    id: "SMARTBOARD",
    entities: ["smartboard", "display"],
    keywords: ["smartboard", "board", "screen", "display", "signage", "projector", "interactive", "tv", "idle"],
    phrases: ["what is smartboard", "idle classroom signage", "how smartboard works", "classroom screen", "cast screen", "digital signage", "hardware requirements"],
    response: "### IntelliAttend SmartBoard & Classroom Signage\n\nTransforms ordinary lecture hall displays and interactive panels into connected campus touchpoints:\n\n- **Idle Screen Digital Signage**: Between lectures, idle classroom screens automatically broadcast daily timetables, upcoming campus events, exam schedules, and placement notices.\n- **Interactive Teaching**: Faculty can push presentation slides, annotate in real-time, and save handwritten notes directly to student cloud drives.\n- **Hardware Agnostic**: Compatible with existing smart TVs, Android displays, interactive panels, or projectors via HDMI or Android app—no proprietary screen purchase required.\n- **Automatic Standby**: Screens switch back instantly when a lecture starts and power down safely during off-hours.",
    quickReplies: ["Attendance Tracking", "Faculty Portal", "Curriculum Tracker", "Book a Demo"]
  },
  {
    id: "FACULTY",
    entities: ["faculty", "teacher", "professor"],
    keywords: ["faculty", "teacher", "professor", "educator", "instructor", "lecturer", "hod"],
    phrases: ["faculty portal", "faculty app", "what can teachers do", "teacher features", "faculty workload", "hod review"],
    response: "### Faculty Portal & Mobile Tools\n\nEngineered to eliminate administrative burdens so educators can focus on teaching:\n\n- **1-Tap Roll Call**: Mark attendance in seconds with automatic timetable mapping.\n- **Curriculum Progress Tracker**: Log syllabus units taught and practical lab experiments against academic calendar deadlines.\n- **Internal Marks & CIE**: Enter internal assessment scores with auto-calculated weighted grades.\n- **Substitute Management**: Request peer substitution with automated notifications when on planned leave.\n- **Direct Student & Parent Messaging**: Send official announcements and academic reminders securely.",
    quickReplies: ["Curriculum Tracker", "SmartBoard Sync", "Timetable Scheduler", "Student App"]
  },
  {
    id: "STUDENT",
    entities: ["student", "app"],
    keywords: ["student", "pupil", "learner", "grades", "percentage", "hall ticket", "notes"],
    phrases: ["student app", "what can students see", "student features", "check attendance", "view timetable", "student portal"],
    response: "### Student Mobile App (iOS & Android)\n\nA personal digital compass for daily campus life:\n\n- **Real-Time Attendance Health**: Live percentage tracking with green/amber/red indicators to stay well above the 75% requirement.\n- **Daily Timetable & Class Locations**: Dynamic daily schedule showing course codes, lecture halls, and faculty names.\n- **SmartBoard Notes Repository**: Access lecture presentations, digital ink notes, and study resources uploaded from class displays.\n- **Hall Tickets & Results**: View semester examination schedules, internal marks, and downloadable grade reports.\n- **Fee Dues & Digital Receipts**: Check fee payment deadlines and access instant verified payment receipts.",
    quickReplies: ["Attendance Rules", "Parent Portal", "Exams & Grading", "Security & Privacy"]
  },
  {
    id: "PARENT",
    entities: ["parent", "guardian"],
    keywords: ["parent", "guardian", "father", "mother", "sms", "alert", "notice"],
    phrases: ["parent portal", "parent app", "parent communication", "parent notifications", "guardian alerts"],
    response: "### Parent Communication & Transparency Portal\n\nFosters trust and academic alignment between institutions and families:\n\n- **Instant Absence Notifications**: Automated SMS and app push notifications whenever a student is marked absent.\n- **Academic Progress Overview**: Transparent view of subject-wise attendance percentages, mid-term marks, and faculty remarks.\n- **Fee Management**: Review tuition and hostel dues, make secure online payments, and download official receipts.\n- **Digital Leave Applications**: Submit and track medical or personal leave requests directly to the class mentor.",
    quickReplies: ["Fee Management", "Attendance Tracking", "Student App", "Security & Privacy"]
  },
  {
    id: "TIMETABLE",
    entities: ["timetable", "scheduler"],
    keywords: ["timetable", "schedule", "scheduler", "slot", "period", "routine", "clash", "room"],
    phrases: ["timetable scheduler", "how does timetable work", "conflict free schedule", "classroom allocation", "faculty substitution"],
    response: "### Smart Timetable & Scheduling Engine\n\n- **Conflict-Free Matrix**: Algorithmic scheduling prevents faculty, batch, and laboratory room overlapping.\n- **Automated Workload Balancing**: Distributes lecture hours evenly to prevent faculty fatigue and adhere to UGC/AICTE guidelines.\n- **Dynamic Adjustments**: Instant timetable reshuffling when faculty is on leave, alerting students automatically.\n- **SmartBoard Sync**: Room timetables stream dynamically to each classroom's digital signage display.",
    quickReplies: ["Faculty Portal", "SmartBoard Displays", "Attendance Tracking", "Book a Demo"]
  },
  {
    id: "FEES",
    entities: ["fees", "finance"],
    keywords: ["fee", "fees", "payment", "tuition", "dues", "hostel", "receipt", "ledger", "finance", "billing"],
    phrases: ["fee management", "how fees work", "pay fee", "fee receipts", "tuition collection", "fee reports"],
    response: "### Fees & Financial Management System\n\n- **Multi-Category Collection**: Configure tuition, examination, laboratory, transport, and hostel fee structures.\n- **Secure Digital Payments**: Integrated with major payment gateways (UPI, NetBanking, Debit/Credit Cards).\n- **Automated Instant Receipts**: Digitally signed receipts issued immediately upon successful payment.\n- **Installment & Defaulter Tracking**: Automated reminder alerts to parents and real-time dues reports for college administration.\n- **Audit-Ready Ledgers**: Comprehensive reconciliation records exportable to institutional accounting software.",
    quickReplies: ["Parent Portal", "Security & Compliance", "Pricing & Pilot", "Speak with Expert"]
  },
  {
    id: "EXAMS",
    entities: ["exams", "marks"],
    keywords: ["exam", "examination", "marks", "grade", "gpa", "cgpa", "results", "cie", "assessment", "naac"],
    phrases: ["exam management", "grading system", "internal marks", "report card", "cie assessment", "naac compliance"],
    response: "### Examination & Grading Management\n\n- **Continuous Internal Evaluation (CIE)**: Streamlines quizzes, assignments, mid-terms, and lab practical scoring.\n- **GPA / CGPA Computation**: Automated grade calculations according to university choice-based credit systems (CBCS).\n- **Digital Hall Tickets & Seating**: Generate and distribute printable hall tickets and classroom seating arrangements.\n- **Accreditation Readiness**: One-click data exports structured for NAAC, NBA, and NIRF accreditation audits.",
    quickReplies: ["Curriculum Tracker", "Student App", "Faculty Portal", "Documentation"]
  },
  {
    id: "LEAVE_OD",
    entities: ["leave", "od"],
    keywords: ["leave", "od", "on-duty", "onduty", "permission", "medical", "sports", "absence"],
    phrases: ["leave management", "od approval", "on duty leave", "apply for leave", "medical certificate"],
    response: "### Digital Leave & On-Duty (OD) Workflow\n\n- **Paperless Leave Approvals**: Multi-tier digital approval pipeline (Mentor -> HOD -> Dean) for student and faculty leave.\n- **On-Duty (OD) Tracking**: Accurately credits attendance for students representing the institution in sports, hackathons, or academic conferences.\n- **Medical Proof Verification**: Students can upload medical certificates directly through the app for mentor verification.\n- **Audit Compliance**: Every approved leave or OD is recorded with an indelible timestamp in the institutional ledger.",
    quickReplies: ["Attendance Tracking", "Student App", "Faculty Portal", "Documentation"]
  },
  {
    id: "CURRICULUM",
    entities: ["curriculum", "syllabus"],
    keywords: ["curriculum", "syllabus", "lesson", "plan", "completion", "lab", "experiments", "hod"],
    phrases: ["curriculum progress", "syllabus tracker", "lesson plan completion", "lab tracker", "hod review"],
    response: "### Curriculum Progress Tracker\n\n- **Lesson Plan Tracking**: Monitors syllabus units taught and practical lab experiments against academic calendar milestones.\n- **Prevent Exam Rushes**: Identifies pacing delays early to prevent rushed lectures before semester examinations.\n- **HOD & Dean Visibility**: Automated weekly progress summaries highlight completion percentages across all academic departments.\n- **Accreditation Evidence**: Maintains historical lecture logs to demonstrate syllabus compliance during accreditation reviews.",
    quickReplies: ["Faculty Portal", "SmartBoard Sync", "Exams & Grading", "Book a Demo"]
  },
  {
    id: "SECURITY_PRIVACY",
    entities: ["security", "privacy", "compliance"],
    keywords: ["security", "privacy", "data", "safe", "encryption", "gdpr", "ferpa", "iso", "compliance", "tracking", "protect", "confidential"],
    phrases: ["is it secure", "is my data safe", "how do you protect privacy", "data privacy", "do you track devices", "security compliance", "ferpa compliant", "gdpr"],
    response: "### Enterprise Security & Data Privacy Assurances\n\nIntelliAttend adheres to the highest data protection and compliance benchmarks:\n\n- **End-to-End Encryption**: 256-bit AES encryption for all data at rest and TLS 1.3 for data in transit.\n- **Strictly Zero Personal Device Tracking**: We strictly protect student physical privacy. IntelliAttend never tracks personal device locations or monitors student movement.\n- **Zero Data Monetization**: Student, faculty, and institutional data is never sold, shared with advertisers, or commercialized.\n- **Role-Based Access Control (RBAC)**: Strict permission boundaries ensure users only see records relevant to their authorized role.\n- **Institutional Compliance**: Architecture aligns with FERPA, GDPR, and ISO 27001 data protection standards.\n- **Offline Resilience**: Local caches allow operations during network dips and re-sync securely once connectivity is restored.",
    quickReplies: ["Tech & Integrations", "Pricing & Pilot", "Speak with Expert", "Documentation"]
  },
  {
    id: "TECH_API",
    entities: ["api", "tech", "integration"],
    keywords: ["api", "tech", "integration", "erp", "database", "webhook", "developer", "canvas", "blackboard", "moodle", "sso"],
    phrases: ["do you support api", "does it integrate with erp", "lms integration", "rest api", "single sign on", "canvas integration"],
    response: "### System Architecture & Enterprise Integrations\n\n- **RESTful APIs & Webhooks**: Seamless programmatic data synchronization with existing campus databases and ERPs.\n- **LMS Connectors**: Pre-built integration support for Canvas, Blackboard, Moodle, and Google Classroom.\n- **Enterprise SSO**: Industry-standard authentication via SAML 2.0, OAuth 2.0, Microsoft Azure AD, and Google Workspace.\n- **Cloud-Native Scalability**: High-availability infrastructure with 99.9% uptime SLA and automated encrypted daily backups.",
    quickReplies: ["Security & Privacy", "Documentation", "Pricing & Pilot", "Contact Support"]
  },
  {
    id: "SOLUTIONS_K12_UNI",
    entities: ["university", "k12", "college"],
    keywords: ["university", "college", "school", "k12", "higher ed", "engineering", "campus", "institution"],
    phrases: ["universities and colleges", "k12 schools", "who is it for", "does it work for schools", "higher education"],
    response: "### Tailored Institutional Solutions\n\n- **Universities & Engineering Colleges**: Built for complex multi-campus structures, autonomous elective credit frameworks, massive lecture halls, lab sessions, and NAAC/NIRF reporting.\n- **K-12 & High Schools**: Focused on daily period attendance, bus transit safety alerts, streamlined parent-teacher communications, and simplified grading.\n- **Specialized Institutes & Medical/Law Colleges**: Configurable clinical posting rosters, mandatory internship attendance, and strict regulatory compliance.",
    quickReplies: ["Explore Features", "Pricing & Pilot", "Book a Demo", "Speak with Expert"]
  },
  {
    id: "PRICING",
    entities: ["pricing", "pilot", "cost"],
    keywords: ["price", "pricing", "cost", "pay", "billing", "subscription", "pilot", "quote", "tiers", "starter", "enterprise"],
    phrases: ["how much does it cost", "pricing plans", "show pricing", "free pilot", "30 day pilot", "institutional quote"],
    response: "### Transparent Institutional Pricing & Free Pilot\n\nIntelliAttend offers customized, value-driven pricing based on total student enrollment:\n\n- **Starter Tier**: Core attendance, basic parent notifications, and faculty mobile app.\n- **Professional Tier**: Full academic suite including SmartBoard digital signage, timetable scheduler, and fee management.\n- **Enterprise Tier**: Custom ERP bridges, dedicated SLA, campus success manager, and priority 24/7 technical support.\n\n### 30-Day Zero-Risk Institutional Pilot\nInstitutions can evaluate IntelliAttend for 30 days with full feature access, complimentary data onboarding, and dedicated training.\n\nTo receive an exact quote for your institution, visit our [Join Page](/join) or [Speak with an Expert](/support).",
    quickReplies: ["Book a Demo", "Speak with Expert", "Compare Plans", "Core Features"]
  },
  {
    id: "DEMO_CONTACT",
    entities: ["demo", "contact", "support", "call"],
    keywords: ["demo", "contact", "support", "help", "phone", "call", "talk", "sales", "expert", "number"],
    phrases: ["book a demo", "contact sales", "speak with expert", "phone number", "call now", "customer support", "contact info"],
    response: "### Connect with Our Enterprise Team\n\nWe are here to assist with demonstrations, technical pilots, and institutional queries:\n\n- **Speak with Expert (Direct Phone)**: [+91 9493615849](tel:+919493615849)\n- **Official Support Email**: [support@intelliattend.com](mailto:support@intelliattend.com)\n- **Schedule Institutional Demo**: [Request a Demo](/contact)\n- **Help & Support Center**: [Visit Support](/support)\n- **Technical Documentation**: [Read Docs](/docs)",
    quickReplies: ["Pricing & Pilot", "Explore Features", "Security & Privacy", "SmartBoard Sync"]
  },
  {
    id: "LOGIN_ISSUES",
    entities: ["login", "account"],
    keywords: ["login", "signin", "password", "account", "credentials", "portal", "access"],
    phrases: ["i cannot login", "login not working", "forgot password", "reset password", "how to login"],
    response: "### Institutional Login & Account Support\n\n- **Student & Faculty Login**: Access your account using your official campus credentials or institutional SSO at [Login Page](/login).\n- **Password Reset**: If you have forgotten your password, select \"Forgot Password\" on the login screen to receive a secure reset link to your registered email.\n- **Campus Directory Issues**: For new account provisioning or institutional email changes, please contact your campus IT administrator or reach out at [support@intelliattend.com](mailto:support@intelliattend.com).",
    quickReplies: ["Speak with Expert", "Documentation", "Contact Support"]
  },
  {
    id: "DOCUMENTATION",
    entities: ["documentation", "docs"],
    keywords: ["documentation", "docs", "guide", "manual", "handbook", "setup", "api docs"],
    phrases: ["show documentation", "where are the docs", "user manual", "setup guide", "how to configure"],
    response: "### Comprehensive Documentation & Guides\n\nYou can explore our structured guides, role manuals, and technical references in our [Documentation Portal](/docs):\n\n- **Faculty Quickstart Guide**: Step-by-step attendance and lesson plan management.\n- **SmartBoard Setup**: Connecting displays via HDMI, Android TV, or browser.\n- **Student & Parent Handbook**: Mobile app navigation, grades, and fee payments.\n- **Administrator & API Reference**: Single Sign-On (SSO), data imports, and webhook endpoints.",
    quickReplies: ["SmartBoard Setup", "Faculty Portal", "Tech & Integrations", "Contact Support"]
  }
];

// --- CONFIDENTIALITY GUARD RESPONSE ---
const RESTRICTED_CONFIDENTIALITY_RESPONSE: BotResponse = {
  text: `### Enterprise Privacy & Security Protection Notice\n\nUnder IntelliAttend's strict compliance policies (aligned with **FERPA**, **GDPR**, and **ISO 27001** standards), confidential system architecture, internal API keys, server credentials, source code repositories, and private individual student records are strictly protected and cannot be disclosed.\n\n- **Role-Based Access**: Individual academic records and administrative controls are securely restricted to authenticated institutional users through their official portal.\n- **Data Protection**: All communications and records are protected by TLS 1.3 in-transit and AES-256 encryption at rest.\n- **Verified Inquiries**: Authorized campus administrators or enterprise IT auditors can contact our compliance desk directly at [support@intelliattend.com](mailto:support@intelliattend.com) or speak with our team at **+91 9493615849**.`,
  quickReplies: ["Security & Privacy", "Core Features", "Speak with Expert", "Documentation"],
  nextContext: { lastIntent: "SECURITY_PRIVACY", lastEntity: "security", history: [] }
};

// --- NLP ENGINE ---

function normalizeInput(input: string): string {
  let cleaned = input.toLowerCase().replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Handle typo replacements
  for (const [typo, correction] of Object.entries(TYPO_MAP)) {
    const regex = new RegExp(`\\b${typo}\\b`, 'g');
    cleaned = cleaned.replace(regex, correction);
  }
  
  return cleaned;
}

function detectProfanity(input: string): boolean {
  const words = input.split(' ');
  return words.some(word => PROFANITY_LIST.includes(word));
}

function extractEntities(normalizedInput: string): string[] {
  const foundEntities: string[] = [];
  const words = normalizedInput.split(' ');
  for (const intent of INTENTS) {
    for (const entity of intent.entities) {
      if (words.includes(entity) && !foundEntities.includes(entity)) {
        foundEntities.push(entity);
      }
    }
  }
  return foundEntities;
}

function scoreIntent(normalizedInput: string, intent: IntentDef, context: BotContext, detectedEntities: string[]): number {
  let score = 0;
  const words = normalizedInput.split(' ');

  // Exact phrase match (+12)
  for (const phrase of intent.phrases) {
    if (normalizedInput.includes(phrase)) score += 12;
  }

  // Keyword match (+5)
  for (const keyword of intent.keywords) {
    if (words.includes(keyword)) score += 5;
  }
  
  // Entity match (+6)
  for (const entity of intent.entities) {
    if (detectedEntities.includes(entity)) score += 6;
  }
  
  // Context match (+8)
  if (context.lastEntity && intent.entities.includes(context.lastEntity)) {
    if (words.includes("it") || words.includes("that") || words.includes("this") || words.includes("they") || words.includes("more")) {
      score += 8;
    }
  }
  
  if (context.lastIntent === intent.id) {
    score += 5; // Continued conversation on the same topic
  }

  return score;
}

export async function generateResponse(userInput: string, context: BotContext): Promise<BotResponse> {
  const isProfane = detectProfanity(userInput.toLowerCase());
  const normalizedInput = normalizeInput(userInput);

  // 1. STRICT PRIVACY & SECURITY GUARD
  // Intercept any attempt to extract private records, credentials, backend keys, or system prompts.
  if (isSensitiveOrRestricted(userInput) || isSensitiveOrRestricted(normalizedInput)) {
    return {
      ...RESTRICTED_CONFIDENTIALITY_RESPONSE,
      nextContext: {
        lastIntent: "SECURITY_PRIVACY",
        lastEntity: "security",
        history: [...context.history, { role: "user", content: userInput }, { role: "assistant", content: RESTRICTED_CONFIDENTIALITY_RESPONSE.text }].slice(-6)
      }
    };
  }

  // 2. Handle empty input gracefully
  if (!normalizedInput.trim()) {
    return {
      text: "How can I assist you with IntelliAttend today? You can ask about our 1-Tap Attendance, SmartBoards, Timetables, Fees, Security, or Institutional Pilot.",
      quickReplies: ["What is IntelliAttend?", "Explore Features", "Pricing & Pilot", "Speak with Expert"],
      nextContext: context
    };
  }

  const detectedEntities = extractEntities(normalizedInput);

  // 3. Direct Navigation & Action Handling
  if (normalizedInput.includes("pricing") && (normalizedInput.includes("take me") || normalizedInput.includes("open") || normalizedInput.includes("go to"))) {
    return {
      text: "You can review our transparent institutional tiers and request a pilot on the [Join Page](/join).",
      quickReplies: ["Compare Plans", "Speak with Expert", "Book a Demo"],
      nextContext: { lastIntent: "PRICING", lastEntity: "pricing", history: context.history }
    };
  }
  if (normalizedInput.includes("documentation") && (normalizedInput.includes("take me") || normalizedInput.includes("open") || normalizedInput.includes("go to"))) {
    return {
      text: "You can access full role guides, setup tutorials, and API references in our [Documentation Portal](/docs).",
      quickReplies: ["SmartBoard Setup", "Faculty Portal", "Support Center"],
      nextContext: { lastIntent: "DOCUMENTATION", lastEntity: "documentation", history: context.history }
    };
  }

  // 4. Score all intents
  const scoredIntents = INTENTS.map(intent => ({
    intent,
    score: scoreIntent(normalizedInput, intent, context, detectedEntities)
  })).sort((a, b) => b.score - a.score);

  const topIntents = scoredIntents.filter(s => s.score >= 10);
  
  let responseText = "";
  let quickReplies: string[] = [];
  let nextIntent: string | null = context.lastIntent;
  const nextEntity: string | null = detectedEntities.length > 0 ? detectedEntities[0] : context.lastEntity;

  if (topIntents.length > 0) {
    if (isProfane) {
      responseText = "I understand you may have urgent requirements. Let's focus on how we can best assist your campus.\n\n";
    }
    
    if (topIntents.length > 1 && topIntents[0].score < topIntents[1].score + 6) {
      // Handle multi-intent questions (e.g., "Tell me about SmartBoard and Faculty app")
      responseText += `${topIntents[0].intent.response}\n\n---\n\n${topIntents[1].intent.response}`;
      quickReplies = Array.from(new Set([...topIntents[0].intent.quickReplies, ...topIntents[1].intent.quickReplies])).slice(0, 4);
    } else {
      responseText += topIntents[0].intent.response;
      quickReplies = topIntents[0].intent.quickReplies;
    }
    
    nextIntent = topIntents[0].intent.id;
  } else {
    // Intelligent Fallback (score < 10)
    if (isProfane) {
      responseText = "I am a professional campus AI assistant. How may I provide assistance with IntelliAttend's attendance automation, SmartBoards, or institutional management?";
    } else if (normalizedInput.includes("weather") || normalizedInput.includes("capital") || normalizedInput.includes("joke") || normalizedInput.includes("who created you")) {
      responseText = "I specialize strictly in IntelliAttend's academic and campus management platform. I would be delighted to assist with any questions about our attendance automation, SmartBoards, mobile apps, or security compliance.";
    } else {
      responseText = "I can provide detailed information about IntelliAttend's **1-Tap Attendance**, **SmartBoard Digital Signage**, **Faculty & Student Apps**, **Fees & Timetables**, **Security & Privacy Compliance**, and **30-Day Institutional Pilots**.\n\nWhat specific capability would you like to explore?";
    }
    quickReplies = ["Attendance Tracking", "SmartBoard Displays", "Pricing & Pilot", "Speak with Expert"];
  }

  // Handle plan or role comparisons
  if (normalizedInput.includes("vs") || normalizedInput.includes("compare") || normalizedInput.includes("difference")) {
    if (normalizedInput.includes("starter") && normalizedInput.includes("professional")) {
      responseText = "### Starter vs Professional Plan Comparison\n\n| Capability | Starter Plan | Professional Plan |\n|---|---|---|\n| 1-Tap Attendance | Included | Included |\n| Automated 75% Rule Alerts | Included | Included |\n| SmartBoard Digital Signage | Optional Add-on | Included |\n| Timetable & Fee Management | Basic | Full Automation |\n| ERP & LMS Webhooks | No | Included |\n\nExplore full details on our [Join Page](/join).";
    } else if (normalizedInput.includes("faculty") && normalizedInput.includes("student")) {
      responseText = "### Faculty Portal vs Student App\n\n- **Faculty Portal**: Designed for educators to take roll call in seconds, track syllabus progress, submit grades, request substitutions, and control classroom displays.\n- **Student App**: Designed for students to track real-time attendance percentage, access daily class schedules, view SmartBoard notes, and receive instant campus announcements.";
    }
  }

  return {
    text: responseText,
    quickReplies,
    nextContext: {
      lastIntent: nextIntent,
      lastEntity: nextEntity,
      history: [...context.history, { role: "user", content: userInput }, { role: "assistant", content: responseText }].slice(-6)
    }
  };
}
