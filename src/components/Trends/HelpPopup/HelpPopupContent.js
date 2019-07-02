import React, { useState } from 'react'
import FirstQuestion from './Questions/FirstQuestion'
import SecondQuestion from './Questions/SecondQuestion'
import ThirdQuestion from './Questions/ThirdQuestion'
import styles from './HelpPopup.module.scss'

const QUESTIONS = [1, 2, 3]

const HelpPopupContent = () => {
  const [openedQuestion, changeOpenedQuestion] = useState(null)
  const toggleQuestions = questionNumber => {
    if (questionNumber === openedQuestion) changeOpenedQuestion(null)
    else changeOpenedQuestion(questionNumber)
  }
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>
        About Santiment’s Top 10 Trending Words in Crypto
      </h3>
      <p>
        Every 9 hours, we calculate the top 10 words with the highest spike in
        mentions on crypto social media, compared to their previous 2-week
        average.
      </p>
      <p>This list aims to do 2 things: </p>
      <ol>
        <li>
          Give you a quick overview of the top <bold>developing topics</bold> in
          crypto at the moment
        </li>
        <li>
          Help you spot <bold>hype peaks</bold> and <bold>local tops</bold>
        </li>
      </ol>
      <p>Find out more about how it works and how to use it below:</p>
      <FirstQuestion
        isOpen={openedQuestion === QUESTIONS[0]}
        onClick={() => toggleQuestions(QUESTIONS[0])}
      />
      <SecondQuestion
        isOpen={openedQuestion === QUESTIONS[1]}
        onClick={() => toggleQuestions(QUESTIONS[1])}
      />
      <ThirdQuestion
        isOpen={openedQuestion === QUESTIONS[2]}
        onClick={() => toggleQuestions(QUESTIONS[2])}
      />
    </div>
  )
}

export default HelpPopupContent
