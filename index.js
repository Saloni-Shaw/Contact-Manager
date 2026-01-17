const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.json());

//CONNECT MONGODB WITH NODE.JS VIA MONGOOSE
mongoose
.connect("mongodb://127.0.0.1:27017/ContactManager")
.then(()=>console.log("MongoDB is connected"))
.catch((err)=>console.log("Error occured"));

//SCHEMA(RULES FOR DATA)
const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    tag:{
        type:String
    },
    age:{
        type:Number,
    },
});

//MODEL MAKING
const Contact=mongoose.model("contact",contactSchema);

//CREATE CONTACT API
app.post("/api/contacts",async(req,res)=>{
    try{
        const contact=await Contact.create(req.body);
        res.status(201).json(contact);
    }catch(err){
        res.status(400).json({message:err.message})
    }
});

//READ ALL CONTACTS
app.get("/api/contacts",async(req,res)=>{
    try{
        const contacts=await Contact.find();
        res.status(200).json(contacts);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});
//UPDATE CONTACT BY ID
app.put("/api/contacts/:id",async(req,res)=>{
    try{
        const updatedContact=await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if(!updatedContact){
            res.status(400).json({message:"Contact not found"});
        }
        res.status(200).json(updatedContact)
    }catch(err){
        res.status(400).json({message:err.message});
    }
});
app.delete("/api/contacts/:id",async(req,res)=>{
    try{
        const deletedContact=await Contact.findByIdAndDelete(req.params.id);
        if(!deletedContact){
            return res.status(404).json({message:"Contact not found"});
        }
        res.status(200).json({message:"Contact deleted successfully"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
});
app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})