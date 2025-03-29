import React from "react";
import Banner from "../components/Banner/Banner.jsx";
import CoinsTable from "../components/CoinsTable";
import Header from "../components/Header.jsx"

const Homepage = () => {
  return (
    <div className="w-full">
      <Header/>
      <Banner />
      <CoinsTable />
    </div>
  );
};

export default Homepage;