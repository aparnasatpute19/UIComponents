angular
    .module('DashboardBuilder')
    .constant(
    "dashboardConfig",
    (function() {
        return    {
            "script": {
                "form" : [ {
                    "key" : "scriptName",
                    "notitle" : true,
                    "placeholder" : "Script name"
                } ],
                "schema" : {
                    "type" : "object",
                    "title" : "Schema",
                    "properties" : {
                        "scriptName" : {
                            "type" : "string",
                            "fieldHtmlClass" : "script-name-input"
                        }
                    },
                    "required" : [ "scriptName" ]
                }
            },
            "settings" :  {
                "label": "Dashboard Configuration",
                "defaults": {
                    "publishChannel": "requestChannel",
                    "subscribeChannel": "responseChannel",
                    "theme": "light"
                },
                "form": [{
                    type: "tabs",
                    selectedTabIndex: 0,
                    tabs: [
                        {
                            title: "Channels",
                            items: [
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [
                                        {
                                            "type" : "help",
                                            "helpvalue" : "<h5 class='pdr10 pdl10'>Set the communication channels used by the dashboard to send and receive data.</h5><hr/>"
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-xs-12",
                                            "items": ["publishChannel", "subscribeChannel"]
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            title: "Theme",
                            items: [
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [
                                        {
                                            "type": "section",
                                            "htmlClass": "col-xs-12",
                                            "items": [
                                                {
                                                    "key" : "theme",
                                                    "type" : 'strapselect',
                                                    "placeholder" : " ",
                                                    "titleMap" : [{
                                                        "value" : "light",
                                                        "name" : "Light"
                                                    },
                                                                  {
                                                                      "value" : "dark",
                                                                      "name" : "Dark"
                                                                  }]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "fieldset",
                                            "htmlClass": "col-xs-12",
                                            "title": "Dahsboard",
                                            "key": "style.box",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.dashboard.background-type",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "solid",
                                                                    "name": "Solid"
                                                                }, {
                                                                    "value": "gradient",
                                                                    "name": "Gradient"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-2",
                                                                  "condition": "model.style['dashboard'] ['background-type'] === 'solid'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.background-color",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-9",
                                                                  "condition": "model.style ['dashboard'] ['background-type'] === 'gradient'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.background-gradient",
                                                                      }
                                                                  ]
                                                              },]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.dashboard.border",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "true",
                                                                    "name": "True"
                                                                }, {
                                                                    "value": "false",
                                                                    "name": "False"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.border-radius",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              }, {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.border-style",
                                                                          "condition": "model.style ['dashboard'] ['border'] === 'true'",
                                                                          "type": "strapselect",
                                                                          "titleMap": [{
                                                                              "value": "dotted",
                                                                              "name": "Dotted"
                                                                          },
                                                                                       {
                                                                                           "value": "dashed",
                                                                                           "name": "Dashed"
                                                                                       },
                                                                                       {
                                                                                           "value": "solid",
                                                                                           "name": "Solid"
                                                                                       },
                                                                                       {
                                                                                           "value": "double",
                                                                                           "name": "Double"
                                                                                       },
                                                                                       {
                                                                                           "value": "inset",
                                                                                           "name": "Inset"
                                                                                       },
                                                                                       {
                                                                                           "value": "outset",
                                                                                           "name": "Outset"
                                                                                       }]
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.border-color",
                                                                          "condition": "model.style ['dashboard'] ['border'] === 'true'",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.dashboard.border-width",
                                                                          "condition": "model.style ['dashboard'] ['border'] === 'true'",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              }
                                                             ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.dashboard.box-shadow",
                                                                    "type": "strapselect",
                                                                    "titleMap": [{
                                                                        "value": "true",
                                                                        "name": "True"
                                                                    }, {
                                                                        "value": "false",
                                                                        "name": "False"
                                                                    }]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-6 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.dashboard.box-shadow-color",
                                                                    "colorFormat": "hex3",
                                                                    "spectrumOptions": {
                                                                        showInput: true,
                                                                        showAlpha: true,
                                                                        allowEmpty: true,
                                                                        showPalette: true,
                                                                        preferredFormat: 'hex3',
                                                                        palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                  ['#000']]
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "fieldset",
                                            "htmlClass": "col-xs-12",
                                            "title": "Outer Box",
                                            "key": "style.box",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.box.background-type",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "solid",
                                                                    "name": "Solid"
                                                                }, {
                                                                    "value": "gradient",
                                                                    "name": "Gradient"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-2",
                                                                  "condition": "model.style['box'] ['background-type'] === 'solid'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.background-color",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-9",
                                                                  "condition": "model.style ['box'] ['background-type'] === 'gradient'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.background-gradient",
                                                                      }
                                                                  ]
                                                              },]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.box.border",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "true",
                                                                    "name": "True"
                                                                }, {
                                                                    "value": "false",
                                                                    "name": "False"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.border-radius",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              }, {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.border-style",
                                                                          "condition": "model.style ['box'] ['border'] === 'true'",
                                                                          "type": "strapselect",
                                                                          "titleMap": [{
                                                                              "value": "dotted",
                                                                              "name": "Dotted"
                                                                          },
                                                                                       {
                                                                                           "value": "dashed",
                                                                                           "name": "Dashed"
                                                                                       },
                                                                                       {
                                                                                           "value": "solid",
                                                                                           "name": "Solid"
                                                                                       },
                                                                                       {
                                                                                           "value": "double",
                                                                                           "name": "Double"
                                                                                       },
                                                                                       {
                                                                                           "value": "inset",
                                                                                           "name": "Inset"
                                                                                       },
                                                                                       {
                                                                                           "value": "outset",
                                                                                           "name": "Outset"
                                                                                       }]
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.border-color",
                                                                          "condition": "model.style ['box'] ['border'] === 'true'",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box.border-width",
                                                                          "condition": "model.style ['box'] ['border'] === 'true'",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              }
                                                             ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [ 
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box.box-shadow",
                                                                    "type": "strapselect",
                                                                    "titleMap": [{
                                                                        "value": "true",
                                                                        "name": "True"
                                                                    }, {
                                                                        "value": "false",
                                                                        "name": "False"
                                                                    }]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-9 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box.box-shadow-color",
                                                                    "colorFormat": "hex3",
                                                                    "spectrumOptions": {
                                                                        showInput: true,
                                                                        showAlpha: true,
                                                                        allowEmpty: true,
                                                                        showPalette: true,
                                                                        preferredFormat: 'hex3',
                                                                        palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                  ['#000']]
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "fieldset",
                                            "htmlClass": "col-xs-12",
                                            "title": "Inner Box",
                                            "key": "style.box-content",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.box-content.background-type",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "solid",
                                                                    "name": "Solid"
                                                                }, {
                                                                    "value": "gradient",
                                                                    "name": "Gradient"
                                                                }, {
                                                                    "value": "transparent",
                                                                    "name": "Transparent"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-2",
                                                                  "condition": "model.style ['box-content'] ['background-type'] === 'solid'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-content.background-color",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-9",
                                                                  "condition": "model.style ['box-content'] ['background-type'] === 'gradient'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-content.background-gradient",
                                                                      }
                                                                  ]
                                                              }]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box-content.border",
                                                                    "type": "strapselect",
                                                                    "titleMap": [{
                                                                        "value": "true",
                                                                        "name": "True"
                                                                    }, {
                                                                        "value": "false",
                                                                        "name": "False"
                                                                    }]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box-content.border-radius",
                                                                    "type": "number"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box-content.border-style",
                                                                    "type": "strapselect",
                                                                    "condition": "model.style['box-content'] ['border'] === 'true'",
                                                                    "titleMap": [{
                                                                        "value": "dotted",
                                                                        "name": "Dotted"
                                                                    },
                                                                                 {
                                                                                     "value": "dashed",
                                                                                     "name": "Dashed"
                                                                                 },
                                                                                 {
                                                                                     "value": "solid",
                                                                                     "name": "Solid"
                                                                                 },
                                                                                 {
                                                                                     "value": "double",
                                                                                     "name": "Double"
                                                                                 },
                                                                                 {
                                                                                     "value": "inset",
                                                                                     "name": "Inset"
                                                                                 },
                                                                                 {
                                                                                     "value": "outset",
                                                                                     "name": "Outset"
                                                                                 }]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box-content.border-color",
                                                                    "condition": "model.style ['box-content'] ['border'] === 'true'",
                                                                    "colorFormat": "hex3",
                                                                    "spectrumOptions": {
                                                                        showInput: true,
                                                                        showAlpha: true,
                                                                        allowEmpty: true,
                                                                        showPalette: true,
                                                                        preferredFormat: 'hex3',
                                                                        palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                  ['#000']]
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-2 col-sm-2",
                                                            "items": [
                                                                {
                                                                    "key": "style.box-content.border-width",
                                                                    "condition": "model.style['box-content'] ['border'] === 'true'",
                                                                    "type": "number"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "fieldset",
                                            "htmlClass": "col-xs-12",
                                            "title": "Box Header",
                                            "key": "style.box-header",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.box-header.background-type",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "solid",
                                                                    "name": "Solid"
                                                                }, {
                                                                    "value": "gradient",
                                                                    "name": "Gradient"
                                                                }, {
                                                                    "value": "transparent",
                                                                    "name": "Transparent"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-2",
                                                                  "condition": "model.style ['box-header'] ['background-type'] === 'solid'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-header.background-color",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-9 col-sm-9",
                                                                  "condition": "model.style ['box-header'] ['background-type'] === 'gradient'",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-header.background-gradient",
                                                                      }
                                                                  ]
                                                              }]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "row",
                                                    "items": [{
                                                        "type": "section",
                                                        "htmlClass": "col-xs-2 col-sm-2",
                                                        "items": [
                                                            {
                                                                "key": "style.box-header.border",
                                                                "type": "strapselect",
                                                                "titleMap": [{
                                                                    "value": "true",
                                                                    "name": "True"
                                                                }, {
                                                                    "value": "false",
                                                                    "name": "False"
                                                                }]
                                                            }
                                                        ]
                                                    },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-header.border-radius",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-header.border-style",
                                                                          "condition": "model.style ['box-header'] ['border'] === 'true'",
                                                                          "type": "strapselect",
                                                                          "titleMap": [{
                                                                              "value": "dotted",
                                                                              "name": "Dotted"
                                                                          },
                                                                                       {
                                                                                           "value": "dashed",
                                                                                           "name": "Dashed"
                                                                                       },
                                                                                       {
                                                                                           "value": "solid",
                                                                                           "name": "Solid"
                                                                                       },
                                                                                       {
                                                                                           "value": "double",
                                                                                           "name": "Double"
                                                                                       },
                                                                                       {
                                                                                           "value": "inset",
                                                                                           "name": "Inset"
                                                                                       },
                                                                                       {
                                                                                           "value": "outset",
                                                                                           "name": "Outset"
                                                                                       }]
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "key": "style.box-header.border-color",
                                                                          "condition": "model.style ['box-header'] ['border'] === 'true'",
                                                                          "colorFormat": "hex3",
                                                                          "spectrumOptions": {
                                                                              showInput: true,
                                                                              showAlpha: true,
                                                                              allowEmpty: true,
                                                                              showPalette: true,
                                                                              preferredFormat: 'hex3',
                                                                              palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                                        ['#000']]
                                                                          }
                                                                      }
                                                                  ]
                                                              },
                                                              {
                                                                  "type": "section",
                                                                  "htmlClass": "col-xs-2 col-sm-2",
                                                                  "items": [
                                                                      {
                                                                          "condition": "model.style ['box-header'] ['border'] === 'true'",
                                                                          "key": "style.box-header.border-width",
                                                                          "type": "number"
                                                                      }
                                                                  ]
                                                              },
                                                             ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "fieldset",
                                            "htmlClass": "col-xs-12",
                                            "title": "Header Label",
                                            "key": "style.box-label",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-xs-6 col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "style.box-label.font-weight",
                                                            "type": "strapselect",
                                                            "titleMap": [{
                                                                "value": "normal",
                                                                "name": "Normal"
                                                            }, {
                                                                "value": "bold",
                                                                "name": "Bold"
                                                            }]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-xs-6 col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "style.box-label.text-align",
                                                            "type": "strapselect",
                                                            "titleMap": [{
                                                                "value": "left",
                                                                "name": "Left"
                                                            }, {
                                                                "value": "center",
                                                                "name": "Center"
                                                            }, {
                                                                "value": "right",
                                                                "name": "Right"
                                                            }]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-xs-6 col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "style.box-label.font-size",
                                                            "type": "number"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-xs-6 col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "style.box-label.display",
                                                            "type": "strapselect",
                                                            "titleMap": [{
                                                                "value": "block",
                                                                "name": "Block"
                                                            }, {
                                                                "value": "none",
                                                                "name": "None"
                                                            }]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-xs-6 col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "style.box-label.color",
                                                            "colorFormat": "hex3",
                                                            showInput: true,
                                                            showAlpha: true,
                                                            allowEmpty: true,
                                                            showPalette: true,
                                                            preferredFormat: 'hex3',
                                                            palette: [['#ff', '##f2f2f2', '#2c343a'],
                                                                      ['#000']]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }],
                "schema": {
                    "type": "object",
                    "title": "Schema",
                    "properties": {
                        "publishChannel": {
                            "title": "Publish channel",
                            "type": "string",
                            "description": "Widgets use the publish channel to publish messages that will be distributed to its subscribers."
                        },
                        "subscribeChannel": {
                            "title": "Subscribe channel",
                            "type": "string",
                            "description": "Widgets use the subscribe channel to consume the messages published over that channel as a data source."
                        },
                        "theme" : {
                            "title" : "Theme",
                            "type" : "string",
                            "description" : "Select a dashboard theme. By default, light theme is applied.",
                            "default" : "light",
                        },
                        // style
                        "style": {
                            "title": "Style",
                            "type": "object",
                            "properties": {
                                //".box"
                                "dashboard": {
                                    "title": "Dashboard",
                                    "type": "object",
                                    "properties": {
                                        "background-type": {
                                            "title": "Background Type",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "background-color": {
                                            "title": "Background Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#FFF",
                                            "validationMessage": "Invalid Color",
                                        },
                                        "background-gradient": {
                                            "title": "Background Gradient",
                                            "type": "string",
                                            "default": "linear-gradient(45deg, rgba(255,255,255,1) 49%, rgba(192,192,192,1) 100%, rgba(128,128,128,1) 100%);",
                                        },
                                        "border": {
                                            "title": "Show Border",
                                            "type": "string",
                                            "default": "false",
                                        },
                                        "border-color": {
                                            "title": "Border Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#DDD",
                                        },
                                        "border-style": {
                                            "title": "Border Style",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "border-width": {
                                            "title": "Border width",
                                            "type": "number",
                                            "default": 1,
                                        },
                                        "border-radius": {
                                            "title": "Border Radius",
                                            "type": "number",
                                            "default": 0,
                                        },
                                        "box-shadow": {
                                            "title": "Show Box Shadow",
                                            "type": "string",
                                            "default": "true",
                                        },
                                        "box-shadow-color": {
                                            "title": "Box shadow color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "rgba(51, 51, 51, 0.3)",
                                        },
                                    }
                                },
                                "box": {
                                    "title": "Box",
                                    "type": "object",
                                    "properties": {
                                        "background-type": {
                                            "title": "Background Type",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "background-color": {
                                            "title": "Background Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#FFF",
                                            "validationMessage": "Invalid Color",
                                        },
                                        "background-gradient": {
                                            "title": "Background Gradient",
                                            "type": "string",
                                            "default": "linear-gradient(45deg, rgba(255,255,255,1) 49%, rgba(192,192,192,1) 100%, rgba(128,128,128,1) 100%);",
                                        },
                                        "border": {
                                            "title": "Show Border",
                                            "type": "string",
                                            "default": "false",
                                        },
                                        "border-color": {
                                            "title": "Border Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#DDD",
                                        },
                                        "border-style": {
                                            "title": "Border Style",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "border-width": {
                                            "title": "Border width",
                                            "type": "number",
                                            "default": 1,
                                        },
                                        "border-radius": {
                                            "title": "Border Radius",
                                            "type": "number",
                                            "default": 0,
                                        },
                                        "box-shadow": {
                                            "title": "Show Box Shadow",
                                            "type": "string",
                                            "default": "true",
                                        },
                                        "box-shadow-color": {
                                            "title": "Box shadow color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "rgba(51, 51, 51, 0.3)",
                                        },
                                    }
                                },
                                "box-header": {
                                    "title": "Box",
                                    "type": "object",
                                    "properties": {
                                        "background-type": {
                                            "title": "Background Type",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "background-color": {
                                            "title": "Background Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#FFF",
                                            "validationMessage": "Invalid Color",
                                        },
                                        "background-gradient": {
                                            "title": "Background Gradient",
                                            "type": "string",
                                            "default": "linear-gradient(45deg, rgba(255,255,255,1) 49%, rgba(192,192,192,1) 100%, rgba(128,128,128,1) 100%);",
                                        },
                                        "border": {
                                            "title": "Show Border",
                                            "type": "string",
                                            "default": "false",
                                        },
                                        "border-color": {
                                            "title": "Border Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#DDD",
                                        },
                                        "border-style": {
                                            "title": "Border Style",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "border-width": {
                                            "title": "Border width",
                                            "type": "number",
                                            "default": 1,
                                        },
                                        "border-radius": {
                                            "title": "Border Radius",
                                            "type": "number",
                                            "default": 0,
                                        },
                                    }
                                },
                                "box-content": {
                                    "title": "Box",
                                    "type": "object",
                                    "properties": {
                                        "background-type": {
                                            "title": "Background Type",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "background-color": {
                                            "title": "Background Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#FFF",
                                            "validationMessage": "Invalid Color",
                                        },
                                        "background-gradient": {
                                            "title": "Background Gradient",
                                            "type": "string",
                                            "default": "linear-gradient(45deg, rgba(255,255,255,1) 49%, rgba(192,192,192,1) 100%, rgba(128,128,128,1) 100%);",
                                        },
                                        "border": {
                                            "title": "Show Border",
                                            "type": "string",
                                            "default": "false",
                                        },
                                        "border-color": {
                                            "title": "Border Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#DDD",
                                        },
                                        "border-style": {
                                            "title": "Border Style",
                                            "type": "string",
                                            "default": "solid",
                                        },
                                        "border-width": {
                                            "title": "Border width (px)",
                                            "type": "number",
                                            "default": 1,
                                        },
                                        "border-radius": {
                                            "title": "Border Radius (px)",
                                            "type": "number",
                                            "default": 0,
                                        },
                                    }
                                },
                                "box-label": {
                                    "title": "Box",
                                    "type": "object",
                                    "properties": {
                                        "font-weight": {
                                            "title": "Font weight",
                                            "type": "string",
                                            "default": "normal",
                                        },
                                        "font-size": {
                                            "title": "Font size (px)",
                                            "type": "number",
                                            "default": 1.2,
                                        },
                                        "text-align": {
                                            "title": "Text Align",
                                            "type": "string",
                                            "default": "center",
                                        },
                                        "display": {
                                            "title": "Display",
                                            "type": "string",
                                            "default": "block",
                                        },
                                        "color": {
                                            "title": "Color",
                                            "type": "string",
                                            "format": "color",
                                            "default": "#000",
                                            "validationMessage": "Invalid Color",
                                        }
                                    }
                                },
                            }
                        }
                    },//end style
                    "required": ["token", "baseUrl", "publishChannel",
                                 "subscribeChannel"]
                }
            },
        }
    }
    )());