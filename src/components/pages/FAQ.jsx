import { useState } from "react";
import { ChevronDown, ChevronUp, Leaf, Package, Truck, CreditCard, HelpCircle } from "lucide-react";

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Products",
            icon: <Leaf className="w-5 h-5 text-green-600" />,
            questions: [
                {
                    question: "What types of agricultural products do you offer?",
                    answer: "We offer a wide range of agricultural products including PGR (Plant Growth Regulators), Organic fertilizers, Micronutrients, Insecticides, and Fungicides. All our products are carefully selected to ensure the best results for your crops."
                },
                {
                    question: "Are your products certified organic?",
                    answer: "Yes, our organic products are certified and follow sustainable farming practices. We ensure that all our products meet the highest quality standards and are safe for both crops and the environment."
                },
                {
                    question: "How do I choose the right product for my crops?",
                    answer: "You can browse our products by category and read detailed descriptions. Each product page includes information about its uses, application methods, and suitable crops. You can also contact our agricultural experts for personalized recommendations."
                }
            ]
        },
        {
            category: "Orders & Shipping",
            icon: <Package className="w-5 h-5 text-green-600" />,
            questions: [
                {
                    question: "How do I place an order?",
                    answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping details, and complete the payment process. You can track your order status in your account dashboard."
                },
                {
                    question: "What are your shipping areas?",
                    answer: "We currently ship to all major cities and rural areas across India. Delivery times vary based on your location, typically ranging from 2-7 business days. We're continuously expanding our shipping network."
                },
                {
                    question: "How can I track my order?",
                    answer: "You can track your order by logging into your account and visiting the 'My Orders' section. Each order has a tracking number and status updates. You'll also receive SMS and email notifications about your order status."
                }
            ]
        },
        {
            category: "Payment & Pricing",
            icon: <CreditCard className="w-5 h-5 text-green-600" />,
            questions: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment gateway. We also offer cash on delivery for eligible orders."
                },
                {
                    question: "Do you offer bulk purchase discounts?",
                    answer: "Yes, we offer special pricing for bulk purchases. Please contact our sales team for bulk order inquiries and customized pricing. We also have special rates for farmers and agricultural cooperatives."
                },
                {
                    question: "How do I get an invoice for my purchase?",
                    answer: "You can download your invoice from the 'My Orders' section. Click on the 'Download Invoice' button next to your order. The invoice will be downloaded as a PDF file. You can also request a physical copy to be included with your delivery."
                }
            ]
        },
        {
            category: "Support & Returns",
            icon: <HelpCircle className="w-5 h-5 text-green-600" />,
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "We accept returns within 7 days of delivery if the product is unopened and in its original packaging. For damaged or incorrect items, please contact our customer support within 48 hours of delivery."
                },
                {
                    question: "How can I get technical support for product usage?",
                    answer: "Our agricultural experts are available to provide technical support. You can reach them through our customer support channels. We also provide detailed usage instructions with each product and have a knowledge base of best practices."
                },
                {
                    question: "Do you offer product training or demonstrations?",
                    answer: "Yes, we offer product demonstrations and training sessions for farmers and agricultural professionals. These can be arranged through our customer support team. We also conduct regular webinars and workshops on agricultural best practices."
                }
            ]
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600">
                        Find answers to common questions about our agricultural products and services
                    </p>
                </div>

                <div className="space-y-8">
                    {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                {category.icon}
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {category.category}
                                </h2>
                            </div>
                            {category.questions.map((faq, index) => {
                                const globalIndex = `${categoryIndex}-${index}`;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(globalIndex)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium text-gray-800">
                                                {faq.question}
                                            </span>
                                            {openIndex === globalIndex ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                        {openIndex === globalIndex && (
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                                <p className="text-gray-600">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Still have questions? Our agricultural experts are here to help!
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        Contact Our Experts
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ; 