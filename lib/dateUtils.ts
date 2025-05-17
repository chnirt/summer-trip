export function formatDateRange(
  startDateStr: string,
  endDateStr: string,
): string {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return startDate.toLocaleDateString("vi-VN");
  }

  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const dayStart = startDate.getDate();
  const dayEnd = endDate.getDate();

  const month = startDate.toLocaleDateString("vi-VN", { month: "2-digit" });
  const year = startDate.getFullYear();

  if (sameMonth && sameYear) {
    return `${dayStart} - ${dayEnd}/${month}/${year}`;
  } else if (sameYear) {
    const start = startDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    const end = endDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${start} - ${end}/${year}`;
  } else {
    const start = startDate.toLocaleDateString("vi-VN");
    const end = endDate.toLocaleDateString("vi-VN");
    return `${start} - ${end}`;
  }
}
