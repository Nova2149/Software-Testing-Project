//First we have to install express on our marchine
const express=require('express')
const fs=require('fs')
const http=require('http')
const path=require('path')
let mysql=require('mysql2');
const { request } = require('http');
const e = require('express');
const { count } = require('console');
let signin_email="";
let  signin_password="";
let counter;
let dairy_id;

//User ID is unique  and belongs to the user 
let user_id;

//setting up the sql connection
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'myweb418'
})

const app=express()

app.use(express.urlencoded())
app.set('view engine','hbs')
console.log(path.join(__dirname,"views/html"))
app.use(express.static(path.resolve(__dirname,"views")))




//Fruits Api which we will use to load the fruits on our website


app.get('/mydata',(req,res)=>
{
    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)
   // console.log(product_data)

   res.send(product_data)


});

//Displaying the Home page
app.get("/home",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/Home.html'))
})
//Displaying the Fruist and vegetables Products
app.get("/fruit&veg",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/fandvuser.html'))
});


//Displaying the Meat Products
app.get("/meat",(req,res)=>{

    res.sendFile(path.resolve(__dirname,'views/html/Meatuser.html')) 
    });

//Displaying the Dairy Products
app.get("/dairy",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/dairyuser.html')) 
})
    
app.listen(6050,()=>
{
    console.log("The Server is running at port 6050");

    
})
/**Sample code for how to get data from the html page to back in the node js */
/*Code Starts
app.get('/rrr',(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/Rough.html'))
})
app.post("/rr",(req,res)=>
{   
    console.log(req.body)

})
Code Ends */

let sql="CREATE TABLE IF NOT EXISTS register(user_id int primary key auto_increment,first_name VARCHAR(50),"+
"last_name VARCHAR(50),email VARCHAR(30),date_of_birth DATE,address VARCHAR(75),phone VARCHAR(10),"+
"password VARCHAR(15),postal_code VARCHAR(7));";

connection.query(sql,(err,result)=>
{
    if(err) throw err;
    console.log("Table is created "+result);

})

//Account page 
app.get("/account",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/account.html'))
})
app.post("/register",(req,res)=>
{
   // console.log(req.body);
    /*1*/ const first_name=req.body.first_name
   /*2*/ const last_name=req.body.last_name
   /*3*/ const email=req.body.email
    /*4*/ const date_of_birth=req.body.date_of_birth
     /*5*/ const address=req.body.address
    /*6*/ const phone=req.body.phone
   /*7*/  const password=req.body.password
    /*8*/ const postal_code=req.body.postal_code
    console.log(first_name,last_name,email,date_of_birth,address,phone,password,postal_code)

    /*To Check if the user is already registered or not */
    sql="select email from register where email=?;";
    connection.query(sql,[email],(err,result)=>
    {
        if (err) throw err;
        console.log(result)
        if(result===null||result=="")
        {   
            console.log("Good to go")
            counter=0

            sql="insert ignore into register(first_name,last_name,email,date_of_birth,address,phone,password,postal_code) "+
            "values(?,?,?,?,?,?,?,?) ";
                connection.query(sql,[first_name,last_name,email,date_of_birth,address,phone,password,postal_code],
                    (err,result)=>
                    {
                        if(err) throw err;
                        console.log("Number of Records Inserted "+result.affectedRows)
            
                    })
        }
        else{

            console.log(result)
            console.log("Sorry User already exists")
            counter=1
            console.log(counter)
     
        }
    })

    
        /*
        if(counter===0)
        {
            sql="insert ignore into register(first_name,last_name,email,date_of_birth,address,phone,password,postal_code) "+
        "values(?,?,?,?,?,?,?,?) ";
            connection.query(sql,[first_name,last_name,email,date_of_birth,address,phone,password,postal_code],
                (err,result)=>
                {
                    if(err) throw err;
                    console.log("Number of Records Inserted "+result.affectedRows)
        
                })
        }
        */
  

})
//Sign In Utility
app.post("/signin",(req,res)=>
{
    console.log(req.body);
    signin_email=req.body.email
    signin_password=req.body.password
    console.log(signin_email,signin_password)

    //Validate sign in from the database
    sql="select * from register  where email=? and password=?;";

    connection.query(sql,[signin_email,signin_password],(err,result)=>
    {
        if (err) throw err;
        console.log(result)
        if(result==null||result=="")
        {
            console.log("Sign In Unsuccessful");
            res.send({"count":1})
        }
        else 
        {
            console.log("Sign In Successful")
            //When Sign In get the User Id of the person
            user_id=result[0].user_id;
            console.log(user_id)
            res.send({"count":0})

        }


    })


})

app.post("/productinfo",(req,res)=>
{   

    console.log(req.body);
     dairy_id=req.body.product_id;
    console.log(dairy_id);

    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)

  
    let final_result=[]
    for( let i=0;i<product_data.dairy.length;i++)
    {   
       // console.log(product_data.dairy[i].product_id)
        if(product_data.dairy[i].product_id==dairy_id)
        {   
            
            console.log("Match found");
           // console.log(product_data.dairy[i])
            final_result=product_data.dairy[i]
        }
      
        
    }
    console.log(final_result)

    
    
        //res.send(product_data.dairy[i]);

    


    // let product_name=req.query.name
    // console.log(product_name)
    // // let product_number=parseInt(product_name)
    // // console.log(product_number)

    // let mydata=fs.readFileSync('simple.json')
    // let product_data=JSON.parse(mydata)
  
   
    // for(let i=0;i<product_data.dairy.length;i++)
    // {   
        
    //     if(product_data.dairy[i].name==product_name)
    //     {   
    //         console.log('Match Found Successfully')
    //         console.log(product_data.dairy[i])
    //     }

    // }




})

//userinfo
app.get("/userinfo",(req,res)=>
{
    console.log("Email of the signined User"+signin_email)
})

//Testing the simple api
app.get("/",(req,res)=>
{   
    let student={
        firstname:"Mayank",
        lastname:"Tagra",
        email:"mayanktagra1@gmail.com"
    }
  //  let temp_data=fs.readFileSync('cart.json')
 //   let product_data=JSON.parse(temp_data)
 //   product_data.push(student)
    let data=JSON.stringify(student)
    fs.writeFileSync(data)
   res.render(student)
})



//Testing code starts here

app.get("/abdul",(req,res)=>
{
    console.log("You are currently inside abdul");


    //fs.unlinkSync('demo.json')
    console.log("File is deleted successfullly")
    let mydata={
        "first_name":"Janak",
        "last_name":"Patel",
        "email":"mayanktagra1@gmail.com"
    }
    fs.writeFileSync('demo.json',JSON.stringify(mydata))
    console.log("File written successfully to the class");


})


app.get("/view",(req,res)=>
{
    let pid=dairy_id;
   
    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)

    let product_id=product_data.dairy[pid].product_id;
    let product_name=product_data.dairy[pid].name;
    let product_price=product_data.dairy[pid].price;
    let product_img=product_data.dairy[pid].img


    res.render('view',{
        "product_id":product_id,
        "product_name":product_name,
        "product_price":product_price,
        "product_img":product_img
    })

});


let mm=4;
app.get("/userid",(req,res)=>
{
    var id=mm
    console.log("Query ran successfully")
    console.log(id)
    res.send({"id":id})
})


//Testing code ends here


//Add to cart Api from products page
//This api will write the product details to the json file
/*When the user clicks on the add product this api is called and it writes all those products to 
the json file*/
app.post("/addproduct",(req,res)=>
{       
        //Check user is logged in or not
        console.log(user_id)


    let pid=req.body.product_id
    console.log(pid)
    let ptype=req.body.type
    console.log(ptype)
    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)

    //It will store the data in the final
    let final_result

    let finalArray=[]
    //Read the File First
    const dataBuffer=fs.readFileSync('cart.json')
    const data=JSON.parse(dataBuffer)
    console.log("Data present initially in the cart")
    console.log(data)
    for(let i=0;i<data.length;i++)
    {
        finalArray.push(data[i])
    }


    for(let i=0;i<product_data.dairy.length;i++)
    {

        if(product_data.dairy[i].product_id==pid && product_data.dairy[i].type==ptype)
        {
            console.log("Its a Dairy Product")
            final_result=product_data.dairy[i];
            console.log(final_result)
            //push the data (JSON Object) to the final Array
            finalArray.push(final_result)

        }
    }
    for(let i=0;i<product_data.meat.length;i++)
    {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
        {
            console.log("Its a meat Product")
            final_result=product_data.meat[i];
            console.log(final_result)
            finalArray.push(final_result)

        }

    }
    for(let i=0;i<product_data.fruitsetlegumes.length;i++)
    {
        if(product_data.fruitsetlegumes[i].product_id==pid 
           && product_data.fruitsetlegumes[i].type==ptype)
        {
            console.log("Its a Fruit et Legumes product")
            final_result=product_data.fruitsetlegumes[i];
            console.log(final_result)
            finalArray.push(final_result)
        }
    }
    fs.writeFileSync('cart.json',JSON.stringify(finalArray))
    console.log(finalArray)
      

    


res.send(null)



})

//Code on 29 october starts here 
//boom boom
/*When the user clicks on the view button this api is called and it writes the data
to the json file */
app.post("/viewproduct",(req,res)=>{

    let pid=req.body.product_id
    console.log(pid)
    let ptype=req.body.type
    console.log(ptype)
    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)
    //product_data

    //Reading the File First
    //Delete the contents initially present in the json file named 'demo.json'
    fs.unlinkSync('demo.json')
    let finalArray=[];
    let final_result

    for(let i=0;i<product_data.dairy.length;i++)
    {

        if(product_data.dairy[i].product_id==pid && product_data.dairy[i].type==ptype)
        {
            console.log("Its a Dairy Product")
            final_result=product_data.dairy[i];
         //   console.log(final_result)
            //push the data (JSON Object) to the final Array
            finalArray.push(final_result)

        }
    }
    for(let i=0;i<product_data.meat.length;i++)
    {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
        {
            console.log("Its a meat Product")
            final_result=product_data.meat[i];
            //console.log(final_result)
            finalArray.push(final_result)

        }

    }
    for(let i=0;i<product_data.fruitsetlegumes.length;i++)
    {
        if(product_data.fruitsetlegumes[i].product_id==pid 
           && product_data.fruitsetlegumes[i].type==ptype)
        {
            console.log("Its a Fruit et Legumes product")
            final_result=product_data.fruitsetlegumes[i];
           // console.log(final_result)
            finalArray.push(final_result)
        }
    }
    fs.writeFileSync('demo.json',JSON.stringify(finalArray))
    console.log(finalArray)
      



})
/*This api is used to show only the view page */
app.get("/viewpage",(req,res)=>
{
    console.log("You are currently on the view page");
    res.sendFile(path.resolve(__dirname,'views/html/viewproduct.html')) 
})

/*This api is used to show up the product for the demo .json file */
app.get("/viewproductdetails",(req,res)=>
{   
    const dataBuffer=fs.readFileSync('demo.json')
    const data=JSON.parse(dataBuffer)
    console.log(data[0])
    res.send(data[0])
   

})
//This api will read the content from json file and display on cart.html
app.get("/viewcart",(req,res)=>
{
    const dataBuffer=fs.readFileSync('cart.json')
    const data=JSON.parse(dataBuffer)

    console.log("Inside View Cart");


    for(let i=0;i<data.length;i++)
    {
        console.log(data[i]);

    }
    res.send(data);


})

//Load the cart.html page
app.get("/cart",(req,res)=>
{
    console.log("You are currently on the cart page");
    res.sendFile(path.resolve(__dirname,'views/html/cart.html')) 

})
//Remove the an item from the cart Page once you click on the Remove button on the 
//Cart Page
app.post("/removeCartItem",(req,res)=>
{    var index=req.body.index
    const dataBuffer=fs.readFileSync('cart.json')
    const mydata=JSON.parse(dataBuffer)
   // console.log(mydata)
    //res.send(mydata)
    //Create a new Array Variable named myArray

  var  myArray=[]
  for(var i=0;i<mydata.length;i++)
  {
      if(i!=index)
      {
          myArray.push(mydata[i])
      }
  }
  //Write the Array myArray to the file cart.json
 fs.writeFileSync('cart.json',JSON.stringify(myArray));
 res.send("File Updated Successfully")



});

//Get Request to load the Payment Page
app.get("/payment",(req,res)=>
{
    console.log("You are currently on the Payment page");
    res.sendFile(path.resolve(__dirname,'views/html/payment.html')) 
})

//Get Request to load the Userinfo Page
app.get("/uinfo",(req,res)=>
{
    console.log("You are currently on the userinfo Page")
    res.sendFile(path.resolve(__dirname,'views/html/userinfo.html')) 
})
//Get Request for getting theUserInfo
app.get("/getuserinfo",(req,res)=>
{       
    console.log("Inside get userinfo")
    sql="select * from register where user_id="+user_id;
    connection.query(sql,(err,result)=>
    {
        if (err) throw err;
        console.log(result)
        res.send(result)
    })
    

})

//Post Request to Update the User Info
/*This Post request will update the user info in the database ,taking into consideration if the user
wants to change his personal information*/
app.post("/updateuserinfo",(req,res)=>
{
    console.log("Inside Update User Info");
    console.log(req.body)
    
    const first_name=req.body.firstName;
    const last_name=req.body.lastName;
    const email=req.body.email;
    const address=req.body.address;
    const phone_number=req.body.phoneNumber;
    const postal_code=req.body.postalCode;

    sql="update register set first_name=?,last_name=?,email=?,address=?,phone=?,postal_code=? where user_id="+user_id+";"
    connection.query(sql,[first_name,last_name,email,address,phone_number,postal_code],(err,result)=>
    {
        if(err) throw err;
        console.log(result);
        console.log("User Info Updatedd Successfully")

    })
    res.send("User Info Updated Successfully")
})

//Post Request for the Payment
//Creating a table to handle the payment

sql="create table if not exists payment(user_id int primary key,card_number long,name varchar(60),"+
"expiry_month int,expiry_year int,cvv int,"+
"foreign key(user_id) references register(user_id));";

connection.query(sql,(err,result)=>
{
    if(err) throw err;
    console.log("Table is created "+result)
})
//insert data into the Payment Card



//Post api to get the payment information which is entered by the user
app.post("/addcard",(req,res)=>
{
    console.log(req.body);
    const card_number=req.body.cardNumber;
    const name=req.body.cardHolderName;
    const expiry_month=req.body.month;
    const expiry_year=req.body.year;
    const cvv=req.body.cvv;

    //insert data into the Payment Table
    sql="select * from payment where user_id=?";
    connection.query(sql,[user_id],(err,result)=>
{
    if(err) throw err;
    console.log(result)
    if(result==null||result=="")
    {
        console.log("Good to Add to the Payment Table")
        sql="insert into payment(user_id,card_number,name,expiry_month,expiry_year,css) values (?,?,?,?,?,?)";
        connection.query(sql,[user_id,card_number,name,expiry_month,expiry_year,cvv],
            (err,result)=>
            {
                if (err) throw err;
                console.log("Number of Records Inserted")
            })
    }
    else{
        console.log(result);
        console.log("Sorry User details already exists")
    }
})


})


//This is just a Testing 
app.get("/vid",(req,res)=>
{   //user_id=3
    var counter;
    if(user_id==undefined)
    {
        console.log("User is not logged in as of now")
        //res.redirect("http://localhost:6050/account")
        counter=0;
        console.log("When You will be going on Account Page")
        res.send({"counter":counter})
        console.log("Redirected to Accounts Page")
    }
    else{
        console.log("User is already logged in")
      // res.redirect("http://localhost:6050/home")
      res.send({"counter":counter})

    }
})

//Get Request to get the HomeLoginnedPage
app.get("/homelogin",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/HomeLoginned.html'))

})
//Get Request to load your Wishlist Page
app.get('/wishlist',(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/wishlist.html'))
})

//AddWishlist to json File
app.post("/addwish",(req,res)=>
{   
    console.log("Inside Add Wish")
    let pid=req.body.product_id
    console.log(pid)
    let ptype=req.body.type
    console.log(ptype)
    let mydata=fs.readFileSync('simple.json')
    let product_data=JSON.parse(mydata)

    //It will store the data in the final
    let final_result

    let finalArray=new Array()
    //Read the File First

    var data;
    const dataBuffer=fs.readFileSync('wishlist.json')
    console.log(dataBuffer.length)
        if(dataBuffer.length==0)
        {
        console.log("JSON File is Empty")
        }
          else{
        data=JSON.parse(dataBuffer)
        console.log("Data present initially in the cart")
        console.log(data)
        //To show the items present initially in the cart
            for(let i=0;i<data.length;i++)
            {
                finalArray.push(data[i])
            }

        }



        console.log(finalArray)
        console.log("Hello Final Array")



        for(let i=0;i<product_data.dairy.length;i++)
        {

            if(product_data.dairy[i].product_id==pid && product_data.dairy[i].type==ptype)
            {
                console.log("Its a Dairy Product")
                final_result=product_data.dairy[i];
                console.log(final_result)
                //push the data (JSON Object) to the final Array
                finalArray.push(final_result)
              
            

            }
        }
        console.log(finalArray)
        for(let i=0;i<product_data.meat.length;i++)
        {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
            {
                console.log("Its a meat Product")
                final_result=product_data.meat[i];
                console.log(final_result)
                finalArray.push(final_result)

                


              //  finalArray.push(final_result)

            }

        }
        for(let i=0;i<product_data.fruitsetlegumes.length;i++)
        {
            if(product_data.fruitsetlegumes[i].product_id==pid 
            && product_data.fruitsetlegumes[i].type==ptype)
            {
                console.log("Its a Fruit et Legumes product")
                final_result=product_data.fruitsetlegumes[i];
                console.log(final_result)
                finalArray.push(final_result)
            }
        }
        fs.writeFileSync('wishlist.json',JSON.stringify(finalArray))
        console.log(finalArray)
        res.send(null)
        

        

})

//Post Request to remove the item from the wish list
app.post("/removewish",(req,res)=>
{   
    var index=req.body.index;
    console.log(index)
    const dataBuffer=fs.readFileSync('wishlist.json')
    const mydata=JSON.parse(dataBuffer)

    var myArray=[]
    for(var i=0;i<mydata.length;i++)
    {
        if(i!=index)
        {
            myArray.push(mydata[i])
        }
    }
    fs.writeFileSync("wishlist.json",JSON.stringify(myArray))
    res.send(

        "FileUpdated Successfully"
    )

})

//Get wish to get all the itens
app.get("/getwish",(req,res)=>
{
    const dataBuffer=fs.readFileSync('wishlist.json');
    const data=JSON.parse(dataBuffer)
    console.log(data)
    res.send(data)

    
})

//Get Request to Update the Password
app.post("/updatePassword",(req,response)=>
{   
    const old_password=req.body.oldPassword;
    const new_password=req.body.newPassword;
    const confirm_password=req.body.confirmPassword;
    console.log(old_password)
    console.log(new_password)
    console.log(confirm_password)
 
    let res_counter=0;
        sql="select * from register where password=?";
        connection.query(sql,[old_password],(err,res)=>
        {   
            if (err) throw err;
            console.log("Qury executed Successfuly")
            console.log(res)
            if(res==""||res==null)
            {   console.log("If the result is null")
               response.send({

                "count":1
               })
               // res.send({"counter":res_counter})
            }
            else
            {   console.log("Inside Else")
                sql="update register set password=? where user_id=?";
                connection.query(sql,[new_password,user_id],(error,result)=>
                {
                    if(error) throw error;
                    console.log(result)
                    
                })
                response.send({


                    "count":0
                })
                console.log(res_counter)
               // res.send({"counter":res_counter})
            }

        })

   
 
   
})
//This is a get Request for the Signout 
app.get("/signout",(req,res)=>
{
    console.log("Signout Response")
    sql="select * from register where user_id=null";
    connection.query(sql,(error,result)=>
    {
        if(error) throw error;
        console.log(result)

    })
    res.send("User Signout of the application successfully")
})

app.get("/callname",(req,res)=>
{
    res.send({

        "name":"Raashid"
    })
})







