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
                "date": {
                    "createdDate": "2023-08-17T08:31:36.802Z",
                    "updatedDate": "2023-08-24T04:40:27.390Z"
                }
            }
        }
    },
    MenuBadRequest : {
        description : "Occurs when given Id is invalid",
         value :{
            "message": "Given_id_is_not_found"
        }
    },
    addMenuItem : {
        description : "Creates a new Menu",
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
            success : true,
            data : {
                
            }
        }
    },
    getByCategory:{
        description : "Sorts the values by given Category",
        value : {
            success : true,
            data : {
                
            }
        }
    }
}