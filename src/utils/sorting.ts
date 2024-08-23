const sortItems = (items: any[], propRef: string, sortType: "asc" | "desc") => {
  // Create a copy of the array to maintain immutability
  const sortedData = [...items].sort((a, b) => {
    const aValue = a[propRef];
    const bValue = b[propRef];

    // Function to extract numeric part from a string
    const extractNumber = (value: string) => {
      const match = value.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    // Check if both values are strings and contain numbers
    const aIsStringWithNumber = typeof aValue === "string" && /\d/.test(aValue);
    const bIsStringWithNumber = typeof bValue === "string" && /\d/.test(bValue);

    if (aIsStringWithNumber && bIsStringWithNumber) {
      const aNumber = extractNumber(aValue);
      const bNumber = extractNumber(bValue);
      return sortType === "asc" ? aNumber - bNumber : bNumber - aNumber;
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      // General string comparison
      return sortType === "asc" 
        ? aValue.toLowerCase().localeCompare(bValue.toLowerCase()) 
        : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      // Numeric comparison
      return sortType === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  return sortedData;
};

const sortCertificates = (items: any[], propRef: string, sortType: "asc" | "desc") => {
  // Create a copy of the array to maintain immutability
  const sortedData = [...items].sort((a, b) => {
    const aValue = propRef in a.course ? a.course[propRef] : a[propRef];
    const bValue = propRef in b.course ? b.course[propRef] : b[propRef];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortType === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortType === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  return sortedData;
};

export { sortCertificates, sortItems };
