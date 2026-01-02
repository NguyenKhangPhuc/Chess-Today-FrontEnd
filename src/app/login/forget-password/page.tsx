'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import Person4Icon from '@mui/icons-material/Person4';
import { useCreateVerificationCode } from '@/app/hooks/mutation-hooks/useCreateVerificationCode';
import { useUpdatePassword } from '@/app/hooks/mutation-hooks/useUpdatePassword';
import { useRouter } from 'next/navigation';
const Home = () => {
    const router = useRouter();
    const { createVerificationCodeMutation } = useCreateVerificationCode();
    const { updatePasswordMutation } = useUpdatePassword({ router });
    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
        defaultValues: {
            username: '',
            code: '',
            oldPass: '',
            newPass: '',

        },
        mode: 'onSubmit'
    },);
    const handleResendVerificationCode = async () => {
        const valid = await trigger('username');
        if (valid) {
            const usernameValue = getValues('username');

            createVerificationCodeMutation.mutate(usernameValue)
        }
    }

    const onSubmit = (values: { username: string, code: string, oldPass: string, newPass: string }) => {
        console.log(values);
        updatePasswordMutation.mutate(values)
    }

    return (
        <div className='w-full min-h-screen scroll-smooth login-container flex flex-col  items-center py-10 p-3'>
            <div className='font-bold text-3xl text-white py-10'>Forget Password</div>
            <form className="flex flex-col xl:w-2/5 md:w-1/2 w-full general-backgroundcolor rounded-xl " onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col p-10 min-w-full gap-3'>
                    <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center ">
                        <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                        <input
                            type='text'
                            placeholder='Email/Username' className="w-full outline-none text-sm"
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
                            type='password' placeholder='Verification code'
                            className="w-full outline-none text-sm"
                            {...register('code', { required: "Verification code is required", minLength: { value: 6, message: 'Password must be 6 character' }, maxLength: { value: 6, message: 'Password must be 6 characters' } })}
                        />
                    </div>
                    {errors.code && <div className="text-red-900 text-sm">{errors.code.message}</div>}
                    <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center">
                        <LockIcon sx={{ color: 'white', fontSize: 20 }} />
                        <input
                            type='password' placeholder='Old password'
                            className="w-full outline-none text-sm"
                            {...register('oldPass', { required: "Old password is required", minLength: { value: 8, message: 'Password must be at least 8 character' }, maxLength: { value: 16, message: 'Password must be at most 16 characters' } })}
                        />
                    </div>
                    {errors.oldPass && <div className="text-red-900 text-sm">{errors.oldPass.message}</div>}
                    <div className="w-full flex p-3 gap-2 bg-[#302e2b] text-white items-center">
                        <LockIcon sx={{ color: 'white', fontSize: 20 }} />
                        <input
                            type='password' placeholder='New Password'
                            className="w-full outline-none text-sm"
                            {...register('newPass', { required: "New password is required", minLength: { value: 8, message: 'Password must be at least 8 character' }, maxLength: { value: 16, message: 'Password must be at most 16 characters' } })}
                        />
                    </div>
                    {errors.newPass && <div className="text-red-900 text-sm">{errors.newPass.message}</div>}
                    <div className='w-full font-semibold uppercase text-[#6e3410] flex justify-fenter cursor-pointer underline' onClick={() => handleResendVerificationCode()}>
                        Click here to receive the code
                    </div>

                    <button
                        className="cursor-pointer bg-[#6e3410] w-full p-3 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2 hover:scale-105 duration-300 text-white mt-10"

                    >
                        Update password
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
                    <div className='w-full bg-black p-5 flex justify-center items-center' onClick={() => { router.push('/login') }}>
                        <div className='text-white text-sm font-bold'>Already have an account?<span className='cursor-pointer underline'>Login</span></div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default Home