import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './index.module.css';

// ─── Floating Lines config ────────────────────────────────────────────────────
const GRADIENT   = ['#0f172a', '#1e3a8a', '#1d4ed8', '#38bdf8', '#60a5fa', '#1d4ed8', '#1e3a8a'];
const LINE_COUNT = [5, 7, 5];
const LINE_DIST  = [4, 5, 4];
const TOP_WAVE   = { x: 10.0,  y:  0.5, rotate: -0.3  };
const MID_WAVE   = { x:  5.0,  y:  0.0, rotate:  0.15 };
const BOT_WAVE   = { x:  2.0,  y: -0.7, rotate: -0.2  };

// ─── Feature data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    label: 'COMMUNICATION',
    title: 'Modbus Integration',
    description:
      'Real-time polling of field assets over Modbus TCP/IP. Configurable register maps, automatic reconnection, and live telemetry streaming to every module.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5H6m12-13.5v11.25M6 16.5L4.5 19.5m13.5-3 1.5 3M8.25 19.5h7.5" />
      </svg>
    ),
    label: 'OPTIMIZATION',
    title: 'MILP Energy Solver',
    description:
      'Mixed-Integer Linear Programming engine dispatches batteries, generators, and flexible loads to maximize self-sufficiency or emissions across each scheduling horizon.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    label: 'FORECASTING',
    title: 'Extensible Forecast Engine',
    description:
      'A model-agnostic forecasting layer ships with SMA, Persistence, and Prophet baselines. Each model follows a common interface so additional algorithms can be plugged in without touching the optimizer.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125S3.75 11.278 3.75 9m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125S3.75 13.903 3.75 11.625" />
      </svg>
    ),
    label: 'STORAGE',
    title: 'Historical Database',
    description:
      'Every measurement, setpoint, and optimizer result is persisted. Query, export, and visualise the full operational history.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    label: 'SECURITY',
    title: 'Local Authentication',
    description:
      'Role-based access control with locally managed credentials — no cloud dependency. Operators and admins get scoped permissions without external identity providers.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" className={styles.featureIcon}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    label: 'DEPLOYMENT',
    title: 'Docker Containerisation',
    description:
      'Every EMS service — API, optimizer, forecaster, and database — runs in its own Docker container, orchestrated via Compose. Spin up the full stack on any Linux host with a single command, and scale or replace individual services independently.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroBadge() {
  return (
    <span className={styles.heroBadge}>
      <span className={styles.heroBadgeDot} />
      Energy Management System
    </span>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Full-bleed animated background */}
      <div className={styles.heroCanvas}>
        <BrowserOnly>
          {() => {
            const FloatingLines = require('../components/FloatingLines').default;
            return (
              <FloatingLines
                enabledWaves={['top', 'middle', 'bottom']}
                lineCount={LINE_COUNT}
                lineDistance={LINE_DIST}
                linesGradient={GRADIENT}
                topWavePosition={TOP_WAVE}
                middleWavePosition={MID_WAVE}
                bottomWavePosition={BOT_WAVE}
                animationSpeed={0.55}
                interactive
                parallax
                parallaxStrength={0.12}
                bendRadius={4}
                bendStrength={-0.4}
                mixBlendMode="normal"
              />
            );
          }}
        </BrowserOnly>
      </div>

      {/* Dark vignette overlay so text stays readable */}
      <div className={styles.heroOverlay} />

      {/* Radial glow */}
      <div className={styles.heroGlow} />

      {/* Hero content */}
      <div className={styles.heroContent}>
        <HeroBadge />

        <h1 className={styles.heroTitle}>
          EMS<span className={styles.heroTitleAccent}>4DC</span>
        </h1>

        <p className={styles.heroSubtitle}>
          A unified platform for DC microgrid intelligence — from field-level Modbus
          telemetry to MILP-optimised dispatch.
        </p>

        <div className={styles.heroCta}>
          <Link className={styles.ctaPrimary} to="/docs.ems/Introduction/intro">
            Get Started
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className={styles.ctaArrow}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link className={styles.ctaSecondary} to="/docs.ems/Installation/software">
            Installation
          </Link>
        </div>

        {/* Stat strip */}
        <div className={styles.statStrip}>
          {[['Modbus', 'TCP/IP'], ['Optimizer', 'MILP'], ['Authentication', 'Local']].map(([k, v]) => (
            <div key={k} className={styles.stat}>
              <span className={styles.statValue}>{v}</span>
              <span className={styles.statKey}>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue}>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}

function FeatureCard({ icon, label, title, description }) {
  return (
    <article className={styles.featureCard}>
      <div className={styles.featureIconWrap}>{icon}</div>
      <span className={styles.featureLabel}>{label}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </article>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionEyebrow}>Capabilities</p>
        <h2 className={styles.sectionTitle}>Everything the microgrid needs</h2>
        <p className={styles.sectionSub}>
          Four tightly-integrated modules, one coherent system.
        </p>
      </div>
      <div className={styles.featureGrid}>
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <p className={styles.ctaEyebrow}>Documentation</p>
        <h2 className={styles.ctaTitle}>Ready to deploy?</h2>
        <p className={styles.ctaSub}>
          Follow the installation guide to get EMS4DC running on your hardware in minutes.
        </p>
        <div className={styles.ctaButtons}>
          <Link className={styles.ctaPrimary} to="/docs.ems/Introduction/intro">
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  return (
    <main className={styles.main}>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
  );
}