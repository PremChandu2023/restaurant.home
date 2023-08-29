import { get } from "http";
import { OrderExamples } from "./order-swagger-example";
import { orderDetails } from "../orders.dtos";

export const OrderApiResponse  = {
    post: {
        created: {
          status: 201, description: 'Creats the new Order',
          content: {
            'application/json': {
              examples: {
                succes : OrderExamples.Order     
              }
            }
          }
        },
        Badrequest: {
          status: 400, description: 'Invalid Requests',
          content: {
            'application/json': {
              examples: {
                succes : OrderExamples.Order,
                TableNumberNull: OrderExamples.TableNUmberNull,
                QuantityNull: OrderExamples.quantityNull,
                MenuItemNull: OrderExamples.menuItemnull  
              }
            }
          }
        }
    },
    get: {
      ok: {
        status: 200, description: 'Gives the orders details by given id',
        
           content: {
          'application/json': {
            examples: {
             Success :OrderExamples.OrderById
            }
          }
        }
      },
      notFound : {
        status : 400, description: 'Order with id not found',
        content : {
          'application/json': {
            examples: {
             NotFound :OrderExamples.OrderIdNotFound
            }
          }
        }
      }
    },
    getAllOrders : {
      ok : {
        status: 200, description: 'Gives all Orders',
        
           content: {
          'application/json': {
            examples: {
             Success :OrderExamples.OrderById
            }
          }
        }
      }
    },
    put: {
      ok: {
        status: 200, description: 'Updates the quantity with given menuitem name and quantity to be placed',
        content : {
          'application/json': {
            examples : {
              success : OrderExamples.updatedQuantity,   
            }
          }
        }
      },
      NotFound : {
        status : 400,description: 'Id is not found with given OrderItemId',
        content : {
        'application/json': {
          examples : {
            InvalidId : OrderExamples.updateIdNotFound,
            InvalidMenuItem : OrderExamples.updateMenuItemNotFound
          }
        }
      }
        
      },
      addMenUitem : {
        ok :{
          status: 200, description: 'Updates the quantity with given menuitem name and quantity to be placed',
          content : {
            'application/json': {
              examples : {
                success : OrderExamples.updatedQuantity,
               
              }
            }
          }
        }
      },
        BadRequest:{
          status: 400, description: 'Updates the quantity with given menuitem name and quantity to be placed',
          content : {
            'application/json': {
              examples : {
               quantityNull : OrderExamples.quantityNull,
               menuItemNull : OrderExamples.menuItemnull
               
              }
            }
          }
        },
        Unauthorized:  {
          status: 401, description: 'Unauthorized', content:
          {
            'application/json': {
              examples: {
                AcceswithoutAuthorization: OrderExamples.AcceswithoutAuthorization, ExpiredAuthenticationToken: OrderExamples.ExpiredAuthenticationToken
              }
            }
          }
        },
        frbidden:  {
          status: 403, description: 'Forbidden', content: {
            'application/json': {
              examples: {
                InsufficientPrivileges: OrderExamples.InsufficientPrivileges,
                RoleBasedAccessControl: OrderExamples.RoleBasedAccessControl
              }
            }
          }
        }
    },
    Patch :{
      ok : {
        status: 200, description: 'Updates the order and payment status',
        content : {
          'application/json': {
            examples : {
              success : OrderExamples.UpdatePaymentStatus,   
            }
          }
        }
      },
      IdNotFound : {
        status: 400, description: 'Occurs when order is deleted',
        content : {
          'application/json': {
            examples : {
              IdNotFound : OrderExamples.OrderIdNotFound
            }
          }
        }
      }
    },
    Delete : {
      ok : {
        status: 200, description: 'Delets the order with given OrderId',
        content : {
          'application/json': {
            examples : {
              success : OrderExamples.deleteSuccess,   
            }
          }
        }
      },
      IdNotFound : {
        status: 400, description: 'Occurs when order is deleted',
        content : {
          'application/json': {
            examples : {
              IdNotFound : OrderExamples.OrderIdNotFound
            }
          }
        }
      }
    }
}