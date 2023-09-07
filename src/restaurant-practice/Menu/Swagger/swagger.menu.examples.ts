export const menuExamples = {
    MenuById :{
        description : "Gives the menu details",
         value :{
            "succes": true,
            "data": {
                "menuitem_id": 2,
                "menu_itemname": "manchuria",
                "price": 10,
                "tax": 5,
            }
        }
    },
    allMenu :{
        description : "Gives the menu details",
         value :{
            "succes": true,
            "data": {
                "menuitem_id": 2,
                "menu_itemname": "manchuria",
                "price": 10,
                "tax": 5,
            }
        }
    },
    MenuIdNotFound : {
        description : "Occurs when given Id is invalid",
         value :{
            "statusCode": 404,
            "error": {
              "message": "Given_orderid_is_invalid"
            },
            "timeStamp": "2023-09-04T10:44:40.302Z",
            "path": "/order/20000"
          }
    },
    addMenu : {
        description : 'Creates a new Menu',
        value : {
            "succes": true,
            "data": {
                "menu_Type": "Icecream",
                "menu_id": 7
            }
        }
    },
    addMenuItem : {
        description : "Creates a new MenuItem",
        value :{
            "succes": true,
            "data": {
                "menu_itemname": "Pancakes",
                "price": 20,
                "menus": {
                    "menu_id": 1,
                    "menu_name": "lunch",
                    "date": {
                        "createdDate": "2023-08-17T08:58:58.467Z",
                        "updatedDate": "2023-08-17T08:58:58.467Z"
                    }
                },
                "menuitem_id": 17,
                "tax": 5,
                "date": {
                    "createdDate": "2023-08-25T11:20:06.064Z",
                    "updatedDate": "2023-08-25T11:20:06.064Z"
                }
            }
        }
    },
    InvalidIdNotFound: {
        description : "Occurs when Menuid is not found",
        value : {
            "message": "Given_id_is_not_found"
        }
    },
    getbyName : {
        description : "Sorts the values by given ItemName",
        value : {
            "succes": true,
            "data": [
                {
                    "menuitem_id": 3,
                    "menu_itemname": "chickenbiryani",
                    "price": 20,
                    "tax": 5
                },
                {
                    "menuitem_id": 4,
                    "menu_itemname": "chickenfriedrice",
                    "price": 20,
                    "tax": 5
                },
                {
                    "menuitem_id": 5,
                    "menu_itemname": "chickenmanchuria",
                    "price": 20,
                    "tax": 5
                }
            ]
        }
    },
    getByCategory:{
        description : "Sorts the values by given Category",
        value : {
            "succes": true,
            "data": [
                {
                    "menuitem_id": 3,
                    "menu_itemname": "chickenbiryani",
                    "price": 20,
                    "tax": 5
                },
                {
                    "menuitem_id": 4,
                    "menu_itemname": "chickenfriedrice",
                    "price": 20,
                    "tax": 5
                },
                {
                    "menuitem_id": 5,
                    "menu_itemname": "chickenmanchuria",
                    "price": 20,
                    "tax": 5
                }
            ]
        }
    }
}