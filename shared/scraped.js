const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./mongo");


scrapdata = ()=>{
  
  
  let Amazon =[];
   //fetching amazon website
   axios.get("https://www.amazon.in/s?k=laptops&rh=n%3A1375424031&ref=nb_sb_noss").then(res=>{

   const $ = cheerio.load(res.data);
    let count =0;
//getting required data from html body
  $(".s-asin").each((index,element)=>{
      if(count <10)
      {
      let image = $(element).find(".aok-relative").children().attr("src");
      let title = $(element).find("span.a-text-normal").text();
      let rating = $(element).find(".a-icon-star-small").children().text();
      let price = $(element).find("span.a-text-price").children("span.a-offscreen").text();
      let offerprice = $(element).find("span.a-price-whole").text();
      //to push only not null elements
      if(title !=="" || price !==""||offerprice!=="")
      {
        Amazon[index] = {image,title,rating,price,offerprice};
        count++;
      }
      }
  })
  
  db.laptops.insertMany(Amazon)
  }).catch(err=>console.log(err));
  
//fetching data from flipcart
  let flipkart =[];
   axios.get("https://www.flipkart.com/search?q=laptop&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off")
   .then(res=>{
    
       const $ = cheerio.load(res.data);
     let count =0;
     $("._1AtVbE").each((index,element)=>{
        
        
            if(count <10)
            {
               let image = $(element).find("img._396cs4 ").attr("src");
               let title = $(element).find("div._4rR01T").text();
               let rating = $(element).find("div._3LWZlK").text();
               let price = $(element).find("div._3I9_wc").text();
               let offerprice = $(element).find("div._30jeq3").text();
               //to push only not null elements
               if(title !=="" || price !==""||offerprice!=="")
              {
                flipkart[count]={image,title,rating,price,offerprice}
                count++;
              }
            }
     })
     db.laptops.insertMany(flipkart)
   }).catch(err=>console.log(err));

  //fetching data from snapdeal
  let snapdeal =[];
  axios.get("https://www.snapdeal.com/search?keyword=laptops&santizedKeyword=laptops&catId=0&categoryId=57&suggested=false&vertical=p&noOfResults=20&searchState=k3%3Dtrue%7Ck5%3D0%7Ck6%3D0%7Ck7%3D%2F0f%2BAw%3D%3D%7Ck8%3D0&clickSrc=searchOnSubCat&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy#bcrumbSearch:laptops")
  .then(res=>{
      const $ = cheerio.load(res.data);


      let count =0;
    $(".favDp").each((index,element)=>{
        if(count <10)
        {
           let image = $(element).find(".picture-elem source").attr("srcset");
           let title = $(element).find("p.product-title").text();
           let rating = "NA";
           let price = $(element).find("span.product-desc-price").text();
           let offerprice = $(element).find("span.product-price").text();
           //to push only not null elements
           if(title !=="" || price !==""||offerprice!=="")
          {
            snapdeal[count]={image,title,rating,price,offerprice}
            count++;
          }
        }
    })
    db.laptops.insertMany(snapdeal)
  }).catch(err=>console.log(err));
  
 
}


module.exports = scrapdata;
