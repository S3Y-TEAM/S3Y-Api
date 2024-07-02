import  prisma  from "../db/prisma.js";
import { Dropbox } from 'dropbox';
import fs from 'fs/promises';
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { getFieldOf , getFileFromResponse } from "./SignUp.js";
const dbx = new Dropbox({ accessToken: process.env.DBX_ACCESS_TOKEN });
import axios from "axios";
const imagesComparisonController = async(req,res)=>{
    //let token = req.headers.authorization.split(' ')[1] ;
    //const decodedToken = isTokenValid(token);
    const userName =  'amr';
    // send request to ai api and check of validation

    /**
     * 
     */

    // if valid 
    let imagesField = await getFieldOf(req.files , 'images') ;
    let imagesPath = await getFileFromResponse(imagesField,  'amr') ;

    const url = 'http://localhost:3000/calculate';
    const headers = {
        'Authorization': `Bearer ${process.env.DBX_ACCESS_TOKEN}`
    };
    // Define the data you want to send in the POST request
    const postData = {
        idPath: imagesPath[0].path,
        personalPath: imagesPath[1].path
    };

    axios.post(url, postData , {headers})
    .then(response => {
        // Handle the response data
        console.log('Response:', response.data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });


}
async function uploadFile(imagePath, dropboxPath) {
    try {
        // Read the image file
        const imageContent = await fs.readFile(imagePath);

        // Upload the image to Dropbox
        const response = await dbx.filesUpload({
            path: dropboxPath,
            contents: imageContent,
            mode: { '.tag': 'overwrite' }
        });

        console.log('Image uploaded:', response.result.name);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}
export {
    imagesComparisonController ,
    uploadFile
}