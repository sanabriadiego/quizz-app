import React from "react"
import {Link} from "react-router-dom"

export default function Home(){
    return(
        <main className="home-main">
            <h1 className="home-main-title">Quizzical</h1>
            <p className="home-main-description">You will be asked 5 questions of general knowledge, please select just one option and check your results. Good luck! 😉</p>
            <Link className="home-main-btn" to="/quiz">Start quiz</Link>
        </main>
    )
}