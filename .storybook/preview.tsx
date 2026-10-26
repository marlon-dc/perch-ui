import type { Decorator, Preview } from '@storybook/react-vite';
import { cn } from '../src/lib/cn';
import '../src/styles/index.css';

type Theme = 'light' | 'dark';

const withTheme: Decorator = (Story, context) => {
  const theme: Theme = context.globals['theme'] === 'dark' ? 'dark' : 'light';
  const docs = context.viewMode === 'docs';
  // Canvas: theme the whole document so portalled overlays (Select, Sheet, Toast) follow it.
  // Docs: every story renders on one page, so each story is themed on its own wrapper instead;
  // writing <html> here would let the last story (Dark) repaint the whole page.
  if (!docs) document.documentElement.dataset['theme'] = theme;
  return (
    <div
      data-theme={docs ? theme : undefined}
      className={cn('bg-bg text-ink font-ui p-4', !docs && 'min-h-screen')}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
      },
    },
  },
  parameters: {
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', 'Internals'],
      },
    },
  },
};

export default preview;
