export type AuthFormValues = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  campus: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

export function validateLoginForm(
  values: Pick<AuthFormValues, 'email' | 'password'>
): { errors: AuthFormErrors; valid: boolean } {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();

  if (!email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';

  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';

  return { errors, valid: Object.keys(errors).length === 0 };
}

export function validateSignupForm(values: AuthFormValues): {
  errors: AuthFormErrors;
  valid: boolean;
} {
  const loginCheck = validateLoginForm(values);
  const errors: AuthFormErrors = { ...loginCheck.errors };

  if (!values.fullName.trim()) errors.fullName = 'Full name is required';

  const username = values.username.trim();
  if (!username) errors.username = 'Username is required';
  else if (username.length < 3) errors.username = 'Username must be at least 3 characters';
  else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Use letters, numbers, and underscores only';
  }

  if (!values.campus.trim()) errors.campus = 'Select your campus';

  return { errors, valid: Object.keys(errors).length === 0 };
}
