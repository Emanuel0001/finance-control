import './login.css';
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
import {RiMapPinUserFill} from 'react-icons/ri'
function App() {
  let history = useHistory();
  const [email, setIsEmail] = useState('');
  const [password, setIsPassword] = useState('');
  const [cookies, setCookie] = useCookies(['name']);
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /*valida email*/
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  /*mensagem erro*/
  const [messageError, setMessageError] = useState('');
  
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
  
  async function onSubmitForm(event) {
    event.preventDefault();
    var loader = document.getElementById('loader');
    loader.style.display = "flex"

    let response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    const result = await response.json()
    setMessageError(result.error)
   console.log(result.message)
    const token = result.token
    const NomeUser = result.nome
    setCookie("x-access-token", token, { path: "/", secure: "true" })
    setCookie("userName", NomeUser, { path: "/", secure: "true" })
    setCookie("email", email, { path: "/", secure: "true" })
    if(result.error){
    loader.style.display = "none"
    }
    if (result.message) {
      const resultadoCliente = await fetch('http://localhost:3001/client', {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'email': NomeUser
        }
      })
      if (resultadoCliente.status === 200) {
        history.push("/dashboard")
      } else {
    setMessageError('acesso invalido')
      
      }
    } else {

      let i = 0;
      while (i <= 1) {
        i++;
        if (i == 1) {
          document.getElementById('botao-entrar').disabled = false;
          continue;
        }
      }
    }

  }

const disabledButton = () => {
  if (isValidPassword && isEmailValid ){
    return false;
  } else { return true;}
}
  return (
    <div className='container'>
      <div className="login-container">
        <div className='left-container'>
          <img className='imagem-logo' src={imagem}></img>
        </div>
        <div className='right-container'>
          
          <form className="form-login" onSubmit={onSubmitForm}><RiMapPinUserFill size={150} className="icone-login"/>
            <label>Email <br />  </label>
            <input
              value={email}
              onChange={validaEmail}
              type="email"
              placeholder='@mail.com'
            ></input>
            
            <label>Password <br /></label>
            <input
              value={password}
              onChange={validaPassword}
              type="password"
              placeholder='password'
            ></input>
            <div id='resultado'>{messageError}</div>
            <div class="loader" id='loader'>
                <div class="loader-tres-pontinhos">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
           <button class='button-entrar' disabled={disabledButton()}>ENTRAR</button>
            <p>Não tem uma conta? <Link to='/cadastro' className='link-login'>Create Account</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
