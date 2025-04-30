import React, { JSX } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Star Citizen Corp Manager"
      description="Manage your corp, assets, and operations in real-time"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className={`hero__title ${styles.hero__text}`}>Star Citizen Corp Manager</h1>
          <p className={`hero__subtitle ${styles.hero__text}`}>
            All-in-one solution for fleet logistics, corp assets, and developer documentation.
          </p>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            📘 Get Started
          </Link>
        </div>
      </header>
      <main>
        <HomepageFeatures/>
      </main>
    </Layout>
  );
}