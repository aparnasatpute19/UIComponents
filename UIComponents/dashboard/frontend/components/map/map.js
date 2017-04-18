angular
  .module("Map")
  .component(
  'scriptrMap',
  {
    transclude: true,
    bindings : { //TODO bind an id to use with ngMap in case we need to put multiple maps on page
      	"sourcesInfo": "<?",
      	"clusteredView": "<?", //boolean, if we render a cluster view for conglomerate markers or not
        "clusteredZoomMax": "<?", //Max zoom of map where cluster view is rendered
        "clusterZoom": "<?", //The zoom of map when clusteredView is true and clustered map is rendered
        "detailedZoomMin" : "<?", //Ignored with clusteredView = true, set when no cluster view
      	"focusedMarkerZoom": "<?", //Zoom when focusing on a single marker
        "pathStrokeOpacity": "@",
        "pathStrokeWeight": "@",
        "maxAssetPoints": "@", // Number of tracked positions per asset per map instance, do not set if infinite
        "defaultCenter": "@", //Map default center
        "trackedAsset": "@",
        "summaryIcons": "<?",
      
        "heatMapData" : "<?",
        
        "assetsData": "<?",
      	"api" : "@",
      	"apiParams" : "@",
        "msgTag": "@",
      	"onFormatData" : "&",
        "onSelectAsset" : "&",
      
         //TODO the below attributes, currently use without geofence
        "geofenceManager": "<?", //True to show the geofence drawing manage icons or not
      	"apiGeofence": "<?",
        "apiGeofenceParams": "<?",
        "msgTagGeofence": "<?",
    },
    templateUrl : '/UIComponents/dashboard/frontend/components/map/map.html',
    
    controller : function($scope, $rootElement, $location, $sce,
                           $compile, $timeout, $interval, $controller, NgMap,
                           defaultConstants, wsClient) {

      var self = this;
      
      // On load, get latest 500 data points saved in db
      this.$onInit = function() {
          self.pathStrokeOpacity = (self.pathStrokeOpacity) ? self.pathStrokeOpacity : 0;
          self.pathStrokeWeight = (self.pathStrokeWeight) ? self.pathStrokeWeight : 5;
        
          self.maxAssetPoints = (self.maxAssetPoints) ? self.maxAssetPoints : 100;
          self.defaultcenter = (self.defaultcenter) ? self.defaultcenter : "40.7053111,-74.258188";
          self.trackedAsset = (self.trackedAsset) ? self.trackedAsset : null;
        
        
          self.geofenceManager = (self.geofenceManager) ? self.geofenceManager : false;
        
          $scope.$parent.summaryIcons = {};
          if(self.summaryIcons) {
             angular.forEach(self.summaryIcons, function(value, key) {
                $scope.$parent.summaryIcons[key] = $sce.trustAsHtml(value);
            });
          }
        
         if(!self.trackedAsset) {
           self.showDetailedMap = false;
         } else {
           self.showDetailedMap = true;
           self.clusteredView = false;
         }
          // If a specific map is tracked do not use clustering
        
         if(self.clusteredView) {
           if(!self.clusteredZoomMax) {
           		self.clusteredZoomMax = 11;
           }
           self.detailedZoomMin =  (self.clusteredZoomMax < 20) ? (self.clusteredZoomMax + 1) : self.clusteredZoomMax;
           if(!self.clusterZoom) {
           		self.clusterZoom = 3;
            }
         } else { //No clustered View check the detailed zoom min
           if(!self.detailedZoomMin) {
            	self.detailedZoomMin = 0;
           }
           //By default set as if we are viewing all TODO: check if we are tracking a single asset
           self.detailedmapzoom = self.detailedZoomMin;
         }
        //Set the focus when showing a single asset
        if(!self.focusedMarkerZoom || (self.clusteredView && self.focusedMarkerZoom < self.clusteredZoomMax)) {
           self.focusedMarkerZoom = (self.detailedZoomMin < 18) ? (self.detailedZoomMin + 3) : self.detailedZoomMin;
         } 
        	
         //This should be move to a parent component
      	 loadMapData();
         
         //Should use default one if not available
         self.sourcesInfo = self.sourcesInfo;//mapConstants.sourceAssetIcon;
        
        
        
        $scope.$on("mapFoucsOnMarker", function(event, data) {
			self.focusOnAsset(data)
        });
      }

      //Load asset Icons per source
      var sourcesInfo = null;
      
      self.sources = {}; // "Stream", "Simulator"
      self.assets = {};
      
      self.selectedAsset = "all";
      
      self.markerClusterer = null;

      self._hiddenAssets = {};

      
      self.assetsKeys = [];
      
      self.mapcenter = null;
      
      self.infoWindow = null;
      
      self.dynMarkers = [];
      
      
      
      //Load initial map assets from api or from passed data and subscribe to channel messages to add newly published assets to map
      var loadMapData =  function() {
          	wsClient.onReady.then(function() {
              if(self.api) {
           		    self.apiParams =  (self.apiParams) ? self.apiParams : {};
             	   	wsClient.call(self.api, self.apiParams).then(function(data, response) {
                      if(self.onFormatData && typeof self.onFormatData() == "function"){
                        data = self.onFormatData()(data);
                      }
                    self.processAssets(data);
                    console.log("api call "+ self.api +" response returned", data)
                  }, function(err) {
                    self.callError = JSON.stringify(error)
                    console.log("api call "+ self.apiParams +" reject call promise", err);
                  });
              }
              if(self.msgTag) {
            	 wsClient.subscribe(self.msgTag, self.processAssets)
              }
              
          });
        
          if(self.assetsData) {
          	 console.log("static assets data", self.assetsData);
             self.processAssets(self.assetsData);
          }
       
      };

      //Call when receiving a new asset, or a set of assets
      self.processAssets = function(data) {
        var assets = data;
       // var id = data.id;
        var process = function(assets) {
          if (!self.trackedAsset || self.trackedAsset == key) {
              // Loop on assets
              for (var key in assets) {
                if (assets.hasOwnProperty(key)) {
                    console.log(key, assets[key]);
                    self.pushAssets(key, assets[key])
                  }
                }
          } else {
               if (assets.hasOwnProperty(self.trackedAsset)) {
                 self.pushAssets(self.trackedAsset, assets[self.trackedAsset])
               }
             }
          self.renderAssets();
          if(self.clusteredView && !self.trackedAsset)  {
            self.renderClusterer();
          }
        };
        
        if (self.clusteredView && !self.markerClusterer && !self.trackedAsset) {
          NgMap
            .getMap({
            id : 'clustered' //TODO: figure out another thing then id, or pass id as a param
          })
            .then(
            function(map) {
              if (!self.markerClusterer) {
                self.buildClusterer(map);
              }
             process(assets);
            });
        } else {
          process(assets)
        }
    };
      
     self.buildClusterer = function(map) {
        self.markerClusterer = new MarkerClusterer(
          map,
          self.dynMarkers,
          {
            maxZoom :  self.clusteredZoomMax,
            imagePath : 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m',
            minimumClusterSize : -1,
            gridSize : 50,
            averageCenter : true
          });
      };
      
      //Render all assets
      var rerenderAllAssets = function() {
        self.selectedAsset = "all";
        self.renderAssets();
      };

      // Render markers assets
      self.renderAssets = function() {
        console.log("Render New Assets.")
        if (self.selectedAsset == "all") {
          self.showAllAssets();
        } else { // Remove displaying single asset on select
          self.displayedAssets = {};
          self.displayedAssets[self.selectedAsset] = self.assets[self.selectedAsset];
        }
      };

      //Render marker clusters
      self.renderClusterer = function() {
          console.log("Render clusterer.")
          self.markerClusterer.resetViewport(true);
          self.markerClusterer.clearMarkers();
          self.markerClusterer.addMarkers(self.dynMarkers, false);
          self.markerClusterer.repaint();
      };

      // Show all assets
      self.showAllAssets = function() {
        self.displayedAssets = angular.copy(self.assets, {})
      };

      // Change map on zoom threshold
      self.onClusteredZoomChanged = function() {
        if (!self.trackedAsset) {
          NgMap.getMap({
            id : 'clustered'
          }).then(function(map) {
            if (map.getZoom() > self.detailedZoomMin) {
              self.showDetailedMap = true;
              self.mapcenter = map.getCenter();
              self.detaileddmapzoom = self.detailedZoomMin;
            } else {
              self.showDetailedMap = false;
              if(self.markerClusterer) 
                self.markerClusterer.setMap(map);
              rerenderAllAssets();
            }
          });
        }
      }

      //Change map on zoom threshold
      self.onDetailedZoomChanged = function() {
        if (!self.trackedAsset && self.clusteredView == true) {
          NgMap.getMap({
            id : 'detailed'
          }).then(function(map) {
            if (map.getZoom() <=  self.clusteredZoomMax) {
              self.showDetailedMap = false;
              self.clusterZoom =  self.clusteredZoomMax;
              rerenderAllAssets();
            } else {
              self.showDetailedMap = true;
            }
          });
        }
      };

      
      
      // Add an asset marker point to map
      // Example of pushed of asset trips: {"tripId":[{"lat":"51.650359051036","long":"-0.055656842290684",....},
      // "source":{"value":"stream"}}],"source":"stream","order":["0"]}
      // Push an array of sources with asssets with multiple marker points to map
      // Data format of asset trips: {"tripId":[{"lat":"40.792300000000004","long":"-73.95045",...},{}],
      // "tripId2":[{},{}], "source":"simulator","order":[tripId1, tripId2]}
      self.pushAssets = function(assetId, trips) {
        var assetSource = trips.source;
        var key = assetSource + "_" + assetId;

        // console.log("asset: " + key + " -> " + assets[key]);
        //Latest Marker for this asset on map
        var prevLatestMarker = null;
        if (!self.assets[key]) { //No assets with this key alreat drawn on map
          instantiateAsset(key);
          //NEED TO KEEP THIS IN CASE NEW ASSET
          self.assets[key]["pathColor"] = generateHexColor();
        } else { //There is already a map marker for this asset
          var markers = self.assets[key]["markers"];
          prevLatestMarker = markers[markers.length - 1];
        }

        var assetModel = null;
        var assetMake = null;

        //Asset Trips
        var tripsOrder = trips.order;

        // Loop on asset trips
        for (var t = tripsOrder.length - 1; t >= 0; t--) {
          var tripKey = tripsOrder[t];
          if (trips.hasOwnProperty(tripKey)) {
            var trip = trips[tripKey];

            // Define trip points icons Colors
            var tripStrokeColor = generateHexColor();
            var tripFillColor = generateHexColor();

            // Loop on trips points
            for (var i = trip.length - 1; i >= 0; i--) {
              var tripPoint = trip[i];

              var tripMarker = {
                "position" : ("" + tripPoint.lat + "," + tripPoint.long)
              };
              tripMarker.title = "Source" + ": " + assetSource + ", Asset" + ": "
                + assetId + ", trip: " + tripKey + ".";
              
              tripMarker.source = assetSource;
              
              tripMarker.assetId = assetId; // asset id
              
              tripMarker.assetKey = key; // source + assetId
              tripMarker.tripKey = tripKey;
              
              tripMarker.details = tripPoint;

              assetModel = (tripMarker.details && tripMarker.details.model) ? tripMarker.details.model.value
              : "";
              assetMake = (tripMarker.details && tripMarker.details.make) ? tripMarker.details.make.value
              : "";
              tripMarker.label = buildAssetLabel(assetMake, assetModel, assetId);

              //If Asset doesn't exist on map yet
              if (!prevLatestMarker && prevLatestMarker == null) {
                tripMarker.id = key + "-" + tripKey + "-" + i;
                tripMarker.pointRef = i;
                tripMarker.strokeColor = tripStrokeColor;
                tripMarker.fillColor = tripFillColor;
              } else {
                if (tripKey == prevLatestMarker.tripKey) {
                  tripMarker.id = key + "-" + tripKey + "-"
                    + ((prevLatestMarker.pointRef) + 1);
                  tripMarker.pointRef = ((prevLatestMarker.pointRef) + 1);
                  tripMarker.strokeColor = prevLatestMarker.strokeColor;
                  tripMarker.fillColor = prevLatestMarker.fillColor;
                  // Change previous Marker icon to a small trip point
                  self.assets[key]["markers"][markers.length - 1].icon = buildTripIcon(
                    6, 0.8, 0.8, prevLatestMarker.strokeColor,
                    prevLatestMarker.fillColor);
                } else {
                  // Change previous Marker icon to a Large trip point marking it as last point in trip
                  self.assets[key]["markers"][markers.length - 1].icon = buildTripIcon(
                    10, 1, 1, prevLatestMarker.strokeColor,
                    prevLatestMarker.fillColor);
                }
              }

              if (t == 0 && i == 0) { //Reached last point in asset trip & last point in current trip
                tripMarker.icon = (self.sourcesInfo && self.sourcesInfo[assetSource] && self.sourcesInfo[assetSource]["icon"]) ? self.sourcesInfo[assetSource]["icon"]
                : defaultConstants.sourceIcon["default"];
                self.assets[key]["latestMarker"] = tripMarker;
              } else {
                if (i == 0) { //Reached last point in trip
                  tripMarker.icon = buildTripIcon(10, 1, 1, tripStrokeColor,
                                                  tripFillColor)
                } else {
                  tripMarker.icon = buildTripIcon(6, 0.8, 0.8, tripStrokeColor,
                                                  tripFillColor);
                }
              }

              controlVehicleTrips(key); //TODO: MFE maybe this won't be needed anymore

              addMarkerToMap(key, tripMarker, tripPoint);
              
             
              if (self.mapcenter == null) {
                self.mapcenter = tripMarker.position;
              }
            } //End looping on asset's trip's points
          }// End check for Availble tripKey in trips
        }//End looping on asset's trips
        addAssetToSourceList(assetSource, key, tripMarker.label);
      };

      //Check asset source, and push asset to appropriate source to display it in its source list box
      var addAssetToSourceList = function(assetSource, assetKey,
                                           label) {
        if (!self.sources[assetSource]) {
          self.sources[assetSource] = [ {
            "key" : assetKey,
            "label" : label
          } ];
        } else {
          //if(self.sources[assetSource].indexOf(assetKey) == -1) {
          if (_.findWhere(self.sources[assetSource], {
            "key" : assetKey
          }) == undefined)
            self.sources[assetSource].push({
              "key" : assetKey,
              "label" : label
            });
          //}
        }
      };

      //Add asset marker trip point to asset markers
      var addMarkerToMap = function(key, newMarker, tripPoint) {
        //Push to assets
        self.assets[key]["markers"].push(newMarker);
        self.assets[key]["path"].push([ tripPoint.lat,
                                     tripPoint.long ]);
        if (!self.trackedAsset) {
          //Keep track for clusterer view as a marker Object not as JSON
          var dynMkr = angular.copy(newMarker, {});
          dynMkr.position = new google.maps.LatLng(tripPoint.lat,
                                                   tripPoint.long);
          var tmp = new google.maps.Marker(dynMkr);
          self.dynMarkers.push(tmp);
        }
      };

      //Control the asset markers trip points limits if maxAssetPoints defined, remove first pushed marker when limit reached
      var controlVehicleTrips = function(key) {
        if(self.maxAssetPoints) {
          if (self.assets[key]["markers"].length > self.maxAssetPoints) {
          	self.assets[key]["markers"].shift();
          }
        }
      };

      var instantiateAsset = function(assetKey) {
        self.assets[assetKey] = {
          "markers" : [],
          "path" : [],
          "pathColor" : "",
          "latestMarker" : {},
          "strokeOpacity" : self.pathStrokeOpacity,
          "strokeWeight" : self.pathStrokeWeight,
          "pathIcon" : [ {
            icon : {
              path : 'M 0,-1 0,1',
              strokeOpacity : 1,
              scale : 4
            },
            offset : '0',
            repeat : '20px'
          } ]
        };
      };

      //Build normal trip marker point
      var buildTripIcon = function(scale, fillOpacity,
                                    strokeWeight, tripStrokeColor, tripFillColor) {
        var tripicon = {
          path : google.maps.SymbolPath.CIRCLE,
          fillOpacity : fillOpacity,
          strokeWeight : strokeWeight,
          scale : scale,
          strokeColor : tripStrokeColor,
          fillColor : tripFillColor
        }
        return tripicon;
      };

      //Build asset label
      var buildAssetLabel = function(make, model, assetId) {
        var assetLabel = (make) ? (make + " ") : "";
        assetLabel += (model) ? (model + "-") : "";
        assetLabel += assetId;
        return assetLabel;
      };


      //Focus on asset when selected from list box, on when clicked on its marker on map
      //Close all info windows, redraw map with only asset trips tracked
      //If all assets are selected redraw all assets
      self.focusOnAsset = function(assetKey) {
        if(self.onSelectAsset && typeof self.onSelectAsset() == "function"){
            self.onSelectAsset()(assetKey);
        }
        self.selectedAsset = assetKey;
        self.showDetailedMap = true;
        if (self.infoWindow != null) {
          self.infoWindow.close();
        }
        if (self.selectedAsset == "all") {
          self.detailedmapzoom = self.detailedZoomMin;
          self.searchText = '';
        } else {
          self.searchText = self.assets[assetKey].latestMarker.label;
          self.mapcenter = self.assets[self.selectedAsset].latestMarker.position;
          self.detailedmapzoom = self.focusedMarkerZoom;
        }
        self.renderAssets();
      };

      //Show asset info in an info window
      self.showAssetInfo = function(event, assetKey, tripKey, id) {
        self.focusOnAsset(assetKey);
        var markerEl = this;
        NgMap.getMap({
          id : 'detailed' //TODO: MAke id parametrable or change selector if possible
        }).then(
          function(map) {
            //Open info window
            $scope.$parent.marker = _.findWhere(
              self.assets[assetKey]["markers"], {
                "id" : id
              })
            var infoWindow = "infoWindowTemplate_"
            + $scope.$parent.marker.source;
            
            $scope.map = map;
            $scope.map.showInfoWindow(event, infoWindow, markerEl);
            //Keep track of opened info window
            self.infoWindow = map.infoWindows[infoWindow];
          });
      };

      var generateHexColor = function() {
        var col = Math.floor(Math.random() * 16777215)
        .toString(16)
        return shadeColor2('#' + col, 0);
      };

      //Percent is a value betwein -1.0, 1.0. <0 to darken, >0 to lighten an hex color
      var shadeColor2 = function(color, percent) {
        var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0
        : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        return "#"
          + (0x1000000 + (Math.round((t - R) * p) + R)
             * 0x10000 + (Math.round((t - G) * p) + G)
             * 0x100 + (Math.round((t - B) * p) + B))
          .toString(16).slice(1);
      };

      self.isEmptyObject = function(obj) {
        return (Object.keys(obj).length == 0);
      };
      
      
      
      self.assetsFences = [];
      self.drawingControl = ["rectangle"];
      self.drawingOptions = {position: 'TOP_CENTER',drawingModes:['rectangle']}

      self.overlaySettings = {"fillColor": "#444", "fillOpacity": 0.2, "strokeWeight": 3, "strokeColor": "#ff8c00", "clickable": true, "zIndex": 1, "editable": true};

      self.setupDrawingManager = function() {
        self.assetsFences = [];
        //Invoke
        $scope.invoke("telematics/api/getVehicleGeofence", {
           "vehicleId": self.selectedAsset
        }, "main-getgeofence_"+self.selectedAsset);

        //By Default hide rect drawing mode
        hideRectDrawingMode();

        //TODO: Put a loading on get & remove when response received
      };


      self.drawGeofence = function(bounds) {
         if(bounds != null) {
           NgMap.getMap({id:'detailed'}).then(function(map) {
              var props = {};
              props["fillColor"] = self.overlaySettings["fillColor"];
              props["fillOpacity"] = self.overlaySettings["fillOpacity"];
              props["strokeWeight"] = self.overlaySettings["strokeWeight"];
              props["strokeColor"] = self.overlaySettings["strokeColor"];
              props["clickable"] = self.overlaySettings["clickable"];
              props["zIndex"] = self.overlaySettings["zIndex"];
              props["editable"] = self.overlaySettings["editable"];
              props["map"] = map;
              props["bounds"] = JSON.parse(bounds);
              var rectangle = new google.maps.Rectangle(props);
              self.assetsFences.push({assetId: self.selectedAsset, assetFence: rectangle});
            });
            //TODO: Remove loading
         } else {
           showRectDrawingMode();
           //TODO: Remove loading
         }
         $('[data-toggle="tooltip"]').tooltip(); 

        $(".gmnoprint").each(function(){ //Add classes to drawing manager to override css
              // ID the Hand button
              newObj = $(this).find("[title='Stop drawing']");
              newObj.attr('class', 'btnStop');
              // ID the Rectangle Button
              newObj = $(this).find("[title='Draw a rectangle']");
              newObj.attr('id', 'btnRectangle');
          });


      }

      var showRectDrawingMode = function() {
         self.drawingOptions = {position: 'TOP_CENTER',drawingModes:["rectangle"]};
      }

      var hideRectDrawingMode = function() {
        self.drawingOptions = {position: 'TOP_CENTER',drawingModes:[]};
      }

      self.onMapOverlayCompleted = function(e){
        hideRectDrawingMode();
        self.assetsFences.push({assetId: self.selectedAsset, assetFence: e.overlay});

        if(self.drawingMessagesTimeout) {
            $timeout.cancel(self.drawingMessagesTimeout);
        }

        self.drawingMessages = "Do not forget to save your geofence before selecting another vehicle."
        self.drawingMessagesTimeout = $timeout(function () { self.drawingMessages = null }, 5000); 
      };

      self.focusVehicle = function() {
        if(self.selectedAsset) {
          self.mapcenter = self.assets[self.selectedAsset].latestMarker.position
        }
      }

      self.drawingMessages = null;
      self.drawingMessagesTimeout = null;

      self.focusGeofence = function() {
         var fenceOverlay =  _.findWhere(self.assetsFences, {"assetId": self.selectedAsset});
         if(fenceOverlay) {
            self.mapcenter = fenceOverlay.assetFence.getBounds().getCenter()
         } else {
            if(self.drawingMessagesTimeout) {
                $timeout.cancel(self.drawingMessagesTimeout);
            }
           self.drawingMessages = "No geofence has been defined yet for selected vehicle."
           self.drawingMessagesTimeout = $timeout(function () { self.drawingMessages = null }, 5000);  
         }
      }

      self.removeGeofence = function() {
        var fenceOverlay =  _.findWhere(self.assetsFences, {"assetId": self.selectedAsset});
        //substract fence
        if(fenceOverlay) {
          self.assetsFences = _.without(self.assetsFences, fenceOverlay);
          $scope.invoke("telematics/api/removeVehicleGeofence", {
               "vehicleId": self.selectedAsset,
            }, "main-removegeofence_"+self.selectedAsset);
            fenceOverlay.assetFence.setMap(null);
        }
        showRectDrawingMode();
      };

      self.hideAllGeofences = function() {
        _.every(self.assetsFences, function(fenceOverlay) {
            fenceOverlay.assetFence.setMap(null);
            return true;
        });
      };

      self.saveGeofence = function() {
         var fenceOverlay =  _.findWhere(self.assetsFences, {"assetId": self.selectedAsset});
        if(fenceOverlay) {
           $scope.invoke("telematics/api/saveVehicleGeofence", {
               "vehicleId": self.selectedAsset,
               "bounds": JSON.stringify(fenceOverlay.assetFence.getBounds())
            }, "main-savegeofence_"+self.selectedAsset);
        } else {

        }
      }
	
   }
});
