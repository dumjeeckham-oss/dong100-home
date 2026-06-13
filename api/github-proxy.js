const { createProxy } = require('decap-cms-proxy-server');

// 환경 변수가 제대로 들어오는지 확인하는 로그 추가
console.log("Checking Environment Variables...");
console.log("ID exists:", !!process.env.GITHUB_CLIENT_ID);
console.log("Secret exists:", !!process.env.GITHUB_CLIENT_SECRET);
console.log("Token exists:", !!process.env.GITHUB_TOKEN);

module.exports = createProxy({
  githubToken: process.env.GITHUB_TOKEN,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
});
