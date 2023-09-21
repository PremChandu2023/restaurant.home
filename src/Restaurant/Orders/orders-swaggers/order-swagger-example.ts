
export const OrderExamples = {
    Order : {
    description : "Gives the order details",
     value :{
        "succes": true,
        "data": {
            "customerName": "Nagendra",
            "tableNumber": 21,
            "order_id": 7,
            "paymentStatus": "pending"
        }
    }
},
TableNUmberNull : {
    description : "Given Table is not entered",
     value : 
     {
       "message": [
         "items.0.tablename cannot be null",
         "items.0.tablename must be a number conforming to the specified constraints"
       ],
       "error": "Bad Request",
       "statusCode": 400
     }
},
OrderById : {
    description : "Gives the order details",
    value : {
        "succes": true,
        "data": {
        "order_id": 11,
        "customerName": "ramanjenulu",
        "tableNumber": 0,
        "orderStatus": "completed",
        "paymentStatus": "approved",
        "orderItems": [
            {
                "orderItem_id": 17,
                "quantity": 3000,
                "menuitems": {
                    "menuitem_id": 4,
                    "menu_itemname": "Pancakes",
                    "price": 10,
                    "tax": 5
                }
            }
        ]
    }
}
},
OrderIdNotFound : {
    description : "Gives the order details",
    value :{
        "statusCode": 404,
        "error": {
          "message": "Given_orderid_is_invalid"
        },
        "timeStamp": "2023-09-04T10:44:40.302Z",
        "path": "/order/20000"
      }
},
updatedQuantity : {
    description : "updates the menuItem and returns menuitem",
    value : {
        success: true,
       data: {
        "succes": true,
        "data": {
            "orderItem_id": 17,
            "quantity": 31,
            "menuitems": {
                "menuitem_id": 4,
                "menu_itemname": "Pancakes",
                "price": 10,
                "tax": 5
            }
        }
    }
    }
},
updateIdNotFound : {
    description : "This error occurs when name with given Orderitemid is not found",
    value : {
        "message": "Id_with_given_OrderItemId_is_not_avalaible",
        "error": "Bad Request",
    }
},
updateMenuItemNotFound : {
    description : "This error occurs when menuItemName  is not found",
    value : {
        "message": "Invalid_Menuitem_name",
        "error": "Bad Request",
    }
},
quantityNull : {
    description : "This error occurs when quanitty is null",
    value : 
    {
      "message": [
        "items.0.quantity cannot be null",
        "items.0.quantity must be a number conforming to the specified constraints"
      ],
      "error": "Bad Request",
      "statusCode": 400
    }
},
menuItemnull : {
    description : "This error occurs when quanitty is null",
    value :{
        "message": [
            "menuItem should not be empty"
        ],
        "error": "Bad Request",
    }
},
AcceswithoutAuthorization:  {
    description: ' If the client attempts to access certain book-related endpoints without providing any authentication credentials',
    value: {
      "statusCode": 401,
      "error": {
          "message": "Error_Authorization_is_required_for_resource"
      },
      "timeStamp": "2023-09-07T09:42:40.972Z",
      "path": "/order"
  }
  },
  ExpiredAuthenticationToken: {
    description: 'When the client sends an authentication token that is invalid, expired, or not recognized by the server',
    value: {
      "statusCode": 401,
      "error": {
          "message": "Error_Token_is_not_present"
      },
      "timeStamp": "2023-09-07T09:42:40.972Z",
      "path": "/order"
  }
  },
  InsufficientPrivileges : {
    description: ' If the client provides authentication credentials, but the credentials do not grant sufficient privileges to access a specific book-related operation',
    value:  {
      "statusCode": 401,
      "error": {
          "message": "Error_client_does_not_have_the_required_authorization_to_perform_the_requested_action"
      },
      "timeStamp": "2023-09-07T09:42:40.972Z",
      "path": "/order"
  }
  }, RoleBasedAccessControl: {
    description: 'If the API uses role-based access control, the server may respond with a 403 status code when a user with a certain role tries to access an operation that requires a higher role or specific permissions.',
    value:  {
      "statusCode": 401,
      "error": {
          "message": "User_with_this_role_is_not_permitted_to_access_the_resource"
      },
      "timeStamp": "2023-09-07T09:42:40.972Z",
      "path": "/order"
  }
  },
  UpdatePaymentStatus: {
    description: 'Updates the payment status',
    value: {
        "succes": true,
        "data": {
          "message": "Order_with_Id_payment_has_been_updated_successfuly deleted successfully"
        }
      }
  },
  deleteSuccess : {
    description: 'Deletes the Order',
    value: {
        "succes": true,
        "data": {
          "message": "Order deleted successfully"
        }
      }
  }

}