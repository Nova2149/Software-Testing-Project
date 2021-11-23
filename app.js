//First we have to install express on our marchine
const express=require('express')
const fs=require('fs')
const http=require('http')
const path=require('path')
let mysql=require('mysql2');
const { request } = require('http');
const e = require('express');
const { count, Console } = require('console');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
let signin_email="";
let  signin_password="";
let counter;
let dairy_id;

//User ID is unique  and belongs to the user 
let user_id;
let order_id;

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


// app.get('/mydata',(req,res)=>
// {
//     let mydata=fs.readFileSync('simple.json')
//     let product_data=JSON.parse(mydata)
//    // console.log(product_data)

//    res.send(product_data)


//});

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
    sql="select * from register where user_id=1000"
    connection.query(sql,(er,rs)=>
    {
        if(er) throw er;
        console.log(rs)
        if(rs==""||rs==null)
        {
            sql="insert into register values(1000,'Tom','Marcos','tm1@gmail.com',null,null,null,'Msdhoni0',null);";
            connection.query(sql,(er1,rs1)=>
            {
                if(er1) throw er1;
                console.log(rs1)
        
            })
        }
        else
        {
            console.log("Admin Already Exists");

        }
    })
 

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
                    res.send({"counter":0})
        }
        else{

            console.log(result)
            console.log("Sorry User already exists")
            counter=1
            console.log(counter)
            res.send({"counter":1})
     
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
        else if(result[0].user_id!=1000)
        {
            console.log("Sign In Successful")
            //When Sign In get the User Id of the person
            user_id=result[0].user_id;
            console.log(user_id)
            res.send({"count":0})

        }
        else{
                res.send({
                    "count":2
                })
        }


    })


})

app.post("/productinfo",(req,res)=>
{   

    console.log(req.body);
     dairy_id=req.body.product_id;
    console.log(dairy_id);

    let mydata=fs.readFileSync('simple3.json')
    let product_data=JSON.parse(mydata)

  
    let final_result=[]
    for( let i=0;i<product_data.length;i++)
    {   
       // console.log(product_data.dairy[i].product_id)
        if(product_data[i].product_id==dairy_id)
        {   
            
            console.log("Match found");
           // console.log(product_data.dairy[i])
            final_result=product_data[i]
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
   
    let mydata=fs.readFileSync('simple3.json')
    let product_data=JSON.parse(mydata)

    let product_id=product_data[pid].product_id;
    let product_name=product_data[pid].name;
    let product_price=product_data[pid].price;
    let product_img=product_data[pid].img


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
    let mydata=fs.readFileSync('simple3.json')
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


    for(let i=0;i<product_data.length;i++)
    {

        if(product_data[i].product_id==pid && product_data[i].type==ptype)
        {
            console.log("Its a Dairy Product")
            final_result=product_data[i];
            console.log(final_result)
            //push the data (JSON Object) to the final Array
            finalArray.push(final_result)

        }
        
    }
    // for(let i=0;i<product_data.meat.length;i++)
    // {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
    //     {
    //         console.log("Its a meat Product")
    //         final_result=product_data.meat[i];
    //         console.log(final_result)
    //         finalArray.push(final_result)

    //     }

    // }
    // for(let i=0;i<product_data.fruitsetlegumes.length;i++)
    // {
    //     if(product_data.fruitsetlegumes[i].product_id==pid 
    //        && product_data.fruitsetlegumes[i].type==ptype)
    //     {
    //         console.log("Its a Fruit et Legumes product")
    //         final_result=product_data.fruitsetlegumes[i];
    //         console.log(final_result)
    //         finalArray.push(final_result)
    //     }
    // }
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
    let mydata=fs.readFileSync('simple3.json')
    let product_data=JSON.parse(mydata)
    //product_data

    //Reading the File First
    //Delete the contents initially present in the json file named 'demo.json'
  
    let finalArray=[];
    let final_result

    for(let i=0;i<product_data.length;i++)
    {

        if(product_data[i].product_id==pid && product_data[i].type==ptype)
        {
            console.log("Its a Dairy Product")
            final_result=product_data[i];
         //   console.log(final_result)
            //push the data (JSON Object) to the final Array
            finalArray.push(final_result)

        }
    }
    // for(let i=0;i<product_data.meat.length;i++)
    // {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
    //     {
    //         console.log("Its a meat Product")
    //         final_result=product_data.meat[i];
    //         //console.log(final_result)
    //         finalArray.push(final_result)

    //     }

    // }
    // for(let i=0;i<product_data.fruitsetlegumes.length;i++)
    // {
    //     if(product_data.fruitsetlegumes[i].product_id==pid 
    //        && product_data.fruitsetlegumes[i].type==ptype)
    //     {
    //         console.log("Its a Fruit et Legumes product")
    //         final_result=product_data.fruitsetlegumes[i];
    //        // console.log(final_result)
    //         finalArray.push(final_result)
    //     }
    // }
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
                sql="insert into payment(user_id,card_number,name,expiry_month,expiry_year,cvv) values (?,?,?,?,?,?)";
                connection.query(sql,[user_id,card_number,name,expiry_month,expiry_year,cvv],
                    (err,result)=>
                    {
                        if (err) throw err;
                        console.log("Number of Records  Inserted "+result)
                    })
            }
            else{
                console.log(result);
                console.log("Sorry User details already exists")
                sql="update payment set card_number=?,name=?,expiry_month=?,expiry_year=?,cvv=? where user_id=?";
                connection.query(sql,[card_number,name,expiry_month,expiry_year,cvv,user_id],(error,result)=>
                {
                    if(error) throw error;
                    console.log("Result after Updation "+result)

                })
            }
        })
        res.sendFile(path.resolve(__dirname,'views/html/checkout.html'))




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
//Request to Creating a wishlist Table
sql="create table if not exists wishlist(user_id int,product_id int,product_type varchar(50)"+
",primary key(user_id,product_id,product_type), foreign key(user_id) references register(user_id) on delete cascade);";

connection.query(sql,(err,res)=>
{
    if(err) throw err;
    console.log("Wishlist Table is created successfully "+res)
})

//AddWishlist to json File
app.post("/addwish",(req,res)=>
{   
    console.log("Inside Add Wish")
    let pid=req.body.product_id
    console.log(pid)
    let ptype=req.body.type
    console.log(ptype)
    let mydata=fs.readFileSync('simple3.json')
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



        for(let i=0;i<product_data.length;i++)
        {

            if(product_data[i].product_id==pid && product_data[i].type==ptype)
            {
                console.log("Its a Dairy Product")
                final_result=product_data[i];
                console.log(final_result)
                //push the data (JSON Object) to the final Array
                finalArray.push(final_result)
              
            

            }
        }
        console.log(finalArray)
        // for(let i=0;i<product_data.meat.length;i++)
        // {    if(product_data.meat[i].product_id==pid  && product_data.meat[i].type==ptype)
        //     {
        //         console.log("Its a meat Product")
        //         final_result=product_data.meat[i];
        //         console.log(final_result)
        //         finalArray.push(final_result)

                


        //       //  finalArray.push(final_result)

        //     }

        // }
        // for(let i=0;i<product_data.fruitsetlegumes.length;i++)
        // {
        //     if(product_data.fruitsetlegumes[i].product_id==pid 
        //     && product_data.fruitsetlegumes[i].type==ptype)
        //     {
        //         console.log("Its a Fruit et Legumes product")
        //         final_result=product_data.fruitsetlegumes[i];
        //         console.log(final_result)
        //         finalArray.push(final_result)
        //     }
        // }
        console.log("Final Array in  Ass Wish Api");

        fs.writeFileSync('wishlist.json',JSON.stringify(finalArray))
        console.log(finalArray)

      //Insert in the wishlist which record is not inserted
      for(let i=0;i<finalArray.length;i++)
      {
        sql="select * from wishlist where user_id=? and product_id=? and product_type=?";
        connection.query(sql,[user_id,finalArray[i].product_id,finalArray[i].type],(error,result)=>
        {
            if(error) throw error;
            console.log(result)
            if(result==""||result==null)
            {
                sql="insert into wishlist values(?,?,?)";
                connection.query(sql,[user_id,finalArray[i].product_id,finalArray[i].type],(er,rs)=>
                {   
                    if(er) throw er;
                    console.log("Inserted new Wish to the wishlist")
                    console.log(i)
                    console.log(rs)
                })

            }
        })
      }
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
        else{
            let product_id=mydata[i].product_id
            let product_type=mydata[i].type
            sql="delete from wishlist where user_id=? and product_id=? and product_type=?";
            connection.query(sql,[user_id,product_id,product_type],(error,result)=>
            {
                if(error)throw error;
                console.log("Result "+result)
            })
        }
    }
    console.log("My Array after deletion")
    console.log(myArray)
    fs.writeFileSync("wishlist.json",JSON.stringify(myArray))
    res.send(

        "FileUpdated Successfully"
    )

})

//Get wish to get all the itens
app.get("/getwish",(req,res)=>
{
    var myArray=[]

    sql="select product_id,product_type from wishlist where user_id=?";

    connection.query(sql,[user_id],(error,result)=>
    {       
        if(error) throw error;
        console.log(result)
        buildResponse(result)
        
    
    });
    console.log("Result of the Database Query")
    function buildResponse(response)
    {
            console.log("Inside Build Response")
            console.log(response)
            

        
     
        const dataBuffer=fs.readFileSync('simple3.json')
        const data=JSON.parse(dataBuffer)
        var finalArray=[]

        for(let j=0;j<response.length;j++)
        {   
            for(let i=0;i<data.length;i++)
            {   
                if(response[j].product_id==data[i].product_id 
                    &&
                    response[j].product_type==data[i].type)
                    {
                        finalArray.push(data[i]);
                    }
        
        
            }

            // //for meat Products
            // for(let i=0;i<data.meat.length;i++)
            // {
            //     if(response[j].product_id==data.meat[i].product_id 
            //         &&
            //         response[j].product_type==data.meat[i].type)
            //         {
            //             finalArray.push(data.meat[i])
            //         }
            // }
            // //for Dairy Products
            // for(let i=0;i<data.dairy.length;i++)
            // {
            //     if(response[j].product_id==data.dairy[i].product_id && 
            //         response[j].product_type==data.dairy[i].type)
            //         {
            //             finalArray.push(data.dairy[i])
            //         }
            // }

            console.log("Result for the Final Array")
            console.log(finalArray)
        }
        //Empty the contents of the  JSON File
        fs.writeFileSync('wishlist.json',JSON.stringify(''))
        //Write to the JSON File
        fs.writeFileSync('wishlist.json',JSON.stringify(finalArray))

 
    }

    //This will add an interval of 2 seconds before the code is executed
    setTimeout(()=>
    {

        
    const dataBuffer=fs.readFileSync('wishlist.json');
    const data=JSON.parse(dataBuffer)
    console.log(data)
    res.send(data)

    },500);


    
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
    //Write the data from the wishlist file to the Database 
    const dataBuffer=fs.readFileSync('wishlist.json');
    const data=JSON.parse(dataBuffer)
    console.log("Content of Wishlis are as below")
    console.log(data)

    //Insert the Data to the Database
    for(let i=0;i<data.length;i++)
    {       
        //To get the Product ID
        let product_id=data[i].product_id
        //To get the Product Type
        let product_type=data[i].type;
        sql="select * from wishlist where user_id=? and product_id=? and product_type=?";
        connection.query(sql,[user_id,product_id,product_type],(error,result)=>
        {
            if(result==null||result=="")
            {
                sql="insert into wishlist values(?,?,?)";
                connection.query(sql,[user_id,product_id,product_type],(er,rs)=>
                {
                    if(er) throw er;
                    console.log(result)

                })

            }
            else{
                console.log("Product Already Exists");

            }
        })
      
    }

    //Below is the code t empty the contents of wishlist.json
    fs.readFileSync('wishlist.json',JSON.stringify(""))
    //Now the wishlist.json File is Emmpty

})


//Get Request for the Checkout Page
app.get("/checkout",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/checkout.html'))

})

//Search Functionallity 
//Get Request to load the search Page

app.get("/search",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/search.html'))
})

app.post("/searchProduct",(req,res)=>
{
    const insertedText=req.body.searchText;
    console.log(insertedText)
    const upper_text_insertedText=insertedText.toUpperCase()

    //Read the Simple.json File
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)

    //Loop through the data
 
  

   var finalArray=[]
   //For Fruits et Legumes Products
   for(let i=0;i<data.length;i++)
   {
   let product_name=data[i].name
   let upper_text_product_name=product_name.toUpperCase()
   if(upper_text_product_name.includes(upper_text_insertedText))
   {
       finalArray.push(data[i])
   }

   }
   
//    //For Dairy Products
//    for(let i=0;i<data.dairy.length;i++)
//    {
//        let product_name=data.dairy[i].name
//        let upper_text_product_name=product_name.toUpperCase()
//        if(upper_text_product_name.includes(upper_text_insertedText))
//        {
//            finalArray.push(data.dairy[i])
//        }
//    }
//    //For Meat Products
//    for(let i=0;i<data.meat.length;i++)
//    {    
//        let product_name=data.meat[i].name
//        let upper_text_product_name=product_name.toUpperCase()
//        if(upper_text_product_name.includes(upper_text_insertedText))
//         {
//             finalArray.push(data.meat[i]);
            
//         }
//    }
   console.log(finalArray)
   res.send(finalArray)
})

//To add the bill to theJSON File

app.post("/bill",(req,res)=>
{
    console.log(req.body)
    let subtotal=req.body.subtotal
    let shipping=req.body.shipping
    let taxes=req.body.taxes
    let total=req.body.total
    //Read the number of Items from the Cart.json files
    const dataBuffer=fs.readFileSync('cart.json')
    const data=JSON.parse(dataBuffer)
    var number=data.length;


    var myArray=[]
    myArray.push({"number":number,"subtotal":subtotal,"shipping":shipping,"taxes":taxes,"total":total})
 
    console.log("My Final Array")
    console.log(myArray)
    fs.writeFileSync('bill.json',JSON.stringify(''))

    fs.writeFileSync('bill.json',JSON.stringify(myArray))


})
//To read the bill from the JSON File
app.get("/readbill",(req,res)=>
{
    const dataBuffer=fs.readFileSync("bill.json")
    const data=JSON.parse(dataBuffer)
    console.log(data)
    res.send(data)
})


//Get Request to get the shiiping details
app.get("/shippingdetails",(req,res)=>
{   
 var myArray=[]
 function passArray(x)
 {
    myArray.push(x)
 }
sql="select address,postal_code from register where user_id=?";
connection.query(sql,[user_id],(error,result)=>
{
    if(error) throw error;
    console.log(result)
    console.log(result[0].address)
    console.log(result[0].postal_code)
passArray({"address":result[0].address})
passArray({"postal_code":result[0].postal_code})
   

})
//Second Sql Query
sql="select card_number from payment where user_id=?";
connection.query(sql,[user_id],(error,result)=>
{
    if(error) throw error;
    console.log(result)
   console.log(result[0].card_number)
   passArray({"card_number":result[0].card_number})

    
})

//Timeout 
setTimeout(()=>
{
    console.log("Inside Shipping Details")
    console.log("Value of finalArray")
    console.log(myArray)

res.send(myArray)

},1000)


    
})

//create an Order Table
sql="create table if not exists  orderTable(user_id int,order_id int,order_total decimal(6,2),order_status varchar(30),"+
"primary key(user_id,order_id),foreign key(user_id) references register(user_id)"+
" on delete cascade);";

connection.query(sql,(error,result)=>
{
    if(error) throw error;
    console.log("Order Table is Created"+result)
})

//get Request when you click Proceed
//Not yet Completed
app.get("/proceed",(req,res)=>
{           

    const dataBuffer=fs.readFileSync('bill.json')
    const data=JSON.parse(dataBuffer)
    console.log(data)

    var order_total=data[0].total
    console.log(order_total)

    var order_status="Placed";



    //user_id,order_id,order_total,order_status 
    sql="select order_id from orderTable where user_id=?";
    connection.query(sql,[user_id],(error,result)=>
    {
        if(error) throw error;
        console.log(result)
        if(result==""||result==null)
        {       
            order_id=1
            sql="insert into orderTable values(?,?,?,?)";
            connection.query(sql,[user_id,order_id,order_total,order_status],(er,rs)=>
            {
                if (er) throw er;
                console.log(rs);

                //Temp code starts Here

            })

        }
        else{

            console.log("Inside Else")
            var  result_index=result.length-1
            console.log(result_index)
            console.log(result[result_index].order_id)
            
             order_id=result[result_index].order_id+1
            console.log(order_id)
            console.log(typeof order_id)
           var string_order_id=order_id.toString()
            sql="insert into orderTable values(?,?,?,?)";
            connection.query(sql,[user_id,order_id,order_total,order_status],(er,rs)=>
            {
                if (er) throw er;
                console.log(rs);

               
                //Write the code to empty the contents of the File
                
            })


                //Temp code Ends Here  


            
        }
    })

})
    
//This api clear the content of the cart and writes the cart items to the db
app.get("/clearcart",(req,res)=>
{
    const dataBuffer=fs.readFileSync('cart.json')
    const data=JSON.parse(dataBuffer)

    console.log(data)
    console.log(data.length)

    for(let i=0;i<data.length;i++)
    {


        setTimeout(()=>
        {

            var product_id=data[i].product_id;
            var product_type=data[i].type
            console.log(product_id)
            console.log(product_type)
    
            sql="select * from orderProduct where user_id=? and order_id=? and product_id=? and product_type=?";
            connection.query(sql,[user_id,order_id,product_id,product_type],(er1,rs1)=>
            {
                if(er1) throw er1;
                console.log(rs1)
                if(rs1==""||rs1==null)
                {
                    console.log("Inside IF");
                    sql="insert into orderProduct values(?,?,?,?,null,null);";
                    connection.query(sql,[user_id,order_id,product_id,product_type,],(er2,rs2)=>
                    {
                        if(er2) throw er2;
                        console.log(rs2)
    
                    })
                }
                else{
    
                    console.log("Inside Elese");
                    console.log("The specific Data already Exists in the Cart")
    
                }
            })

        })
       
    }
    fs.writeFileSync('cart.json',JSON.stringify(""))


})



//Get Request to upload the order page
app.get("/order",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/order.html'))

})
//Store items while making the Order in the database

sql="create table if not exists orderProduct(user_id int,order_id int,product_id int,product_type varchar(50),product_rating int,product_review text"
+",primary key(user_id,order_id,product_id,product_type),foreign key(user_id,order_id) references orderTable(user_id,order_id) on delete cascade)";

//Now write the Sql command to create the connection
connection.query(sql,(err,res)=>
{
    if(err) throw err;
    console.log("orderProduct Table is created successfully "+res);
})

//Api for getting all the orders from the Order Table
app.get("/getorders",(req,res)=>
{
    sql="select * from orderTable where user_id=?";
    connection.query(sql,[user_id],(error,result)=>
    {
        if(error) throw error;
        console.log(result);
        res.send(result)
    })
})

/*This is a Testing code which is yet to start */
//Write an  Sql Query to 
// const dataBuffer=fs.readFileSync('cart.json')
// const data=JSON.parse(dataBuffer)
// console.log(data)
//The testing code ends Here


//Write the code to get the items associated with a particular user and prticualr order 


//To load the Admin Page
app.get("/admin",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/Admin.html'))
})

//To load Customer Derails PAge
app.get("/customerdetails",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/CustomerDetails.html'))
})

//Customer Details Api to get all the Registered Users
//Admin Section
app.get("/getusers",(req,res)=>
{
    sql="select * from register";
    connection.query(sql,(error,result)=>
    {
        if(error) throw error;
        console.log(result)

        res.send(result)

    })
})

//Admin Section APi
//To remove or block a particular user
app.get("/removeuser",(req,res)=>
{   let email=req.body.email;
    sql="delete from register where email=?;"
    connection.query(sql,[email],(error,result)=>
    {
        if (error) throw error;
        console.log(result)

    })
})

//Get Request to load the product Info PAge
//Admin Section
app.get("/productinfo",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/ProductInfo.html'))
})

//Admin Section
//To get a particular from the json File

app.post("/getproduct",(req,res)=>
{   
    console.log(req.body)
    let pid=req.body.product_id
    let ptype=req.body.type;
    console.log(pid)
    console.log(ptype)
    const dataBuffer=fs.readFileSync("simple3.json")
    const data=JSON.parse(dataBuffer)
    var finalArray=[]
    
    
    for(let i=0;i<data.length;i++)
    {

        if(data[i].product_id==pid && data[i].type==ptype)
        {
            console.log("Its a Dairy Product")
        
            //push the data (JSON Object) to the final Array
            console.log(data[i])
            finalArray.push(data[i])

        }
    }

     console.log(finalArray)
     res.send(finalArray)
})

//Admin Section 

//Update Product Info
app.post("/updateProductInfo",(req,res)=>
{           
    console.log("Update Product Info")

    console.log(req.body)

    let product_id=req.body.product_id
    let type=req.body.type
    let img=req.body.product_url;
    let price=req.body.product_price
    let Description=req.body.product_description
    let quantity=req.body.product_quantity
    let name=req.body.product_name

   

    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)
    var finalArray=[]

    for(let i=0;i<data.length;i++)
    {
        finalArray.push(data[i])

    }
    for(let i=0;i<finalArray.length;i++)
    {
        if(finalArray[i].product_id==product_id && finalArray[i].type==type)
        {
            finalArray[i].img=img
            finalArray[i].price=price
            finalArray[i].Description=Description
            finalArray[i].quantity=quantity
            finalArray[i].name=name
        }
    }

    //To Update the Contents of the File
  
    fs.writeFileSync('simple3.json',JSON.stringify(finalArray))

})

//To Load Meat Data User Side
app.get("/meatData",(req,res)=>
{
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)
    var finalArray=[]
    for(let i=0;i<data.length;i++)
    {
        if(data[i].type=="meat")
        {
            finalArray.push(data[i])
        }
    }
    res.send(finalArray)
})

//To Load Dairy Data User Side
app.get("/dairyData",(req,res)=>
{   
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)
    var finalArray=[]
    for(let i=0;i<data.length;i++)
    {
        if(data[i].type=="dairy")
        {
            finalArray.push(data[i])
        }
    }
    res.send(finalArray)

})

// To Load Fruits and vegetables User Side
app.get("/f&vData",(req,res)=>
{
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)
    var finalArray=[]
    for(let i=0;i<data.length;i++)
    {
        if(data[i].type=="fruitsetlegumes")
        {
            finalArray.push(data[i])
        }
    }
    res.send(finalArray)
})

app.get("/addproduct",(req,res)=>
{
    res.sendFile(path.resolve(__dirname,'views/html/AddProduct.html'))
})

app.post("/addnewproduct",(req,res)=>
{
    console.log(req.body)
    let product_name=req.body.product_name
    let product_price=req.body.product_price
    let product_type=req.body.product_type
    let product_description=req.body.product_description
    let product_quantity=req.body.product_quantity
    let product_img_url=req.body.product_img_url
    
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)
    var finalArray=[]
    for(let i=0;i<data.length-1;i++)
    {
        finalArray.push(data[i]);

    }
    
 
    finalArray.push({
        "product_id":parseInt(data.length-1),
        "name":product_name,
        "price":parseFloat(product_price),
        "type":product_type,
        "Description":product_description,
        "quantity":product_quantity,
        "img":product_img_url
    })
    finalArray.push({})
    console.log(finalArray)


    //Writing the data to the json File
    fs.writeFileSync('simple3.json',JSON.stringify(finalArray))
    //end of the Response 


})
//Testing APi starts HEre

app.get("/mytest",(req,res)=>
{
    const dataBuffer=fs.readFileSync('simple3.json')
    const data=JSON.parse(dataBuffer)

    var finalArray=[]
    let pid=4
    let ptype="dairy"

    for(let i=0;i<data.length;i++)
    {
        finalArray.push(data[i])
    }
    // To Update the final Array=

    for(let i=0;i<finalArray.length;i++)
    {
        if(finalArray[i].product_id==pid && finalArray[i].type==ptype)
        {
            finalArray[i].quantity=50
        }
    }

    res.send(finalArray)


   

})


//Testing API ends HEre