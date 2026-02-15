import type { Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';

console.log('Loading project styles decorator...');

import storybookGlobalsUrl from '../globals.css?url';

/**
 * Map of glob-matched paths to their processed CSS URLs.
 *
 * Keys follow the pattern `../nodejs/<project>/src/globals.css`.
 * Values are Vite-processed asset URLs.
 */
const projectStyleUrls = import.meta.glob<string>(
  '../../nodejs/*/src/globals.css',
  { query: '?url', import: 'default', eager: true },
);

/**
 * Lookup from project directory name to its processed globals CSS URL.
 */
const projectCssMap: Record<string, string> = {};

for (const [ globPath, url ] of Object.entries(projectStyleUrls)) {
  const match = globPath.match(/\.\.\/nodejs\/([^/]+)\/src\/globals\.css$/);
  if (match) {
    projectCssMap[match[1]] = url;
  }
}

console.log('Project CSS map:', JSON.stringify(projectCssMap, null, 2));

/** Stable element ID used to manage the dynamic stylesheet link. */
const LINK_ID = 'storybook-project-globals-css';

/**
 * Extract the project directory name from a story's file path.
 *
 * @param fileName - The `parameters.fileName` value auto-set by Storybook
 *   (e.g. `"nodejs/game-forgotten-wing/src/component.stories.tsx"`).
 * @returns The project directory name, or `null` if parsing fails.
 */
function getProjectName(fileName?: string): string | null {
  if (!fileName) return null;
  const match = fileName.match(/nodejs\/([^/]+)\//);
  return match ? match[1] : null;
}

/**
 * Decorator that dynamically loads the appropriate `globals.css` for each
 * project. When a project has its own `src/globals.css`, that stylesheet is
 * injected via a `<link>` tag. Projects without one fall back to the shared
 * `.storybook/globals.css`.
 *
 * Only one project stylesheet is active at any time — switching stories
 * swaps the `<link>` href rather than stacking stylesheets.
 */
export const ProjectStylesDecorator: Decorator = (Story, context) => {
  const project = getProjectName(context.parameters?.fileName);
  const cssUrl = (project && projectCssMap[project]) || storybookGlobalsUrl;

  console.log(`Applying styles for project: ${project || 'storybook globals'} (${cssUrl})`);

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>(`#${LINK_ID}`);

    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.append(link);
    }

    link.href = cssUrl;
  }, [ cssUrl ]);

  return <Story />;
};
