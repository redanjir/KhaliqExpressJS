import { Router } from "express";
import {param, validationResult, matchedData, checkSchema,} from "express-validator";
import {createUserValidationSchema, getUsersValidationSchema, partialUpdateUserValidationSchema} from "../utils/validationSchemas.mjs";
import {User } from "../mongoose/schemas/user.mjs"
import { createNewUser, getUserById, getUsers } from "../controllers/userController.mjs";

const router = Router();

// POST: create new users
router.post("/api/users", 
    checkSchema(createUserValidationSchema),
    createNewUser,
);

// GET: get all users
router.get("/api/users",
    checkSchema(getUsersValidationSchema),
    getUsers,
);

//GET: get user by id
router.get(
    "/api/users/:id",
    // Add isMongoId to check if the id is a valid objectid
    param("id").isMongoId().withMessage("Invalid id"), //Import param from express-validator to validate Id
    getUserById,
);

//PUT: replace user by id -- expects the entire resource
router.put(
    "/api/users/:id",
    param("id").isMongoId().withMessage("Invalid id"),
    checkSchema(createUserValidationSchema),
    async (req,res) =>{

    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({error: result.array()});
    }

    //matchedData sends a new obj with all the matched & sanitized fields from the req
    const data = matchedData(req);
    
    try{
        const {id, ...restofdata} = data //Destructure where restofdata is without the id
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {$set: restofdata},
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        if(!updatedUser){
            return res.sendStatus(404);
        }

        return res.status(201).send(updatedUser);
    }catch(err){
        return res.status(500).send({msg: `Server error: ${err}`});
    }
});

//PATCH: update user by id -- expects partial updates
router.patch(
    "/api/users/:id", 
    param("id").isMongoId().withMessage("Invalid ID"),
    checkSchema(partialUpdateUserValidationSchema),
    async (req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({errors: result.array()});
    }

    const data = matchedData(req);
    const {id, ...restofdata} = data;

    try{
        const finduserbyid = await User.findByIdAndUpdate(id,
            {$set: restofdata},
            {new: true, runValidators: true}
        )

        if(!finduserbyid){
            return res.sendStatus(404);
        }

        return res.status(201).send(finduserbyid);
    }catch(err){
        return res.status(500).send({error: `Server error: ${err}`});
    }

});

//DELETE: delete user by id
router.delete(
"/api/users/:id",
param("id").isMongoId().withMessage("Invalid ID"),
async (req,res)=>{

    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({errors: result.array()});
    }

    const data = matchedData(req);
    try{
        const deleteUser = await User.findByIdAndDelete(data.id);
        if(!deleteUser){
            return res.sendStatus(404);
        }

        return res.status(200).send({msg: `Successfully deleted user ${data.id}`});
    }catch(err){
        return res.status(500).send(`Server error: ${err}`);
    }
});


export default router;