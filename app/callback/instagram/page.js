// app/callback/instagram/page.js
import { Suspense } from 'react';
import CallbackHandler from './CallbackHandler';
import Loading from '@/components/ui/Loading';

export default function InstagramCallbackPage() {
  return (
    // The Suspense boundary is in the parent, wrapping the component that uses the hook.
    <Suspense fallback={<Loading />}>
      <CallbackHandler />
    </Suspense>
  );
}
