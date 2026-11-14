export interface Testimonial {
  name: string
  role: string
  quote: string
}

/**
 * Placeholder copy for the landing page's testimonials section — this platform hasn't launched
 * yet, so there are no real quotes to show. Generic first-name personas only; replace every
 * entry with real, attributed feedback before this ever goes in front of real visitors.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sample teacher",
    role: "Primary school, Phnom Penh",
    quote: "Placeholder quote — swap in real feedback from a pilot classroom once you have it.",
  },
  {
    name: "Sample student",
    role: "Grade 6",
    quote: "Placeholder quote — swap in a real student's reaction to the games once you have it.",
  },
  {
    name: "Sample parent",
    role: "Parent of a Grade 4 student",
    quote: "Placeholder quote — swap in real feedback about learning outcomes once you have it.",
  },
]
