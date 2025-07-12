function setupSecurityHeaders(app) {
  app.disable("x-powered-by");
}
module.exports = { setupSecurityHeaders };
