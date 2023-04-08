import Route from './Route.js';

await Route.get("/user", 'UserController', 'index')
await Route.post("/user", 'UserController', 'save')
await Route.get("/user/:id", 'UserController', 'single')
await Route.delete("/user/:id", 'UserController', 'delete')
await Route.patch("/user/:id", 'UserController', 'update')
await Route.get("/allcontact/:id",'UserController','getAllContact')
await Route.get("/allmessage/:idU/:idC", 'UserController','getAllMessage')

await Route.get('/messages','MessageController','listMessage')
await Route.post('/messages','MessageController','saveMessage')
await Route.get('/messages/:id','MessageController','singleMessage')
await Route.delete('/messages/:id','MessageController','deleteMessage')


await Route.get('/contact','ContactController','listContact')
await Route.post('/contact','ContactController','saveContact')
await Route.get('/contact/:id','ContactController','singleContact')
await Route.delete('/contact/:id','ContactController','deleteContact')
await Route.patch("/contact/:id", 'ContactController', 'updateContact')


export default Route.routes
