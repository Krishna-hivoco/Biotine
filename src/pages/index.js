
// import Header from "@/components/Header";
// import Layout from "@/components/Layout";
// import SelectLanguage from "@/components/SelectLanguage";
// import SplashScreen from "@/components/SplashScreen";
// import { CircleCheck, X } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const App = () => {
//   const [displaySplash, setDisplaySplash] = useState(true);
//   const [showRegister, setShowRegister] = useState(false);
//   const [animation, setAnimation] = useState(false);
//   const [showLanguage, setShowLanguage] = useState(false);

//   const [isExit, setIsExit] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [Name, setName] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");

//   useEffect(() => {
//     setTimeout(() => setDisplaySplash(false), 3000);
//   }, []);

//   useEffect(() => {
//     if (!displaySplash) {
//       setTimeout(() => setAnimation(true), 100);
//     }
//   }, [displaySplash]);

//   const verifyName = (Name) => {
//     if (!Name.trim()) {
//       setIsExit(null);
//       return;
//     }

//     setIsLoading(true);
//     fetch(`https://api.amway.thefirstimpression.ai/api/is_user_exit?name=${Name}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setIsExit(data.is_user_exist);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setIsLoading(false);
//         setIsExit(null);
//       });
//   };

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedQuery(Name);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [Name]);

//   useEffect(() => {
//     if (debouncedQuery) {
//       verifyName(debouncedQuery);
//     } else {
//       setIsExit(null);
//     }
//   }, [debouncedQuery]);

//   const getStatusIcon = () => {
//     if (!Name.trim()) return null;
//     if (isLoading) return <span className="text-[#4B2500] animate-pulse">...</span>;
//     if (isExit === true) return <X size={20} className="text-red-500" strokeWidth={1.5} />;
//     if (isExit === false)
//       return <CircleCheck size={20} className="text-white fill-[#4B2500]" strokeWidth={1.5} />;
//     return null;
//   };

//   const goFarword = () => {
//     if (isExit === false && Name.trim()) {
//       sessionStorage.setItem("name", Name.trim());
//       setShowLanguage(true);
//     }
//   };

//   const handleArrowClick = () => {
//     setShowRegister(true);
//   };

//   if (displaySplash) {
//     return (
//       <Layout diffTopImage={true} animation={false}>
//         <SplashScreen />
//       </Layout>
//     );
//   }

//   return (
//     <Layout animation={animation}>
//       <div className="relative h-full w-full z-50 overflow-hidden">
//         <div
//           className={`flex items-center justify-center gap-3 pt-[11vh] pb-[5vh] overflow-hidden
//             transition-all duration-1000 ease-in-out ${
//               animation ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
//             }
//           `}
//         >
//           <Image
//             src={"/logos/Nutrilite-logo.png"}
//             width={217}
//             height={44}
//             alt="nutrilite logo"
//             priority={true}
//           />
//         </div>

//         <div className="px-12 sm:w-4/5 sm:mx-auto">
//           <Image
//             className={`mx-auto w-auto transition-all duration-700 ease-in-out ${
//               showRegister ? "h-[20vh] -translate-y-4" : "h-[43vh]"
//             } ${animation ? "translate-y-0 opacity-100" : "translate-y-30 opacity-0"}`}
//             alt="nutrilite-triple-protect"
//             width={300}
//             height={346}
//             src="/images/image_biotin.png"
//             priority={true}
//             quality={100}
//           />

//           {!showRegister && (
//             <button
//               onClick={handleArrowClick}
//               className={`w-full flex justify-center transition-all duration-1000 ease-in-out ${
//                 animation ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
//               }`}
//             >
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 64 64"
//                 fill="none"
//                 className="border-2 border-[#4B2500] rounded-sm text-[#4B2500] mt-[4vh] cursor-pointer hover:bg-[#4B2500] hover:text-white transition-colors"
//               >
//                 <path
//                   d="M16 32H48M48 32L40 24M48 32L40 40"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           )}

//           {showRegister && !showLanguage && (
//             <section
//               className={`flex w-full flex-col gap-7 sm:gap-2 mt-6 transition-all duration-700 delay-200 ease-in-out ${
//                 showRegister ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//               }`}
//             >
//               <div className="flex flex-col gap-2 items-center">
//                 <h1 className="font-bold text-xl/7 text-[#4B2500] text-center ">User Registration</h1>
//               </div>

//               <div className="w-full flex flex-col gap-1 justify-center">
//                 <input
//                   type="text"
//                   enterKeyHint="enter"
//                   inputMode="text"
//                   placeholder="Enter your name"
//                   className="font-medium text-sm/6 text-center align-middle text-[#4B2500] capitalize py-3.5 px-5 rounded-sm outline-1 outline-[#4B2500]"
//                   value={Name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 {Name.trim() && (
//                   <label
//                     className={`font-medium flex items-center gap-1 text-sm/4 text-left px-5 ${
//                       isExit === null
//                         ? "text-gray-400"
//                         : isExit === false
//                         ? "text-[#4B2500]"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {isExit === false
//                       ? "Username available"
//                       : isExit === true
//                       ? "Username already exists"
//                       : "Checking availability..."}
//                     {getStatusIcon()}
//                   </label>
//                 )}
//               </div>

//               <button
//                 onClick={goFarword}
//                 disabled={!(Name.trim() && isExit === false)}
//                 className={`py-3 px-3 rounded-sm font-bold text-xl/6.5 text-center cursor-pointer transition-all
//                   ${
//                     Name.trim() && isExit === false
//                       ? "text-[#4B2500]"
//                       : "text-[#4B2500] opacity-50 cursor-not-allowed "
//                   }
//                 `}
//               >
//                 Continue
//               </button>
//             </section>
//           )}

//           {showLanguage && (
//             <section
//               className={`flex w-full flex-col gap-6 mt-6 transition-all duration-700 ease-in-out ${
//                 showLanguage ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//               }`}
//             >
//               <h1 className="font-bold text-xl/7 text-[#4B2500] text-center">CHOOSE LANGUAGE</h1>

//               <div className="flex flex-col gap-4">
//                 <button className="w-full py-4 px-4 rounded-lg border-2 border-[#4B2500] bg-white text-[#4B2500] font-semibold text-lg hover:bg-[#4B2500] hover:text-white transition-colors">
//                   English
//                 </button>

//                 <button className="w-full py-4 px-4 rounded-lg border-2 border-[#4B2500] bg-white text-[#4B2500] font-semibold text-lg hover:bg-[#4B2500] hover:text-white transition-colors">
//                   Hindi
//                 </button>
//               </div>
//             </section>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default App;



import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SelectLanguage from "@/components/SelectLanguage";
import SplashScreen from "@/components/SplashScreen";
import { CircleCheck, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const App = () => {
  const router = useRouter();
  const [displaySplash, setDisplaySplash] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const [isExit, setIsExit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Name, setName] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setTimeout(() => setDisplaySplash(false), 3000);
  }, []);

  useEffect(() => {
    if (!displaySplash) {
      setTimeout(() => setAnimation(true), 100);
    }
  }, [displaySplash]);

  const verifyName = (Name) => {
    if (!Name.trim()) {
      setIsExit(null);
      return;
    }

    setIsLoading(true);
    fetch(`https://api.amway.thefirstimpression.ai/api/is_user_exit?name=${Name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setIsExit(data.is_user_exist);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setIsExit(null);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(Name);
    }, 500);
    return () => clearTimeout(handler);
  }, [Name]);

  useEffect(() => {
    if (debouncedQuery) {
      verifyName(debouncedQuery);
    } else {
      setIsExit(null);
    }
  }, [debouncedQuery]);

  const getStatusIcon = () => {
    if (!Name.trim()) return null;
    if (isLoading) return <span className="text-[#4B2500] animate-pulse">...</span>;
    if (isExit === true) return <X size={20} className="text-red-500" strokeWidth={1.5} />;
    if (isExit === false)
      return <CircleCheck size={20} className="text-white fill-[#4B2500]" strokeWidth={1.5} />;
    return null;
  };

  const goFarword = () => {
    if (isExit === false && Name.trim()) {
      sessionStorage.setItem("name", Name.trim());
      setShowLanguage(true);
    }
  };

  const handleLanguageSelect = (language) => {
    const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    router.push(`/quiz?language=${language.toLowerCase()}&session=${session_id}`);
  };

  const handleArrowClick = () => {
    setShowRegister(true);
  };

  if (displaySplash) {
    return (
      <Layout diffTopImage={true} animation={false}>
        <SplashScreen />
      </Layout>
    );
  }

  return (
    <Layout animation={animation}>
      <div className="relative h-full w-full z-50 overflow-hidden">
        <div
          className={`flex items-center justify-center gap-3 pt-[11vh] pb-[5vh] overflow-hidden
            transition-all duration-1000 ease-in-out ${
              animation ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
            }
          `}
        >
          <Image
            src={"/logos/Nutrilite-logo.png"}
            width={217}
            height={44}
            alt="nutrilite logo"
            priority={true}
          />
        </div>

        <div className="px-12 sm:w-4/5 sm:mx-auto">
          <Image
            className={`mx-auto w-auto transition-all duration-700 ease-in-out ${
              showRegister ? "h-[20vh] -translate-y-4" : "h-[43vh]"
            } ${animation ? "translate-y-0 opacity-100" : "translate-y-30 opacity-0"}`}
            alt="nutrilite-triple-protect"
            width={300}
            height={346}
            src="/images/image_biotin.png"
            priority={true}
            quality={100}
          />

          {!showRegister && (
            <button
              onClick={handleArrowClick}
              className={`w-full flex justify-center transition-all duration-1000 ease-in-out ${
                animation ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                className="border-2 border-[#4B2500] rounded-sm text-[#4B2500] mt-[4vh] cursor-pointer hover:bg-[#4B2500] hover:text-white transition-colors"
              >
                <path
                  d="M16 32H48M48 32L40 24M48 32L40 40"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {showRegister && !showLanguage && (
            <section
              className={`flex w-full flex-col gap-7 sm:gap-2 mt-6 transition-all duration-700 delay-200 ease-in-out ${
                showRegister ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-2 items-center">
                <h1 className="font-bold text-xl/7 text-[#4B2500] text-center">User Registration</h1>
              </div>

              <div className="w-full flex flex-col gap-1 justify-center">
                <input
                  type="text"
                  enterKeyHint="enter"
                  inputMode="text"
                  placeholder=" Your name"
                  className="font-medium text-sm/6 text-center align-middle text-[#4B2500] capitalize py-3.5 px-5 rounded-sm outline-1 outline-[#4B2500] bg-[#4B250014]"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
                {Name.trim() && (
                  <label
                    className={`font-medium flex items-center gap-1 text-sm/4 text-left px-5 ${
                      isExit === null
                        ? "text-gray-400"
                        : isExit === false
                        ? "text-[#4B2500]"
                        : "text-red-500"
                    }`}
                  >
                    {isExit === false
                      ? "Username available"
                      : isExit === true
                      ? "Username already exists"
                      : "Checking availability..."}
                    {getStatusIcon()}
                  </label>
                )}
              </div>

              <button
                onClick={goFarword}
                disabled={!(Name.trim() && isExit === false)}
                className={`py-3 px-3 rounded-sm font-bold text-xl/6.5 text-center cursor-pointer transition-all
                  ${
                    Name.trim() && isExit === false
                      ? "text-[#4B2500]"
                      : "text-[#4B2500] opacity-50 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </section>
          )}

          {showLanguage && (
            <section
              className={`flex w-full flex-col gap-6 mt-6 transition-all duration-700 ease-in-out ${
                showLanguage ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="font-bold text-xl/7 text-[#4B2500] text-center">CHOOSE LANGUAGE</h1>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleLanguageSelect("english")}
                  className="w-full py-4 px-4 rounded-lg border-2 border-[#4B2500] bg-[#4B250014] text-[#4B2500] font-semibold text-lg hover:bg-[#4B2500] hover:text-white transition-colors"
                >
                  English
                </button>

                <button
                  onClick={() => handleLanguageSelect("hindi")}
                  className="w-full py-4 px-4 rounded-lg border-2 border-[#4B2500] bg-[#4B250014] text-[#4B2500] font-semibold text-lg hover:bg-[#4B2500] hover:text-white transition-colors"
                >
                  Hindi
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;

