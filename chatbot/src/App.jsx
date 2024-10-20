import React from 'react'
import Dashboard from './Components/Dashboard'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Register from './Components/Register'
import Login from './Components/Login'
import Home from './Components/Home'

const App = () => {
  return (
    <div>
     <Routes>
     <Route path='' element={<Dashboard/>}/>
     <Route path='register' element={<Register/>}/>
     <Route path='login' element={<Login/>}/>
     <Route path='home' element={<Home/>}/>
     

     </Routes>
    </div>
  )
}

export default App


// import React from 'react';
// import Dashboard from './Components/Dashboard';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// const App = () => {
//   return (
//         <Router>
//           <Routes>
//           <Route path='/' element={<Dashboard />} />
//         </Routes>

//         </Router>
        
     
//   );
// };

// export default App;



// import React from 'react'
// import Register from './Components/Register'
// import Login from './Components/Login'
// import Dashboard from './Components/Dashboard'

// const App = () => {
//   return (
//     <div>
//     <Dashboard/>
      
//     </div>
//   )
// }

// export default App


