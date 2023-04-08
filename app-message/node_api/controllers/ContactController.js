import { HttpResponse } from '../helpers/helper.js';
import {Contact, User} from '../models/schemas/schemas.js';
import Validator from '../validator/Validator.js';

export  default class ContactController{
    constructor(){}



    /**
     * return all Contact
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async listContact(req, res){
        try {
            let vers = await Contact.all();
           
            res.status(HttpResponse.OK);
            return res.send(vers);
        } catch (error) {
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            console.log(error)
            return res.send(error);
        }
    }

    /**
     * insert a contact in the database
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async saveContact(req, res){
        console.log(req.body)
        let verify = true;
        const validate = new Validator(req.body, {
            added_by: {require : true},
            added: {require : true}
            
        });
        const data = validate.validate();
        data.muted = 0;
        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };
        
        //verify if the user exist
        try{

            const veri = await User.getById(req.body.added_by);
            console.log(veri);
            User.db.removeConnection();
            if(veri.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error:  "the user who wants to add the contact is unknown"});
            }
            data.added_by  = req.body.added_by;
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }

        //verify if contact exist

        try{

            //const verif = await User.getById(req.body.added);
            const verif  = await User.findByAttr("phone",req.body.added);
            User.db.removeConnection();
            console.log(verif);
            if(verif.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error: "The user to be added as a contact is unknown"});
            }
            data.added  = req.body.added;
        }catch(error){
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }

        // verify if the contact has already been registered


       try{
            let sql = `select * from contacts c where  c.added = ${req.body.added} and c.added_by = ${req.body.added_by}`;
            let cont = await User.execute(sql);
            User.db.removeConnection();
            if (cont.length != 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error: "This user is already one of your contacts"});
            }
            
       }catch(error){
        res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
       }

        // if ( Contact.idexist(added_by,User)){
        //     if( Contact.idexist(added,User)){
        //         verify = true;
        //     }else {verify = false;}
            
        // } else { verify  = false; }
  
        if (verify == true){
            try {
                let vers = await Contact.save(data);
                Contact.db.removeConnection();
                res.status(HttpResponse.OK);
                return res.send(vers);
            } catch (error) {
                Contact.db.removeConnection();
                res.status(HttpResponse.INTERNAL_SERVER_ERROR);
                return res.send({error});
            }
        }

        else{
            console.log(`Error , send_to or from doesn't exist`);
        }

        
    }


    /**
     * get one contact in the database with your id
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async singleContact(req, res){
        try {
            let ver = await Contact.getById(req.params.id);
            Contact.db.removeConnection();
            if(ver.length > 0){
                res.status(HttpResponse.OK);
                const user = await Contact.getValFromRelation(['phone', 'firstName','lastName'],'Users', `phone = ${ver[0].added}`)
                return res.send({
                    added: ver[0],
                    user
                })
                
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({Contact: `${req.params.id} doesn't correspond to any Contact`})
            }
        } catch (error) {
            Contact.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * update a contact
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
   //just change a attribute muted 
    async updateContact(req, res){
        const validate = new Validator(req.body, {
           muted:{require : true},
        });
        const data = validate.validate()

        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };

        //verify if the user exist
        // try{

        //     const veri = await User.getById(req.body.added_by);
        //     console.log(veri);
        //     User.db.removeConnection();
        //     if(veri.length == 0){
        //         res.status(HttpResponse.UNPROCESSABLE_ENTITY);
        //         return res.send({error:  "l'utilisateur voulant ajouter le contact  est inconnue"});
        //     }
        //     data.added_by  = req.body.added_by;
        // }catch(error){
        //     User.db.removeConnection();
        //     res.status(HttpResponse.INTERNAL_SERVER_ERROR);
        //     return res.send({error});
        // }

        // // verify if the phone number is in the database

        // try{
        //      const contact = await User.findByAttr("phone",req.body.added)
        //      console.log(contact)
        //      User.db.removeConnection();
        //      if (contact.length == 0){
        //         res.status(HttpResponse.UNPROCESSABLE_ENTITY);
        //         return res.send({"error": "this contact doesn't exist"})
            
        //      }
        //     }catch(error){
        //         res.status(HttpResponse.INTERNAL_SERVER_ERROR);
        //         User.db.removeConnection();
        //         return res.send({error});
        //     }

        // verify the attribute muted is changed
        if (req.body.muted != 0){
            data.muted = 1;
        }

        //update contact
        try {
            let cat = await Contact.update(req.params.id, data);
            Contact.db.removeConnection();
            if(cat.affectedRows > 0){
                res.status(HttpResponse.OK);
                return res.send(cat);
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({Contact: `${req.params.id} doesn't correspond to any Contact`})
            }
        } catch (error) {
            Contact.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * remove a Contact with your id
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async deleteContact(req, res){
        try {
            let ver = await Contact.delete(req.params.id);
            User.db.removeConnection();
            if(ver.affectedRows > 0){
                res.status(HttpResponse.OK);
                // let sqlMessage =`select m.id from messages m where (m.send_to = ${req.params.id}) || (m.from_id = ${req.params.id}); `
                // let idmessages =  User.execute(sqlMessage);

                // for (const i of id) {
                    
                // }


                return res.send({Contact: 'Contact removed'});

             }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({Contact: `${req.params.id} doesn't correspond to any Contact`})
            }
        } catch (error) {
            Contact.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    


}