import { FC } from 'react';
import logo from '../assets/logo.png';

const Navbar: FC = () => {
    return (
        <nav className="w-full h-24 bg-white shadow border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Left section (empty for balance) */}
                <div className="w-24"></div>
                
                {/* Center section with logo */}
                <a 
                    href="/"
                    className="flex items-center justify-center"
                >
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="h-16"
                    />
                </a>

                {/* Right section with login button */}
                <div className="w-24 flex justify-end">
                    <a 
                        href="/login"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer transition-colors"
                    >
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;