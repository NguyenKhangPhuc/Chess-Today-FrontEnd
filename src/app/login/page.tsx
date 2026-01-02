'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

// Page to manage the visible login/signup form by the isLogin state
const Home = () => {
    const [isLogin, setIsLogin] = useState(true)
    return (
        <div className='w-full min-h-screen scroll-smooth login-container flex flex-col  items-center py-10 p-3'>
            <div className='font-bold text-3xl text-white py-10'>{isLogin ? 'Log in' : 'Sign up'}</div>
            {isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <SignUpForm setIsLogin={setIsLogin} />}
        </div>
    )
}
export default Home