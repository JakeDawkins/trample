import React from 'react';
import ErrorBoundary from '../errorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col absolute top-0 bottom-0 right-0 left-0 overflow-y-scroll border-4 border-black">
      <ErrorBoundary>
        <header className="flex justify-center w-full mt-4">
          <h1 className="text-4xl font-bold">Trample</h1>
        </header>
        <main className="flex mt-4 w-full">{children}</main>
      </ErrorBoundary>
    </div>
  );
}

export default Layout;
