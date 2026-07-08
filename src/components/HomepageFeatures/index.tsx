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
        Built with Rust... of course! Generate files, projects, or entire
        architectures in milliseconds.
      </>
    ),
  },
  {
    title: 'Lua Scripting',
    icon: '⚙️',
    description: (
      <>
        Orchestrate rendering with a language you already know — with full IDE
        autocomplete and diagnostics for the entire Archetect API.
      </>
    ),
  },
  {
    title: 'Rich Templating',
    icon: '🎨',
    description: (
      <>
        Jinja-style templating with conditional logic, loops, and custom
        filters for dynamic code generation.
      </>
    ),
  },
  {
    title: 'Advanced Casing & Inflections',
    icon: '🔤',
    description: (
      <>
        Answer once — <code>my-project</code>, <code>MyProject</code>, and{' '}
        <code>MY_PROJECT</code> land where they belong. Smart pluralization
        included.
      </>
    ),
  },
  {
    title: 'Flexible Workflows',
    icon: '🔄',
    description: (
      <>
        Rich terminal UI for interactive use; headless with answer files for
        CI; MCP server for AI agents.
      </>
    ),
  },
  {
    title: 'Composable Catalogs',
    icon: '📦',
    description: (
      <>
        Organized, searchable collections of archetypes — composed from shared
        components and libraries — for open-source communities and enterprises,
        alike.
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
