import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

type Theme = 'light' | 'dark';

const withTheme: Decorator = (Story, context) => {
  const theme: Theme = context.globals['theme'] === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset['theme'] = theme;
  return (
    <div className="bg-bg text-ink font-ui min-h-screen p-4">
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
  },
};

export default preview;
