import { test, describe, after } from 'node:test';
import assert from 'node:assert';
import { getLatestCommits } from './github.ts';

describe('getLatestCommits', () => {
  const originalFetch = global.fetch;

  after(() => {
    global.fetch = originalFetch;
  });

  test('should return formatted commits on success', async () => {
    const mockCommits = [
      {
        sha: '1234567890abcdef',
        commit: {
          author: { name: 'Test User', date: '2023-01-01T00:00:00Z' },
          message: 'Feat: Add feature\n\nThis is a description',
        },
        html_url: 'http://github.com/test/1',
      },
      {
        sha: 'abcdef1234567890',
        commit: {
          author: { name: 'Test User 2', date: '2023-01-02T00:00:00Z' },
          message: 'Fix: Bug fix',
        },
        html_url: 'http://github.com/test/2',
      },
    ];

    global.fetch = async () => ({
        ok: true,
        json: async () => mockCommits,
    } as unknown as Response);

    const commits = await getLatestCommits();

    assert.strictEqual(commits.length, 2);
    assert.strictEqual(commits[0].id, '1234567890abcdef');
    assert.strictEqual(commits[0].version, '1234567');
    assert.strictEqual(commits[0].title, 'Feat: Add feature');
    assert.strictEqual(commits[0].desc, 'This is a description');
    assert.strictEqual(commits[0].timestamp, '2023-01-01T00:00:00Z');

    assert.strictEqual(commits[1].title, 'Fix: Bug fix');
    assert.strictEqual(commits[1].desc, '');
  });

  test('should return empty array on failure', async () => {
    global.fetch = async () => ({
        ok: false,
        statusText: 'Not Found',
    } as unknown as Response);

    const commits = await getLatestCommits();
    assert.strictEqual(commits.length, 0);
  });

  test('should return empty array on exception', async () => {
      global.fetch = async () => {
          throw new Error('Network error');
      };

      const commits = await getLatestCommits();
      assert.strictEqual(commits.length, 0);
  });

  test('should include Authorization header if GITHUB_TOKEN is set', async () => {
    process.env.GITHUB_TOKEN = 'test-token';

    global.fetch = async (url, options) => {
        assert.ok(options?.headers);
        const headers = options!.headers as Record<string, string>;
        assert.strictEqual(headers['Authorization'], 'Bearer test-token');

        return {
            ok: true,
            json: async () => [],
        } as unknown as Response;
    };

    await getLatestCommits();

    delete process.env.GITHUB_TOKEN;
  });

  test('should use default repo URL', async () => {
      global.fetch = async (url) => {
          assert.match(url as string, /repos\/yuga-hashimoto\/self-evolving-website\/commits/);
          return {
              ok: true,
              json: async () => [],
          } as unknown as Response;
      };

      await getLatestCommits();
  });
});
