
import './FAQ.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPanel from './home/TopPanel';
import Footer from './home/Footer';


const faqData = [
  {
    question: "How do I register for the app?",
    answer: "You can register by clicking on the 'Register' button on the homepage and filling in your details.",
  },
  {
    question: "How can I change my profile picture?",
    answer: "Click on your profile picture in the top-right corner",
  },
  {
    question: "How can I change my display name?",
    answer: "Click on your profile picture in the top-right corner",
  },
  {
    question: "How can I delete my account?",
    answer: "Click on your profile picture in the top-right corner",
  },
  {
    question: "Is there a way to reset my password if I forget it?",
    answer: "No, password recovery is not available. Please make sure to remember your login credentials.",
  },
  {
    question: "How do I log out of the app?",
    answer: "You can log out by either clicking the app logo at the top of the screen or by clicking your profile picture in the top-right corner. In the account details, you'll find a logout button."
    
  },
  {
    question: "How do I start playing?",
    answer: "To begin a lesson, simply click the 'Start Lesson' button on the main screen.",
  },
  {
    question: "How does the scoring system work?",
    answer: "There are 4 levels in the game, each containing 26 stages. You must earn 26 points to advance to the next level. Each correct gesture (or more) performed in front of the camera earns 1 point.",
  },
  {
    question: "What happens if I make a mistake?",
    answer: "You have 3 lives (hearts). Each mistake costs one heart. Once all hearts are lost, a 15-minute timer starts, after which you'll regain your 3 hearts.",
  },
  {
    question: "Where can I see my progress?",
    answer: "Your personal progress appears on the right side of the main screen. You can also compare your standing with others on the leaderboard.",
  },
  {
    question: "How can I view all the signs?",
    answer: "You can click the 'View A-Z in Sign Language' button on the main screen to see the full alphabet.",
  },
  {
    question: "Can I repeat a stage?",
    answer: "Yes, you can repeat a specific stage to practice. However, if you've already completed it successfully, repeating it won't give you additional points.",
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const location = useLocation();
  const { currentUserImg, currentUsername, currentDisplayName, currentToken } = location.state || {};
  const navigate = useNavigate();

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-wrapper">
      <TopPanel userImg={currentUserImg} username={currentUsername} displayName={currentDisplayName} navigate={navigate} token={currentToken} />
      
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleAnswer(index)}
              >
                {item.question}
                <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
  
      <Footer />
    </div>
  );
  
}

export default FAQ;
