import React, { useState, useEffect } from "react"
import {nanoid} from "nanoid"
import {decode} from "he"
import Question from "./Question"
import Answer from "./Answer"

export default function Quiz(){
    //We want to return an array of objects
    const [quiz, setQuiz] = useState([])
    //Count is used to call useEffect again, so we get a new quiz from the API
    const [count, setCount] = useState(0)
    //quizChecked determines if we have evaluated the quiz and counted all the correct answers. It also determines if we are ready to call a new quiz.
    const [quizChecked, setQuizChecked] = useState(false)
    //We set the wrong answer to 5. So everytime the user gets a corret answer we rest one to "wrongAnswers"
    const [wrongAnswers, setWrongAnswers] = useState(5)

    //We use this funtion to shuffle the array of answers (objects), everytime we get a new quiz
    function shuffleArray (array){
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array
    }

    //We map through the entire quiz, comparing the id of the answer that has been clicked with every answer of the quiz. If they match we change the isHeld property to the opposite of its previous state. ***IMPROVEMENT IDEA: For the moment we can select as many answers as we want from a question, we should select just one among those answers.***
    function checkIfHeld(id){
        setQuiz(oldQuiz => oldQuiz.map(question => {
            const oldAnswers = question.answers
            const newAnswers = oldAnswers.map(answer => {
                return(
                    answer.id === id ? 
                    {...answer, isHeld: !answer.isHeld} : 
                    answer
                )
            })
            return{
                    ...question,
                    answers: newAnswers
                }
        }))
    }

    //handleBtn checks first if the quiz has been checked. If that is the case, it calls a new quiz by changing the state of count, it sets back the wrong answers to 5 and sets the state of quizChecked back to false. On the other hand if the quiz has not been checked, we first change the state of quizChecked to true. Then we map throught the entire quiz to check all the wrong answers, depending if its the correct answer, or if the user has clicked an answer and it was not the correct one, we change the property values of "correct", "wrong" and "none" of that answer. Otherwise we return the same answer, without modifying those values. However we remove the "chooseAnswer" method, so the user is not able to click and change the state of the answers.
    function handleBtn(){
        if(quizChecked){
            setCount(prevState => prevState + 1)
            setWrongAnswers(5)
            setQuizChecked(false)
        }else{
            setQuizChecked(true)
            setQuiz(oldQuiz => oldQuiz.map(question => {
                const oldAnswers = question.answers
                const newAnswers = oldAnswers.map(answer => {
                    let newAnswer = {}
                    if(answer.correctAnswer){
                        newAnswer = {...answer, correct : true}
                    }else if(answer.isHeld && !answer.correctAnswer){
                        setWrongAnswers(prevCount => prevCount - 1)
                        newAnswer = {...answer, wrong : true}
                    }else{
                        newAnswer = {...answer, none: true}
                    }
                    return(
                        {...newAnswer, chooseAnswer : () => false}
                    )
                })
                return(
                    {
                        ...question,
                        answers: newAnswers
                    }
                )
            }))
        }
    }

    //We get from the API 5 multiple choice questions. We create an array of objects, each object represents a question. Each representaion of this question has an ID, a string that is the question, and an array of objects that represents the answers. Each representation of these answers has an ID, a value that is the string of the answer, and boolean values that will determine if the answer is the correct one or if the user has clicked the wrong one for example. Finally we shuffle the array so the correct answer is placed in a different position rather than the last one (because we use push it into the array that includes the wrong answers)
    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
                .then(response => response.json())
                .then(data => {
                    const dataArray = data.results
                    const questionsArray = dataArray.map(question => {
                        const incorrectAnswersArray = question.incorrect_answers
                        const incorrectAnswers = incorrectAnswersArray.map(answer => {
                            return { 
                                id: nanoid(),
                                value: decode(answer),
                                isHeld : false,
                                correctAnswer : false,
                                correct: false,
                                wrong: false,
                                none: false
                            }
                        })
                        incorrectAnswers.push(
                            {
                                id : nanoid(),
                                value: decode(question.correct_answer),
                                isHeld : false,
                                correctAnswer : true,
                                correct: false,
                                wrong: false,
                                none : false
                            })
                        const answersArray = incorrectAnswers.map(answer => {
                            return{
                                ...answer,
                                chooseAnswer : () => checkIfHeld(answer.id)
                            }
                        })
                        const answers = shuffleArray(answersArray)
                        return {
                                id : nanoid(),
                                question : decode(question.question),
                                answers : answers
                            }
                    })
                    setQuiz(questionsArray)
                })
    }, [count])
  
    //The quiz is rendered  the first time we open the page, and also when we ask for a new Quiz, that means when the count state changes.
    const newQuiz = quiz.map(question => {
        const answersArray = question.answers
        const answers = answersArray.map(answer => {
            return(
                <Answer 
                    key = {answer.id}
                    value = {answer.value}
                    isHeld = {answer.isHeld}
                    chooseAnswer = {answer.chooseAnswer}
                    correct = {answer.correct}
                    wrong = {answer.wrong}
                    none = {answer.none}
                />
            )
        })
        return(
            <Question
                key = {question.id}
                question = {question.question}
                answers = {answers}
            />
        )
    })    
    
    return(
        <main className="quiz-container">
            <div className="questions-container">
                {newQuiz}
            </div>
            <div className="result-button-container">
                {quizChecked && <span className="result-button-container-result">You scored {wrongAnswers}/5 correct answers</span>}
                <button className="result-button-container-btn" onClick={handleBtn}>{quizChecked ? "Play again" : "Check Answers"}</button>
            </div>
        </main>
    )
}

