import React, { ReactNode } from 'react';

interface AppProps {
  children: ReactNode;
}

export default function App(props: AppProps) {
  const { children } = props;
  return <>{children}</>;
}
