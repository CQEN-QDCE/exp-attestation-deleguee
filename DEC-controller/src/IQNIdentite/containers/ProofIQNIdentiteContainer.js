/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React                            from 'react';
import { Button, Container, Col, Row }  from 'reactstrap';
import { useTranslation }               from 'react-i18next'
import ProofIQNIdentiteForm             from '../components/ProofIQNIdentiteForm';
import Success                          from '../../assets/images/success.png';
import '../../assets/styles/ProofContainer.css';

const ProofIQNIdentiteContainer = (props) => {

    const { t } = useTranslation(['translation', 'identite']); 
    
    return (
        <Container className="my-5">
            <Row form>
                <ProofIQNIdentiteForm data={props.location.state} />
                <Col lg={7} className="text-center proof-left-col">
                <img className="text-center w-25" src={Success} alt="proof-banner" />
                <h4 className="ml-md-5 pb-4 mt-4">
                    {t('identite:msgIssueSuccess')}
                </h4>
                <p className="ml-md-5 pb-4 mt-2">
                {t('identite:msgIssueSuccessCompl')}
                </p>
                <div className="text-center ">
                <Button className="mt-2" outline color="primary" size="lg" onClick={() => window.open("http://mfa-controller.apps.exp.lab.pocquebec.org/", "_blank")} >{t('identite:btnVerifyCred')}</Button>
                </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProofIQNIdentiteContainer;
