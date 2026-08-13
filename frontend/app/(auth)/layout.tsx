import Image from "next/image";
import React from "react";

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-5xl p-2 bg-white rounded-2xl flex flex-col md:flex-row shadow-xl overflow-hidden min-h-[600px] border border-gray-100 ">
      
        <div className="hidden md:block md:w-1/2 relative min-h-[500px]">
          <Image
            src={"/images/Authentication/Auth_Gradient_image.jpg"}
            alt="ProTrack Gradient Image"
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-lg" />
          <div className="absolute bottom-10 left-0 w-full px-8 z-10">
            <h1 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight drop-shadow-md">
              ProTrack
            </h1>
            <p className="mt-3 text-sm lg:text-base text-gray-200 font-medium drop-shadow-sm leading-relaxed max-w-sm">
              A smart way to track and manage your projects effortlessly.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
