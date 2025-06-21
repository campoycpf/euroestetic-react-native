const SkeletonNoResults = () => {
  return (
    <div
      className="mt-4 flex gap-x-[1.5%] min-[1359px]:gap-x-[2%] min-[1400px]:gap-x-[3%] min-[1570px]:gap-x-[4%] gap-y-8 justify-center flex-wrap animate-pulse">
      <div className="w-[48%] max-w-[300px] sm:max-w-md sm:min-w-72 flex flex-col lg:w-[22%]">
        <div className="relative w-full h-56 min-[450px]:h-60 sm:h-64 md:h-80 bg-gray-100 rounded-md" />
        <div className="">
          <div className="w-full h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-9 my-3 bg-gray-100 rounded-2xl " />
        </div>
      </div>
      <div className="w-[48%] max-w-[300px] sm:max-w-md sm:min-w-72 flex flex-col lg:w-[22%]">
        <div className="relative w-full h-56 min-[450px]:h-60 sm:h-64 md:h-80 bg-gray-100 rounded-md" />
        <div className="">
          <div className="w-full h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-9 my-3 bg-gray-100 rounded-2xl " />
        </div>
      </div>
      <div className="w-[48%] max-w-[300px] sm:max-w-md sm:min-w-72 flex flex-col lg:w-[22%]">
        <div className="relative w-full h-56 min-[450px]:h-60 sm:h-64 md:h-80 bg-gray-100 rounded-md" />
        <div className="">
          <div className="w-full h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-9 my-3 bg-gray-100 rounded-2xl " />
        </div>
      </div>
      <div className="w-[48%] max-w-[300px] sm:max-w-md sm:min-w-72 flex flex-col lg:w-[22%]">
        <div className="relative w-full h-56 min-[450px]:h-60 sm:h-64 md:h-80 bg-gray-100 rounded-md" />
        <div className="">
          <div className="w-full h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-5 my-3 bg-gray-100 rounded-md " />
          <div className="w-1/2 h-9 my-3 bg-gray-100 rounded-2xl " />
        </div>
      </div>
      <div className="absolute text-3xl w-full flex justify-center items-start">
          <div className="mt-8">SIN RESULTADOS</div>
      </div>
    </div>
  );
};

export default SkeletonNoResults;
