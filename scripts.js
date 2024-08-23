let correctAnswer = '';
let score = 5; // Base score
const winningScore = 10;
let selectedLanguage = 'en'; // Default language
let selectedDifficulty = 'any';
let selectedCategory = 'any';
let selectedType = 'any';
let questionCache = [];
let currentQuestionIndex = 0;
let isFetching = false;
let questionCount = 0; // Initialize question count

const translations = {
    en: {
        startGame: 'Start Game',
        submit: 'Submit 🚀',
        score: 'Score',
        category: 'Category',
        correct: "🎉 Correct! You've gained a point.",
        wrong: '😢 Wrong answer! The correct answer was "{answer}".',
        selectAnswer: "Please select an answer.",
        congrats: "🏆 Congratulations! You've won the game! You have answered a total of {count} questions.",
        gameOver: "Game Over! Your score reached zero. You answered {count} questions.",
        errorFetching: "Error fetching questions. Please try again."
    },
    id: {
        startGame: 'Mulai Permainan',
        submit: 'Kirim 🚀',
        score: 'Skor',
        category: 'Kategori',
        correct: '🎉 Benar! Anda mendapat satu poin.',
        wrong: '😢 Jawaban salah! Jawaban yang benar adalah "{answer}".',
        selectAnswer: 'Silakan pilih jawaban.',
        congrats: '🏆 Selamat! Anda telah memenangkan permainan! Anda telah menjawab total {count} pertanyaan.',
        gameOver: 'Permainan Berakhir! Skor Anda mencapai nol. Anda menjawab {count} pertanyaan.',
        errorFetching: 'Kesalahan saat mengambil pertanyaan. Silakan coba lagi.'
    },
    es: {
        startGame: 'Iniciar Juego',
        submit: 'Enviar 🚀',
        score: 'Puntuación',
        category: 'Categoría',
        correct: "🎉 ¡Correcto! Has ganado un punto.",
        wrong: '😢 Respuesta incorrecta. La respuesta correcta era "{answer}".',
        selectAnswer: "Por favor, selecciona una respuesta.",
        congrats: "🏆 ¡Felicidades! ¡Has ganado el juego! Has respondido un total de {count} preguntas.",
        gameOver: "Juego terminado. Tu puntuación llegó a cero. Respondiste {count} preguntas.",
        errorFetching: "Error al obtener preguntas. Por favor, inténtalo de nuevo."
    },
    fr: {
        startGame: 'Démarrer le jeu',
        submit: 'Soumettre 🚀',
        score: 'Score',
        category: 'Catégorie',
        correct: "🎉 Correct! Vous avez gagné un point.",
        wrong: '😢 Mauvaise réponse! La bonne réponse était "{answer}".',
        selectAnswer: "Veuillez sélectionner une réponse.",
        congrats: "🏆 Félicitations! Vous avez gagné le jeu! Vous avez répondu à un total de {count} questions.",
        gameOver: "Jeu terminé! Votre score a atteint zéro. Vous avez répondu à {count} questions.",
        errorFetching: "Erreur lors de la récupération des questions. Veuillez réessayer."
    },
    de: {
        startGame: 'Spiel starten',
        submit: 'Absenden 🚀',
        score: 'Punktzahl',
        category: 'Kategorie',
        correct: "🎉 Richtig! Sie haben einen Punkt gewonnen.",
        wrong: '😢 Falsche Antwort! Die richtige Antwort war "{answer}".',
        selectAnswer: "Bitte wählen Sie eine Antwort.",
        congrats: "🏆 Glückwunsch! Sie haben das Spiel gewonnen! Sie haben insgesamt {count} Fragen beantwortet.",
        gameOver: "Spiel beendet! Ihre Punktzahl erreichte null. Sie haben {count} Fragen beantwortet.",
        errorFetching: "Fehler beim Abrufen der Fragen. Bitte versuchen Sie es erneut."
    },
    ja: {
        startGame: 'ゲーム開始',
        submit: '送信 🚀',
        score: 'スコア',
        category: 'カテゴリー',
        correct: "🎉 正解です！ポイントを獲得しました。",
        wrong: '😢 間違った答え！正解は "{answer}" でした。',
        selectAnswer: "回答を選択してください。",
        congrats: "🏆 おめでとうございます！ゲームに勝ちました！合計 {count} 問答えました。",
        gameOver: "ゲームオーバー！スコアがゼロになりました。{count} 問答えました。",
        errorFetching: "質問の取得中にエラーが発生しました。もう一度お試しください。"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('submitBtn').addEventListener('click', submitAnswer);
    document.getElementById('game-area').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'cancelBtn') {
            resetGame();
        }
    });
    document.getElementById('trivia-language').addEventListener('change', changeLanguage);
    updateInterface();
});

function changeLanguage() {
    selectedLanguage = document.getElementById('trivia-language').value;
    updateInterface();
}

function updateInterface() {
    document.getElementById('start-game').textContent = translations[selectedLanguage].startGame;
    document.getElementById('submitBtn').textContent = translations[selectedLanguage].submit;
    document.getElementById('scoreBoard').innerHTML = `${translations[selectedLanguage].score}: <span id="score">${score}</span>`;
}

function startGame() {
    selectedLanguage = document.getElementById('trivia-language').value;
    selectedDifficulty = document.getElementById('trivia-difficulty').value;
    selectedCategory = document.getElementById('trivia-category').value;
    selectedType = document.getElementById('trivia-type').value;
    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelBtn';
    cancelButton.className = 'button';
    cancelButton.textContent = 'X';
    document.getElementById('game-area').appendChild(cancelButton);
    score = 5; // Reset score when starting a new game
    document.getElementById('score').textContent = score;
    questionCache = [];
    questionCount = 0; // Reset question count when starting a new game
    currentQuestionIndex = 0;

    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    document.getElementById('category').style.display = 'none';
    document.getElementById('question').style.display = 'none';
    document.getElementById('answers').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';

    fetchQuestions();
}

async function fetchQuestions() {
    isFetching = true;
    let apiUrl = `https://opentdb.com/api.php?amount=25`;
    if (selectedCategory !== 'any') {
        apiUrl += `&category=${selectedCategory}`;
    }
    if (selectedDifficulty !== 'any') {
        apiUrl += `&difficulty=${selectedDifficulty}`;
    }
    if (selectedType !== 'any') {
        apiUrl += `&type=${selectedType}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questionCache = [];

        for (const question of data.results) {
            const translatedQuestion = await translateText(question.question, selectedLanguage);
            const translatedCorrectAnswer = await translateText(question.correct_answer, selectedLanguage);
            const translatedIncorrectAnswers = await Promise.all(
                question.incorrect_answers.map(answer => translateText(answer, selectedLanguage))
            );

            questionCache.push({
                ...question,
                question: translatedQuestion,
                correct_answer: translatedCorrectAnswer,
                incorrect_answers: translatedIncorrectAnswers
            });
        }

        isFetching = false;

        // Hide loading animation and display question
        document.getElementById('loading').style.display = 'none';
        document.getElementById('category').style.display = 'block';
        document.getElementById('question').style.display = 'block';
        document.getElementById('answers').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'block';

        if (questionCache.length > 0) {
            displayNextQuestion();
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        document.getElementById('message').textContent = translations[selectedLanguage].errorFetching;
        isFetching = false;

        // Hide loading animation if there's an error
        document.getElementById('loading').style.display = 'none';
    }
}


function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const messageElement = document.getElementById('message');
    if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        questionCount++; // Increment question count
        if (userAnswer === correctAnswer) {
            score++;
            messageElement.textContent = translations[selectedLanguage].correct;
        } else {
            score--;
            messageElement.textContent = translations[selectedLanguage].wrong.replace('{answer}', correctAnswer);
        }
        document.getElementById('score').textContent = score;

        if (score >= winningScore) {
            messageElement.textContent = translations[selectedLanguage].congrats.replace('{count}', questionCount);
            document.getElementById('message').classList.add('winning-effect');
            setTimeout(() => {
                document.getElementById('message').classList.remove('winning-effect');
                resetGame();
            }, 3000);
        } else if (score <= 0) {
            gameOver();
        } else {
            setTimeout(() => {
                displayNextQuestion();
                messageElement.textContent = '';
            }, 1000);
        }
    } else {
        messageElement.textContent = translations[selectedLanguage].selectAnswer;
    }
}

function translateText(text, targetLanguage) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => data[0][0][0])
        .catch(error => {
            console.error('Error translating text:', error);
            return text; // Fallback to the original text if translation fails
        });
}


function displayNextQuestion() {
    if (currentQuestionIndex >= questionCache.length) {
        currentQuestionIndex = 0;
    }

    const questionData = questionCache[currentQuestionIndex];
    correctAnswer = questionData.correct_answer;
    const answers = [...questionData.incorrect_answers, correctAnswer];
    answers.sort(() => Math.random() - 0.5);

    document.getElementById('category').innerHTML = `${translations[selectedLanguage].category}: ${questionData.category}`;
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
}

function gameOver() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = translations[selectedLanguage].gameOver.replace('{count}', questionCount);
    document.getElementById('submitBtn').disabled = true;
    setTimeout(() => {
        resetGame();
    }, 2000);
}

function resetGame() {
    document.getElementById('message').textContent = '';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('game-setup').style.display = 'block';
    document.getElementById('footer').style.display = 'block';
    questionCache = [];
    currentQuestionIndex = 0;
    isFetching = false;
    updateInterface();
}
