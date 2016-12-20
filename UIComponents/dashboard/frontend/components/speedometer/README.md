# Angular Speedometer 
 
  Angular component for displaying meter gauge/speedometer gauge visualization

## Requirements:

  D3.js v4.2.2
  AngularJS v1.0.1+
  wsProvider.js
  httpProvider.js
  
## Getting started:

  You will need to include angular JS and 'D3 JS' in your project to make the component work

  ```html
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-cookies.js"></script>
  <script src="//cdn.rawgit.com/gdi2290/angular-websocket/v1.0.9/angular-websocket.min.js"></script>
  <script src="https://d3js.org/d3.v4.min.js"></script>  
  ```
  Include angular-metergauge module
   
  ```html
  <script src="/UIComponents/dashboard/frontend/components/speedometer/angular.metergauge.min.js"></script>
  ```
  
  Include wsProvider and httpProvider for calling backend API's
  
  ```html
    <script src="/UIComponents/wsProvider.js"></script>
    <script src="/UIComponents/httpProvider.js"></script>
    <script src="/UIComponents/config/scriptrTransport.js"></script>
  ```
  
  Include scriptrTransport for configuration
  
  ```html
    <script src="/UIComponents/config/scriptrTransport.js"></script>
  ```
  
  Add "WsClient", "HttpClient", "Speedometer" to your app module's dependency
  
  ```
  angular.module("myApp", ["WsClient", "HttpClient", "Speedometer"])
  ```
  
## Options:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
  
  
## Componenet usage:

scriptr-speedometer is an element component. you will just have to add it in your html view and add its relevant options.













