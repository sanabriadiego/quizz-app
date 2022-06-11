import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./Home"
import Quiz from "./Quiz"

export default function App(){
    return(
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
        </Routes>
    )
}