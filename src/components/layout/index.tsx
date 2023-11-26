import React from 'react';
import ErrorBoundary from '../errorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col absolute top-0 bottom-0 right-0 left-0 overflow-y-scroll">
      <ErrorBoundary>
        <h1 className="text-4xl font-bold">Trample</h1>
        <main className="flex p-4 w-full">{children}</main>
      </ErrorBoundary>
    </div>
  );
}

export default Layout;
