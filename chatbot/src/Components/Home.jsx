// import React from 'react'
// import axios from 'axios'
// import { useState, useEffect } from "react"




// import { Bounce, Flip, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom'


// const Home = () => {
    
  // const show2 = ()=>{
  //   toast.success('Successfully Loged In ', {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //     transition: Flip,
  //     });

  // }


  


  // window.addEventListener("load",show2)
  // axios.defaults.withCredentials=true

  // const [message,setmessage]= useState()
  // const navigate = useNavigate()


  // useEffect(()=>{
  //   axios.get('http://localhost:3001/dashboard')
  //   .then(res=>{
  //     if(res.data.valid){
  //       setmessage(res.data.message)
  //     }
  //     else{
  //       navigate('/login')

  //     }
  //   })
  //   .catch(err=>console.log(err))
  // })
  



//   return (
//     <div>
//         <div className='h-[100vh] w-[100%]  flex justify-center items-center bg-cover  ' style={{"backgroundImage":"url('../src/assets/back.jpg')"}}>
//         <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//           <div>
//             <textarea className='h-10 w-[500%] ml-[-150%] flex flex-wrap text-black p-8 rounded-2xl mt-[250%]'/>
//           </div>

//         </div>
            
//         </div>
//          <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"/>
    
      
      
//     </div>
//   )
// }

// export default Home


import React from 'react'
import axios from 'axios'
import { useState, useEffect } from "react"

import { Bounce, Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

import MonacoEditor from "@monaco-editor/react";


function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/analyze-code", {
        code,
        language,
      });
      setResponse(res.data); 
    } catch (error) {
      console.error("Error analyzing code", error);
    }
  };



  const show2 = ()=>{
    toast.success('Successfully Loged In ', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Flip,
      });

  }


  


  window.addEventListener("load",show2)
  axios.defaults.withCredentials=true

  const [message,setmessage]= useState()
  const navigate = useNavigate()


  useEffect(()=>{
    axios.get('http://localhost:3001/dashboard')
    .then(res=>{
      if(res.data.valid){
        setmessage(res.data.message)
      }
      else{
        navigate('/login')

      }
    })
    .catch(err=>console.log(err))
  })

  return (
    <div
      className="h-[100vh] w-[100%] bg-cover "
      style={{ backgroundImage: "url('../src/assets/back.jpg')" }}
    >
      <div className="h-screen w-full backdrop-filter backdrop-blur-lg ">
        <div className="h-[800px] w-[80%] ml-52 relative left-20">
          <h1 className=" text-[300%] text-white ml-[30%]">
            Code Fix
          </h1>

          <div>
            <label className="  text-xl text-white ml-[60%]">
              Choose Language:
            </label>
            <select
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
            </select>
          </div>

          <div className="mt-7 ">
            <MonacoEditor
              height="500px"
              width="1000px"
              language={language}
              value={code}
              onChange={(newCode) => setCode(newCode)}
              theme="vs-dark"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="text-white mt-6 ml-[35%]  text-2xl"
          >
            Analyze Code
          </button>

          {response && (
            <div>
              <h3>Analysis Results:</h3>
              <pre>{response}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
