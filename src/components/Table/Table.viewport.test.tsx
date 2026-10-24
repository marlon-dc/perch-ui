import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Table.stories';

const { MonthGrid } = composeStories(stories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('Table cell left border is hidden in forced colors except on partial cells', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<MonthGrid />);
    const plain = screen
      .getByRole('row', { name: /^Electricity/ })
      .element()
      .querySelector('td')!;
    const partial = screen.getByRole('cell', { name: /\(Partly paid\)$/ }).element();
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect.poll(() => getComputedStyle(plain).borderLeftColor).toBe(canvas);
    expect(getComputedStyle(partial).borderLeftColor).not.toBe(canvas);
  } finally {
    await forcedColors('none');
  }
});

test("Chrome's accessible name for a cell button has no stray space before the comma", async () => {
  const screen = await render(<MonthGrid />);
  await expect.element(screen.getByRole('region', { name: 'Month grid' })).toBeVisible();
  // The test runs in an iframe of the runner page: read Chrome's AX tree of every frame.
  type FrameTree = { frame: { id: string }; childFrames?: FrameTree[] };
  type AXNode = { role?: { value?: string }; name?: { value?: string } };
  const { frameTree } = (await cdp().send('Page.getFrameTree')) as { frameTree: FrameTree };
  const frameIds: string[] = [];
  const walk = (tree: FrameTree) => {
    frameIds.push(tree.frame.id);
    tree.childFrames?.forEach(walk);
  };
  walk(frameTree);
  const nodes: AXNode[] = [];
  for (const frameId of frameIds) {
    const res = (await cdp().send('Accessibility.getFullAXTree', { frameId })) as {
      nodes: AXNode[];
    };
    nodes.push(...res.nodes);
  }
  const names = nodes
    .filter((n) => n.role?.value === 'button')
    .map((n) => n.name?.value ?? '')
    .filter((name) => name.includes('edit Rent'));
  expect(names).toEqual(['₱12,000.00, edit Rent, Week 1', '₱0.00, edit Rent, Week 2']);
});
