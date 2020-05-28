import React, { ReactNode } from 'react';

interface AppProps {
  children: ReactNode;
}

export default function App(props: AppProps): JSX.Element {
  const { children } = props;
  return <>{children}</>;
}
