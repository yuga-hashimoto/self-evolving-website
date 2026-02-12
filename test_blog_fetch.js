const http = require('http');

http.get('http://localhost:3131/blog', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('How This Website Evolves Itself')) {
      console.log('PASS: Found "How This Website Evolves Itself"');
    } else {
      console.log('FAIL: Did not find "How This Website Evolves Itself"');
      console.log('Response status:', res.statusCode);
      console.log('Response snippet:', data.substring(0, 1000));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
