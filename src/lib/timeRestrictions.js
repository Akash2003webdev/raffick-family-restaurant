// Business rule: "Tiffin & Dosai" items (idli, dosai, etc.) are only
// available for ordering before 11 AM (kitchen switches over after that).
// Every other category is only orderable from 11 AM onwards, until the
// restaurant closes at midnight.

const TIFFIN_CATEGORY_NAME = "Tiffin & Dosai";
const TIFFIN_CUTOFF_HOUR = 11; // 11:00 AM

export function isBeforeTiffinCutoff(date = new Date()) {
  return date.getHours() < TIFFIN_CUTOFF_HOUR;
}

export function isTiffinCategory(categoryName) {
  return categoryName === TIFFIN_CATEGORY_NAME;
}

/**
 * Whether an item can be ordered right now, based on its category.
 * Tiffin items: orderable only before 11 AM.
 * Everything else: orderable only from 11 AM onwards.
 */
export function isItemOrderableNow(categoryName, date = new Date()) {
  const morningNow = isBeforeTiffinCutoff(date);
  return isTiffinCategory(categoryName) ? morningNow : !morningNow;
}

/**
 * Short label to show on a disabled item explaining when it'll be orderable.
 */
export function getUnavailableReason(categoryName) {
  return isTiffinCategory(categoryName)
    ? "Tiffin available only before 11 AM"
    : "Available from 11 AM";
}
