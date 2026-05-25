export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (data?.details?.length) {
    return data.details.map((detail) => `${detail.path || 'field'}: ${detail.message}`).join(' ');
  }

  return data?.error || error?.message || 'Something went wrong. Please try again.';
}
