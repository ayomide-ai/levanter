const http = require('http');
const { spawn } = require('child_process');

const port = Number(process.env.PORT || 10000);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, service: 'levanter' }));
  }
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('Levanter is running');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Render health server listening on 0.0.0.0:${port}`);
});

const bot = spawn('npm', ['start'], {
  cwd: '/root/LyFE',
  stdio: 'inherit',
  env: process.env,
});

const shutdown = (signal) => {
  try { bot.kill(signal); } catch {}
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bot.on('exit', (code, signal) => {
  console.log(`Levanter bot exited code=${code} signal=${signal}`);
  process.exit(code ?? 0);
});
