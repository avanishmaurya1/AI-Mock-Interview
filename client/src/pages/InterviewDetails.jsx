import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";


function InterviewDetails() {


  const { id } = useParams();

  const navigate = useNavigate();


  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(true);




  useEffect(() => {


    const fetchInterview = async () => {


      try {


        const res = await API.get(
          `/interview/${id}`
        );


        setInterview(
          res.data.interview
        );


      } catch(error) {


        console.log(error);

        alert(
          error.response?.data?.message ||
          "Failed to load interview"
        );


        navigate("/dashboard");


      } finally {


        setLoading(false);


      }


    };


    fetchInterview();


  }, [id, navigate]);






  if (loading) {


    return (

      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">

        <h2 className="text-2xl text-cyan-400">
          Loading Interview Details...
        </h2>

      </div>

    );

  }







  if (!interview) {


    return null;


  }






  return (

    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">



      <div className="max-w-5xl mx-auto">





        <button

          onClick={() => navigate("/dashboard")}

          className="mb-6 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"

        >

          ← Back Dashboard

        </button>







        <div className="bg-gray-800 p-6 rounded-xl mb-8">


          <h1 className="text-3xl font-bold text-cyan-400 mb-4">

            {interview.jobRole}

          </h1>




          <div className="grid md:grid-cols-3 gap-4">


            <div>

              <p className="text-gray-400">
                Experience
              </p>

              <p className="font-bold">
                {interview.experience}
              </p>

            </div>



            <div>

              <p className="text-gray-400">
                Difficulty
              </p>

              <p className="font-bold">
                {interview.difficulty}
              </p>

            </div>




            <div>

              <p className="text-gray-400">
                Overall Score
              </p>

              <p className="font-bold text-cyan-400">

                {interview.overallScore}/10

              </p>

            </div>



          </div>



        </div>







        <h2 className="text-2xl font-bold mb-5">

          Interview Report

        </h2>






        {
          interview.questions.map(
            (q,index)=>(


            <div

              key={q._id}

              className="bg-gray-800 rounded-xl p-6 mb-5"

            >



              <h3 className="text-xl font-bold mb-4">

                Q{index+1}. {q.question}

              </h3>





              <div className="mb-3">

                <p className="text-gray-400">
                  Your Answer
                </p>

                <p>
                  {q.answer || "Not answered"}
                </p>

              </div>







              <div className="mb-3">

                <p className="text-gray-400">
                  AI Feedback
                </p>

                <p>
                  {q.feedback || "No feedback"}
                </p>

              </div>








              <div className="mb-3">

                <p className="text-gray-400">
                  Correct Answer
                </p>

                <p>
                  {q.correctAnswer || "Not available"}
                </p>

              </div>








              <div className="mb-3">

                <p className="text-gray-400">
                  Improvement
                </p>

                <p>
                  {q.improvement || "No suggestion"}
                </p>

              </div>







              <p className="text-green-400 font-bold">

                Score: {q.score}/10

              </p>




            </div>


          )

          )

        }





      </div>



    </div>

  );

}



export default InterviewDetails;