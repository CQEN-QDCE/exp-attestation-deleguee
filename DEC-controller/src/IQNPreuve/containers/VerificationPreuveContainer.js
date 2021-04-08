/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React, { useState, useEffect }  from 'react';
import { Container, Spinner }          from 'reactstrap'
import { useTranslation }              from 'react-i18next'
import { GET_API_SECRET }              from '../../config/constants' 
import { fetchWithTimeout }            from '../../helpers/fetchWithTimeout'
import '../../assets/styles/Forms.css';

function VerificationPreuveContainer(props) {

    let INTERVAL = 5000; 
    let TIMEOUT  = 3000; 

    const { t } = useTranslation('identite');

    const [presentation_exchange_id, setPresentationExchangeId] = useState(props.location.state.presentation_exchange_id)


    /*console.log("=================Verfier data =================")
    console.log("Exchange-id: " + props.location.state.presentation_exchange_id)
    console.log("data: " + props.location.state.data); 
    console.log("data: " + props.location.state.data.motherFullName); 
    console.log("connection_id" + props.location.state.connection_id) */

    useEffect(() => {

        setPresentationExchangeId(props.location.state.presentation_exchange_id)
        // console.log("Presentation exchange ID: " + props.location.state.presentation_exchange_id); 
        getConnectionInfo()
    }
    , []);

	function getConnectionInfo() {
		try {
			fetchWithTimeout(`/present-proof/records/${presentation_exchange_id}`,
				{
					method: 'GET',
					headers: {
						'X-API-Key': `${GET_API_SECRET()}`,
						'Content-Type': 'application/json; charset=utf-8',
					}
				}, TIMEOUT).then((
					resp => {
						try {
							resp.json().then((data => {
								if (data.state) {
									let intervalFunction;
									data.state === "request_sent" ? intervalFunction = setTimeout(getConnectionInfo, INTERVAL) : VerifyPresentation(presentation_exchange_id);
								} else {
									console.log('En attent de réponse!');
									setTimeout(getConnectionInfo, INTERVAL)
								}
							}))
						} catch (error) {
							setTimeout(getConnectionInfo, INTERVAL)
						}
					}
				))
		} catch (error) {
			console.log(error);
			setTimeout(getConnectionInfo, INTERVAL)
		}
	}

    const VerifyPresentation = (presentation_exchange_id) => {
        fetch('/present-proof/records/' + presentation_exchange_id + '/verify-presentation', 
			{
				method : 'POST', 
				headers: {
                    'X-API-Key'                         : `${GET_API_SECRET()}`,
					'Content-Type'                      : 'application/json; charset=utf-8',
					'Access-Control-Allow-Origin'       : '*', 
					'Access-Control-Allow-Methods'      : '*',
					'Access-Control-Allow-Headers'      : '*', 
					'Access-Control-Allow-Credentials'  : 'true'
				},
				body:{}
			}
		).then(response => response.json())
         .then(data => {
            
            let subjectId         = data.presentation.requested_proof.revealed_attrs.subjectId.raw
            let subjectFirstNames = data.presentation.requested_proof.revealed_attrs.subjectFirstNames.raw
            let subjectLastName   = data.presentation.requested_proof.revealed_attrs.subjectLastName.raw
            let subjectBirthDate  = data.presentation.requested_proof.revealed_attrs.subjectBirthDate.raw
    
            /*console.log("Mother full name: " + props.location.state.data.motherFullName); 
            console.log("===== Preuve du parent =====")
            console.log("SubjectId: " + subjectId)
            console.log("SubjectFirstNames: " + subjectFirstNames)
            console.log("SubjectLastName: " + subjectLastName)
            console.log("subjectBirthDate: " + subjectBirthDate)
            console.log(props.location.state.data.motherFullName) */

            props.history.push('/emissionidentite', {
                data              : props.location.state.data, 
                connection_id     : props.location.state.connection_id,
                parentId          : subjectId, 
                parentFirstNames  : subjectFirstNames, 
                parentLastName    : subjectLastName, 
                parentBirthDate   : subjectBirthDate
            })
        });
    }
 
    return (
        <Container className="mt-5 pt-5">
            <br /><br /><br /><br />
            <div className="text-center FormBox mt-5 pt-5">
                <h3 className="mb-5 pb-4 mt-2 header"> {t('identite:lblVerification')} </h3>
                <br />
                <p>
                    <h4>{t('identite:msgVerification1')} </h4>
                        {t('identite:msgVerification2')}
                </p>
                <p>
                    {t('identite:msgWait')}
                </p>
                <Spinner /> 
                
            </div>
        </Container>
    );
}

export default VerificationPreuveContainer;