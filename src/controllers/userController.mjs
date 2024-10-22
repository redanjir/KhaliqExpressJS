import { validationResult, matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

//@desc get user
//@route GET /api/users/:id
//@access public
export const getUserById = async (req,res) =>{
    
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({errors: result.array()});
    }

    const data = matchedData(req);
    const {id} = data;

    try{
        const finduserbyid = await User.findOne({_id: id});

        if(!finduserbyid){
            return res.sendStatus(404);
        }
        return res.status(200).send(finduserbyid);

    }catch(err){
        return res.status(500).send({msg: `Server error ${err}`});
    }

};

//@desc create user
//@route post /api/users
//@access public
export const createNewUser =  async (req,res)=>{

    const result = validationResult(req);
    //If there are errors
    if(!result.isEmpty()){ //If isEmpty returns true, there are no errors
        return res.status(400).send(result.array())
    }

    //matchedData is the validated data (from the body in this case)
    const data = matchedData(req);
    //Because hashPassword is an async function, you need to await it.
    data.password = await hashPassword(data.password);

    const newUser = new User(data);
    try{
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    }catch(err){
        return res.status(400).send(err);
    }
};

//@desc get users
//@route get /api/users
//@access public
export const getUsers = async (req, res)=>{

    // If you did not specify a session store, the session data is stored in memory
    // req.session.id == req.sessionID. They are the same.
    req.sessionStore.get(req.session.id, (err, sessionData) =>{
        if(err){
            throw err
        }
        //If session is not set, sessionData is undefined
        console.log(sessionData);
    })
    const result = validationResult(req);   

    if(! result.isEmpty()){
        return res.status(400).send({errors: result.array()});
    }

    //matchedData sends a new obj with all the matched & sanitized fields from the req
    const data = matchedData(req, {locations: ['query']}); //By default, it is only from body, but you can add more
    const{filter, value} = data;

    if(filter && value ){

        //Add regex for case insensitivity
        const query = { [filter]: new RegExp(value, 'i') };

        try{
            const filteredUsers = await User.find(query);
            return res.status(200).send(filteredUsers);
        }catch(err){    
            return res.status(500).send({msg: `Server error :${err}`});
        }

    }

    try{
        const allUsers = await User.find();
        return res.status(201).send(allUsers);
    }catch(err){
        return res.status(500).send({msg: `Server error: ${err}`});
    }

}