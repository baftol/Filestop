import React from "react";

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recent Uploads</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder for file uploads */}
        <div className="bg-white shadow-md rounded p-4">File 1</div>
        <div className="bg-white shadow-md rounded p-4">File 2</div>
        <div className="bg-white shadow-md rounded p-4">File 3</div>
      </div>
    </div>
  );
};

export default HomePage;
