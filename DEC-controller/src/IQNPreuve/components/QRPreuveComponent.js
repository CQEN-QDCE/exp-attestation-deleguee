/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React from 'react';
import QRCode from 'qrcode.react'

function QRPreuveComponent(props) {
	const content = JSON.parse(props.value); 
	console.log(content.invitation.invitation_url)
	
	return (
        <div>
            <h2>Preuve identité parent</h2>
            <p>Merci de présenter l'attestation d'identité du parent</p>
            <QRCode value={content.invitation.invitation_url} size={400}/>
        </div>
        
	);
}

export default QRPreuveComponent;