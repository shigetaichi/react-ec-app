// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { signInAction } from './redux/users/actions';

// function App() {
//   const dispatch = useDispatch();//必ず定数に入れてから使う！！！
//   const selector = useSelector( (state) => state);
//   console.log(selector.users);
  
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         <button onClick={ () => dispatch( signInAction({uid: "0001", username: 'shige'}) )}>
//           Sign in
//         </button>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import Router from './Router';
import './assets/reset.css';
import './assets/style.css';
import { Header } from './components/Header/index';

const App = () => {
  return(
    <>
      <Header/>
      <main className="c-main">
        <Router/>
      </main>
    </>
    //Reactでは、並列にコンポーネントを並べて返すということができない。つまり、<></>が必要。
  )
}

export default App;