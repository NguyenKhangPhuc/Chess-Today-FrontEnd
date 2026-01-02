import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import Person4Icon from '@mui/icons-material/Person4';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks/mutation-hooks/useLogin';
import { LoginAttributes } from '../types/types';
import { useState } from 'react';
import VerifyCodeForm from './VerifyCodeForm';
import { useCreateVerificationCode } from '../hooks/mutation-hooks/useCreateVerificationCode';

const LoginForm = ({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [isVerified, setIsVerified] = useState(false)
    const [isOpenVerificationForm, setIsOpenVerificationForm] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        mode: 'onSubmit'
    });
    const { loginMutation } = useLogin({ router, queryClient, setIsVerified })
    const { createVerificationCodeMutation } = useCreateVerificationCode()
    const onSubmit = (values: LoginAttributes) => {
        console.log(values);
        loginMutation.mutate(values)
    };

    const handleCreateVerificationCode = async () => {
        const valid = await trigger('username');
        if (valid) {
            const usernameValue = getValues('username');
            setIsOpenVerificationForm(true)
            createVerificationCodeMutation.mutate(usernameValue)
        }
    }
    if (isOpenVerificationForm == true) return <VerifyCodeForm setIsOpenVerificationForm={setIsOpenVerificationForm} />
    return (

        <form className="flex flex-col xl:w-2/5 md:w-1/2 w-full general-backgroundcolor rounded-xl " onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col p-10 min-w-full gap-3'>
                <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center ">
                    <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                    <input
                        type='text'
                        placeholder='Username, phone number or email'
                        className="w-full outline-none text-sm"
                        {...register('username', { required: "Username is required" })}
                    />
                </div>
                {errors.username && <div className="text-red-900 text-sm">{errors.username.message}</div>}
                <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center">
                    <LockIcon sx={{ color: 'white', fontSize: 20 }} />
                    <input
                        type='password' placeholder='Password'
                        className="w-full outline-none text-sm"
                        {...register('password', { required: "Password is required", minLength: { value: 3, message: 'Password must be at least 8 character' }, maxLength: { value: 16, message: 'Password must be at most 16 characters' } })}
                    />
                </div>
                {errors.password && <div className="text-red-900 text-sm">{errors.password.message}</div>}
                <div className='flex justify-between items-center text-sm text-white'>
                    <div>
                        <input type="checkbox" className='mr-2' />
                        Remember me
                    </div>
                    <div className='cursor-pointer underline' onClick={() => { router.push('/login/forget-password') }}>Forgot password?</div>
                </div>

                {isVerified && <div className='w-full font-semibold uppercase text-[#6e3410] flex justify-fenter cursor-pointer underline' onClick={() => handleCreateVerificationCode()}>
                    Click here to verify your account
                </div>}
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
            <div className='w-full bg-black p-5 flex justify-center items-center' onClick={() => setIsLogin(false)}>
                <div className='text-white text-sm font-bold'>Don&apos;t have an account? <span className='cursor-pointer underline'>Sign up</span></div>
            </div>
        </form>
    )
}

export default LoginForm;