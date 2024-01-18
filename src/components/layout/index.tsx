import React, { useEffect } from 'react';
import ErrorBoundary from '../errorBoundary';
import { Analytics } from '@vercel/analytics/react';
import mixpanel from 'mixpanel-browser';


interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if(token){
      mixpanel.init(
        token, 
        {
          track_pageview: true, 
          persistence: 'localStorage'
        }
      );
    }
  }, [])

  return (
    <>
      <div className="flex flex-col absolute top-0 bottom-0 right-0 left-0 overflow-y-scroll rainbow-box">
        <ErrorBoundary>
          <main className="flex w-full h-full">{children}</main>
        </ErrorBoundary>
        <footer className='text-xs text-center'>&copy;{new Date().getFullYear()} Jake Dawkins</footer>
      </div>
      <Analytics />
    </>
  );
}

export default Layout;
