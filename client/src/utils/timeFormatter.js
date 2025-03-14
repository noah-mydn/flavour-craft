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
