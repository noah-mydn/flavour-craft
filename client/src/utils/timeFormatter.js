export const normalizeTime = (input) => {
  if (!input || typeof input !== "string") return "N/A";

  let part = input.split("+")[0].trim();

  let hours = 0,
    minutes = 0;

  let hourMatch = part.match(/(\d+)\s*hour/);
  let minuteMatch = part.match(/(\d+)\s*minute/);

  if (hourMatch) hours = parseInt(hourMatch[1]);
  if (minuteMatch) minutes = parseInt(minuteMatch[1]);

  if (hours > 0 && minutes > 0) {
    return minutes === 30 ? `${hours}.5 hrs` : `${hours} hrs ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} hrs`;
  } else {
    return `${minutes} min`;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;

  // For posts older than a week, show the date
  const options = { month: "short", day: "numeric" };
  return postDate.toLocaleDateString(undefined, options);
};
