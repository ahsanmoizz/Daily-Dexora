module.exports = {
  apps: [{
    name: "bundler",
    script: "./src/index.js",
    watch: false,
    env: { NODE_ENV: "production" }
  }]
};
