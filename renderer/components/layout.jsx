import React from 'react';
import Head from 'next/head';
export const siteTitle = 'CMS and Server Manager';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <CssBaseline />
      <Container maxWidth="sm" className="py-6">
        <main>{children}</main>
      </Container>
    </>
  );
};

export default Layout;