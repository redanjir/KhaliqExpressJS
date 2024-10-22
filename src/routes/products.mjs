import { Router } from "express";
import { mockProducts } from "../utils/mockdata.mjs";

const router = Router();

//GET: get all products
router.get("/api/products", (req, res)=>{
    const {query: {name},} = req;

    if(req.signedCookies.hello && req.signedCookies.hello === 'world'){
        if(name){
            const lowerCaseName = name.toLowerCase();
            return res.send(mockProducts.filter((product)=> {return product.name.toLowerCase().includes(lowerCaseName)}));
        }
        return res.send({mockProducts, msg: "Correct Cookie"});
    }

    return res.status(403).send({msg: "Sorry you need the correct cookie"});
});

//GET: get product by id
router.get("/api/products/:id", (req,res)=>{
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)){
        return res.status(400).send("Bad request, Invalid ID");
    }

    const findProduct = mockProducts.find((product) => product.id === parsedId);

    if(findProduct){
        return res.status(200).send(findProduct);
    }else{
        return res.sendStatus(404);
    }
});

export default router;