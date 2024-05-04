import { useEffect, useState } from "react";

import Fondo from "../src/assets/hero_img.jpg";
import Logo from "../src/assets/logo.svg";
import Atranslate from "../src/assets/Sort_alfa.svg";
import Sound from "../src/assets/sound_max_fill.svg";
import Copy from "../src/assets/Copy.svg";
import flechas from "../src/assets/Change_lenguage.svg";
import Alert from '@mui/material/Alert';

function App() {
  const [texto, setTexto] = useState("");
  const [textoTraducido, setTextoTraducido] = useState("");
  const [idiomaOg, setIdiomaOg] = useState("es");
  const [idiomaTr, setIdiomaTr] = useState("en");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleChange = (e) => {
    setTexto(e.target.value);
  };

  const traducirTexto = async () => {
    try {
      if (texto.trim() === "") {
        setTextoTraducido("");
        return;
      }
      const textoCodificado = encodeURIComponent(texto);
      const url = `https://api.mymemory.translated.net/get?q=${textoCodificado}&langpair=${idiomaOg}|${idiomaTr}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const traduccion = data.responseData.translatedText;
        setTextoTraducido(traduccion);
      } else {
        throw new Error("Error al realizar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const detectarIdioma = async () => {
    try {
      const response = await fetch("https://ws.detectlanguage.com/0.2/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer af2fcc255e9543d9aeda4300ac4138aa",
        },
        body: JSON.stringify({ q: texto }),
      });
      if (response.ok) {
        const data = await response.json();
        const detections = data.data.detections;
        if (detections && detections.length > 0) {
          const idiomaDetectado = detections.find(
            (detection) => detection.isReliable === true
          );
          if (idiomaDetectado) {
            const idioma = idiomaDetectado.language;
            setIdiomaOg(idioma);
          } else {
            console.log("No se pudo detectar un idioma confiable.");
          }
        } else {
          console.log("No se encontraron detecciones de idioma.");
        }
      } else {
        throw new Error("Error al realizar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopyTexto = () => {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        console.log("Texto copiado al portapapeles");
        setAlertMessage("Texto copiado al portapapeles");
        setAlertType("success");
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
      })
      .catch((err) => {
        console.error("Error al copiar el texto:", err);
        setAlertMessage("Error al copiar el texto");
        setAlertType("error");
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
      });
  };

 const handleCopyTranslate = () => {
    navigator.clipboard
      .writeText(textoTraducido)
      .then(() => {
        console.log("Traducción copiada al portapapeles");
        setAlertMessage("Traducción copiada al portapapeles");
        setAlertType("success");
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000); 
      })
      .catch((err) => {
        console.error("Error al copiar la traducción:", err);
        setAlertMessage("Error al copiar la traducción");
        setAlertType("error");
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000); 
      });
  }

  const originLenguage = (lenguage) => {
    setIdiomaOg(lenguage);
  };

  const translateLenguage = (lenguage) => {
    setIdiomaTr(lenguage);
  };

  const cambiarIdiomas = () => {
    const tempIdiomaOg = idiomaOg;
    setIdiomaOg(idiomaTr);
    setIdiomaTr(tempIdiomaOg);
  };

  const reproducirTextoOg = () => {
    const utterance1 = new SpeechSynthesisUtterance(texto);
    speechSynthesis.speak(utterance1);
  };

  const reproducirTextoTraducido = () => {
    const utterance2 = new SpeechSynthesisUtterance(textoTraducido);
    speechSynthesis.speak(utterance2);
  };

  useEffect(()=>{
    if(idiomaOg === idiomaTr){
      setIdiomaTr('')
    }
  }, [idiomaOg])

  return (
    <div
      className="bg-cover bg-center h-full sm:h-screen"
      style={{ backgroundImage: `url(${Fondo})` }}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="h-40 flex items-end">
          <img src={Logo} alt="" />
        </div>
        <div className=" w-full h-full justify-center items-center flex flex-col sm:flex-row gap-5 mt-10">
          <div className="h-96 w-6/7 sm:w-2/5 bg-gray-800 opacity-90 rounded-3xl flex flex-col border border-gray-500">
            <div className="h-16 flex items-center justify-start gap-2 px-1 text-sm text-gray-300">
              <button className=" transition duration-300 hover:text-white hover:bg-slate-500 opacity-20 hover:opacity-100 rounded-xl p-2" onClick={detectarIdioma}>
                Detect Lenguage
              </button>
              <button
                className={`transition duration-300 hover:text-white hover:bg-slate-500 opacity-20 hover:opacity-100 rounded-xl p-2 ${
                  idiomaOg === "en"
                    ? "bg-slate-500 text-white opacity-100"
                    : "text-gray-300"
                }`}
                onClick={() => originLenguage("en")}
              >
                English
              </button>
              <button
                className={`transition duration-300 hover:text-white hover:bg-slate-500 opacity-20 hover:opacity-100 rounded-xl p-2 ${
                  idiomaOg === "fr"
                    ? "bg-slate-500 text-white opacity-100"
                    : "text-gray-300"
                }`}
                onClick={() => originLenguage("fr")}
              >
                French
              </button>
              <button
                className={`transition duration-300 hover:text-white hover:bg-slate-500 opacity-20 hover:opacity-100 rounded-xl p-2 ${
                  idiomaOg === "es"
                    ? "bg-slate-500 text-white opacity-100"
                    : "text-gray-300"
                }`}
                onClick={() => originLenguage("es")}
              >
                Spanish
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-11/12">
                <div className="border-t border-gray-300 opacity-20"></div>
              </div>
            </div>
            <label
              htmlFor="traduccion"
              className="h-56 flex w-full items-start"
            >
              <textarea
                id="traduccion"
                maxLength={500}
                value={texto}
                className="pt-5 bg-transparent text-white h-full w-full focus:outline-none px-8 resize-none overflow-auto"
                placeholder="Traduce tu texto..."
                onChange={handleChange}
              ></textarea>
            </label>
            <div className="flex items-center justify-end pr-10">
              <p className="text-gray-300 opacity-30">{texto.length} / 500 </p>
            </div>
            <div className="h-20 flex">
              <div className="w-1/2 flex gap-2 pl-10 items-center">
                <button className="border-2 rounded-xl border-gray-600" onClick={reproducirTextoOg}>
                  <img src={Sound} alt="Sound" className="h-6 m-1" />
                </button>
                <button className="border-2  rounded-xl border-gray-600">
                  <img
                    src={Copy}
                    alt="Copy"
                    className="h-6 m-1"
                    onClick={handleCopyTexto}
                  />
                </button>
              </div>
              <div className="w-1/2 flex items-center justify-end pr-8">
                <button
                  className=" transition duration-300 bg-blue-600 hover:bg-blue-500 h-10 w-36 rounded-lg text-white flex items-center justify-center gap-2 border-white border"
                  onClick={traducirTexto}
                >
                  <img src={Atranslate} alt="" />
                  Translate
                </button>
              </div>
            </div>
          </div>

          <div className="h-96 w-6/7 sm:w-2/5 bg-gray-900 opacity-90 rounded-3xl flex flex-col border border-gray-500">
            <div className="h-16 flex items-center justify-between gap-2 sm:gap-6 px-10 text-sm text-gray-300">
              <div className="flex gap-6">
                <button
                  className={`transition duration-300 ${
                    idiomaTr === "en"
                      ? "bg-slate-500 text-white opacity-100"
                      : "text-gray-300"
                  } rounded-xl p-2 ${
                    idiomaOg === "en"
                      ? "opacity-20"
                      : "hover:text-white hover:bg-slate-500 hover:opacity-100 opacity-20 text-gray-300"
                  }`}
                  onClick={() => translateLenguage("en")}
                  disabled={idiomaOg === "en"}
                >
                  English
                </button>
                <button
                  className={`transition duration-300 ${
                    idiomaTr === "fr"
                      ? "bg-slate-500 text-white opacity-100"
                      : "text-gray-300"
                  } rounded-xl p-2 ${
                    idiomaOg === "fr"
                      ? "opacity-20"
                      : "hover:text-white hover:bg-slate-500 hover:opacity-100 opacity-20 text-gray-300"
                  }`}
                  onClick={() => translateLenguage("fr")}
                  disabled={idiomaOg === "fr"}
                >
                  French
                </button>

                <button
                  className={`transition duration-300 ${
                    idiomaTr === "es"
                      ? "bg-slate-500 text-white opacity-100"
                      : "text-gray-300"
                  } rounded-xl p-2 ${
                    idiomaOg === "es"
                      ? "opacity-20"
                      : "hover:text-white hover:bg-slate-500 hover:opacity-100 opacity-20 text-gray-300"
                  }`}
                  onClick={() => translateLenguage("es")}
                  disabled={idiomaOg === "es"}
                >
                  Spanish
                </button>
              </div>
              <div className="flex items-center justify-end w-1/3">
                <div className="border-2  rounded-lg border-gray-600 flex items-center  cursor-pointer" onClick={cambiarIdiomas}>
                  <img src={flechas} alt="" className="h-5 m-1" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-11/12">
                <div className="border-t border-gray-300 opacity-20"></div>
              </div>
            </div>
            <label
              htmlFor="traduccion"
              className="h-56 flex w-full items-start"
            >
              <textarea
                id="traduccion"
                readOnly
                maxLength={500}
                value={textoTraducido}
                className="pt-5 bg-transparent text-white h-full w-full focus:outline-none px-8 resize-none overflow-auto"
              ></textarea>
            </label>
            <div className="h-20 flex">
              <div className="w-1/2 flex gap-2 pl-10 items-center">
                <button className="border-2 rounded-xl border-gray-600" onClick={reproducirTextoTraducido}>
                  <img src={Sound} alt="Sound" className="h-6 m-1" />
                </button>
                <button className="border-2  rounded-xl border-gray-600">
                  <img
                    src={Copy}
                    alt="Copy"
                    className="h-6 m-1"
                    onClick={handleCopyTranslate}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alertOpen && (
  <Alert
    severity={alertType === "success" ? "success" : "error"}
    onClose={() => setAlertOpen(false)}
    className="fixed top-5 right-5 w-60 "
    style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
    {alertMessage}
  </Alert>
)}
    </div>
  );
}

export default App;
