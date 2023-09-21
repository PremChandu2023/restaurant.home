
export const AuthExamples = {
    loginsuccess : {
        description : 'Verify the employee and returns a Jwt token',
        value : {
            succes : true,
            jwtToken : 'sdjhvshvjdvnjdvnjvkjsvvhjvvjjjeiljejnebjq_hdhg_jwhd-dbb',
            jwtreferenceToken: 'uqwuhguhkhfukeyuheuhuhe-2jbdbbb',
        }
    },
    registerSuccess : {
        description : 'register the user and returns it',
        value : {
            "succes": true,
            "data": {
              "employee_Id": "A25",
              "employee_Name": "Prem",
              "status": "Active",
              "email": "chandu3a3@gmail.com",
              "phoneNumber": "855456145",
              "role": "waiter",
              "roles": {
                "id": 3,
                "name": "waiter",
                "description": "Have permissions to place order for an employee"
              },
              "id": 2
            }
        },    
    },
    duplicateEmail : {
        description : "Occurs when given email is invalid",
         value :{
            "message": "Given email is already registered give new email"
        }
    },
    duplicateIdError : {
        description : "Occurs when given Id is invalid",
         value :{
            "message": [
              "employee_Id should not be empty",
              "employee_Id must be a string",
            ],
            "error": "Bad Request",
            "statusCode": 400
          }
        },
        phoneNumberError :  {
            description : "Occurs when given phone number is invalid",
             value :{
                "message": [
                  "phoneNumber must be a number string"
                ],
                "error": "Bad Request",
                "statusCode": 400
              }
            },
            RoleNameError: {
                description : "Occurs when given phone number is invalid",
                 value :{
                    "message": [
                      "role must be one of the following values: manager, admin, waiter, chef, customer"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                  }
                },
    MenuById :{
        description : "Gives the menu details",
         value :{
            "succes": true,
            "data": {
              "id": 2,
              "employee_Id": "A25",
              "employee_Name": "Prem",
              "status": "Active",
              "email": "chandu3a3@gmail.com",
              "phoneNumber": "855456145",
              "roles": {
                "id": 3,
                "name": "waiter",
                "description": "Have permissions to place order for an employee"
              }
            }
          }
    }, MenuBadRequest : {
        description : "Occurs when given Id is invalid",
         value :{
            "message": "Given_id_is_not_found"
        }
    },
    Referencetokensuccess : {
      description : "Gives the new jwt token",
       value :{
        "succes": true,
        "data": {
            "JwtToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY5MzQ4MDY0MSwiZXhwIjoxNjkzNTY3MDQxfQ.XXMe_3_ZGju4t72YYXWrXErPsoovmp4ZP-rH1MwKhFaxRfUWApksfjL0BW4RUx_6MoMJLwz53_7msdGzP4pbRw"
        }
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