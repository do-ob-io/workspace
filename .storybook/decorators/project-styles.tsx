import type { Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';

import storybookGlobalsCss from '../globals.css?inline';

/**
 * Map of glob-matched paths to their Vite-compiled CSS strings.
 *
 * Keys follow the pattern `../../nodejs/<project>/src/globals.css`.
 * Values are compiled CSS strings produced by Vite's `?inline` query
 * (processed through the `@tailwindcss/vite` plugin).
 */
const projectStyles = import.meta.glob<string>(
  '../../nodejs/*/src/globals.css',
  { query: '?inline', import: 'default', eager: true },
);

/**
 * Lookup from project directory name to its compiled globals CSS string.
 */
const projectCssMap: Record<string, string> = {};

for (const [ globPath, css ] of Object.entries(projectStyles)) {
  const match = globPath.match(/\.\.\/nodejs\/([^/]+)\/src\/globals\.css$/);
  if (match) {
    projectCssMap[match[1]] = css;
  }
}

/** Stable element ID used to manage the dynamic stylesheet. */
const STYLE_ID = 'storybook-project-globals-css';

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
 * Decorator that dynamically loads the appropriate compiled `globals.css` for
 * each project. When a project has its own `src/globals.css`, that compiled
 * stylesheet is injected via a `<style>` tag. Projects without one fall back
 * to the shared `.storybook/globals.css`.
 *
 * Only one project stylesheet is active at any time — switching stories
 * replaces the `<style>` content rather than stacking stylesheets.
 */
export const ProjectStylesDecorator: Decorator = (Story, context) => {
  const project = getProjectName(context.parameters?.fileName);
  const css = (project && projectCssMap[project]) || storybookGlobalsCss;

  useEffect(() => {
    let style = document.querySelector<HTMLStyleElement>(`#${STYLE_ID}`);

    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.append(style);
    }

    style.textContent = css;
  }, [ css ]);

  return <Story />;
};
