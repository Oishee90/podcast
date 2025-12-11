import Upload from "@/component/home/Upload";
import React, { Suspense } from "react";


const page = () => {
  return (
    <div className="bg-black">
      <Suspense fallback={<div>Loading...</div>}>

        <Upload></Upload>
      </Suspense>
    </div>
  );
};

export default page;
