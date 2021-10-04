const cors = require("cors");
require("dotenv").config();
const express = require("express");
const mongo = require("./shared/mongo");
const scrapdata = require("./shared/scraped");
const productroute = require("./Routes/products");
const PORT = process.env.PORT || 5000;

const app = express();

startserver = async()=>{
    try{
        await mongo.connect();

        await mongo.laptops.deleteMany({});
        await scrapdata();
        console.log("data inserted");
       
        //reset data base for every 12 hrs
        setInterval(async() => {
            await mongo.laptops.deleteMany({});
            await scrapdata(); 
            console.log("data reseted sucessfully");
        }, 43200*1000);
         
        //to allow every application
        app.use(cors());
        //to parse data to json
       app.use(express.json());
       
       app.use((req,res,next)=>{
         console.log("logging middleware");
         next();
       })
       
       app.use("/products", productroute)
       app.listen(PORT,()=>{console.log(`server started at ${PORT}`);})
        


    }
    catch(err)
    {
        console.log(err);
    }
    
}
startserver();

