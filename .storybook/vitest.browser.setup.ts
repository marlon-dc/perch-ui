import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './preview';

// Gives composed stories (composeStories) the preview decorator, CSS and globals.
setProjectAnnotations([previewAnnotations]);
