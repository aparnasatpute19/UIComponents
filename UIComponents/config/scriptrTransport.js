var wssConfig = ["wsClientProvider",function (wsClientProvider) {
  wsClientProvider.setBaseUrl("wss://kitchen-sink.scriptrapps.io");  
  wsClientProvider.setToken("TzgzNTA4NkQxOA==");
  wsClientProvider.setPublishChannel("requestChannel");
  wsClientProvider.setSubscribeChannel("responseChannel");
}];

var httpsConfig = ["httpClientProvider",function (httpClientProvider) {
  httpClientProvider.setBaseUrl("https://kitchen-sink.scriptrapps.io");
  httpClientProvider.setToken("TzgzNTA4NkQxOA==");
}]