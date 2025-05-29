import LoginButton from "../components/LoginButton";
import HYR_Studio_logo from "../assets/HYR_Studio_logo.png";

export default function SignInForm() {
 

  return (
    <div className='flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto mt-30 sm:w-full sm:max-w-sm'>
        <img
          className='mx-auto h-auto w-full'
          src={HYR_Studio_logo}
          alt='Content Catalyst Logo'
        />
        <h2 className='mt-10 mb-12 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
      </div>

      <LoginButton />

      <p className='mt-10 text-center text-sm/6 text-gray-500'>
        Not a member?{" "}
        <a
          href='#'
          className='font-semibold text-indigo-600 hover:text-indigo-500'
        >
          Contact Us!
        </a>
      </p>
    </div>
  );
}
