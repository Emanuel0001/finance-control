import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
  import { Redirect } from "react-router-dom";
  import login from './login'
  import dashboard from "./dashboard";
  import cadastro from './cadastro'
  const router = () => { 
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={login} />
          <Route exact path='/cadastro' component={cadastro}></Route>
          <Route exact path='/DashBoard' component={dashboard}></Route>
        </Switch>
      </Router>
    )
  }
  
  export default router;