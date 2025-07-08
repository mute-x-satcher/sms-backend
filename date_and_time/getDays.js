function getDaysInMonth(monthShort) {
  const months = {
    Jan: 31,
    Feb: 28, // 29 if leap year
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31
  };

  return months[monthShort] || "Invalid month";
}

module.exports = getDaysInMonth