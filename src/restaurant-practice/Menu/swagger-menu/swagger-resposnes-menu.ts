import { MenuItems } from "src/restaurant-practice/Orders/orders.entities/menuitem.entity";
import { menuExamples } from "./swagger-menu-examples";

export const MenuResponses = {
    get : {
        ok : {
            status: 200, description: 'Gives the orders details by given id',
            // schema :MenuItems,
            
               content: {
              'application/json': {
                examples: {
                 success : {}
                }
              }
            }
          }
    },
    getById :  {
        ok : {
            status: 200, description: 'Gives the order details by given id',
            
               content: {
              'application/json': {
                examples: {
                 success : menuExamples.MenuById
                }
              }
            }
          },
        Badrequest:  {
            status: 400, description: 'Occurs when given Id is invalid',
            
               content: {
              'application/json': {
                examples: {
                 InvalidId : menuExamples.MenuBadRequest
                }
              }
            }
          }
    },
    filterGetByName :{
      ok : {
        status: 200, description: 'Gives the order details by given id',
        
           content: {
          'application/json': {
            examples: {
             getByName : menuExamples.getbyName,
             getByCategory: menuExamples.getByCategory
            }
          }
        }
      }
    },
    addMenuItem :{
        ok : {
        status: 201, description: 'Creates a new Menuitem',
        // schema :MenuItems,
        
           content: {
          'application/json': {
            examples: {
             success : menuExamples.addMenuItem
            }
          }
        }
      },
      BadRequest : {
        status: 400, description: 'Invalid id',
        // schema :MenuItems,
        
           content: {
          'application/json': {
            examples: {
             MenuItemIdFound : menuExamples.InvalidIdNotFound
            }
          }
        }
      }
    }
    
}