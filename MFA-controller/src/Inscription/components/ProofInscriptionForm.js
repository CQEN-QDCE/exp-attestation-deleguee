/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React                      from 'react';
import { useTranslation }         from 'react-i18next'
import { Container, Col, Row, 
         FormGroup, Label   }     from 'reactstrap';
import Success                    from '../../assets/images/success.png';

function ProofInscriptionForm(props) {

    const {
        succursale,
        classe,
        periode,
        holderId,
        holderType,
        subjectId,
        subjectFirstNames,
        subjectLastName,
        subjectGender,
        subjectBirthplace,
        subjectBirthDate,
        subjectFatherFullName,
        subjectMotherFullName, 
        subjectPhoto
    } = props.data.data; 

    const { t } = useTranslation(['translation', 'inscription']);

    function getNomEnfant(){
        return subjectFirstNames + " " + subjectLastName; 
    }

    function getProf(){
        if(succursale === 'Sillery'){
            return "Fifi";
        } else if(succursale === 'Ste-Foy'){
            return "Mimi"; 
        } else if(succursale === 'Lebourgneuf'){
            return "Lili"; 
        }
    }

    function getGender(){
        if(subjectGender === "Female" | subjectGender === "Feminin"){
            return "F";
        } else if (subjectGender === "Male" | subjectGender === "Masculin"){
            return "M"; 
        }
    }

    return(
        <Container className="my-5">
        <Row form>
            <Col lg={4} className="text-center proof-left-col">
            <img className="text-center w-25" src={Success} alt="proof-banner" />
            <h4 className="ml-md-5 pb-4 mt-4">
                {t('inscription:msgInscriptionSuccess')}
            </h4>
            <p className="ml-md-5 pb-4 mt-2">
            {t('inscription:msgInscriptionSuccessCompl')}
            </p>
            <div className="text-center ">
                Votre enfant <b>{getNomEnfant()}</b>, {getGender() === "M" ? "né" : "née" } le <b>{subjectBirthDate}</b> à <b>{subjectBirthplace}
                </b>, {getGender() === "M" ? "fils" : "fille"} de <b>{subjectMotherFullName}</b> et <b>{subjectFatherFullName}</b>, 
                a été {getGender() === "M" ? "inscrit" : "inscrite"} avec success à la succursale de <b>{succursale}</b>, dans la classe de <b>{classe}</b> en
                période de <b>{periode}</b>, sous les soins de <b>Mme {getProf()}</b>. 
            </div>
            <br/>
            <br/>
            <br/>
            <div className="text-center">
                <p className="text-center" style={{ color: '#808080', fontSize: '10px' }}>
                    Numéro IQN d'identification de l'enfant (credentialSubject.id): {subjectId} <br/>
                    Numéro IQN d'identification du parent (holder.id) : {holderId} <br/> 
                    Schema de l'attestation : {window.env && window.env.IDENTITY_SCHEMA_ID ? window.env.IDENTITY_SCHEMA_ID : process.env.REACT_APP_SCHEMA_ID_IDENTITE} <br />
                    Credential definition id: {window.env && window.env.IDENTITY_CREDENTIAL_DEFINITION ? window.env.IDENTITY_CREDENTIAL_DEFINITION : process.env.REACT_APP_CRED_DEF_IDENTITE}
                </p>
            </div>
            </Col>
            <Col lg={4} className="text-center proof-left-col">
                <div id="preview">
                    <img src={subjectPhoto} id="photoPreview" width="400" />
                </div>
            </Col>
        </Row>
        </Container>
    );
}

export default ProofInscriptionForm;