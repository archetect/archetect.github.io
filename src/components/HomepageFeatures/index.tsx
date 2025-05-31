import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Blazingly Fast',
    icon: '🚀',
    description: (
      <>
        Built with Rust... of course! Generate files, projects, or entire architectures.
      </>
    ),
  },
  {
    title: 'Powerful Scripting',
    icon: '⚙️',
    description: (
      <>
        Embedded scripting engine for sophisticated rendering orchestration and custom workflows.
      </>
    ),
  },
  {
    title: 'Rich Templating',
    icon: '🎨',
    description: (
      <>
        Jinja2-compatible templating with conditional logic, loops, and custom filters
        for dynamic code generation.
      </>
    ),
  },
  {
    title: 'Advanced Casing & Inflections',
    icon: '🔤',
    description: (
      <>
        Built-in case conversions and inflections for clean, consistent naming.
      </>
    ),
  },
  {
    title: 'Flexible Workflows',
    icon: '🔄',
    description: (
      <>
        Rich terminal UI for interactive workflows or run headless in CI and tooling.
      </>
    ),
  },
  {
    title: 'Archetype Catalogs',
    icon: '📦',
    description: (
      <>
        Organized collections of templates for open-source communities and enterprises, alike.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.slice(0, 3).map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className="row">
          {FeatureList.slice(3, 6).map((props, idx) => (
            <Feature key={idx + 3} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}