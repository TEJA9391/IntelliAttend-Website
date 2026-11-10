export interface FeedbackItem {
  id: string;
  name: string;
  initial?: string;
  role: string;
  institution: string;
  text: string;
  rating: number;
  color?: string;
  email?: string;
  createdAt?: string;
}

export const INITIAL_TESTIMONIALS: FeedbackItem[] = [
  {
    id: "seed-1",
    name: "Dr. Uma Maheshwar Rao",
    initial: "U",
    role: "Professor & HOD, Dept. of CSE-AIML",
    institution: "Malla Reddy Colleges",
    text: "Eliminated manual paper registers and saved 15 minutes in every lab and lecture session.",
    rating: 5,
    color: "bg-teal-100 text-teal-800",
  },
  {
    id: "seed-2",
    name: "Krishna Murthy",
    initial: "K",
    role: "Associate Professor, Dept. of CSE-AIML",
    institution: "Malla Reddy Colleges",
    text: "Automated 75% attendance threshold reports made mid-term exam eligibility hassle-free.",
    rating: 4,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "seed-3",
    name: "K. Anusha",
    initial: "A",
    role: "Assistant Professor, Dept. of CSE-AIML",
    institution: "Malla Reddy Colleges",
    text: "Pushing presentations and timetables directly to classroom screens removed the need for USB pen drives.",
    rating: 4.5,
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "seed-4",
    name: "T. Usharani",
    initial: "U",
    role: "Assistant Professor, Dept. of CSE-AIML",
    institution: "Malla Reddy Colleges",
    text: "Real-time attendance tracking and automated student records reduced my administrative workload and helped me focus more on teaching and student engagement.",
    rating: 5,
    color: "bg-purple-100 text-purple-800",
  },
];

const COLOR_PALETTES = [
  "bg-teal-100 text-teal-800",
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
  "bg-purple-100 text-purple-800",
  "bg-indigo-100 text-indigo-800",
  "bg-amber-100 text-amber-800",
  "bg-cyan-100 text-cyan-800",
  "bg-rose-100 text-rose-800",
];

const STORAGE_KEY = "intelliattend_community_feedbacks";
export const FEEDBACK_RECIPIENT_EMAIL = "tejrtej9347@gmail.com";
export const MAX_DISPLAY_FEEDBACKS = 50;
export const MIN_RATING_FOR_DISPLAY = 3.5;

/**
 * Retrieves the official verified faculty testimonials.
 * User-submitted feedbacks remain private and are sent directly to email.
 */
export function getDisplayedTestimonials(): FeedbackItem[] {
  if (typeof window !== "undefined") {
    try {
      // Clear any previously persisted user feedbacks so they don't display in the public carousel
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return INITIAL_TESTIMONIALS;
}

/**
 * Submits feedback:
 * 1. Delivers private feedback to tejrtej9347@gmail.com via FormSubmit.
 * 2. Does NOT display submitted feedback in public testimonials carousel.
 */
export async function submitUserFeedback(data: {
  name: string;
  role: string;
  institution: string;
  text: string;
  rating: number;
  email?: string;
}): Promise<{ success: boolean; displayed: boolean; error?: string }> {
  // 1. Deliver to email: tejrtej9347@gmail.com
  let emailDispatched = false;
  try {
    const emailPayload = {
      _subject: `New IntelliAttend Feedback (${data.rating}★) from ${data.name}`,
      name: data.name,
      role: data.role || "Feedback Submitter",
      institution: data.institution || "Malla Reddy Colleges",
      rating: `${data.rating} / 5 Stars`,
      status: "Private Direct Feedback",
      feedback_message: data.text,
      user_email: data.email || "Not provided",
      submission_date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      _captcha: "false",
      _template: "table"
    };

    const response = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_RECIPIENT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (response.ok) {
      emailDispatched = true;
    }
  } catch (err) {
    console.warn("Could not send through FormSubmit:", err);
  }

  return {
    success: true,
    displayed: false,
  };
}

