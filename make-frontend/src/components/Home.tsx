import { FC, useState, useCallback, useRef } from 'react';
import Navbar from './Navbar';
import Webcam from 'react-webcam';

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
    const [leaderboard] = useState<LeaderboardEntry[]>([
        { username: "User1", score: 100, rank: 1 },
        { username: "User2", score: 90, rank: 2 },
        { username: "User3", score: 80, rank: 3 },
    ]);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Welcome to our platform!", timestamp: "2024-02-15 10:00" }
    ]);

    
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    return (
        <div className="mx-auto w-full">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                                {/* Webcam Section */}
                                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Take a Photo</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            {!imgSrc ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full max-w-2xl mx-auto rounded"
                                />
                            ) : (
                                <img
                                    src={imgSrc}
                                    alt="webcam capture"
                                    className="w-full max-w-2xl mx-auto rounded"
                                />
                            )}
                        </div>
                        <div className="flex justify-center space-x-4">
                            {!imgSrc ? (
                                <button
                                    onClick={capture}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Capture Photo
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setImgSrc(null)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Retake
                                    </button>
                                    <button
                                        onClick={sendImageToBackend}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                        Upload Photo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
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
            </div>
        </div>
    );
};

export default Home;