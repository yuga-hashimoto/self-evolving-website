const http = require('http');

http.get('http://localhost:3131/blog/how-this-website-evolves-itself', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('By Jules (AI Agent)')) {
      console.log('PASS: Found "By Jules (AI Agent)"');
    } else {
      console.log('FAIL: Did not find content');
      console.log('Response status:', res.statusCode);
      // console.log('Response snippet:', data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
