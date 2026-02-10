import { test } from 'node:test';
import assert from 'node:assert';
// Note: .ts extension is required when using node --experimental-strip-types
import { formatDuration } from './model-analytics.ts';

test('formatDuration', async (t) => {
  await t.test('formats 0 seconds', () => {
    assert.strictEqual(formatDuration(0), '0:00');
  });

  await t.test('formats single digit seconds', () => {
    assert.strictEqual(formatDuration(5), '0:05');
  });

  await t.test('formats less than 60 seconds', () => {
    assert.strictEqual(formatDuration(45), '0:45');
  });

  await t.test('formats exactly 60 seconds', () => {
    assert.strictEqual(formatDuration(60), '1:00');
  });

  await t.test('formats more than 60 seconds', () => {
    assert.strictEqual(formatDuration(65), '1:05');
  });

  await t.test('formats 10 minutes', () => {
    assert.strictEqual(formatDuration(600), '10:00');
  });

  await t.test('formats more than an hour', () => {
    assert.strictEqual(formatDuration(3661), '61:01');
  });
});
