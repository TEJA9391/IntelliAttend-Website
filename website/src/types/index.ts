export interface NavItem {
  name: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: TeamMember;
  company: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: TeamMember;
  publishedAt: string;
  readingTime: number;
  category: string;
  coverImage?: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

export interface Solution {
  id: string;
  name: string;
  description: string;
  href: string;
  targetAudience: string;
  features: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  message: string;
}

export interface OnboardingFormData {
  institutionType: string;
  institutionName: string;
  contactPerson: string;
  workEmail: string;
  phoneNumber: string;
  studentCount: string;
  facultyCount: string;
  platformNeeds: string[];
  demoDate: string;
  demoTime: string;
  additionalRequirements: string;
}
