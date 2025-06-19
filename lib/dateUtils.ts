export function formatDateRange(
  startDateStr: string,
  endDateStr: string,
): string {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Nếu cùng ngày, tháng, năm => chỉ hiển thị 1 ngày
  if (
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return startDate.toLocaleDateString("vi-VN");
  }

  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const dayStart = startDate.getDate().toString().padStart(2, "0");
  const dayEnd = endDate.getDate().toString().padStart(2, "0");
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0"); // tháng +1 vì getMonth() trả về 0-11
  const year = startDate.getFullYear();

  if (sameMonth && sameYear) {
    // Định dạng: "04 - 05/07/2025"
    return `${dayStart} - ${dayEnd}/${month}/${year}`;
  } else if (sameYear) {
    // Định dạng: "04/07 - 05/08/2025"
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
    // Định dạng khác năm: "04/07/2024 - 05/01/2025"
    const start = startDate.toLocaleDateString("vi-VN");
    const end = endDate.toLocaleDateString("vi-VN");
    return `${start} - ${end}`;
  }
}
