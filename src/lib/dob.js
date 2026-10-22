/**
 * A date of birth typed as "MM / DD / YYYY": laid out as it is typed, checked,
 * and put in words. Shared by the forms that ask for one.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** The digits of a date of birth, shown as "MM / DD / YYYY" as they come. */
export const dobText = (digits) =>
  [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(" / ");

/**
 * What the field should show after a keystroke: `typed` is its new value,
 * `before` what it showed. Deleting a separator deletes the digit before it,
 * so backspace never sticks.
 */
export function nextDob(typed, before) {
  let digits = typed.replace(/\D/g, "").slice(0, 8);
  if (typed.length < before.length && digits === before.replace(/\D/g, ""))
    digits = digits.slice(0, -1);
  return dobText(digits);
}

/** A date of birth as its parts, from what was typed. */
function dobParts(text) {
  const digits = text.replace(/\D/g, "");
  return {
    digits,
    month: Number(digits.slice(0, 2)),
    day: Number(digits.slice(2, 4)),
    year: Number(digits.slice(4, 8)),
  };
}

/** What is wrong with a date of birth, on `today`; nothing when it will do. */
export function dobProblem(text, today) {
  const { digits, month, day, year } = dobParts(text);
  if (!digits) return "Enter your date of birth";
  if (digits.length < 8) return "Enter the full date, as MM / DD / YYYY";
  const date = new Date(year, month - 1, day);
  if (
    year < 1900 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return "That date does not exist";
  if (date > today) return "That date is still to come";
  if (new Date(year + 18, month - 1, day) > today)
    return "You need to be 18 or older";
  return null;
}

/** A date of birth in words, "April 12, 1991". */
export function dobLong(text) {
  const { month, day, year } = dobParts(text);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
