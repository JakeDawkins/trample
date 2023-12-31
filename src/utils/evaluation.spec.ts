import { canMakeWord } from './evaluation';

describe('canMakeWord', () => {
  it('wont let you use a word youve used before', async () => {
    const result = await canMakeWord('at', ['c'], 1, ['CAT', 'ACT']);
    expect(result).toBe(false);
  });

  /**
   * REPLACEMENTS
   */

  it('returns true if a word can be made by replacement', async () => {
    const result = await canMakeWord('cat', ['a', 'b'], 0);
    expect(result).toBe(true);
  });

  it('returns false if a word cannot be made by replacement', async () => {
    //  C here should be deduped and not checked for validity
    const result = await canMakeWord('cat', ['c', 'x'], 0);
    expect(result).toBe(false);
  });

  /**
   * DELETIONS
   */

  it('returns true if a word can be made by deletion', async () => {
    const result = await canMakeWord('cat', ['a', 't'], 1);
    expect(result).toBe(true);
  });

  it('returns false if a word is too short for deletion', async () => {
    const result = await canMakeWord('at', [], 1);
    expect(result).toBe(false);
  });

  it('returns false if there are no deletions remaining', async () => {
    const result = await canMakeWord('cat', [], 0);
    expect(result).toBe(false);
  });

  /**
   * INSERTIONS
   */

  it('returns true if a word can be made by insertion before', async () => {
    const result = await canMakeWord('at', ['c'], 0);
    expect(result).toBe(true);
  });

  it('returns true if a word can be made by insertion after', async () => {
    const result = await canMakeWord('for', ['t'], 0);
    expect(result).toBe(true);
  });
});
