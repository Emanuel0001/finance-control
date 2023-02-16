/*dependecs*/
import { useEffect, useState } from 'react';
import './dashboard.css'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'
/*icons*/
import { FcUp } from 'react-icons/fc';
import { FcDown } from 'react-icons/fc';
import { FcDebt } from 'react-icons/fc';
import { AiFillBank } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'
import { SlLogout } from 'react-icons/sl'

function Dashboard() {
    let history = useHistory();

    const [Nome, setNameUser] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('entrada');
    const [dados, setDados] = useState([]);
    const [totalEntradas, setTotalEntradas] = useState('');
    const [totalSaidas, setTotalSaidas] = useState('');
    const [message, setMessage] = useState('');

    const [isValidDescricao, setIsValidDescricao] = useState(false);
    const [isValidValor, setIsValidValor] = useState(false);

    const [isValidInsert, setIsValidInsert] = useState(false)

    const userName = Cookies.get("userName")
    const email = Cookies.get("email")

    useEffect(() => {
        buscaTodosRegistros();

        setNameUser(userName);
        const token = Cookies.get('x-access-token');
        async function validaToken() {
            const resultadoCliente = await fetch('http://localhost:3001/client', {
                method: "GET",
                headers: {
                    'x-access-token': token
                }
            })
            if (resultadoCliente.status != 200) {
                history.push('./')
            }
        } validaToken()

        buscaSaidas();
        buscaEntradas();

    }, []);

    const validaDescricao = (event) => {
        setDescricao(event.target.value);
        if (descricao.length >= 2) {
            setIsValidDescricao(true);
        } else {
            setIsValidDescricao(false)
        }

    }
    const validaValor = (event) => {
        setValor(event.target.value)
        if (valor.length >= 2) {
            setIsValidValor(true);
        } else {
            setIsValidValor(false);
        }
    }
    async function buscaTodosRegistros() {
        var loader = document.getElementById('loader');
        loader.style.display = "flex"
        let response = await fetch('http://localhost:3001/buscarRegistros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        const resultado = await response.json();
        const list = resultado.resultado.rows;
        setDados(list);
        loader.style.display = "none"
        console.log('sou suas saidas', resultado.saidas)
    }

    async function buscaEntradas() {
        let response = await fetch('http://localhost:3001/buscarEntradas', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        const resultado = await response.json();
        setTotalEntradas(resultado.entradas)
    }

    async function buscaSaidas() {
        console.log('saidas buscando')
        let response = await fetch('http://localhost:3001/buscarSaidas', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        const resultado = await response.json();
        setTotalSaidas(resultado.saidas)
    }

    const deletarCookie = () => {
        Cookies.remove('email');
        Cookies.remove('x-access-token');
        history.push('/');
    }

    async function submitForm(event) {
        event.preventDefault();
        console.log('clicou')
        let response = await fetch('http://localhost:3001/insertTable', {
            method: 'POST',
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({ descricao: descricao, valor: valor, tipo: tipo, email: email })
        })
        const result = await response.json()
        if (result.enviado) {
            setIsValidInsert(true)
            setMessage('ADCIONADO COM SUCESSO')
        }
        if (result.error) {
            setIsValidInsert(false)
            setMessage(result.error)
        }
        console.log(result.enviado, result.error)
        setTimeout(function () {
            buscaTodosRegistros()
            buscaSaidas();
            buscaEntradas();
        }, 500);

        setTimeout(function () {
            setMessage('');
            setValor('');
            setDescricao('');
        }, 1000);

    }
    async function deletaAll() {
        const click = 'clicou'
        let response = await fetch('http://localhost:3001/deletAllTable', {
            method: 'POST',
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({ email: email, click: click })

        })
        const result = await response.json()
        if (result.error) {
            setIsValidInsert(false)
            setMessage(result.error)
        }
        if (result.clear) {
            setIsValidInsert(true)
            setMessage(result.clear)
            buscaTodosRegistros()
        }
        
        buscaSaidas();
        buscaEntradas();
    }

    const disabledButton = () => {
        if (isValidDescricao && isValidValor) {
            return false;
        } else {
            return true;
        }
    }
    const handleChange = (event) => {
        setTipo(event.target.value);
    }
    return (
        <div className='container-dashboard'>
            <div className='logo'><AiFillBank size={36} /></div>
            <div className='menu-container'>
                Olá, <b>{Nome}</b>!
            </div>
            <div className='sair'>
                <SlLogout size={25} onClick={deletarCookie} />
            </div>
            <div className='container-header'>
                <h1>Controle Financeiro</h1>
            </div>
            <div className='container-body'>
                <div className='bloco'>
                    <h1 className='bloco-title'>Entradas</h1>
                    <FcUp className='icons' />
                    <h1 className='montantes'>R$ {totalEntradas || 0} </h1>
                </div>
                <div className='bloco'>
                    <h1 className='bloco-title'>Saídas</h1>
                    <FcDown className='icons' />
                    <h1 className='montantes'>R$ {totalSaidas || 0}</h1>
                </div>
                <div className='bloco'>
                    <h1 className='bloco-title'>Total</h1>
                    <FcDebt className='icons' />
                    <h1 className='montantes'>R$ {totalEntradas - totalSaidas}</h1>
                </div>
            </div>
            <div className='form-container'>
                <form className='form-dasboard' onSubmit={submitForm}>
                    <input
                        type='text'
                        placeholder='Descricão'
                        value={descricao}
                        onChange={validaDescricao}
                        className='descricao'></input>
                    <input
                        type="number"
                        value={valor}
                        onChange={validaValor}
                        placeholder='Valor'></input>
                    <select onChange={handleChange}>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saida</option>
                    </select>
                    <button className='button-adcionar' disabled={disabledButton()}>ADCIONAR</button>
                </form>
            </div>
            <div className={`message ${isValidInsert ? 'sucess' : 'error'}`}>
                {message}
            </div>
            <div class="loader" id='loader'>
                <div class="loader-tres-pontinhos">
                    <span>oi</span>
                    <span>oi</span>
                    <span>oi</span>
                </div>
            </div>
            <div className='table-container'>
                <table>
                    <tr>
                        <th>Descricão</th>
                        <th>Valor</th>
                        <th>tipo</th>
                    </tr>
                    {dados.map((val, key) => {
                        console.log(val.valor,val.tipo,val.descricao,key)
                        return (
                            <tr key={key}>
                                <td>{val.descricao}</td>
                                <td>{val.valor}</td>
                                <td>{val.tipo}</td>
                                <td> <FcDown size={30} /></td>
                                <td><FaTrashAlt size={23} color="red" /></td>
                            </tr>
                        )
                    })}
                </table>

            </div>

            <div className='deletButton'>
                <button className='deletAll' onClick={deletaAll}>Limpar</button>
            </div>
        </div>
    );
}

export default Dashboard;