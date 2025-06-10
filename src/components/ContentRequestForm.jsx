import {useState} from "react";
import {useForm} from "react-hook-form";
import useContent from "../hooks/useContent";
import useLoader from "../hooks/useLoader";
import useUserLoginStore from "../hooks/useUserLoginStore";

const NETWORK_OPTIONS = [
  {label: "Instagram", value: "instagram"},
  {label: "Instagram Story", value: "instagram_stories"},
  {label: "LinkedIn", value: "linkedin"},
  {label: "Twitter", value: "x"},
  {label: "Facebook", value: "facebook_page"},
  {label: "Website Blog Post", value: "blog"},
];
const LANGUAGE_OPTIONS = [
  {label: "English", value: "english"},
  {label: "Spanish", value: "spanish"},
  {label: "French", value: "french"},
  {label: "German", value: "german"},
  {label: "Italian", value: "italian"},
  {label: "Hebrew", value: "hebrew"},
  {label: "Russian", value: "russian"},
];

export default function ContentRequestForm() {
  const {contentGenerator} = useContent();
  const {setLoading} = useLoader();
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();
  const {getUserCompanies} = useUserLoginStore();
  const companies = getUserCompanies();

  const [keywords, setKeywords] = useState([]);
  const [network, setNetwork] = useState("Instagram");
  const [language, setLanguage] = useState("English");
  const [keywordInput, setKeywordInput] = useState("");

  const onSubmit = async (data) => {
    const formData = {...data, keywords, network, language};
    setLoading(true);
    const result = await contentGenerator(formData);

    if (result) {
      reset();
      setKeywords([]);
      setKeywordInput("");
      setNetwork("Instagram");
    }
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  return (
    <div className='flex w-full min-h-full flex-col justify-center px-6  lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
          Request Content
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-4xl'>
        <form className='space-y-6 w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid w-full grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Persona */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-900'>
                Persona
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register("persona", {required: "Persona is required"})}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600'
                  placeholder='e.g. HYRW'
                  value={companies.companyName} // Default to first company name
                />
                {errors.persona && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.persona.message}
                  </p>
                )}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-900'>
                Topic
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register("topic", {required: "Topic is required"})}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600'
                  placeholder='e.g. how sports improve work performance'
                />
                {errors.topic && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.topic.message}
                  </p>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-900'>
                Industry
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register("industry", {required: "Industry is required"})}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600'
                  placeholder='e.g. work therapy'
                />
                {errors.industry && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.industry.message}
                  </p>
                )}
              </div>
            </div>

            {/* Network */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-900'>
                Network
              </label>
              <div className='mt-2'>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600'
                >
                  {NETWORK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-900'>
                Language
              </label>
              <div className='mt-2'>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600'
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keywords (ocupa las dos columnas) */}
            <div >
              <label className='block text-sm text-left font-medium text-gray-900'>
                Keywords
              </label>
              <div className='mt-2 flex gap-2'>
                <input
                  type='text'
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  className='flex-1 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600'
                  placeholder='Type a keyword and press Enter'
                />
                <button
                  type='button'
                  onClick={addKeyword}
                  className='px-3 py-1.5 text-sm text-left bg-indigo-600 text-white rounded-md hover:bg-indigo-500'
                >
                  Add
                </button>
              </div>
              <div className='flex flex-wrap gap-2 mt-2'>
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className='flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm'
                  >
                    {kw}
                    <button
                      type='button'
                      onClick={() => removeKeyword(kw)}
                      className='text-red-600 hover:text-red-800 font-bold'
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className='w-full items-center justify-center flex'>
            <button
              type='submit'
              className='flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
