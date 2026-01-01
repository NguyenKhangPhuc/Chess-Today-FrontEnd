import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import Person4Icon from '@mui/icons-material/Person4';
import { useForm } from 'react-hook-form';
import { useSignUp } from '../hooks/mutation-hooks/useSignUp';
import { SignUpAttributes } from '../types/types';
import { useState } from 'react';
import VerificationForm from './VerifyCodeForm';
const SignUpForm = ({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [isOpenVerificationForm, setIsOpenVerificationForm] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            username: '',
            password: ''

        },
        mode: 'onSubmit'
    },);
    const { signUpMutation } = useSignUp({ setIsOpenVerificationForm })
    const onSubmit = (values: SignUpAttributes) => {
        console.log(values);
        signUpMutation.mutate(values)
    };
    if (isOpenVerificationForm) return <VerificationForm setIsOpenVerificationForm={setIsOpenVerificationForm} />
    return (
        <form className="flex flex-col xl:w-2/5 md:w-1/2 w-full general-backgroundcolor rounded-xl " onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col p-10 min-w-full gap-3'>
                <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center ">
                    <Person4Icon sx={{ color: 'white', fontSize: 20 }} />
                    <input
                        type='text'
                        placeholder='Full name'
                        className="w-full outline-none text-sm"
                        {...register('name', { required: "Name is required" },)}
                    />
                </div>
                {errors.name && <div className="text-red-900 text-sm">{errors.name.message}</div>}
                <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center ">
                    <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                    <input
                        type='text'
                        placeholder='Email' className="w-full outline-none text-sm"
                        {...register('username',
                            {
                                required: "Username is required", pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid Email",
                                }
                            }
                        )}
                    />
                </div>
                {errors.username && <div className="text-red-900 text-sm">{errors.username.message}</div>}
                <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center">
                    <LockIcon sx={{ color: 'white', fontSize: 20 }} />
                    <input
                        type='password' placeholder='Password'
                        className="w-full outline-none text-sm"
                        {...register('password', { required: "Password is required", minLength: { value: 8, message: 'Password must be at least 8 character' }, maxLength: { value: 16, message: 'Password must be at most 16 characters' } })}
                    />
                </div>
                {errors.password && <div className="text-red-900 text-sm">{errors.password.message}</div>}
                <div className='flex justify-between items-center text-sm text-white'>
                    <div>
                        <input type="checkbox" className='mr-2' />
                        Remember me
                    </div>
                    <div className='cursor-pointer underline'>Forgot password?</div>
                </div>

                <button
                    className="cursor-pointer bg-[#6e3410] w-full p-3 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2 hover:scale-105 duration-300 text-white mt-10"

                >
                    Login
                </button>

                <div className="flex items-center my-5 text-sm text-white">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="px-3 text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className='bg-[#302e2b] w-full p-4 text-white font-bold flex items-center gap-3 cursor-pointer  shadow-xl/30 hover:-translate-y-2 hover:scale-105 duration-300 rounded-lg'>
                    <AppleIcon sx={{ color: 'white' }} />
                    <div>Login with Apple</div>
                </div>
                <div className='bg-[#302e2b] w-full p-4 text-white font-bold flex items-center gap-3 cursor-pointer  shadow-xl/30 hover:-translate-y-2 hover:scale-105 duration-300 rounded-lg'>
                    <GoogleIcon sx={{ color: 'white' }} />
                    <div>Login with Google</div>
                </div>
                <div className='bg-[#302e2b] w-full p-4 text-white font-bold flex items-center gap-3 cursor-pointer  shadow-xl/30 hover:-translate-y-2 hover:scale-105 duration-300 rounded-lg'>
                    <FacebookIcon sx={{ color: 'white' }} />
                    <div>Login with Facebook</div>
                </div>
            </div>
            <div className='w-full bg-black p-5 flex justify-center items-center' onClick={() => setIsLogin(true)}>
                <div className='text-white text-sm font-bold'>Already have an account? <span className='cursor-pointer underline'>Sign up</span></div>
            </div>
        </form>
    )
}

export default SignUpForm