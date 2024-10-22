import { mockusers } from "../utils/mockdata.mjs";

export const resolveIndexbyId = (req, res, next) =>{
    const {params: {id}} = req;
    if(isNaN(parseInt(id))){
        return res.sendStatus(400);
    }

    // Note: findUserIndex returns the position in the array, not the user id.
    const findUserIndex = mockusers.findIndex((user)=> user.id == parseInt(id));

    if(findUserIndex === -1){
        return res.sendStatus(404);
    }

    req.findUserIndex = findUserIndex;
    next();
}