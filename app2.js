//app2.js 
//Testing File
const express=require('express')
const fs=require('fs')
const path=require('path')
let mysql=require('mysql2')

let signin_email="";
let signin_password="";

//Setting up the Sql Connection
const connection=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'root',
        database:'world'
    }
)
const app=express();

let sql="create table if not exists person("+
"person_id int primary key auto_increment,"+
"person_first_name varchar(20),person_last_name varchar(20),person_age int)";

connection.query(sql,(err,result)=>
{
    if(err) throw err;
    console.log("Table is Created "+result)
})

app.get("/insertperson",(req,res)=>
{
     sql="insert into person(person_first_name,person_last_name,person_age"+
     ") values(?,?,?)";
     let first_name='Mayank'
     let last_name='Tagra'
     let age=30
     connection.query(sql,[first_name,last_name,age],(err,res)=>
     {
         if (err) throw err;
         console.log("Number of Records Inserted"+res)
     })

     res.send("Inserted Data Successfully")
})
app.get("/hello",(req,res)=>
{
    res.send("Hello World")
})

app.listen(5000,()=>
{
    console.log("The Server is running at the Port 5000");

})