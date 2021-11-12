
$(function(){

    var myArray=[];
    $.ajax({
        url:'http://localhost:6050/mydata',
        type:'GET',
        dataType:'json',

        success:function(response){
            myArray=response
            console.log("Hello Everyone");
           // console.log(myArray)
            console.log(myArray.dairy)
            buildTable(myArray)

        }
      
    })
    function buildTable(data)
    {
        var table=document.getElementById("mydiv")
        for(var i=0;i<data.dairy.length;i++)
        {
            var row1=`<div>
        
        <form action='/productinfo' method='GET'>       
        <div>
            <p class="item" id="user_item">${data.dairy[i].name}</p>
        </div>

        <div>
        <img class="productImage" src=${data.dairy[i].img} width="200px" height="200px">            
        </div>
        <div class="product_display item">

        <p>PRICE: ${data.dairy[i].price}</p>
        </div>
        <!--To Add Buttons-->
        

        <div class="buttonPanel">
            <button type="button" id="user_button" class="btn btn-primary user_view" onclick=viewProduct('${data.dairy[i].product_id}','${data.dairy[i].type}') >
            VIEW 
            </button>
            <button type="button" class="btn btn-success" onclick=addProduct('${data.dairy[i].product_id}','${data.dairy[i].type}')>ADD TO CART</button>
            <button  class="loveButton" type="button" onclick=addToWishlist('${data.dairy[i].product_id}','${data.dairy[i].type}') >
            <i class=" btn btn-danger fa fa-heart-o" ></i>
        </button>    
        </div>
        
            
            

        </div>`

        table.innerHTML+=row1;
        }

    }


})
   
function viewProduct(id,type)
{   
    //Start of view Product
    console.log("Id of the product is")
    console.log(id)

    // var product_id=id;
    // $.ajax({
    //     url:"http://localhost:6050/productinfo",
    //     type:"POST",
    //     dataType:"json",
    //     data:{"product_id":product_id},
    //     success:function(response)
    //     {
    //         console.log(response)
    //     }

  //  })
  $.ajax({
      url:"http://localhost:6050/viewproduct",
      type:"POST",
      dataType:"json",
      data:{
          "product_id":id,
          "type":type
      },
      success:function(response)
      {
          console.log(response)
      }
  })
  location.href="/viewpage"
  //End of view Product

}



function addProduct(id,type)
{
    console.log("Inside add Product")
    console.log(id)

    //To get the local Storage
    let count=localStorage.getItem("count")
    if(count==1)
    {
        window.location.href="/account"
    }
    else{

            $.ajax({
                url:"http://localhost:6050/addproduct",
                type:"POST",
                dataType:"json",
                data:{"product_id":id,"type":type},
                success:function(response)
                {
                    console.log(response)
                }
            })
    }
}

function addToWishlist(id,type)
{
    console.log("Isnide Add to wishlist");
    alert("Product added to Wishlist")
    console.log(id)
    console.log(type)
    $.ajax({
        url:"http://localhost:6050/addwish",
        type:"POST",
        dataType:"json",
        data:{"product_id":id,"type":type},
        success:function(response)
        {
            console.log(response)
        }
    })

}
function updateLocalStorage()
{
    console.log(localStorage.getItem("count"))
    localStorage.setItem("count",1);

}