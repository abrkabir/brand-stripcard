import showcaseImage from "../../public/images/assets/features/feature-security-wide.webp";

/**
 * Copy for the auth pages.
 *
 * One entry per screen, and every screen renders from the same shell, so a
 * new one (verify email, two-step code) is an entry here plus a short page,
 * with no new layout.
 *
 *   social    whether to offer Google and Apple sign-in above the form
 */
export const authCopy = {
  login: {
    title: "Log in to your account",
    subtitle: "Enter your details to manage your cards and payments.",
    social: true,
    submit: "Log in",
    altText: "New to StripCard?",
    altLabel: "Create account",
    altHref: "/register",
  },
  register: {
    title: "Sign up account",
    subtitle: "Enter your personal data to create your account.",
    social: true,
    submit: "Sign up",
    altText: "Already have an account?",
    altLabel: "Log in",
    altHref: "/login",
  },
  forgotPassword: {
    title: "Reset your password",
    subtitle: "Enter the email on your account and we will send you a link to set a new password.",
    social: false,
    submit: "Send reset link",
    altText: "Remembered it?",
    altLabel: "Log in",
    altHref: "/login",
  },
  resetPassword: {
    title: "Choose a new password",
    subtitle: "Pick something you have not used here before.",
    social: false,
    submit: "Save new password",
    altText: "Changed your mind?",
    altLabel: "Back to log in",
    altHref: "/login",
  },
};

/**
 * The image shell beside the form (see AuthShowcase): one photo split across
 * a grid of rounded tiles, with a few tiles given over to content.
 *
 * `steps` are the chips on the dark tile, read top to bottom as the steps of
 * issuing a card; the last one shows as in progress. `guards` are the
 * safeguards along the foot of the orange tile, as icon names (see icons).
 */
export const authShowcase = {
  image: showcaseImage,
  status: {
    steps: ["verify_identity", "set_spend_limit", "issue_virtual_card"],
    title: "Cards in seconds",
    text: "Create a virtual card and pay right away.",
  },
  control: {
    title: "Full control",
    text: "Set limits, freeze or delete any card in a tap.",
    guards: ["shield", "lock", "fingerprint"],
  },
};
