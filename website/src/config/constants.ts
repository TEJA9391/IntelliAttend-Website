export const SITE_CONFIG = {
  name: "IntelliAttend",
  title: "IntelliAttend | Intelligent Attendance. Smart Campus.",
  description:
    "From 1-tap attendance and timetable scheduling to fee payments and SmartBoard displays—run your entire campus from one unified platform at your fingertips.",
  url: "https://intelliattend.app",
  ogImage: "/images/og.png",
  links: {
    twitter: "https://x.com/intelliattend",
    github: "https://github.com/intelliattend",
    linkedin: "https://www.linkedin.com/company/intelliattend/",
    instagram: "https://www.instagram.com/intelliattend?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==",
    youtube: "https://www.youtube.com/@intelliattend-45",
    discord: "https://discord.com/users/1563078786646540319",
  },
} as const;

export const NAV_LINKS = [
  {
    name: "Products",
    href: "/products",
    children: [
      {
        name: "SmartBoard",
        href: "/products/smartboard",
        description: "Interactive classroom displays",
      },
      {
        name: "Faculty",
        href: "/products/faculty",
        description: "Manage classes and attendance",
      },
      {
        name: "Student",
        href: "/products/student",
        description: "Track progress and schedules",
      },
    ],
  },
  {
    name: "Solutions",
    href: "/solutions",
    children: [
      {
        name: "Universities",
        href: "/solutions/universities",
        description: "Scale campus management",
      },
      {
        name: "K-12 Schools",
        href: "/solutions/k12",
        description: "Streamline daily operations",
      },
    ],
  },
  { name: "Join", href: "/join" },
  { name: "Blog", href: "/blog" },
  {
    name: "Resources",
    href: "/docs",
    children: [
      {
        name: "Documentation",
        href: "/docs",
        description: "Platform guides and API",
      },
      {
        name: "Help Center",
        href: "/support",
        description: "24/7 customer support",
      },
    ],
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { name: "SmartBoard", href: "/products/smartboard" },
    { name: "Faculty Portal", href: "/products/faculty" },
    { name: "Student App", href: "/products/student" },
    { name: "Join", href: "/join" },
  ],
  solutions: [
    { name: "Universities", href: "/solutions/universities" },
    { name: "K-12 Schools", href: "/solutions/k12" },
  ],
  resources: [
    { name: "Help Center", href: "/support" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
} as const;

export const CONTACT_INFO = {
  email: "contact@intelliattend.app",
  phone: "+91 9493615849",
  phoneHref: "tel:+919493615849",
  whatsapp: "+91 9493615849",
  whatsappUrl: "https://wa.me/919493615849?text=Hi%20IntelliAttend%2C%20I%20have%20a%20question.",
  address: "Maisammaguda, Dhulapally (Post via Kompally), Gundlapochampally Village, Medchal-Malkajgiri District, Hyderabad, Telangana 500100, India",
} as const;

export const SOCIAL_LINKS = [
  { name: "X (Twitter)", href: "https://x.com/intelliattend" },
  { name: "GitHub", href: "https://github.com/intelliattend" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/intelliattend/" },
  { name: "Instagram", href: "https://www.instagram.com/intelliattend?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" },
  { name: "YouTube", href: "https://www.youtube.com/@intelliattend-45" },
  { name: "Discord", href: "https://discord.com/users/1563078786646540319" },
] as const;

export const PORTAL_ROLES = [
  {
    id: "faculty",
    title: "Faculty Portal",
    description: "Manage classes, attendance, and SmartBoard.",
    href: "/login/faculty",
    color: "teal",
  },
  {
    id: "student",
    title: "Student Portal",
    description: "View schedules, attendance, and resources.",
    href: "/login/student",
    color: "emerald",
  },
  {
    id: "admin",
    title: "Administrator Portal",
    description: "Manage campus operations and analytics.",
    href: "/login/admin",
    color: "violet",
  },
] as const;
