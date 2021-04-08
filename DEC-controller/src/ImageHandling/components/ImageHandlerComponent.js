/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React, { useState } from  'react'
import { render } from 'react-dom';

function ImageHandlerComponent(){

    const [selectedFile, setSelectedFile]         = useState('')
    const [selectedFileMime, setSelectedFileMime] = useState('')
    const [showing, setShowing]                   = useState('')

    function handleImage (event) {
        let file = event.target.files[0];
        setSelectedFileMime(event.target.files[0].type);
        //let fileEnc = '';
        let reader = new FileReader();
        reader.onload = function(event) {
            //fileEnc = Buffer.from(event.target.result).toString('base64'); 
            setSelectedFile(Buffer.from(event.target.result).toString('base64'));
        };
        reader.readAsArrayBuffer(file);
    }

    function showFile(){
        console.log("=====================================");
        console.log("Type: " + selectedFileMime);
        console.log("======>> "+ selectedFile);
        let showing = 'data:' + selectedFileMime + ';charset=utf-8;base64,' + selectedFile;
        setShowing(showing);
        //console.log(showing);
    }

    return(
        <div className="App">
            <input type="file" accept="image/*" onChange={handleImage}/> 
            <button onClick={showFile}>Show</button>
            <div>
                <img src={showing}></img>
            </div>

        </div>
    ); 

}
export default ImageHandlerComponent;