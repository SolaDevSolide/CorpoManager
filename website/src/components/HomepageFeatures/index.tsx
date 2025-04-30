import React, { JSX } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

const FeatureList = [
  {
    title: 'Modular Architecture',
    icon: '🧩',
    description: (
      <>
        Clean monorepo setup with clear separation of backend, frontend, and docs.
      </>
    ),
  },
  {
    title: 'Realtime Integration',
    icon: '📡',
    description: (
      <>
        WebSockets and Redis Pub/Sub keep your fleet and data synced live.
      </>
    ),
  },
  {
    title: 'Built-in Documentation',
    icon: '📘',
    description: (
      <>
        Powered by Docusaurus — contributors can easily extend and maintain it.
      </>
    ),
  },
];

function Feature({
                   title,
                   icon,
                   description,
                 }: {
  title: string;
  icon: string;
  description: JSX.Element;
}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}