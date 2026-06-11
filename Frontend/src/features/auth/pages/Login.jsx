import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, Navigate } from 'react-router'
import useAuth from '../hook/useAuth.js'




const Login = () => {

  const user = useSelector((state) => state.auth.user) 
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)


  const navigate = useNavigate()

  const {handelLogin} = useAuth()


  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value
    })
  }

  const onSubmit = async(e) => {
    e.preventDefault()
    // console.log(loginData)

    const payload = loginData
    await handelLogin(payload)
    navigate("/")
  }
  if(!loading && user){
        return <Navigate to="/" replace />
    }

  return (
    <>
      <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
        <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center'>
            <div className='w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur'>
                <h1 className='text-3xl font-bold text-[#31b8c6]'> Welcome Back</h1>
                <p className='mt-2 text-sm text-zinc-300'>Please enter your email and password to login.</p>
                <form onSubmit={onSubmit} className='mt-8 space-y-5'>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-200">Email</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email"
                            value={loginData.email}
                            onChange={onChange}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"/>   
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-200">Password</label>
                        <input 
                            type="text" 
                            id="password" 
                            name="password"
                            value={loginData.password}
                            onChange={onChange}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"/>
                    </div>
                    <div>
                        <button type='submit' className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)]">Login</button>
                    </div>
                </form>

                <p className='mt-4 text-center text-sm text-zinc-300'>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-[#31b8c6] hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
      </section>
    </>
  )
}

export default Login
