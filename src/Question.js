import React from "react"

export default function Question(props){
    return(
        <div className="questionComp-container">
            <h1 className="questionComp-question">{props.question}</h1>
            <div className="questionComp-answers-container">{props.answers}</div>
        </div>
    )
}