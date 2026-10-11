import Link from 'next/link';
import React from 'react';

function Page404() {
  return (
    <>
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="mt-8">
        This page either doesn&apos;t exist or is unavailable right now.
      </p>
      <p className="mt-4">
        <Link href="/" className="underline font-bold">
          Back to Home
        </Link>
      </p>
    </>
  );
}

export default Page404;
