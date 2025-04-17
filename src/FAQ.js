
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
    answer: "Click the app logo at the top of the screen to log out.",
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
    <>
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
      </>
   
  );
}

export default FAQ;
