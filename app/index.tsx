import { Redirect } from 'expo-router';

/** Web and deep links hit `/` — send users to the main feed. */
export default function Index() {
  return <Redirect href="/feed" />;
}
