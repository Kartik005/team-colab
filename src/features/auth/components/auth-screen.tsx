"use client" // i.e. its a react component, not a react server component

import React from 'react'
import { useState } from 'react'
import { SignInFlow } from '../types'
import SignInCard from './sign-in-card'
import SignUpCard from './sign-up-card'

const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");

    // auth screen shows up when we are redirected to "/auth"


    return (
        <div>
            <div className='min-h-screen flex flex-col items-center justify-center bg-[#257180]'>
                <div className="mb-8 text-slate-100 text-center">
                    <h1 className="text-3xl font-bold">Welcome to Team-Colab</h1>
                    <p className="text-lg text-slate-100 mt-2">
                        Connect and Collaborate with your friends
                    </p>
                </div>
                <div className=' md:h-auto md:w-[420px]'>
                    {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}

                </div>
            </div>
        </div>
    )
}

export default AuthScreen