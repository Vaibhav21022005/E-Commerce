import Address from "../model/Address.js";

//save address
export const saveAddress = async ( req, res)=>{
    try{
        const address = await Address.create(req.body);
        res.json({message: "Address saved Successfully", address})
        
    }catch (error){
        res.status(500).json({message:"Error saving address", error});        
    }
};

//get adrress by userId
export const getAddresses = async(req, res)=>{
    try{
        const addresses = await Address.find({userId: req.params.userId})
        res.json({addresses});
    }catch (error){
        res.status(500).json({message:"Error Fetching address", error});
    }
}