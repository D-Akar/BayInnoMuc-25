// FAQ Service - Static FAQ data and search functionality
// TODO: Integrate with vector database for semantic similarity search

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export const faqCategories = [
  "Testing & Diagnosis",
  "Treatment & Medication",
  "Living with HIV",
  "Prevention & PrEP",
  "Support Resources",
] as const;

export const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Testing & Diagnosis",
    question: "What should I do if I think I've been exposed to HIV?",
    answer:
      "If you believe you may have been exposed to HIV, it's important to act quickly. Post-exposure prophylaxis (PEP) is a medication that can prevent HIV infection if started within 72 hours of exposure. Contact a healthcare provider, local clinic, or emergency room immediately. We understand this can be frightening, and you're not alone. Many people have navigated this situation, and there are resources available to help you.",
    tags: ["exposure", "PEP", "emergency", "testing"],
  },
  {
    id: "2",
    category: "Testing & Diagnosis",
    question: "How accurate are HIV tests?",
    answer:
      "Modern HIV tests are highly accurate. Fourth-generation tests can detect HIV as early as 2-4 weeks after exposure with over 99% accuracy. If you test negative after the window period (typically 3 months), the result is considered conclusive. However, if you've had recent exposure, it's important to test again after the window period. We're here to help you understand your results and next steps.",
    tags: ["testing", "accuracy", "window period", "diagnosis"],
  },
  {
    id: "3",
    category: "Testing & Diagnosis",
    question: "Where can I get tested confidentially?",
    answer:
      "You can get tested at many locations, including local health departments, community health centers, private doctors' offices, and some pharmacies. Many locations offer free or low-cost testing, and your results are confidential. Some places offer rapid testing with results in 20 minutes. We can help you find testing locations in your area that respect your privacy and provide supportive care.",
    tags: ["testing", "confidential", "locations", "privacy"],
  },
  {
    id: "4",
    category: "Prevention & PrEP",
    question: "What is PrEP and should I consider it?",
    answer:
      "PrEP (Pre-Exposure Prophylaxis) is a daily medication that can significantly reduce your risk of getting HIV through sex or injection drug use. When taken consistently, PrEP is up to 99% effective at preventing HIV. It's recommended for people who are at higher risk of HIV exposure. Talking with a healthcare provider can help you determine if PrEP is right for you. There's no judgment here—taking care of your health is important, and PrEP is a valid prevention option.",
    tags: ["PrEP", "prevention", "medication", "protection"],
  },
  {
    id: "5",
    category: "Treatment & Medication",
    question: "What are the side effects of HIV medication?",
    answer:
      "Modern HIV medications are generally well-tolerated, and many people experience few or no side effects. When side effects do occur, they're often mild and temporary, such as nausea, fatigue, or headaches during the first few weeks. Serious side effects are rare. Your healthcare provider will work with you to find a medication regimen that works for your body. If you're experiencing side effects, it's important to communicate with your care team—they can help adjust your treatment.",
    tags: ["medication", "side effects", "treatment", "health"],
  },
  {
    id: "6",
    category: "Treatment & Medication",
    question: "Is HIV treatment free or covered by insurance?",
    answer:
      "HIV treatment is often covered by insurance, including Medicaid and Medicare. There are also assistance programs available for those who are uninsured or underinsured, such as the Ryan White HIV/AIDS Program, pharmaceutical patient assistance programs, and state AIDS Drug Assistance Programs (ADAP). Many clinics offer sliding scale fees based on income. You don't have to navigate this alone—we can help connect you with resources to access the care you need.",
    tags: ["insurance", "cost", "financial assistance", "treatment"],
  },
  {
    id: "7",
    category: "Living with HIV",
    question: "Can I live a normal life with HIV?",
    answer:
      "Yes, absolutely. With modern treatment, people living with HIV can live long, healthy, and fulfilling lives. Effective HIV medication (antiretroviral therapy) can reduce the amount of virus in your body to undetectable levels, which means you can't transmit HIV to others and can maintain good health. Many people with HIV work, have relationships, start families, and pursue their dreams. Your diagnosis doesn't define you, and there's a whole community of people living full, vibrant lives with HIV.",
    tags: ["living with HIV", "normal life", "health", "hope"],
  },
  {
    id: "8",
    category: "Living with HIV",
    question: "How do I tell my partner about my status?",
    answer:
      "Disclosing your HIV status to a partner can feel overwhelming, and there's no one 'right' way to do it. Choose a private, comfortable setting when you both have time to talk. You might want to prepare what you'll say, and remember that you're sharing important health information—you're not asking for forgiveness. If you're on effective treatment and undetectable, you can share that you can't transmit HIV. Some people find it helpful to bring educational materials. Remember, you deserve respect and support. If you need help preparing for this conversation, we're here to support you.",
    tags: ["disclosure", "partner", "relationships", "communication"],
  },
  {
    id: "9",
    category: "Support Resources",
    question: "Where can I find emotional support?",
    answer:
      "You don't have to navigate this alone. There are many sources of support available, including support groups (both in-person and online), mental health counselors who specialize in HIV care, peer navigators, and crisis hotlines. Many organizations offer free or low-cost counseling services. Connecting with others who understand your experience can be incredibly valuable. We're here to help you find the support that feels right for you.",
    tags: ["support", "emotional", "counseling", "community"],
  },
  {
    id: "10",
    category: "Support Resources",
    question: "What legal protections exist for people living with HIV?",
    answer:
      "People living with HIV are protected by the Americans with Disabilities Act (ADA), which prohibits discrimination in employment, housing, and public accommodations. Your HIV status is confidential medical information, and healthcare providers are required to protect your privacy under HIPAA. Laws vary by state regarding disclosure requirements to sexual partners. If you're facing discrimination or have questions about your rights, legal aid organizations can provide guidance and support.",
    tags: ["legal", "rights", "discrimination", "privacy"],
  },
  {
    id: "11",
    category: "Prevention & PrEP",
    question: "How do I start PrEP?",
    answer:
      "Starting PrEP involves a few steps: first, you'll need to see a healthcare provider who can prescribe it. They'll test you for HIV (to confirm you're negative) and check your kidney function. If PrEP is right for you, they'll write a prescription. Many insurance plans cover PrEP, and there are assistance programs if cost is a concern. Once you start, you'll take one pill daily. Your provider will want to see you every few months for follow-up testing and to ensure everything is going well. Taking this step to protect your health is something to be proud of.",
    tags: ["PrEP", "starting", "prescription", "healthcare"],
  },
  {
    id: "12",
    category: "Living with HIV",
    question: "Can I have children if I'm living with HIV?",
    answer:
      "Yes, people living with HIV can have healthy children. With proper medical care and treatment, the risk of transmitting HIV to your baby during pregnancy or childbirth is less than 1%. This involves taking HIV medication during pregnancy, potentially adjusting your treatment plan, and sometimes using formula instead of breastfeeding (depending on your situation and location). Many people living with HIV have become parents and have healthy, HIV-negative children. If you're considering starting a family, talking with an HIV specialist who has experience with pregnancy care is important.",
    tags: ["pregnancy", "children", "family", "transmission"],
  },
];

/**
 * Search FAQs by query string
 * TODO: Replace with vector database similarity search for better results
 */
export function searchFAQs(query: string): FAQItem[] {
  if (!query.trim()) {
    return faqData;
  }

  const lowerQuery = query.toLowerCase();
  return faqData.filter((faq) => {
    const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
    const answerMatch = faq.answer.toLowerCase().includes(lowerQuery);
    const tagMatch = faq.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return questionMatch || answerMatch || tagMatch;
  });
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string): FAQItem[] {
  return faqData.filter((faq) => faq.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(faqData.map((faq) => faq.category)));
}

