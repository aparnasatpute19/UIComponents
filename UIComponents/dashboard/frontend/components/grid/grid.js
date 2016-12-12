agGrid.initialiseAgGridWithAngular1(angular);
angular.module('Grid', ['agGrid']);

angular
  .module("Grid")
  .component('scriptrGrid',
  {
    bindings : {
      
      "onLoad": "&onLoad",
      
      "columnsDefinition" : "<columnsDefinition",
      
      "enableServerSideSorting" : "<?", // Note that Client side sorting & filtering does not make sense in virtual paging and is just not supported, only Server side sorting & filtering is supported
      
      "enableServerSideFilter" : "<?",
      
      "enableColResize" : "<?",
      
      "cellEditable" : "<?",
      
      "enableSorting": "<?", // client-side sorting
      
      "serviceApi" : "@", // restApi 
      
      "onCellValueChangedScript" : "@", // script to  be called after editing a cell
      
      "providerOption" : "@", //"http" or "webSocketCall" or "publish"
      
      "enableClientFilter" : "<?",
      
      "rowModelType": "@", // rowModelType can be set to "pagination" or "virtual" (infinite scrolling)
      
      "rowModelSelection": "@", //"multiple" or "single"
      
      "rowDeselection": "<?",
      
      /** pagination properties **/
      "paginationPageSize": "<?", // In virtual paging context means how big each page in our page cache will be, default is 100
      
      /** virtual paging properties **/
      "paginationOverflowSize": "<?", // how many extra blank rows to display to the user at the end of the dataset, which sets the vertical scroll and then allows the grid to request viewing more rows of data. default is 1, ie show 1 row.
      
       /** virtual paging properties **/
      "maxConcurrentDatasourceRequests": "<?", // how many server side requests to send at a time. if user is scrolling lots, then the requests are throttled down 
       
      /** virtual paging properties **/
      "paginationInitialRowCount" : "<?",// how many rows to initially show in the grid. having 1 shows a blank row, so it looks like the grid is loading from the users perspective (as we have a spinner in the first col)
      
       /** virtual paging properties **/
      "maxPagesInCache" : "<?", // how many pages to store in cache. default is undefined, which allows an infinite sized cache, pages are never purged. this should be set for large data to stop your browser from getting full of data
    },
    
    templateUrl : '/UIComponents/dashboard/frontend/components/grid/grid.html',
    controller : function($scope, $window, dataService) {
      
      var self = this;
      
      if(!this.enableClientFilter){
        this.hideClientFilter = "true";
      }
      if(!this.enableServerSideFilter){
        this.hideServerFilter = "true";
      }
      
      this.dataSource = {
        getRows : function(params) {
          var APIParams = self.buildParams(params)
            var dataResponse = dataService.getGridData(self.serviceApi, APIParams, self.providerOption).then(
            function(data, response) {
              if (data && data.documents) {
                var rowsData = data.documents;
                var count = parseInt(data.count);
                params.successCallback(rowsData, count);
                self.gridOptions.api.sizeColumnsToFit();
              } else {
                params.failCallback();
              }
            }, function(err) {
              console.log("reject", err);
            });
        }
      }
      
      for(var i = 0; i < this.columnsDefinition.length; i++){
        if(this.columnsDefinition[i].hasOwnProperty("type")){
          this.columnsDefinition[i].filter = "number";
        }
      }
     
      
      this.$onInit = function() {
        this.gridOptions = {
          enableSorting: (typeof this.enableSorting != 'undefined')? this.enableSorting : true,
          enableServerSideSorting : (typeof this.enableServerSideSorting != 'undefined')? this.enableServerSideSorting : true,
          enableServerSideFilter : (typeof this.enableServerSideFilter != 'undefined') ? this.enableServerSideFilter : true,
          enableColResize : (typeof this.enableColResize != 'undefined') ? this.enableColResize : false,
          enableFilter : (typeof this.enableFilter != 'undefined') ? this.enableFilter : true,
          columnDefs : this.columnsDefinition,
          rowModelType :(this.rowModelType)? this.rowModelType : "pagination",
          rowSelection : (this.rowModelSelection) ? this.rowModelSelection : "multiple",
          paginationPageSize : (this.paginationPageSize) ? this.paginationPageSize : 50,
          overlayLoadingTemplate: '<span class="ag-overlay-loading-center"><i class="fa fa-spinner fa-spin fa-fw fa-2x"></i> Please wait while your rows are loading</span>',

          defaultColDef : {
            filterParams : {
              apply : true
            },
            editable : (typeof this.cellEditable != 'undefined')? this.cellEditable : true,
          },
          onCellValueChanged : function(event) {
             self._saveData(self.onCellValueChangedScript, event.data);
          },
          onGridReady : function(event) {
            console.log('the grid is now ready');
            // set "Contains" in the column drop down filter to "StartWith" as it is not supported in our document query 
            event.api.filterManager.availableFilters.text.CONTAINS = "startsWith";
            self._createNewDatasource();
          },
          
        };
        
       angular.element($window).bind('resize', function () {
         self.gridOptions.api.sizeColumnsToFit();
       });
      }
      
      this._saveData = function(onCellValueChangedScript, event){
        dataService.saveGridData(onCellValueChangedScript, event);
      }

      // Get data from backend
      this._createNewDatasource = function() {
        this.gridOptions.api.setDatasource(this.dataSource);
      }
      
      // add a specific row upon WebSocket call
      function addItemsWebSocketCall(rowData) {
        this.gridOptions.api.addItems(rowData);
      }
      // remove a specific row upon WebSocket call
      function onRemoveRowWebSocketCall(key) {
        this.gridOptions.api.forEachNode(function(node) {
          if (node.data.key == key) {
            var index = node.id;
            var model = this.gridOptions.api.getModel();
            var node = [ model.getRow(index) ];
            this.gridOptions.api.removeItems(node);
          }
        })
      }
      this.onFilterChanged = function() {
        this.gridOptions.enableServerSideFilter = false;
        this.gridOptions.api.setQuickFilter(this.quickFilterValue);
        this.gridOptions.enableServerSideFilter = true;
      }
      
      this.buildParams = function(params) {
        var queryFilter = this.gridOptions.quickFilterText;
        var columnName = null;
        var type = null;
        var pageNumber = params.endRow / this.gridOptions.paginationPageSize;
        if (params.sortModel && params.sortModel.length > 0) {
          var sort = params.sortModel[0].sort;
          var sortingColumnName = params.sortModel[0].colId;
          type = (this.gridOptions.api.getColumnDef(sortingColumnName).type) ? this.gridOptions.api.getColumnDef(sortingColumnName).type : null;
        }
        if (params.filterModel) {
          for (p in params.filterModel) {
            queryFilter = params.filterModel[p].filter;
            var queryType = params.filterModel[p].type;
            var filterColumnName = p;
            type = (this.gridOptions.api
                    .getColumnDef(filterColumnName).type) ? this.gridOptions.api
              .getColumnDef(filterColumnName).type
            : null;
          }
        }
        var APIParams = {
          "resultsPerPage" : this.gridOptions.paginationPageSize,
          "pageNumber" : pageNumber
        }
        if (sortingColumnName) {
          APIParams["sortingColumnName"] = sortingColumnName;
        }
        if (filterColumnName) {
          APIParams["filterColumnName"] = filterColumnName;
        }
        if (sort) {
          APIParams["sort"] = sort;
        }
        if (type) {
          APIParams["sortType"] = type;
        }
        if (queryFilter) {
          APIParams["queryFilter"] = queryFilter;
        }
        if (queryType) {
          APIParams["queryType"] = queryType;
        }
        return APIParams;
      }
    }
  });

angular
  .module('Grid')
  .service("dataService", function(httpClient, wsClient, $q) {
  
    this.saveGridData = function(api, params){
      var d = $q.defer(); 
      httpClient
        .get(api, params).then(function(data, response){
        var data = {"result": data}
        d.resolve(data, response)
      }, function(err) {
        d.reject(err)
      });
      return d.promise;
    }
  
    this.getGridData = function(api, params, provider, callback) {
      var d = $q.defer(); 
      if(provider == "http"){
        httpClient
          .get(api, params).then(function(data, response){
            if(data && data.documents){
              var data = {"documents": data.documents, "count": data.count}
              d.resolve(data, response)
            }else{
              d.resolve(null, response)
            }
        }, function(err) {
          d.reject(err)
        });
        return d.promise;
      }
      
     if(provider == "webSocketCall"){
        wsClient.onReady.then(function() {
          wsClient
            .call(api, params, "call").then(function(data, response) {
              if(data && data.documents){
                var data = {"documents": data.documents, "count": data.count}
                d.resolve(data, response)
              }else{
                  d.resolve(null, response)
              }
            }, function(err) {
              d.reject(err)
            }
          ); 
        }); 
        return d.promise;
      }
      
     if(provider == "publish"){
      wsClient.onReady.then(function() {
        wsClient.publish({"data":"www ss"}, "publish").then(function(data, response) {
          if(data && data.documents){
            var data = {"documents": data.documents, "count": data.count}
            d.resolve(data, response)
          }else{
            d.resolve(null, response)
          }
        }, function(err) {
            d.reject(err)
          }
        );
      }); 
      return d.promise;
     }
    }
});