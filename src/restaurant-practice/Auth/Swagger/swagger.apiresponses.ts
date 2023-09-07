import { AuthExamples } from "./swagger.authexamp";

export const AuthApiResposnes = {
    post : {
        success : {
            status: 201, description: 'Logins the user and returns a jwt token after verifying the user',
            content: {
              'application/json': {
                examples: {
                  succes : AuthExamples.loginsucces     
                }
              }
            }
          },
          Usersuccess : {
            status: 201, description: 'register the user',
            content: {
              'application/json': {
                examples: {
                  succes : AuthExamples.registerSuccess     
                }
              }
            }
          },
          UserbadRequest : {
            status: 400, description : 'Errors in given request body',
            content : {
              'application/json': {
                examples: {
                  duplicateEmail : AuthExamples.duplicateEmail,
                  duplicateIdError : AuthExamples.duplicateIdError,
                  phonenumberError : AuthExamples.phoneNumberError,
                  RoleNameError : AuthExamples.RoleNameError

                }
              }
            }
            }
    },
    getById : {
      ok : {
          status: 200, description: 'Gives the order details by given id',
          
             content: {
            'application/json': {
              examples: {
               success : AuthExamples.MenuById
              }
            }
          }
        },
      Badrequest:  {
          status: 400, description: 'Occurs when given Id is invalid',
          
             content: {
            'application/json': {
              examples: {
               InvalidId : AuthExamples.MenuBadRequest
              }
            }
          }
        }
  },
  posttoken : {
    ok : {
      status: 210, description: 'Checks the expired date of referesh token and returns a new generated jwt access token',
         content: {
        'application/json': {
          examples: {
           success : AuthExamples.Referencetokensuccess
          }
        }
      }
    }
  },
  PostRole : {
    ok : {
      status: 210, description: 'creates a role',
         content: {
        'application/json': {
          examples: {
           success : AuthExamples.RoleGetSuccess
          }
        }
      }
    },
    Conflict : {
      status :410, description : "Occurs when you are trying to post the same role again",
      content: {
        'application/json': {
          examples: {
           conflict : AuthExamples.RoleConflict
          }
        }
      }
    }
  },
  PutRole: {
    ok: {
      status: 200, description: 'Role is updated succefully',
         content: {
        'application/json': {
          examples: {
           success : AuthExamples.RolePutSuccess
          }
        }
      }
    },
    BadRequest : {
      status :410, description : "Occurs when given path varaible is invalid",
      content: {
        'application/json': {
          examples: {
           IdNotFound : AuthExamples.RolePutBadREquest
          }
        }
      }
    }
  }
}