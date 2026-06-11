const handler = require('../api/draft.js');

function makeReq(url) {
  return {
    url,
    headers: {
      host: 'dong100.org',
      referer: 'https://dong100.org/',
    },
  };
}

function makeRes() {
  const res = {};
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.writeHead = (code, obj) => { res.statusCode = code; res.location = obj && obj.Location; };
  res.end = (body) => { res.ended = true; res.body = body; console.log('RESP', { statusCode: res.statusCode, headers: res.headers, location: res.location, body: res.body }); };
  return res;
}

(async () => {
  const req = makeReq('/api/draft?sanity-preview-secret=TESTSECRET&sanity-preview-pathname=/');
  const res = makeRes();
  try {
    await handler(req, res);
    console.log('Handler completed');
  } catch (err) {
    console.error('Handler threw', err && err.stack ? err.stack : err);
  }
})();
