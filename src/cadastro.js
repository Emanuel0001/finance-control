import './cadastro.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import React, { useState } from 'react'
import imagem from '../src/images/finance.png'
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";
import {RiMapPinUserLine} from 'react-icons/ri'
function App() {
  let history = useHistory();
  const [email, setIsEmail] = useState('');
  const [password, setIsPassword] = useState('');
  const [passwordConfirmacao, setIsPasswordConfirmacao] = useState('');

  const [nome, setIsNome] = useState('');
  const [cookies, setCookie] = useCookies(['name']);
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /*valida email*/

  const [isValidPasswordConfirm, setIsValidPasswordConfirm] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isValidName, setIsValidName] = useState(false);

  /*mensagem erro*/
  const [erroMessageConfirmacao,setPasswordErroMessageConfirmacao] = useState('')
  const [PasswordErroMessage, setPasswordErroMessage] = useState('');
  const [EmailErroMessage, setEmailErroMessage] = useState('');
  const [MessageError, setMessageError] = useState('');
  const [nameError, setNameError] = useState('');
  const validaEmail = (event) => {
    setIsEmail(event.target.value)
    if (emailRegex.test(email)) {
      setIsEmailValid(true);
      setMessageError('');
    } else {
      setIsEmailValid(false);
      setMessageError('Inválido');
    }
  }
 console.log(password,passwordConfirmacao)
  const validaPasswordConfirmacao = (event) => {
    setIsPasswordConfirmacao(event.target.value)
   
    if (passwordConfirmacao.length >= 7) {
      setIsValidPasswordConfirm(true);
      setMessageError(' ');
    } else {
      setIsValidPasswordConfirm(false);
      setMessageError('Mínimo 8 caracters');
    }
  }
  const validaPassword = (event) => {
    setIsPassword(event.target.value)
    if (password.length >= 7 ) {
      setIsValidPassword(true);
      setMessageError('');
    } else {
      setIsValidPassword(false);
      setMessageError('Mínimo 8 caracters');
    }
  }
  const validaNome = (event) => {
    setIsNome(event.target.value)
    if( nome.length < 1) {
      setIsValidName(false)
      setMessageError('nome invalido')
    } else {
      setIsValidName(true)
      setNameError('')

    }
  }
  
  async function onSubmitForm(event) {
    event.preventDefault();
    console.log("clicou")
    let response = await fetch('http://localhost:3001/cadastrarClient', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, passwordConfirmacao: passwordConfirmacao, name: nome })
    })
    const result = await response.json()
     if(result.error){
      setMessageError(result.error)
    }
    if(result.cadastrado){
      setMessageError(result.cadastrado)
    } 
  }

const disabledButton = () => {
  if (isValidPassword && isEmailValid ){
    return false;
  } else { return true;}
}
  return (
    <div className='container'>
      <div className="cadastro-container">
        <div className='left-container'>
          <img className='imagem-logo' src={imagem}></img>
        </div>
        <div className='right-container'>
          <form className="form-cadastro" onSubmit={onSubmitForm}> 
            <label>Email <br />  </label>
            <input
              value={email}
              onChange={validaEmail}
              type="email"
              placeholder='@mail.com'
            ></input>
            <div className={`message ${isValidPassword ? 'success' : 'error'}`}>
              {EmailErroMessage}
            </div>
            <label>Password <br /></label>
            <input
              value={password}
              onChange={validaPassword}
              type="password"
              placeholder='password'
            ></input>

             <label>confirm Password <br /></label>
            <input
              value={passwordConfirmacao}
              onChange={validaPasswordConfirmacao}
              type="password"
              placeholder='password'
            ></input>
            <label>Name <br /></label>
            <input
              value={nome}
              onChange={validaNome}
              type="text"
              placeholder='first Name'
            ></input>
            <div id='resultado'>{MessageError}</div>
            <button className='button-casdastrar' >Cadastrar-se</button>
            <p>Possuí uma conta? <Link to='/' className='link-login'>Fazer login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
