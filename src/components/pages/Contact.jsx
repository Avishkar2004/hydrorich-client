import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api.js';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [aiResponse, setAiResponse] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setAiResponse(null)

        try {
            const response = await fetch(API_ENDPOINTS.contact, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setAiResponse(data.aiResponse)
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
                setErrors(data.errors || { submit: 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrors({ submit: 'Network error. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <Mail className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Email</h3>
                                    <p className="text-gray-600">support@hydrorich.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <Phone className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Phone</h3>
                                    <p className="text-gray-600">+91 1234567890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <MapPin className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Address</h3>
                                    <p className="text-gray-600">123 Water Street, Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h2>
                        <div className="space-y-2 text-gray-600">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                                placeholder="How can we help?"
                            />
                            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                                placeholder="Your message here..."
                            />
                            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {errors.submit}
                            </div>
                        )}
                        {submitStatus === 'success' && (
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                                Thank you for your message! We'll get back to you soon.
                                {aiResponse && (
                                    <div className='p-4 bg-gray-50 rounded-lg'>
                                        <h3 className="font-medium text-gray-800 mb-2">Initial Response:</h3>
                                        <div className='prose prose-sm text-gray-800'>
                                            {aiResponse.split("\n").map((paragragh, index) => (
                                                <p className='mb-2' key={index}>{paragragh}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
