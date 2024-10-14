
require('dotenv').config();
// Replace 'YOUR_API_KEY' with your actual QuizAPI.io API key
const apiKey = process.env.API_KEY;
console.log("apikey on" + apiKey); //'gyFYoG23A9QndbwwZQqb1hymXK7Gj2jdpRVl3uHq';
const apiUrl = 'https://quizapi.io/api/v1/questions?apiKey=' + apiKey + '&limit=5';

// Quiz variables
const quizContainer = document.getElementById('quiz');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn'); // Reference to Submit button
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = {};

// Fetch 20 random quiz questions
async function fetchQuiz() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            questions = data;  // Store all questions
        } else {
            quizContainer.innerHTML = '<p>No questions available.</p>';
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        quizContainer.innerHTML = '<p>Error loading quiz.</p>';
    }
}

// Display the current question
function displayQuestion(questionData) {
    const question = questionData.question;
    const answers = questionData.answers;
    correctAnswers = questionData.correct_answers;  // Store the correct answers

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `<h3>${question}</h3>`;

    // Display answers
    for (let answerKey in answers) {
        if (answers[answerKey]) {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer';
            answerElement.innerHTML = `
                <input type="radio" name="answer" value="${answerKey}" id="${answerKey}">
                <label for="${answerKey}">${answers[answerKey]}</label>
            `;
            questionElement.appendChild(answerElement);
        }
    }

    // Clear previous content and append new question
    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    document.getElementById('result').innerHTML = '';
    submitBtn.style.display = 'inline-block';  // Show Submit button
    nextBtn.style.display = 'none';  // Hide next button initially
}

// Start the quiz when "Start Quiz" button is clicked
function startQuiz() {
    startBtn.style.display = 'none';  // Hide the Start Quiz button
    quizContainer.style.display = 'block';  // Show the quiz container

    // Fetch questions and display the first one
    displayQuestion(questions[currentQuestionIndex]);
}

// Submit the quiz and check if the answer is correct
function submitQuiz() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (selectedAnswer) {
        const answerKey = selectedAnswer.value;
        const isCorrect = correctAnswers[answerKey + '_correct'] === 'true';

        const resultElement = document.getElementById('result');
        if (isCorrect) {
            resultElement.innerHTML = '<p>Correct!</p>';
            resultElement.style.color = 'green';
            nextBtn.style.display = 'inline-block';  // Show next button
            submitBtn.style.display = 'none';  // Hide Submit button after correct answer
        } else {
            resultElement.innerHTML = '<p>Wrong! Try again.</p>';
            resultElement.style.color = 'red';
            nextBtn.style.display = 'none';  // Keep next button hidden if wrong
        }
    } else {
        alert('Please select an answer.');
    }
}

// Load the next question
function nextQuestion() {
    currentQuestionIndex++;  // Move to the next question

    if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);  // Display next question
        nextBtn.style.display = 'none';  // Hide next button until correct answer
        submitBtn.style.display = 'inline-block';  // Show Submit button for the next question
    } else {
        quizContainer.innerHTML = '<p>You have completed the quiz!</p>';
        nextBtn.style.display = 'none';  // Hide next button when quiz is finished
    }
}

// Fetch the quiz questions when the page loads
fetchQuiz();

// Attach event listener to the Start Quiz button
startBtn.addEventListener('click', startQuiz);
