import React, { useState } from "react";
import Navbar from "../components/user_components/Navbar";


const Dashboard = () => {
    return (
        <div>
            <Navbar/>
            <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-purple-700 font-montserrat mb-6">
                Hello
            </h1>
            </div>
        </div>
    )
}

export default Dashboard