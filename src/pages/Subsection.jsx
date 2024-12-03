import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Subsection = () => {
    const params = useParams();

    const [subsectionId, setSubsectionId] = useState(0);
    const [sectionId, setSectionId] = useState(0);
    const [currentSubsection, setCurrentSubsection] = useState([]);
    const [nextSubsectionId, setNextSubsectionId] = useState(null);
    const [quizes, setQuizes] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [sumCorrectAnswers, setSumCorrectAnswers] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            setSubsectionId(params.id);
            const fetchSubsectionData = async () => {
                try {
                    const response = await axios.get(`/v1/information-chunk/get-information-chunk-by-subsection-id?id=${params.id}`);
                    if (response.status === 200 && response.data.information_chunks.length !== 0) {
                        setCurrentSubsection(response.data.information_chunks);
                        console.log(response.data);
                    }
                } catch (e) {
                    toast.error("Ошибка загрузки данных " + e);
                }
                try{
                    const response = await axios.get(`/v1/subsection/get-subsection-by-id?id=${params.id}`);
                    if (response.status === 200 && response.data) {
                        let subsection = response.data.subsection;
                        setNextSubsectionId(subsection.next_subsection_id);
                        setSectionId(subsection.section_id);
                        axios.get(`/v1/section/get-section-by-id?id=${subsection.section_id}`).then((response) => {
                            if (response.status !== 200){
                                return;
                            }
                            if (response.data.section.status === 0){
                                axios.put('/v1/section/update-section-status', {id: subsection.section_id, status: 1});
                            }
                        });
                        if (subsection.status === 0) {
                            axios.put("/v1/subsection/update-subsection-by-status", {id: params.id, status: 1});
                        }
                    }
                }catch (e){
                    toast.error("Ошибка загрузки данных " + e);
                }
            };
            fetchSubsectionData();
        }
    }, [params.id]);

    useEffect(() => {
        const fetchQuizData = async (quizId) => {
            try {
                const questionResponse = await axios.get(`/v1/quiz-question/get-quiz-questions-by-quiz-id?id=${quizId}`);
                const quiz_questions = questionResponse.data.quiz_questions;

                const quizData = await Promise.all(
                    quiz_questions.map(async (question) => {
                        const answerResponse = await axios.get(`/v1/quiz-answer/get-quiz-answers-by-quiz-question-id?quizQuestionId=${question.id}`);
                        return {
                            question: question.question,
                            answers: answerResponse.data.quiz_answers,
                        };
                    })
                );
                console.log('quizData', quizData);
                setQuizes((prevState) => {
                    return [...prevState, ...quizData];
                });
            } catch (error) {
                toast.error("Ошибка загрузки данных!\n" + error);
            }
        };

        // Fetch quizzes for each subsection item of type 5
        currentSubsection
            .filter((el) => el.type === 5)
            .forEach((el) => {
                if (!quizes[el.information]) {
                    fetchQuizData(el.information);
                }
            });
    }, [currentSubsection]);


    const chooseAnswer = (el, quizId, answer) => {
        setUserAnswers([...userAnswers, {id: quizId, answer: answer.id, is_correct: answer.is_true_answer}]);
        console.log(answer.id);
    }
    const isCorrect = (questionId, answerId) => {
        let question = userAnswers.find((el) => el.id === questionId);
        if (!question) return;
        if(question.is_correct){
            return "text-green-500";
        }
        else{
            return "text-red-500";
        }

    }
    useEffect(() => {
        if(userAnswers.length === quizes.length){
            let updatedSum = 0;
            userAnswers.forEach((answer) => answer.is_correct ? updatedSum++ : null);
            setSumCorrectAnswers(updatedSum);
        }
    }, [userAnswers]);

    const reloadQuiz = () => {
        setUserAnswers([]);
    }

    const endClick = () => {
        if (nextSubsectionId) {
            axios.put("/v1/subsection/update-subsection-by-status", {id: subsectionId, status: 2});

            navigate('/subsection/'+nextSubsectionId);
        } else{
            axios.put("/v1/subsection/update-subsection-by-status", {id: subsectionId, status: 2});
            axios.put("/v1/section/update-section-status", {id: sectionId, status: 2});

            navigate('/', {relative: false, replace: true});
        }
    }

    return (
        <div className="px-12 flex flex-col gap-y-12 mb-12">
            <h3 className="text-3xl font-bold mb-2">Секция {subsectionId}</h3>
            {currentSubsection.length !== 0 &&
                currentSubsection.map((el) => {
                    if (el.type === 0) {
                        // Заголовок
                        return <h3 key={`header-${el.id}`} className="font-semibold text-4xl">{el.information}</h3>;
                    }
                    if (el.type === 2) {
                        // Видео
                        return (
                            <div>
                                <h2 className="text-gray-400 text-3xl ml-4 mb-1">Видео</h2>
                                <div key={`video-${el.id}`} className="p-10 shadow-2xl bg-gray-100 rounded-xl">
                                    <ReactPlayer
                                        className="rounded-xl align-middle mx-auto"
                                        url={el.information}
                                        controls={true}
                                        light={false}
                                        width="90%"
                                    />
                                </div>
                            </div>
                        );
                    }
                    if (el.type === 5) {
                        // Квиз
                        return (
                            <div>
                                <h2 className="text-gray-400 text-3xl ml-4 mb-1">Квиз</h2>
                                <div key={`quiz-${el.id}`} className="p-10 shadow-2xl bg-gray-100 rounded-xl">

                                    {quizes ? (
                                        quizes.map((quiz, index) => (
                                            <div key={`quiz-question-${index}`} className="my-12">
                                                <h4 className={'font-semibold text-xl ' + isCorrect(index)}>{quiz.question}</h4>
                                                <div>
                                                    {quiz.answers.map((answer, idx) => (
                                                        <div className="px-6">
                                                        <button key={`quiz-answer-${idx}`}
                                                            className={'text-xl list-item cursor-pointer hover:bg-gray-200 rounded-xl p-3 w-full text-left ' + (userAnswers.find((el) => el.answer === answer.id) ? "bg-gray-300" : "") }
                                                            onClick={(e) => chooseAnswer(e, index, answer)}
                                                            disabled={userAnswers.find((el) => el.id === index)}
                                                        >{answer.answer}</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Loading quiz...</p>
                                    )}
                                    { quizes.length === userAnswers.length &&
                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-md font-semibold text-center my-4">{sumCorrectAnswers}/{quizes.length} правильных ответов ({sumCorrectAnswers/quizes.length*100}%)</h3>
                                            <button
                                                className="bg-blue-600 p-4 text-white mx-auto rounded-xl"
                                                onClick={reloadQuiz}
                                            >Пройти заново</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <h2 className="text-gray-400 text-3xl ml-4 mb-1">Информация</h2>
                            <div key={`text-${el.id}`} className="p-8 shadow-2xl bg-gray-100 rounded-xl">
                                <p dangerouslySetInnerHTML={{__html: el.information }} className="text-md"></p>
                            </div>
                        </div>
                    );
                })}
            <button onClick={endClick} className="text-white text-center text-md bg-blue-600 p-4 rounded-xl w-auto">{
                nextSubsectionId ? "Перейти к следующей теме" : "Завершить главу"
            }</button>
        </div>
    );
};

export default Subsection;
