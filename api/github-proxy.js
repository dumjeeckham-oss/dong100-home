// 이 코드는 GitHub과 Decap CMS 사이에서 인증을 중개합니다.
const { createProxy } = require('decap-cms-proxy-server');

module.exports = createProxy({
  githubToken: process.env.GITHUB_TOKEN,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
});
