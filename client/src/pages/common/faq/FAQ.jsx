import { useState } from "react";

const faqData = [
    {
        id: 1,
        question: "How do I apply for a job?",
        answer:
            "You can search job listings, select a role you’re interested in, and click the Apply button. Make sure your resume is updated before applying."
    },
    {
        id: 2,
        question: "How can I upload my resume?",
        answer:
            "Go to your profile section, click on Upload Resume, choose a PDF file, and submit. The file should not exceed 2MB."
    },
    {
        id: 3,
        question: "Is there any fee for creating an account?",
        answer:
            "No, job seekers can register, upload resumes, and apply for jobs completely free."
    },
    {
        id: 4,
        question: "How can recruiters contact me?",
        answer:
            "Recruiters can directly message you or invite you for interviews if your profile matches their requirements."
    },
    {
        id: 5,
        question: "How do I reset my password?",
        answer:
            "Go to Login → Forgot Password → Enter your registered email and follow the instructions."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Frequently Asked Questions
            </h2>

            {faqData.map((faq, index) => (
                <div
                    key={faq.id}
                    className="border border-gray-300 rounded-lg mb-4 shadow-sm hover:shadow-md transition"
                >
                    {/* Question */}
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => toggleFAQ(index)}
                    >
                        <h4 className="text-lg font-semibold text-gray-800">{faq.question}</h4>
                        <span className="text-2xl font-bold text-gray-700">
                            {activeIndex === index ? "−" : "+"}
                        </span>
                    </div>

                    {/* Answer */}
                    {activeIndex === index && (
                        <p className="p-4 text-gray-700 bg-white leading-relaxed">
                            {faq.answer}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
