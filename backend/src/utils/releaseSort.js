export const sortReleases = (releases, sortBy, order) => {
  const compare = (a, b) => {
    let left = a[sortBy];
    let right = b[sortBy];

    if (sortBy === "release_date") {
      // Expecting YYYY-MM-DD; fallback to string compare if invalid date
      const leftTime = Date.parse(left) || 0;
      const rightTime = Date.parse(right) || 0;
      return leftTime - rightTime;
    }

    // Case-insensitive string compare for other fields
    left = typeof left === "string" ? left.toLowerCase() : String(left);
    right = typeof right === "string" ? right.toLowerCase() : String(right);
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  };

  const sorted = [...releases].sort(compare);
  return order === "desc" ? sorted.reverse() : sorted;
};

