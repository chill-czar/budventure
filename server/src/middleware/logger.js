const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const method = req.method;
  const url = req.originalUrl || req.url;

  console.log(`[${method}] ${url} - IP: ${ip} - Time: ${new Date().toLocaleString()}`);

  next();
};

module.exports = logger;
