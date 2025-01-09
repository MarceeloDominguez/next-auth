"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

interface MyInputTypes {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MyInputTypes>();
  const router = useRouter();
  const [error, setError] = useState<String | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="text-white bg-red-500 text-md text-center font-bold p-2 mb-2 rounded-md">
            {error}
          </p>
        )}
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>
        <label
          htmlFor="email"
          className="text-slate-500 mb-2 block text-sm font-semibold"
        >
          Email:
        </label>
        <input
          type="email"
          placeholder="email@gmail.com"
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.email && (
          <span className="text-red-600">{errors.email.message}</span>
        )}

        <label
          htmlFor="password"
          className="text-slate-500 mb-2 block text-sm font-semibold"
        >
          Password:
        </label>
        <input
          type="password"
          placeholder="**********"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.password && (
          <span className="text-red-600">{errors.password.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4">
          Login
        </button>
      </form>
    </div>
  );
}
