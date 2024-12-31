import React from 'react';
import debateImage from '../assets/debateimage.jpg';

const Home = () => {
  return (
    <div className="container flex flex-col md:flex-row items-center justify-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-blue">
      <div className="text-section md:w-1/2 md:text-left">
        <h2 className="text-3xl sm:text-6xl md:text-[40px] font-bold text-black pt-10 md:pt-0">
          Debate, vote, and see the impact of your voice!
        </h2>
        <p className = "text-2xl text-gray-500 pt-10">Let's join and discuss</p>
      </div>
      <div className="image-section md:w-1/2 flex justify-center mt-6 md:mt-0 md:ml-14">
        <img src={debateImage} alt="Debate" className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto" />
      </div>
    </div>
  );
}

export default Home;
