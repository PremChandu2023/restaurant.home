
export const AuthExamples = {
    loginsucces : {
        description : 'Verify the employee and returns a Jwt token',
        value : {
            succes : true,
            jwtToken : 'sdjhvshvjdvnjdvnjvkjsvvhjvvjjjeiljejnebjq'
        }
    },
    duplicateEmail : {
        description : "Occurs when given Id is invalid",
         value :{
            "message": "Given email is already registered give new email"
        }
    },
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
    }, MenuBadRequest : {
        description : "Occurs when given Id is invalid",
         value :{
            "message": "Given_id_is_not_found"
        }
    },
    
    RoleGetSuccess : {
        description : "Gives the role deatils that have been posted",
         value :{
            "succes": true,
            "data": {
                "name": "Customer",
                "description": "customer has permission to order",
                "id": 5,
            }
        }
    },
    RoleConflict : {
        description : "Same Role posted again",
         value :{
            error: "Conflict Error",
            message : "Given_role_is_already_present ",
         }
    },
    RolePutSuccess:  {
        description : "Role is updated with given name in database",
         value : {
    "succes": true,
    "data": {
        "id": 1,
        "employee_Id": "A1",
        "employee_Name": "prem",
        "status": "Active",
        "email": "prem3a3",
        "phoneNumber": 8367,
        "date": {
            "createdDate": "2023-08-22T05:30:40.783Z",
            "updatedDate": "2023-08-22T09:38:24.000Z"
        },
        "roles": {
            "id": 1,
            "name": "Manager",
        }
    }
}
    },
    RolePutBadREquest : {
    description : "Role is updated with given name in database",
    value :{
        message : 'Id not found to update the role'
    }
}
}