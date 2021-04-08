/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React, { useState }      from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
         Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardColumns} from 'reactstrap';
import { useHistory }           from 'react-router-dom'
import { useTranslation }       from 'react-i18next'
import { v4 as uuidv4 }         from 'uuid'
import { GET_API_SECRET }       from '../../config/constants'
import { GET_ISSUER_HOST_URL }  from '../../config/endpoints'
import '../../assets/styles/Forms.css'

const IQNIdentiteForm = () => {

  /**
   * Set la librairie d'internationalisation
   */
  const { t } = useTranslation(['translation','identite']);

  function formatID(){
    return "did:sov:" + uuidv4().substring(25);
  }

  /**
   * Definition des variables du formulaire
   */
  const [issuanceDate, setIssuanceDate]             = useState('2020-10-08')
  const [id, setId]                                 = useState(formatID())
  const [firstNames, setFirstNames]                 = useState('Sarah')
  const [lastName, setLastName]                     = useState('Courcy')
  const [gender, setGender]                         = useState(t('translation:gender.female'))
  const [birthplace, setBirthplace]                 = useState('Ville de Québec, Québec, Canada')
  const [birthDate, setBirthDate]                   = useState('1976-11-08')
  const [fatherFullName, setFatherFullName]         = useState('Mathieu Courcy')
  const [motherFullName, setMotherFullName]         = useState('Marie Courcy')
  const [registrationNumber, setRegistrationNumber] = useState(uuidv4())
  const [holderChoix, setHolderChoix]               = useState(t('identite:holder.you'))
  const [holderType, setHolderType]                 = useState(t('identite:mother'))
  
  const [selectedFile, setSelectedFile]             = useState('')
  const [photoPreview, setPhotoPreview]             = useState('')

  // Date d'expiration calculée en fonction de l'âge légal, dans le cas d'attestation pour enfants
  let expirationDate = "";

  // Controle de dropdown pour gender 
  const [genderdropdownOpen, setGenderOpen] = useState(false)
  const gendertoggle = () => setGenderOpen( !genderdropdownOpen)
  // Controle de dropdown pour holder 
  const [holderDropdownOpen, setHolderOpen] = useState(false)
  const holderToggle = () => setHolderOpen( !holderDropdownOpen)
   
  /**
   * Fais toggle entre le modal et le mode normal. 
   */
  const toggle = () => setModal(!modal);
  const [modal, setModal]                   = useState(false);
  const history                             = useHistory();

  /**
   * Traitement du click du button. Si les champs obligatoires ne sont pas remplis, 
   * émmetre un message d'erreur et retourner l'usager au form; sinon, soumettre une 
   * appel pour faire la création d'une invitation de connection avec 
   * /connections/create-invitation. Redirect vers /qrcodecertnaissance. 
   */
  const handleRequest = () => {
    if (issuanceDate       === '' |
        id                 === '' | 
        firstNames         === '' | 
        lastName           === '' | 
        gender             === '' | 
        birthplace         === '' | 
        birthDate          === '' | 
        fatherFullName     === '' | 
        motherFullName     === '' | 
        registrationNumber === '' | 
        selectedFile       === '' ) {
      toggle();
    }
    else {
      if(holderChoix === t('identite:holder.you')){
        creerInvitation('/qriqnidentite'); 
      } else if(holderChoix === t('identite:holder.child')){
        calcMajority();
        creerInvitation('/qriqnpreuve'); 
      } else {
        alert("Probleme de parametrisation. Param invalide: " + holderChoix);
      }
    }
  }

    /**
     * Création du buffer de la photo, bien que de son preview. 
     * @param {*} event 
     */
    function handleFiles(event) {
  
        // Attributions initiales
        let files = event.target.files;
        let file  = files[0];
        let img   = document.createElement("img");

        img.width = 400;
        img.classList.add("obj");
        img.file  = file;

        // Faire la lecture du fichier sur disque, puis créér le buffer et le preview
        const reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { 
            aImg.src = e.target.result; 
            setPhotoPreview(aImg.src);  // créé la pre-visualisation de la photo
            setSelectedFile(aImg.src);  // créé le buffer de la photo
            return aImg.src;
        }; })(img);
        reader.readAsDataURL(file);
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
                issuanceDate       : issuanceDate, 
                expirationDate     : expirationDate, 
                id                 : id, 
                firstNames         : firstNames, 
                lastName           : lastName, 
                gender             : gender,
                birthplace         : birthplace, 
                birthDate          : birthDate, 
                fatherFullName     : fatherFullName, 
                motherFullName     : motherFullName, 
                registrationNumber : registrationNumber, 
                holderChoix        : holderChoix, 
                photo              : selectedFile
              },
              invitation: data
            } 
          )
      ))
    ))
  }

  /*
  * Fait le calcule de la date de majorité d'une personne, à partir de sa date de naissance. 
  * On assume que la majorité est atteinte à l'âge de 18 ans. 
  */
  function calcMajority(){
    let dateNaissance = birthDate.split('-');
    let expirationYear = parseInt(dateNaissance[0])+ 18;
    console.log( (expirationYear) + '-' + dateNaissance[1] + '-' + dateNaissance[2]);
    expirationDate = ((expirationYear) + '-' + dateNaissance[1] + '-' + dateNaissance[2]);    
  }

  function changePersonne(e){
      let target = e.target.innerText; 
      setHolderChoix(e.target.innerText)

      if(target === 'Vous' || target === 'Yourself'){
        setFirstNames('Sarah'); 
        setMotherFullName('Marie Courcy'); 
        setFatherFullName('Mathieu Courcy'); 
        setBirthDate('1976-11-08'); 
        setIssuanceDate('2019-07-17');
      } else {
        setFirstNames('Alice'); 
        setMotherFullName('Sarah Courcy'); 
        setFatherFullName('Michel Courcy'); 
        setBirthDate('2020-12-22'); 
        setIssuanceDate('2020-12-22');
      }
  }

  return (
    <Form className="text-center FormBox">
      <h1 className="mb-5 pb-4 mt-3 header">{t('identite:digitalID')}</h1>
      <br />
      <Row form>
      <Col md={4}>
          <FormGroup>
            <Label for="holderChoix">Faites-vous la demande pour:</Label>
            <Dropdown isOpen={holderDropdownOpen} toggle={holderToggle} >
                <DropdownToggle caret color="light" className="inputField rounded-pill">
                    {holderChoix}
                </DropdownToggle>
                <DropdownMenu value={holderChoix} name="holderChoix">
                    <DropdownItem name="self"   onClick={ changePersonne }> {t('identite:holder.you')}   </DropdownItem>
                    <DropdownItem name="child"  onClick={ changePersonne } > {t('identite:holder.child')} </DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </FormGroup>
        </Col>
      </Row>
      <Row form>
        <Col md={4}>
          <FormGroup>
            <Label for="firstNames">{t('identite:credentialSubject.firstNames')}</Label>
            <Input type="text" className="inputField rounded-pill" name="firstNames" id="firstNames" onChange={(e) => setFirstNames(e.target.value)} placeholder={t('identite:credentialSubject.firstNames')} value={firstNames} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="lastName">{t('identite:credentialSubject.lastName')}</Label>
            <Input type="text" className="inputField rounded-pill" name="lastName" id="lastName" onChange={(e) => setLastName(e.target.value)} placeholder={t('identite:credentialSubject.lastName')} value={lastName} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="birthDate">{t('identite:credentialSubject.birthDate')}</Label>
            <Input type="date" className="inputField rounded-pill" name="birthDate" id="birthDate" onChange={(e) => setBirthDate(e.target.value)} placeholder={t('identite:credentialSubject.birthDate')} value={birthDate} />
          </FormGroup>
        </Col>
        
        
        <Col md={4}>
          <FormGroup>
            <Label for="birthplace">{t('identite:credentialSubject.birthplace')}</Label>
            <Input type="text" className="inputField rounded-pill" name="birthplace" id="birthplace" onChange={(e) => setBirthplace(e.target.value)} placeholder={t('identite:credentialSubject.birthplace')} value={birthplace} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="fatherFullName">{t('identite:credentialSubject.fatherFullName')}</Label>
            <Input type="text" className="inputField rounded-pill" name="fatherFullName" id="fatherFullName" onChange={(e) => setFatherFullName(e.target.value)} placeholder={t('identite:credentialSubject.fatherFullName')} value={fatherFullName} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="motherFullName">{t('identite:credentialSubject.motherFullName')}</Label>
            <Input type="text" className="inputField rounded-pill" name="motherFullName" id="motherFullName" onChange={(e) => setMotherFullName(e.target.value)} placeholder={t('identite:credentialSubject.motherFullName')} value={motherFullName} />
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="issuanceDate">{t('identite:issuanceDate')}</Label>
            <Input type="date" className="inputField rounded-pill" name="issuanceDate" id="issuanceDate" onChange={(e) => setIssuanceDate(e.target.value)} placeholder={t('identite:issuanceDate')} value={issuanceDate} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="gender">{t('identite:credentialSubject.gender')}</Label>
            <Dropdown isOpen={genderdropdownOpen} toggle={gendertoggle}  className="inputField rounded-pill">
                <DropdownToggle caret color="light" className="inputField rounded-pill">
                    {gender}
                </DropdownToggle>
                <DropdownMenu value={gender} name="gender">
                    <DropdownItem name="male"   onClick={(e) => { setGender(e.target.innerText) }} >{t('translation:gender.male')}  </DropdownItem>
                    <DropdownItem name="female" onClick={(e) => { setGender(e.target.innerText) }} >{t('translation:gender.female')}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="registrationNumber">{t('identite:credentialSubject.registrationNumber')}</Label>
            <Input type="text" className="inputField rounded-pill" name="registrationNumber" id="registrationNumber" onChange={(e) => setRegistrationNumber(e.target.value)} placeholder={t('identite:credentialSubject.registrationNumber')} value={registrationNumber} />
          </FormGroup>
        </Col>
      </Row>
      <Row form>
            <Col md={4}>
                <FormGroup>
                    <Label for="photo">Photo</Label>
                    <Input type="file" className="inputField rounded-pill" name="photo" id="photo" onChange={handleFiles} placeholder="Photo" />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup>
                    <div id="preview">
                        <Label for="photoPreview">Photo</Label>
                        <img src={photoPreview} id="photoImage" width="400" />
                    </div>
                </FormGroup>
            </Col>
        </Row>

      <Button onClick={handleRequest} outline color="primary" className="m-3">{t('identite:btnIssue')}</Button>
      <br />
      <br />
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

export default IQNIdentiteForm;