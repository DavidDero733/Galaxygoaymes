import https from 'https';
https.get('https://raw.githubusercontent.com/brunoiscool2/unblockedgames/main/index.html', (res) => {
  let raw = '';
  res.on('data', d => raw += d);
  res.on('end', () => console.log(raw.split('\n').filter(line => line.includes('href')).slice(0, 50).join('\n')));
});
