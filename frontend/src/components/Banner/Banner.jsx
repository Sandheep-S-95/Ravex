import CarouselComponent from "./CarouselComponent";
import BannerVideo from "../../assets/banner.mp4"; // Import the video as a module

function Banner() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={BannerVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with subtle gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Banner Content */}
      <div className="relative mx-auto max-w-7xl px-4 pt-28 flex flex-col justify-around h-full">
        <div className="flex flex-col justify-center items-center h-[40%] text-center">
          {/* Larger, gradient title */}
          <h2 className="text-7xl font-extrabold font-montserrat mb-2 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400 drop-shadow-lg">
              RAVEX
            </span>
          </h2>
          
          {/* New caption */}
          <p className="text-xl text-white font-medium font-montserrat mb-6 tracking-wide">
            AI-DRIVEN CRYPTO INTELLIGENCE
          </p>
          
          <p className="text-lg text-gray-300 capitalize font-montserrat max-w-2xl">
            Get all the Info regarding your favorite Crypto Currency with powerful AI insights
          </p>
        </div>
        <div className="h-1/2 flex items-center w-full">
          <CarouselComponent />
        </div>
      </div>
    </div>
  );
}

export default Banner;