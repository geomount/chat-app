import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 5 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .refine((p) => /[A-Z]/.test(p), {
        message: "Password must have an Uppercase Character",
      })
    .refine((p) => /[a-z]/.test(p), {
        message: "Password must have a Lowercase Character",
      })
    .refine((p) => /[0-9]/.test(p), { 
        message: "Password must have a Number" })
    .refine((p) => /[!@#$%^&*]/.test(p), {
        message: "Password must have a Special Character (!, @, #, $, %, ^, &, *)",
    }),
});

export default function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = handleSubmit((data) => console.log(data))
    return (
        <div className='flex justify-center items-center min-h-screen p-4 bg-black text-white'>
            <form onSubmit={onSubmit} className="bg-blue-400 rounded-lg shadow-lg p-8 max-w-md w-full text-black">
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Username</label>
                    <input {...register("username")} type='username' className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-700" />
                    {errors.username && <p className="text-red-500 font-semibold text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input {...register("password")} type='password' className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-700"/>
                    {errors.password && <p className="text-red-500 font-semibold text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black">Submit</button>
            </form>
        </div>
    )

}