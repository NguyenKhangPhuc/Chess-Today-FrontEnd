import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import Person4Icon from '@mui/icons-material/Person4';
import { useForm } from 'react-hook-form';
import { useVerifyCode } from '../hooks/mutation-hooks/useVerifyCode';
import { useCreateVerificationCode } from '../hooks/mutation-hooks/useCreateVerificationCode';
const VerificationForm = ({ setIsOpenVerificationForm }: { setIsOpenVerificationForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
        defaultValues: {
            code: '',
            username: '',

        },
        mode: 'onSubmit'
    },);
    const { verifyCodeMutation } = useVerifyCode({ setIsOpenVerificationForm })
    const { createVerificationCodeMutation } = useCreateVerificationCode();
    const onSubmit = (values: { code: string, username: string }) => {
        console.log(values);
        verifyCodeMutation.mutate(values);
    };

    const handleResendVerificationCode = async () => {
        const valid = await trigger('username');
        if (valid) {
            const usernameValue = getValues('username');

            createVerificationCodeMutation.mutate(usernameValue)
        }
    }
    return (
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
                <div className='w-full font-semibold uppercase text-[#6e3410] flex justify-fenter cursor-pointer underline' onClick={() => handleResendVerificationCode()}>
                    Resend code?
                </div>

                <button
                    className="cursor-pointer bg-[#6e3410] w-full p-3 rounded-lg shadow-xl/30 font-bold text-2xl hover:-translate-y-2 hover:scale-105 duration-300 text-white mt-10"

                >
                    Verify
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
        </form>
    )
}

export default VerificationForm