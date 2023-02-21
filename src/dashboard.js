/*dependecs*/
import { useEffect, useState } from 'react';
import './dashboard.css'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'
/*icons*/
import { FiArrowUpCircle } from 'react-icons/fi';
import { FiArrowDownCircle } from 'react-icons/fi';
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
   
    const [saidasTotal, setSaidasTotal] = useState('');
    const [entradasTotal, setEntradasTotal] = useState('');
    /*pega valor do input table*/
    const [valueInput, setValueInput] = useState("");
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
buscaEntradas();
buscaSaidas();
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
        if (resultado.entradas) {
            var valor = resultado.entradas;
            setTotalEntradas(valor);

        }
        if(resultado.nenhuma){
            setTotalEntradas('');

        }

    }

    async function buscaSaidas() {
        let response = await fetch('http://localhost:3001/buscarSaidas', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        const resultado = await response.json();
        setSaidasTotal(resultado.saidas)
        if (resultado.saidas) {
            var valor = resultado.saidas;

            setTotalSaidas(valor);
        }
        if(resultado.nenhuma){
            setTotalSaidas('');

        }
    }

    const deletarCookie = () => {
        Cookies.remove('email');
        Cookies.remove('x-access-token');
        history.push('/');
    }

    async function submitForm(event) {
        event.preventDefault();
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
            setTimeout(function () {
                buscaTodosRegistros()
                buscaSaidas();
                buscaEntradas();
                resultadoTotalSoma()
            }, 500);

        }
        if (result.error) {
            setIsValidInsert(false)
            setMessage(result.error)
        }
        console.log(result.enviado, result.error)

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
            setTotalSaidas('')
            setTotalEntradas('')
        }
        if (result.clear) {
            setIsValidInsert(true)
            setMessage(result.clear)
            setTotalSaidas('')
            setTotalEntradas('')
            buscaSaidas();
            buscaEntradas();
            resultadoTotalSoma()
            buscaTodosRegistros()
            setTimeout(function () {
                setMessage('');
                setValor('');
                setDescricao('');
            }, 1000);
        }


    }

    const handleChange = (event) => {
        setTipo(event.target.value);
    }

    
    async function handleDelete (key,e) {
        
        let response = await fetch('http://localhost:3001/deletRowTable', {
            method: 'POST',
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({ email: email, row: key })

        })
        const result = await response.json()
        if(result.clear){
            
            
                buscaTodosRegistros()
                buscaSaidas();
                buscaEntradas();
                resultadoTotalSoma()
    setMessage('DELETADO COM SUCESSO');
        }
    }
  const resultadoTotalSoma = () => {
          var valor = (entradasTotal - saidasTotal);
        
       
        return valor.toLocaleString()
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
                    <FiArrowUpCircle className='icons' color='blue' />
                    <h1 className='montantes' id='montante-entrada' >R$ {totalEntradas.toLocaleString('pt-BR') || 0} </h1>
                </div>
                <div className='bloco'>
                    <h1 className='bloco-title'>Saídas</h1>
                    <FiArrowDownCircle className='icons' size={23} color="red" />
                    <h1 className='montantes' id='montante-saida'>R$ {totalSaidas.toLocaleString('pt-BR') || 0}</h1>
                </div>
                <div className='bloco'>
                    <h1 className='bloco-title'>Total</h1>
                    <FcDebt className='icons' />
                    <h1 className='montantes' id='montante-total'>R$ {(totalEntradas - totalSaidas).toLocaleString('pt-BR')}</h1>
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
                    <button className='button-adcionar'>ADCIONAR</button>
                </form>
            </div>
            <div className={`message ${isValidInsert ? 'sucess' : 'error'}`}>
                {message}
            </div>
            <div class="loader" id='loader'>
                <div class="loader-tres-pontinhos">
                    <span></span>
                    <span></span>
                    <span></span>
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
                        return (
                            <tr key={key}>
                                <td>{val.descricao}</td>
                                <td>{val.valor}</td>
                                <td>{val.tipo}</td>
                                <td>
                                    <button 
                                    className='deletItemtable'
                                    onClick={e => handleDelete(key,e)}
                                    >
                                        <FaTrashAlt size={23} /></button>
                                </td>
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