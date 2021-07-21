import React from "react";
import { useForm } from "react-hook-form";

interface ILoginForm {
  email?: string;
  password?: string;
}

export const Login = () => {
    const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
    const onSubmit = () => {};
  
    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
            <h3 className="text-2xl text-gray-800">로그인</h3>
            <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
              <input
            ref={register({ required: "이메일을 입력해주세요." })}
            name="email"
            required
            type="email"
            placeholder="이메일"
            className="input"
              />
              {errors.email?.message && (
            <span className="font-medium text-red-500">
              {errors.email?.message}
            </span>
          )}
              <input
            ref={register({ required: "비밀번호를 입력해주세요.", minLength: 10 })}
            required
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input"
              />
          {errors.password?.message && (
            <span className="font-medium text-red-500">
              {errors.password?.message}
            </span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="font-medium text-red-500">
              비밀번호는 10자 이상이어야 합니다.
            </span>
          )}
          <button className="mt-3 btn">로그인</button>
            </form>
          </div>
        </div>
        );
};