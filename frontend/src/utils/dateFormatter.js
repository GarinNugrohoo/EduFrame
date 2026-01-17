export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Format default: "17 Jan 2024"
    const defaultOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    const formatOptions = { ...defaultOptions, ...options };

    return date.toLocaleDateString("id-ID", formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return as is if error
  }
};

// Format dengan waktu: "17 Jan 2024, 10:06"
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Format: "17 Jan 2024, 10:06"
    const datePart = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateString;
  }
};

// Format relatif: "2 jam yang lalu", "3 hari yang lalu"
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Baru saja";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return formatDate(dateString);
  }
};

// Format untuk display di profile: "Bergabung 17 Januari 2024"
export const formatProfileDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting profile date:", error);
    return "";
  }
};
