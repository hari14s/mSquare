import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
   
        <div className='h-[100vh] w-screen bg-black'>

            <div className='h-20 w-screen bg-purple-600 flex flex-wrap'>
                <h1 className='mt-6 ml-14 text-3xl font-mono'>
                    CODE FIXER
                </h1>
            


            </div>
            <div className=' text-gray-100 flex flex-wrap'>
                <h1 className='font-serif text-[150%]  mt-20 ml-64'style={{ outline: 'none', caretColor: 'transparent' }}>
                <TypeAnimation
      sequence={[
       
        'Welcome to Code Fixer...',
        2000, 
        'Where Security meets Code...',
        2000,
        'Scan|Detect Fix and Secure...',
        2000,
        'Fill the code and Let us Fix...',
        2000
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
    />
                </h1>
               


            </div>
            <div className=' text-gray-400 flex flex-wrap text-xl'>
                <h1 className='flex mt-12 absolute ml-72 '>Your Code's Best Friend|Find Bugs Before They Find You!</h1>
                <p className='flex mt-20 ml-80 absolute'>
                Spot Bugs. Fix Fast. Code with Confidence.
                </p>

            </div>
            <img src="../src/assets/pic1.jpg" alt="Description" className='h-72 absolute flex flex-wrap ml-[60%] mt-[-60px]' />
            <div>
               <Link to="/register">
               <button className='text-xl h-10 w-28 bg- bg-purple-400 rounded-xl p-1 absolute ml-96 mt-44 font-serif  'style={{ outline: 'none', caretColor: 'transparent' }}>Get Started</button>
               </Link> 
            </div>
        </div>


      
    
  )
}

export default Dashboard
