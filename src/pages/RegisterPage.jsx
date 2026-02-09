import React from 'react';
import AuthHero from '../components/auth/AuthHero';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full">
                {/* LEFT: Hero Image (Ẩn trên mobile) */}
                <AuthHero />

                {/* RIGHT: Register Form */}
                <div className="lg:col-span-1 flex items-center justify-center overflow-y-auto">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
