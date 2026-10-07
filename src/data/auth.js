/**
 * Copy for the auth pages.
 *
 * One entry per screen, and both screens render from the same shell — so a new
 * one (reset password, verify email) is an entry here plus a two-line page,
 * with no new layout.
 *
 * `aside` is the line on the shader panel. Keep it short: it is set at display
 * size against a moving background, and a third line starts fighting the bloom.
 */
export const authCopy = {
  login: {
    title: "Welcome back",
    subtitle: "Pick up where you left off — saved listings, alerts and enquiries.",
    aside: "Every listing here, someone from our team has stood inside.",
    submit: "Log in",
    altText: "New to Adestate?",
    altLabel: "Create an account",
    altHref: "/register",
  },
  forgotPassword: {
    title: "Reset your password",
    subtitle:
      "Give us the email on your account and we will send a link to set a new password.",
    aside: "Locked out? One email and you are back in.",
    submit: "Send reset link",
    altText: "Remembered it?",
    altLabel: "Log in",
    altHref: "/login",
  },
  resetPassword: {
    title: "Choose a new password",
    subtitle: "Pick something you have not used here before.",
    aside: "One new password and you are back where you left off.",
    submit: "Save new password",
    altText: "Changed your mind?",
    altLabel: "Back to log in",
    altHref: "/login",
  },
  register: {
    title: "Get started",
    subtitle: "Save what you like, get told when something matches, and talk to a named agent.",
    aside: "Every listing here, someone from our team has stood inside.",
    submit: "Create account",
    altText: "Already have an account?",
    altLabel: "Log in",
    altHref: "/login",
  },
};
