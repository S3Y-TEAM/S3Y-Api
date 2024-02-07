import express from 'express' ;
import prisma  from "./db/prisma.js" ;
const app = express() ;

const PORT = 8000 ;
app.get('/' , (req,res)=>{
    // const testo = async ()=>{
    //     const user =  await prisma.employee.create({
    //         data: {
    //             National_id : 22  ,     
    //             Fname : "Amr" ,              
    //             Lname : "khaled" ,                 
    //             Email : "amrk25112001@gmail.com" ,               
    //             Password  :"1234554" ,         
    //             Phone_number : "01220101"  ,      
    //             Personal_image :  "sfjkkdsjsj"  ,   
    //             country : "egyjpt" ,               
    //             city  : "mankls" ,                 
    //             Adress  :"masn" ,               
    //             user_name  : "allmkkrrr" ,            
    //             verified  : 1 ,             
                               
    //         },
    //     }) 

    //     //const Printo = await prisma.Links.findMany() ;
    //     //console.log(Printo) ;
    // }
    // testo() ;

      
    res.send('<h1>Hello</h1>')
})
app.listen(PORT , ()=> {
    console.log('app is listening on port ${PORT}') ;
}
)