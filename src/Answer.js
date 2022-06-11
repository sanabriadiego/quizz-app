import React from "react"

export default function Answer(props){
    let styles = {}
    if(!props.isHeld){
        styles = {backgroundColor : "#F5F7FB"}
    }else if(props.isHeld){
        styles = {backgroundColor : "#D6DBF5", borderColor: "#D6DBF5"}
    }
    //When we receive the data from the API, and the quiz gets rendered, all the answers have their "correct", "wrong", and "none" props set to false, so the backgroundColor property doesn't change. Once we evaluate the quiz those props change.
    if(props.correct){
        styles = {backgroundColor : "#94D7A2", borderColor: "#94D7A2", cursor: "default"}
    }
   
    if(props.wrong){
        styles = {backgroundColor : "#F8BCBC", color: "#8F94AF", borderColor: "#F8BCBC", cursor: "default"}
    }

    if(props.none){
        styles = {color : "#8F94AF", borderColor: "#8F94AF", cursor: "default"}
    }

    return(
        <button className="answerComp-answer" key={props.id} onClick={props.chooseAnswer} style={styles}>
            {props.value}
        </button>
    )
}