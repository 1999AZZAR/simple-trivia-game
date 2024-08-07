let correctAnswer = '';
let score = 5; // Base score
const winningScore = 10;
let selectedDifficulty = 'any';
let selectedCategory = 'any';
let questionCache = [];
let currentQuestionIndex = 0;
let isFetching = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('submitBtn').addEventListener('click', submitAnswer);
});

function startGame() {
    selectedDifficulty = document.getElementById('trivia-difficulty').value;
    selectedCategory = document.getElementById('trivia-category').value;
    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    score = 5; // Reset score when starting a new game
    document.getElementById('score').textContent = score;
    questionCache = [];
    currentQuestionIndex = 0;
    fetchQuestionsIfNeeded();
}

function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const messageElement = document.getElementById('message');
    if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        if (userAnswer === correctAnswer) {
            score++;
            messageElement.textContent = "🎉 Correct! You've gained a point.";
        } else {
            score--;
            messageElement.textContent = `😢 Wrong answer! The correct answer was "${correctAnswer}".`;
        }
        document.getElementById('score').textContent = score;

        if (score >= winningScore) {
            messageElement.textContent = "🏆 Congratulations! You've won the game!";
            setTimeout(() => {
                resetGame();
            }, 3000); // Restart game after 3 seconds
        } else if (score <= 0) {
            gameOver();
        } else {
            setTimeout(() => {
                displayNextQuestion();
                messageElement.textContent = '';
            }, 2000); // Display next question after 2 seconds
        }
    } else {
        messageElement.textContent = "Please select an answer.";
    }
}

function fetchQuestionsIfNeeded() {
    if (questionCache.length <= 2 && !isFetching) {
        fetchQuestions();
    }
}

function fetchQuestions() {
    isFetching = true;
    let apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
    if (selectedCategory !== 'any') {
        apiUrl += `&category=${selectedCategory}`;
    }
    if (selectedDifficulty !== 'any') {
        apiUrl += `&difficulty=${selectedDifficulty}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            questionCache = [...questionCache, ...data.results];
            isFetching = false;
            if (currentQuestionIndex === 0) {
                displayNextQuestion();
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            document.getElementById('message').textContent = "Error fetching questions. Please try again.";
            isFetching = false;
        });
}

function displayNextQuestion() {
    if (currentQuestionIndex >= questionCache.length) {
        currentQuestionIndex = 0;
    }

    const questionData = questionCache[currentQuestionIndex];
    correctAnswer = questionData.correct_answer;
    const answers = [...questionData.incorrect_answers, correctAnswer];
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    document.getElementById('category').innerHTML = `Category: ${questionData.category}`;
    document.getElementById('question').innerHTML = questionData.question;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    answers.forEach(answer => {
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `
            <label>
                <input type="radio" name="answer" value="${answer}">
                ${answer}
            </label>
        `;
        answersDiv.appendChild(answerElement);
    });

    currentQuestionIndex++;
    fetchQuestionsIfNeeded(); // Check if we need to fetch more questions
}

function gameOver() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = "Game Over! Your score reached zero.";
    document.getElementById('submitBtn').disabled = true; // Disable submit button
    setTimeout(() => {
        resetGame();
    }, 3000); // Return to setup screen after 3 seconds
}

function resetGame() {
    document.getElementById('message').textContent = '';
    document.getElementById('submitBtn').disabled = false; // Enable submit button
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('game-setup').style.display = 'block';
    questionCache = [];
    currentQuestionIndex = 0;
    isFetching = false;
}
