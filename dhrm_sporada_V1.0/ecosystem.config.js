// ecosystem.config.js
module.exports = {
  apps : [{
    name: 'dhrm_frontend',
    script: 'npm',
    args: 'run dev',
    watch: true,
    cwd: 'E:\rane-group\rane v2\rane-group\dhrm-sporada\dhrm_sporada_V1.0' // REPLACE YOUR FRONTEND PATH
  }]
};
