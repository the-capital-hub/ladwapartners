import Swal from "sweetalert2";

/**
 * Wrapper around fetch that shows SweetAlert messages on success or failure.
 * @param {string} url - API endpoint to call.
 * @param {RequestInit} [options] - fetch options.
 * @param {Object} [messages] - Optional success or error messages.
 * @param {string|null} [messages.successMessage] - Message for successful requests. Pass null to suppress.
 * @param {string} [messages.errorMessage] - Message when the request fails.
 */
export async function apiRequest(
  url,
  options = {},
  { successMessage, errorMessage } = {}
) {
  const successText =
    successMessage === undefined
      ? "Request completed successfully."
      : successMessage;
  const errorText =
    errorMessage ?? "Something went wrong. Please try again.";

  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.success === false) {
      const message = data?.message || errorText;
      Swal.fire({ icon: "error", title: "Error", text: message });
      throw new Error(message);
    }

    if (successText) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message || successText,
      });
    }

    return data;
  } catch (err) {
    const message = err.message || errorText;
    Swal.fire({ icon: "error", title: "Error", text: message });
    throw err;
  }
}
