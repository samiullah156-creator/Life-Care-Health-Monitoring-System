/**
 * Map Firebase Auth error codes to user-friendly messages.
 * Firebase uses auth/invalid-credential for wrong email, wrong password, or user not found.
 */
const AUTH_MESSAGES = {
  'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
  'auth/invalid-login-credentials': 'Invalid email or password. Please check and try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already registered. Try signing in.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later or reset your password.',
  'auth/operation-not-allowed': 'Sign-in method is not enabled. Contact support.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

export function getAuthErrorMessage(error) {
  if (!error) return 'Something went wrong.';
  const code = error?.code || (typeof error === 'string' && error.includes('auth/') ? error.split('(')[1]?.replace(')', '') : null);
  if (code && AUTH_MESSAGES[code]) return AUTH_MESSAGES[code];
  return error?.message || String(error);
}
