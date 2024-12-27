import React from 'react'

const About = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-3xl mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p className="mb-4"><h2 className='text-xl font-semibold mb-4 text-center'>Welcome to DebateHub!</h2>
DebateHub is an interactive platform where users can engage in thoughtful debates on a wide range of topics. You can create a question, offer multiple viewpoints, and allow the community to vote on the options. Every user is given 10 votes to distribute as they see fit. The results are displayed in graphical formats, allowing everyone to see the distribution of opinions. The goal of DebateHub is to foster meaningful discussions where ideas can be freely exchanged, respected, and explored in a constructive way.
              </p>
            </div>
    </div>
  )
}

export default About