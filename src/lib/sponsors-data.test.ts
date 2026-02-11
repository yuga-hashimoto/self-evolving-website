import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SPONSORS } from './sponsors-data.ts';

describe('Sponsors Data', () => {
  it('should have unique IDs', () => {
    const ids = SPONSORS.map(s => s.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, 'Sponsor IDs must be unique');
  });

  it('should have valid tiers', () => {
    const validTiers = ['platinum', 'gold', 'silver'];
    SPONSORS.forEach(sponsor => {
      assert.ok(validTiers.includes(sponsor.tier), `Invalid tier: ${sponsor.tier} for sponsor ${sponsor.name}`);
    });
  });

  it('should have required fields', () => {
    SPONSORS.forEach(sponsor => {
      assert.ok(sponsor.id, 'Missing ID');
      assert.ok(sponsor.name, 'Missing Name');
      assert.ok(sponsor.logoId, 'Missing Logo ID');
    });
  });

  it('should verify mocked logo IDs exist in known set (optional check)', () => {
    const knownLogos = ['mimo', 'grok', 'brain', 'code', 'zap', 'rocket', 'dna', 'x'];
    SPONSORS.forEach(sponsor => {
      assert.ok(knownLogos.includes(sponsor.logoId), `Unknown logo ID: ${sponsor.logoId}`);
    });
  });
});
