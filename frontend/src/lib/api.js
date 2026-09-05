const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.errors = errors;
  }
}

export async function submitOrder(payload) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.message || 'Something went wrong. Please try again.', body.errors || {});
  }

  return body; // { order_number, status }
}
