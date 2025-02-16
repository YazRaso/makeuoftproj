import { FC, useState, ChangeEvent } from 'react';
import Navbar from './Navbar';

interface LeaderboardEntry {
    username: string;
    score: number;
    rank: number;
}

interface Message {
    id: number;
    text: string;
    timestamp: string;
}

const Home: FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Welcome to our platform!", timestamp: "2024-02-15 10:00" }
    ]);

    const [leaderboard] = useState<LeaderboardEntry[]>([
        { username: "User1", score: 100, rank: 1 },
        { username: "User2", score: 90, rank: 2 },
        { username: "User3", score: 80, rank: 3 },
    ]);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Add your file upload logic here
            console.log("File selected:", file.name);
        }
    };

    return (
        <div className="mx-auto w-full">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Leaderboard Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                    <div className="space-y-4">
                        {leaderboard.map((entry) => (
                            <div 
                                key={entry.rank}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded"
                            >
                                <div className="flex items-center">
                                    <span className="font-bold w-8">{entry.rank}.</span>
                                    <span>{entry.username}</span>
                                </div>
                                <span className="font-bold">{entry.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Messages</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {messages.map((message) => (
                            <div 
                                key={message.id}
                                className="bg-gray-50 p-3 rounded"
                            >
                                <p>{message.text}</p>
                                <span className="text-sm text-gray-500">{message.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Photo Upload Section */}
                <div className="mt-8 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label
                        htmlFor="photo-upload"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block"
                    >
                        Upload Photo
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Home;