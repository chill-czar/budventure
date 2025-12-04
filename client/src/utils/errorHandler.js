export const handleApiError = (error, context) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  console.error(`${context}:`, error);

  if (typeof window !== 'undefined') {
    // For now using alert, could be replaced with toast notifications
    alert(message);
  }

  return message;
};

export const createErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An error occurred';
};
