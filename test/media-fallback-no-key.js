const assert = require('node:assert/strict');
delete process.env.TMDB_API_KEY;
delete process.env.TMDB_READ_ACCESS_TOKEN;
const media = require('../data/media');
(async () => {
  const originalFetch = global.fetch;
  global.fetch = async input => {
    const url = String(input);
    assert.ok(url.includes('commons.wikimedia.org/w/api.php'), 'TMDB anahtarı yokken Wikimedia kaynağı denenmeli');
    return { ok: true, json: async () => ({ query: { pages: {
      7: { title: 'File:Known Movie - film scene still.jpg', imageinfo: [{ thumburl: 'https://upload.wikimedia.org/known-movie-scene.jpg' }] }
    } } }) };
  };
  try {
    const frames = await media.resolveFilm({ id: 'no-key-film', title: 'Known Movie', en: 'Known Movie', year: 2021 });
    assert.equal(frames[0], 'https://upload.wikimedia.org/known-movie-scene.jpg');
    console.log('Film fallback test passed without TMDB_API_KEY.');
  } finally { global.fetch = originalFetch; }
})().catch(err => { console.error(err); process.exitCode = 1; });
