import Upload from "@/component/home/Upload";
import Loading from "@/component/Loading";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div className= "min-h-screen"><Loading></Loading></div>}>
      <div className="bg-black">
        <Upload></Upload>
      </div>
    </Suspense>
  );
};

export default page;
