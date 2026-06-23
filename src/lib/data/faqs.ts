export interface Faq {
  question: string;
  answer: string;
}

/** Homepage FAQ content. Powers both the UI and FAQ JSON-LD. */
export const homeFaqs: Faq[] = [
  {
    question: "Are all the tools really free?",
    answer:
      "Yes. Every tool on OnlineUtilities is completely free to use with no sign-up, no limits and no hidden costs.",
  },
  {
    question: "Do you store the data I enter?",
    answer:
      "No. Our tools are designed to run entirely in your browser wherever possible, so your data never leaves your device.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Never. All tools work instantly without registration so you can get things done right away.",
  },
  {
    question: "Will the tools work on mobile?",
    answer:
      "Absolutely. OnlineUtilities is mobile-first and fully responsive, so every tool works great on phones, tablets and desktops.",
  },
  {
    question: "How often are new tools added?",
    answer:
      "We add new utilities regularly. The platform is built to scale to hundreds of tools, so the collection keeps growing.",
  },
];
