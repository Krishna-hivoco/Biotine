

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";
import VerifyLoading from "@/components/VerifyLoading";
import { ArrowLeft, LogOut, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Answer Popup Component
const AnswerPopup = ({ isVisible, isCorrect }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      {isCorrect ? (
        <div className="flex flex-col gap-2 text-center justify-center items-center">
          <Image
            src="/right.png"
            alt="Correct answer"
            width={234}
            height={144}
            className="w-full object-contain"
            priority
          />
          <h3 className="font-bold text-2xl text-white">
            Glowing! <br /> You got it right.
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center justify-center items-center">
          <Image
            src="/oops.png"
            alt="Wrong answer"
            width={234}
            height={144}
            className="w-full object-contain"
            priority
          />
          <h3 className="font-bold text-2xl text-white">
            Not your best <br /> glow yet!<br />
            Try the next one.
          </h3>
        </div>
      )}
    </div>
  );
};

const Quiz = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [correctOptionValue, setCorrectOptionValue] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupIsCorrect, setPopupIsCorrect] = useState(false);
  const [hasFetchedQuestions, setHasFetchedQuestions] = useState(false);
  const [score, setScore] = useState(0);

  const language = searchParams.get("language") || "English";
  const user_id = searchParams.get("user_id") || "";

  useEffect(() => {
    const userName = sessionStorage.getItem("name");
    const storedUserId = sessionStorage.getItem("userId");
    setName(userName);
    setUserId(storedUserId || user_id);

    if (!userName) {
      router.replace("/");
    }
  }, [router, user_id]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setAnimation(true), 500);
    }
  }, [isLoading]);

  useEffect(() => {
    if (router.isReady && !isQuizCompleted && name && language && !hasFetchedQuestions) {
      fetchQuestions();
    }
  }, [router.isReady, language, isQuizCompleted, name, hasFetchedQuestions]);

  // Auto-close popup and move to next question
  useEffect(() => {
    if (!showPopup) return;

    const timer = setTimeout(() => {
      setShowPopup(false);

      // Move to next question after popup closes
      // const nextTimer = setTimeout(() => {
      //   if (!selectedOption || isQuizCompleted) return;

      //   if (audio) {
      //     audio.pause();
      //   }
      //   setSeconds(30);

      //   resetState();
      //   if (currentQuestionIndex < questions.length - 1) {
      //     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      //   } else {
      //     if (!isQuizCompleted) {
      //       completeQuiz();
      //     }
      //   }
      // }, 100);

      return () => clearTimeout(nextTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showPopup]);

  const toggleQuestionAudio = () => {
    if (isPlaying) {
      stopQuestionAudio();
    } else {
      playQuestionAudio();
    }
  };

  const playQuestionAudio = () => {
    if (audio) {
      audio.pause();
    }

    const questionAudio = new Audio(questions[currentQuestionIndex]?.audio_path);

    questionAudio
      .play()
      .then(() => {
        setIsPlaying(true);
        setAudio(questionAudio);
      })
      .catch((error) => console.error("Audio play error:", error));

    questionAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  const stopQuestionAudio = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  };

  const fetchQuestions = async () => {
    if (isQuizCompleted || hasFetchedQuestions) return;

    try {
      setHasFetchedQuestions(true);
      const response = await fetch(
        `https://backend.thefirstimpression.ai/get_all_question?lang=${language}&type=biotin`
      );

      if (!response.ok) {
        throw new Error("Failed to load questions");
      }

      const data = await response.json();
      if (data?.quiz?.length > 0) {
        setQuestions(data.quiz);
      } else {
        setHasError(true);
        setErrorMessage("Unable to load quiz questions. Please try again later.");
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage("Unable to load quiz questions. Please try again later.");
    }
  };

  const handleSkip = () => {
    if (isQuizCompleted || selectedOption) return;

    if (audio) {
      audio.pause();
    }
    if (currentQuestionIndex < questions.length - 1) {
      setSeconds(30);
      resetState();
      setIsPlaying(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (isQuizCompleted || !selectedOption) return;

    if (audio) {
      audio.pause();
    }
    setSeconds(30);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (isQuizCompleted) return;

    resetState();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (isQuizCompleted) return;
    setIsQuizCompleted(true);
    if (audio) audio.pause();

    // Navigate to result page with score
    setTimeout(() => {
      router.push(`/result?score=${score}`);
    }, 150);
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setCorrectOptionValue(null);
  };

  const verifyAnswer = async (userAnswer) => {
    if (!questions[currentQuestionIndex] || isQuizCompleted) return;
    if (seconds === 2) return;
    if (selectedOption) return;

    const body = {
      lang: language,
      user_answer: userAnswer,
      question_id: questions[currentQuestionIndex].question_id,
      user_id: userId,
      type: "biotin"
    };

    const startTime = Date.now();
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://backend.thefirstimpression.ai/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 800;

      setTimeout(() => {
        setIsLoading(false);

        // Update score if answer is correct
        if (data.is_correct) {
          setScore((prevScore) => prevScore + 1);
          const newAudio = new Audio("/music/rightAnswer.mp3");
          setAudio(newAudio);
          newAudio.play();
        } else {
          const newAudio = new Audio("/music/wrongAnswer.mp3");
          setAudio(newAudio);
          newAudio.play();
        }

        // Show popup
        setPopupIsCorrect(data.is_correct);
        setShowPopup(true);

        setIsAnswerCorrect(data.is_correct);
        setCorrectOptionValue(data.correct_option_value);
        setSelectedOption(userAnswer);
      }, Math.max(0, minLoadingTime - elapsedTime));
    } catch (error) {
      setIsLoading(false);
      console.error("Error validating answer:", error);
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    if (audio) {
      audio.pause();
    }
    verifyAnswer(option);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!name) return null;
  if (!currentQuestion) {
    return <Loading />;
  }

  return (
    <Layout>
      <div
        className={`pt-[3.5vh] pb-[14vh] h-svh max-w-md mx-auto grid transition-all duration-500 ease-in-out ${animation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        <section className="w-full flex flex-col gap-1.5 px-6 relative z-50">
          <nav className="w-full flex justify-between relative">
            <div
              className={`flex flex-col justify-between transition-all duration-1000 ease-in-out ${animation ? "translate-x-0" : "-translate-x-30"
                }`}
            >
              <div className="flex gap-3 self-start">
                <Link className="cursor-pointer" href={"/"}>
                  <ArrowLeft size={24} />
                </Link>

                <span className="text-[#4B2500] font-semibold text-lg/5.5">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
            </div>

            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-transparent text-[#4B2500] font-inter font-semibold text-base">
              {!isLoading && (
                <Timer
                  onTimeout={handleSkip}
                  seconds={seconds}
                  setSeconds={setSeconds}
                  index={currentQuestionIndex}
                  isQuizQuestionLoading={!currentQuestion}
                  autoSubmit={handleSubmit}
                />
              )}
            </span>

            <div
              className={`flex flex-row-reverse gap-2.5 transition-all duration-1000 ease-in-out ${animation ? "translate-x-0" : "translate-x-30"
                }`}
            >
              <span className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-transparent outline-1 outline-[#4B2500]">
                <Link className="cursor-pointer" href={"/"}>
                  <LogOut color="#4B2500" size={16} />
                </Link>
              </span>

              <span
                onClick={toggleQuestionAudio}
                className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-transparent outline-1 outline-[#4B2500] cursor-pointer"
              >
                {!isPlaying ? (
                  <VolumeOff color="#4B2500" size={16} />
                ) : (
                  <Volume2 color="#4B2500" size={16} />
                )}
              </span>
            </div>
          </nav>

          <ProgressBar
            animation={animation}
            count={currentQuestion.question_id + 1}
          />
        </section>

        <section className="w-full flex flex-col gap-6 px-6 relative z-50 mt-6">
          <div className="font-semibold flex justify-center items-center h-[196px] backdrop-blur-xs bg-[#4B25000D] text-base/5 tracking-wide outline-[#4B2500] outline-1 text-[#4B2500] p-3.5 rounded-2xl">
            {`Q${currentQuestion.question_id + 1}.`} {currentQuestion.question}
          </div>

          <div
            className={`w-full flex flex-col gap-3 transition-all duration-700 ease-in-out ${animation ? "translate-y-0" : "translate-y-10"
              }`}
          >
            {currentQuestion?.options?.map((option, index) => {
              const optionText = option.text || option;
              const isSelected =
                selectedOption?.trim().toLowerCase() ===
                optionText?.trim().toLowerCase();
              const isCorrectOption =
                correctOptionValue?.trim().toLowerCase() ===
                optionText?.trim().toLowerCase();

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(optionText)}
                  disabled={selectedOption !== null}
                  className={`
                  flex items-center justify-between 
                  outline outline-[#4B2500] p-3.5 rounded-sm 
                  capitalize font-semibold text-base/5 text-black111 tracking-wide w-full
                  transition-all
                  ${!selectedOption
                      ? "cursor-pointer hover:bg-[#703513]/10"
                      : "cursor-not-allowed"
                    }
                  ${isSelected
                      ? isAnswerCorrect
                        ? "!border-[#066A37] !bg-dark-green !text-white"
                        : "!bg-[#ED0000] !border-[#ED0000] !text-white"
                      : isCorrectOption && selectedOption && !isAnswerCorrect
                        ? "!border-[#066A37] !bg-dark-green !text-white"
                        : "bg-[#4B250014]"
                    }
                `}
                >
                  {optionText}

                  {isSelected && isAnswerCorrect && (
                    <Image
                      src="/svg/tick-circle-solid.svg"
                      width={24}
                      height={24}
                      alt="tick image"
                      priority
                    />
                  )}

                  {!isSelected &&
                    isCorrectOption &&
                    selectedOption &&
                    !isAnswerCorrect && (
                      <Image
                        src="/svg/tick-circle-solid.svg"
                        width={24}
                        height={24}
                        alt="correct answer indicator"
                        priority
                      />
                    )}
                </button>
              );
            })}
          </div>
        </section>

        <div
          className={`w-full flex items-center justify-between gap-5 px-6 relative z-50 mt-8 transition-all duration-[1200ms] ease-in-out ${animation ? "translate-y-0" : "translate-y-50"
            }`}
        >
          <button
            onClick={handleSkip}
            disabled={isQuizCompleted || selectedOption !== null}
            className={`w-[154px] rounded-lg font-semibold text-xl/6 text-[#4B2500] text-center py-3 transition-all ${selectedOption !== null
                ? "cursor-not-allowed backdrop-blur-lg bg-[#4B250026]"
                : "hover:bg-[#4B2500] hover:text-white backdrop-blur-lg bg-[#4B250026]"
              }`}
          >
            Skip
          </button>

          <button
            onClick={handleSubmit}
            disabled={isQuizCompleted || !selectedOption}
            className={`w-[154px] rounded-lg font-semibold text-xl/6 text-center py-3 transition-all ${selectedOption
                ? "text-white bg-[#4B2500] cursor-pointer"
                : "text-[#4B2500] backdrop-blur-lg bg-[#4B250026] cursor-not-allowed"
              }`}
          >
            {currentQuestionIndex+1 >= questions.length ? "Submit" : "Next"}
          </button>
        </div>

        {isLoading && <VerifyLoading />}

        {/* Answer Popup */}
        <AnswerPopup isVisible={showPopup} isCorrect={popupIsCorrect} />
      </div>
    </Layout>
  );
};

export default Quiz;