var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: ['/login', '/user', '/certificate/', '/tags/','/admin/','/template/','/sendemail/'],
  target: 'https://links-qda1.aine.ai:9092/',
  secure: true
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);