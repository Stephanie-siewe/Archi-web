import { HttpResponse } from '../helpers/helper.js';
import {Message, User} from '../models/schemas/schemas.js';
import Validator from '../validator/Validator.js';

export  default class MessageController{
    constructor(){}



    /**
     * return all messages
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async listMessage(req, res){
        try {
            let cats = await Message.all();
           
            res.status(HttpResponse.OK);
            return res.send(cats);
        } catch (error) {
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            console.log(error)
            return res.send(error);
        }
    }

    /**
     * save message
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async saveMessage(req, res){
        console.log(req.body)
        let verify = true;
        const validate = new Validator(req.body, {
            body: {require : true},
            send_to: {require: true},
            from_id: {require : true }
        });
        const data = validate.validate();

        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };

        // verify if the message is a respond of another message
        if (req.body.request_to != null){
            try {
            
                const ver = await Message.getById(req.body.request_to);
                console.log(ver)
                if(ver.length == 0){
                    res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                    return res.send({error: "message isn't a respond "});
                }
                data.request_to = req.body.request_to;
                // if (( await Message.idexist(req.body.send_to))){
                //     if( Message.idexist(req.body.from_id,User)){
                //         verify = true;
                //     }
                //     else {verify = false;}
                // } else { verify  = false; }
    
            } catch (error) {
                    res.status(HttpResponse.INTERNAL_SERVER_ERROR);
                    return res.send({error});
            }

        }else{
            console.log("not request_to");
        }
        
        //verify if the sender exist with your id
        try{

            const veri = await User.getById(req.body.from_id);
            console.log(veri);
            User.db.removeConnection();
            if(veri.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error: "Sender doesn't exist"});
            }
            data.from_id  = req.body.from_id;
        }catch(error){
            User.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }

        // verify if the receiver exist with your id

        try{

            const verif = await User.getById(req.body.send_to);
            console.log(verif);
            User.db.removeConnection();
            if(verif.length == 0){
                res.status(HttpResponse.UNPROCESSABLE_ENTITY);
                return res.send({error: "receiver doesn't exist"});
            }
            data.send_to  = req.body.send_to;
        }catch(error){
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            User.db.removeConnection();
            return res.send({error});
        }
        
        // save message
  
        if (verify == true){
            try {
                let cats = await Message.save(data);
                Message.db.removeConnection();
                cats = await Message.getById(cats.insertId)
                res.status(HttpResponse.OK);
                return res.send(cats);
            } catch (error) {
                Message.db.removeConnection();
                res.status(HttpResponse.INTERNAL_SERVER_ERROR);
                return res.send({error});
            }
        }

       

        
    }


    /**
     * get one message in database with your id
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
     */
    async singleMessage(req, res){
        try {
            let cat = await Message.getById(req.params.id);
            Message.db.removeConnection();
            if(cat.length > 0){
                res.status(HttpResponse.OK);
                return res.send({user: cat[0]});
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} doesn't correspond to any message`})
            }
        } catch (error) {
            Message.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }

    /**
     * update a message
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    /*async update(req, res){
        const validate = new Validator(req.body, {});
        const data = validate.validate()

        if(Object.keys(data).includes('error')){ 
            res.status(HttpResponse.UNPROCESSABLE_ENTITY);
            return res.send(data)
        };
        try {
            let cat = await Message.update(req.params.id, data);
            Message.db.removeConnection();
            if(cat.affectedRows > 0){
                res.status(HttpResponse.OK);
                return res.send(cat);
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} does not corresponde to any message`})
            }
        } catch (error) {
            Message.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }*/

    /**
     * remove a message
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns Express.res
    */
    async deleteMessage(req, res){
        try {
            let cat = await Message.delete(req.params.id);
            User.db.removeConnection();
            if(cat.affectedRows > 0){
                res.status(HttpResponse.OK);
                return res.send({message: 'message removed'});
            }else{
                res.status(HttpResponse.NOT_FOUND);
                return res.send({message: `${req.params.id} doesn't correspond to any message`})
            }
        } catch (error) {
            Message.db.removeConnection();
            res.status(HttpResponse.INTERNAL_SERVER_ERROR);
            return res.send({error});
        }
    }
}