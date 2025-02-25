import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
const backendLink = "http://localhost:3005";
axios.defaults.withCredentials = true;


const schema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters long'),
        // .refine(async (u) => {
        //     console.log("HI", u);
        //     const response = await axios.get(backendLink + `/api/v0/check-username/${u}`) as any;
        //     return !response.data.isUnique;
        //     }, 'Username is already taken! Please choose something else'),

    email: z.string()
        .min(1, { message: "Please enter your email" })
        .email("This is not a valid email."),
        // .refine(async (e) => {
        //     const response = await axios.get(backendLink + `/api/v0/check-email/${e}`) as any;
        //     return !response.data.isUnique;
        //     }, 'Email is already used! Please sign in'),

    photo: z.string().optional(),

    age: z.string().
        min(1, 'Age must be entered')
        .refine((p) => /^\d+$/.test(p), { message: "Age must only be a number" }),

    password: z.string().min(8, 'Password must be at least 8 characters').max(20, 'Password must be at most 20 characters').refine((p) => /[A-Z]/.test(p), {
        message: "Password must have an Uppercase Character",
      })
      .refine((p) => /[a-z]/.test(p), {
        message: "Password must have a Lowercase Character",
      })
      .refine((p) => /[0-9]/.test(p), { message: "Password must have a Number" })
      .refine((p) => /[!@#$%^&*]/.test(p), {
        message: "Password must have a Special Character (!, @, #, $, %, ^, &, *)",
      }),
});

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = handleSubmit(async (data) => {
        if (!data) {
            return;
        }
    
        try {
            console.log(backendLink + "/api/v0/signup");
    
            const response = await fetch(backendLink + "/api/v0/signup", {
                method: "POST",
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    age: data.age,
                    photo: data.photo,
                }),
            });
    
            const responseData = await response.json(); // Parse the JSON response
    
            if (response.ok && responseData.success) {
                console.log(responseData.message);
            } else {
                console.error('Please Sign Up again');
            }
    
        } catch (err) {
            console.error('Error during sign-up:', err);
        }
    });
    

    return (
        <div className='flex justify-center items-center min-h-screen p-4 bg-black text-white'>
            <form onSubmit={onSubmit} className="bg-blue-400 rounded-lg shadow-lg p-8 max-w-md w-full text-black">
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Username</label>
                    <input {...register("username")} type='username' className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" />
                    {errors.username && <p className="text-red-500 font-semibold text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input {...register("email")} type='email' className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"/>
                    {errors.email && <p className="text-red-500 font-semibold text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Age</label>
                    <input {...register("age")} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"/>
                    {errors.age && <p className="text-red-500 font-semibold text-sm mt-1">{errors.age.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Photo</label>
                    <input {...register("photo")} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"/>
                    {errors.photo && <p className="text-red-500 font-semibold text-sm mt-1">{errors.photo.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input {...register("password")} type='password' className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"/>
                    {errors.password && <p className="text-red-500 font-semibold text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black">Submit</button>
            </form>
        </div>
    )

}