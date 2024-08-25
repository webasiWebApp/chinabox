'use client'

import Image from 'next/image';

import SubmitUrlInput from './(component)/submitUrlInput';

import { useRouter } from 'next/navigation';
import { useAuth, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';


export default function Home() {

  const router = useRouter(); // Initialize the router
  const { isSignedIn } = useAuth(); // Get the user's sign-in status from Clerk

  const handleAddProductClick = () => {
    if (isSignedIn) {
      // If the user is signed in, redirect to "/chinabox"
      router.push('/chinabox');
    } else {
      // If the user is not signed in, trigger the sign-in popup
      document.querySelector('#sign-in-button').click(); // Programmatically trigger the SignInButton
    }
  };



  return (
    <div>
      <div className="flex flex-wrap justify-around items-center p-4">
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/1.png"
            alt="Logo 1"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/2.png"
            alt="Logo 2"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/3.png"
            alt="Logo 3"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/4.png"
            alt="Logo 4"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/5.jpeg"
            alt="Logo 5"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/6.png"
            alt="Logo 6"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/7.png"
            alt="Logo 7"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
        <div className="mb-1 me-5 ms-5">
          <Image
            src="/images/brandLogo/8.png"
            alt="Logo 8"
            width={100}
            height={100}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </div>
      </div>


      <section className='w-100 hero-sec  flex flex-col items-center justify-center'>
          <h1 className="text-6xl font-bold">
            <span className="text-black bg-green-500 px-2">Get it in to</span>{""}
            <span className="bg-red-500 px-2">China Box</span>
          </h1>
          <p className="mt-4 text-xl">
            Shop from <span className="text-yellow-300">everywhere</span>, get it in a
            single package
          </p>
          <p className="text-sm mt-2">
            Choose from any method that suits your preferences
          </p>
      </section>


      <section className='url-submit-sec mt-10 mb-10'>
       
        <div className="flex flex-wrap justify-around items-center gap-4 p-4">
          <div className="w-72 h-72 relative">
            <Image
              src="/images/step/step1.png"
              alt="Step 1"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="w-72 h-72 relative">
            <Image
              src="/images/step/step2.png"
              alt="Step 2"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="w-72 h-72 relative">
            <Image
              src="/images/step/step3.png"
              alt="Step 3"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="w-72 h-72 relative">
            <Image
              src="/images/step/step4.png"
              alt="Step 4"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>

      </section>


      <section className='submit-url-sec w-100 mt-10 mb-10 flex flex-column justify-center items-center '>
        <h2 className='text-2xl font-bold text-Blue-950 text-center'>Get started now </h2>
        <div>
          <button
            className="mx-5 p-2 bg-[#ef8121] text-white rounded hover:bg-[#d9751a] focus:outline-none"
            onClick={handleAddProductClick}
          >
            Add Product
          </button>

          {/* Hidden SignInButton to be triggered programmatically */}

          <div className='hidden'>
            <SignedOut>
              <SignInButton mode="modal" id="sign-in-button" />
            </SignedOut>
          </div>
         
        </div>

      </section>

    </div>
  );
}
