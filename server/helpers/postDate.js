const INITIAL_TIMESTAMP_TOLERANCE_MS = 1000;

const frenchDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Paris"
});

function toValidDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getPostDateDisplay(post) {
  const createdAt = toValidDate(post?.createdAt);
  const publishedAt = toValidDate(post?.publishedAt);
  const updatedAt = toValidDate(post?.updatedAt);
  const publicationDate = publishedAt || createdAt;
  const initialDates = [createdAt, publishedAt].filter(Boolean);
  const initialTimestamp = initialDates.length
    ? Math.max(...initialDates.map((date) => date.getTime()))
    : null;
  const isUpdated =
    updatedAt !== null &&
    initialTimestamp !== null &&
    updatedAt.getTime() > initialTimestamp + INITIAL_TIMESTAMP_TOLERANCE_MS;
  const relevantDate = isUpdated ? updatedAt : publicationDate;

  return {
    label: isUpdated ? "Mise à jour le:" : "Publié le:",
    formattedDate: relevantDate
      ? frenchDateFormatter.format(relevantDate)
      : "",
    isUpdated
  };
}
