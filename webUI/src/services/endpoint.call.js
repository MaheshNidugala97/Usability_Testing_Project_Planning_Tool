export const getTickets = async () => {
  try {
    const response = await fetch("http://localhost:3009/api/issues");
    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};
