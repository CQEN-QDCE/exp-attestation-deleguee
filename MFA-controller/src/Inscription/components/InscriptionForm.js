/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React, { useState }      from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter,
         Dropdown, DropdownToggle, DropdownMenu, DropdownItem }  from 'reactstrap';
import { useHistory }           from 'react-router-dom'
import { useTranslation }       from 'react-i18next'
import { GET_API_SECRET }       from '../../config/constants'
import { GET_ISSUER_HOST_URL }  from '../../config/endpoints'
import                               '../../assets/styles/Forms.css'

const InscriptionForm = () => {

  /**
   * Set la librairie d'internationalisation
   */
  const { t } = useTranslation(['translation','identite', 'inscription']);

  /**
   * Definition des variables du formulaire
   */
  const [succursale, setSuccursale]                 = useState('Sillery')
  const [classe, setClasse]                         = useState('Garderie')
  const [periode, setPeriode]                       = useState('Temps complèt')
  
  // Controle de dropdown pour succursale 
  const [succursaleDropdownOpen, setSuccursaleOpen] = useState(false)
  const succursaleToggle = () => setSuccursaleOpen( !succursaleDropdownOpen)

  // Controle de dropdown pour la classe 
  const [classeDropdownOpen, setClasseOpen]         = useState(false)
  const classeToggle = () => setClasseOpen( !classeDropdownOpen) 

  // Controle de dropdown pour la periode  
  const [periodeDropdownOpen, setPeriodeOpen]       = useState(false)
  const periodeToggle = () => setPeriodeOpen( !periodeDropdownOpen)

  const [modal, setModal]                           = useState(false);
  const history                                     = useHistory();

  /**
   * Fais toggle entre le modal et le mode normal. 
   */
  const toggle = () => setModal(!modal);

  /**
   * Traitement du click du button. On passe à la création d'une invitation pour l'identité de l'enfant.  
   */
  const handleRequest = () => {
    creerInvitation('/qrinscription'); 
  }

  function creerInvitation(destination){

    fetch('/connections/create-invitation',
    {
      method: 'POST',
      headers: {
        'HOST'                         : `${GET_ISSUER_HOST_URL}`,
        'X-API-Key'                    : `${GET_API_SECRET()}`,
        'Content-Type'                 : 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin'  : '*', 
        'Access-Control-Allow-Methods' : 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS', 
        'Access-Control-Allow-Headers' : 'Content-Type', 
        'Access-Control-Max-Age'       : '86400'
      }
    }).then((
      resp => resp.json().then((
        data => 
          history.push(destination,
            {
              type: "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation", 
              data: {
                succursale  : succursale, 
                classe      : classe, 
                periode     : periode
              },
              invitation    : data
            } 
          )
      ))
    ))
  }

  return (
    <Form className="text-center FormBox">
      <h1 className="mb-5 pb-4 mt-3 header">{t('inscription:lblInscription')}</h1>
      <br />
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="succursale">Choisir la succursale: </Label>
            <Dropdown isOpen={succursaleDropdownOpen} toggle={succursaleToggle} >
                <DropdownToggle caret color="light" className="inputField rounded-pill" size="lg">
                    {succursale}
                </DropdownToggle>
                <DropdownMenu value={succursale} name="succursale">
                    <DropdownItem name="sillery"     onClick={(e) => { setSuccursale(e.target.innerText) }} size="lg" block> Sillery     </DropdownItem>
                    <DropdownItem name="Ste-Foy"     onClick={(e) => { setSuccursale(e.target.innerText) }} > Ste-Foy     </DropdownItem>
                    <DropdownItem name="Lebourgneuf" onClick={(e) => { setSuccursale(e.target.innerText) }} > Lebourgneuf </DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="classe">En classe de: </Label>
            <Dropdown isOpen={classeDropdownOpen} toggle={classeToggle} >
                <DropdownToggle caret color="light" className="inputField rounded-pill" size="lg">
                    {classe}
                </DropdownToggle>
                <DropdownMenu value={classe} name="classe">
                    <DropdownItem name="garderie"   onClick={(e) => { setClasse(e.target.innerText) }} > Garderie   </DropdownItem>
                    <DropdownItem name="Maternelle" onClick={(e) => { setClasse(e.target.innerText) }} > Maternelle </DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="classe">Période: </Label>
            <Dropdown isOpen={periodeDropdownOpen} toggle={periodeToggle} >
                <DropdownToggle caret color="light" className="inputField rounded-pill" size="lg">
                    {periode}
                </DropdownToggle>
                <DropdownMenu value={periode} name="periode">
                    <DropdownItem name="tempsComplet" onClick={(e) => { setPeriode(e.target.innerText) }} > Temps complèt </DropdownItem>
                    <DropdownItem name="tempsPartiel" onClick={(e) => { setPeriode(e.target.innerText) }} > Temps partiel </DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </FormGroup>
        </Col>
      </Row>
      <br /><br /><br /><br /><br /><br />
      <Button onClick={handleRequest} outline color="primary" className="m-3">{t('inscription:btnIdentityRequest')}</Button>
      <br />
      <br />
     
      <div>
        <Modal isOpen={modal} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>{t('identite:IQNIdentity')}</ModalHeader>
          <ModalBody>{t('identite:modalMessage')}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>{t('identite:ok')}</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    </Form>
  );
} 

export default InscriptionForm;
