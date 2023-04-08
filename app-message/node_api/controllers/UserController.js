import { HttpResponse } from '../helpers/helper.js';
import {User,Contact, Message} from '../models/schemas/schemas.js';
import Validator from '../validator/Validator.js';
import CryptoJS from 'crypto-js';

export default class UserController{
    constructor(){}

    /**
     * return all user
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async index(req, res){
        try {
            let vers = await User.all();
            User.db.removeConnection();
            res.status(HttpResponse.OK);
            return res.send(vers);
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            console.log(error)
            return res.send(error);
        }
    }

    /**
     * save user
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async save(req, res){
        console.log(req.body)
        const validate = new Validator(req.body, {
            firstName: {require: true},
            lastName: {require: true},
            email: {require: true},
            phone: {require: true},
            password: {require: true}
        });
        const data = validate.validate()

        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };

        // verify if the phone number exist 
        try {
            const us = await User.findByAttr("phone",req.body.phone);
            User.db.removeConnection();
            if(us.length !== 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({"error": "this user exist"})
            }
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
         //password encryption and registration of user

        try {
            data.password = CryptoJS.MD5(data.password);
            let vers = await User.save(data);
            User.db.removeConnection();
            res.status(HttpResponse.OK);

            vers = await User.getById(vers.insertId)
            res.status(HttpResponse.OK);
            return res.send(vers);
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }


    /**
     * get one user in the database with your id
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async single(req, res){
        try {
            let ver = await User.getById(req.params.id);
            User.db.removeConnection();
            if(ver.length > 0){
                res.status(HttpResponse.OK);
                return res.send({user: ver[0]});
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} doesn't correspond to any user`})
            }
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * update a user
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async update(req, res){
        const validate = new Validator(req.body, {
            firstName: {require: false},
            lastName: {require: false},
            email: {require: false},
            phone: {require: false},
            password: {require: false}
        });
        const data = validate.validate()

        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };
         // chercher comment s'assurer que le mot de passe a changer
         //ensuite encrypter le mot de passe pour l'update
        if (req.body.password != User.getById(req.params.id) && req.body.password != null){
                data.password = CryptoJS.MD5(req.body.password)
        }
        try {
            let ver = await User.update(req.params.id, data);
            User.db.removeConnection();
            if(ver.affectedRows > 0){
                res.status(HttpResponse.OK);
                return res.send(ver);
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} doesn't corresponde to any user`})
            }
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * remove a user
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async delete(req, res){
        try {
            let cat = await User.delete(req.params.id);
            User.db.removeConnection();
            if(cat.affectedRows > 0){
                res.status(HttpResponse.OK);
                return res.send({message: 'user removed'});
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} doesn't corresponde to any user`})
            }
        } catch (error) {
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }
    

     /**
     * get allcontact of a user
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async getAllContact(req ,res){

        // verify if a user exist
         try{
            
            const veri = await User.getById(req.params.id);
            console.log(veri);
            User.db.removeConnection();
            if(veri.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error:  "user doesn't exist"});
            }
        
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }

        //get all contact of this user
        try{
           let contacts = await Contact.getValFromRelation(['u.firstName','u.lastName','u.id'],'users u',`u.phone in ( select c.added from contacts c where c.added_by=${req.params.id}) `);
           console.log(contacts);
            let infosid = [];
            for (const contact of contacts) {
                infosid.push(contact.id);
            }
            console.log(infosid);
            let infosmessages = [];
            for (let infoid of infosid) {
                console.log(infoid);
            //     let sql = `select m.createdAt, m.body from messages m where m.send_to = ${infoid} and m.from_id=${req.params.id} order by m.createdAt desc limit 1`;
            //     let sender = await User.execute(sql);
            //    //let sender = await Message.getValFromRelation( ['m.created','m.body'],'messages m',`m.send_to  = ${infoid} and m.from_id = ${req.params.id} order by m.createdAt desc limit 1`) ;
            //    console.log(sender);
            //    let receiver = await Message.getValFromRelation( ['m.createdAt','m.body'],'messages m',`m.send_to  = ${req.params.id} and m.from_id = ${infoid} order by m.createdAt desc limit 1`);
            //    console.log(receiver);
            //    if (sender.createdAt > receiver.createdAt){
            //     infosmessages.push(sender);
            //    }else{
            //     infosmessages.push(receiver);
            //    }
            let sql = `select m.id,m.createdAt, m.body, m.request_to from messages m where (m.send_to = ${infoid} and m.from_id=${req.params.id}) || (m.send_to = ${req.params.id} and m.from_id=${infoid}) order by m.createdAt desc limit 1; `;
            let listmessages = await User.execute(sql);
            console.log(listmessages);
            infosmessages.push(listmessages);
             }
            console.log(infosmessages);

            // for (let i = 0; i<=contacts.length; i++ ){
            //     contacts[i]. = infosmessages[i];
            // }
            // console.log (contacts);

           //let infosmessages = await Contact.getValFromRelation(['Max(messages.createdAt)','messages.body','contacts.added'],'messages,contacts',`messages.send_to = contacts.added || messages.from_id = contacts.added  group by  contacts.added`);

            User.db.removeConnection();
            res.status(HttpResponse.OK);
            // les messages sont dans le meme ordre que les contacts
            return res.send({contacts,
                  infosmessages    });
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * get allmessage of a user and your contact
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async getAllMessage(req , res){
        
        // verify if a user exist
        try{
            
            const veri = await User.getById(req.params.idU);
            console.log(veri);
            User.db.removeConnection();
            if(veri.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error:  "user doesn't exist"});
            }

        
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
        
        // verify if a contact exist
        try{
            
            const verif = await User.getById(req.params.idC);
            console.log(verif);
            User.db.removeConnection();
            if(verif.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error:  "contact doesn't exist"});
            }
        
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
        // get all message 
        try{
            let sql = `select m.id,m.createdAt, m.body, m.request_to from messages m where (m.send_to = ${req.params.idC} and m.from_id=${req.params.idU}) || (m.send_to = ${req.params.idU} and m.from_id=${req.params.idC}) `;
            let listmessages = await User.execute(sql);
            console.log(listmessages);
            User.db.removeConnection();
            res.status(HttpResponse.OK);
            return res.send(listmessages);

            
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        };
       
    }
}