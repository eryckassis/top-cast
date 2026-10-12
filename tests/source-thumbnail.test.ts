import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

describe('Source Thumbnail Placeholders', () => {
  const componentPath = path.resolve('src/renderer/components/source-thumbnail.tsx');
  const fileContent = fs.readFileSync(componentPath, 'utf8');

  it('exports SourceThumbnail and SourceThumbnailPlaceholder components', () => {
    assert.ok(fileContent.includes('export function SourceThumbnailPlaceholder'));
    assert.ok(fileContent.includes('export function SourceThumbnail'));
  });

  it('renders a simple standardized placeholder with Monitor for screen and AppWindow for window', () => {
    assert.ok(fileContent.includes('sourceKind === \'window\''));
    assert.ok(fileContent.includes('<AppWindow'));
    assert.ok(fileContent.includes('<Monitor'));
  });

  it('keeps placeholders simple with icon-only presentation', () => {
    // Should NOT have bloated simulated OS titlebars, traffic lights, or badge pills
    assert.ok(!fileContent.includes('Janela Ativa'));
    assert.ok(!fileContent.includes('Tela Inteira'));
    assert.ok(!fileContent.includes('bg-rose-500'));
    assert.ok(!fileContent.includes('bg-amber-500'));
    assert.ok(!fileContent.includes('bg-emerald-500'));
  });

  it('validates empty dataUrl before attempting to render img element', () => {
    assert.ok(fileContent.includes("source.thumbnailDataUrl !== 'data:image/png;base64,'"));
  });
});
