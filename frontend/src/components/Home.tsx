import { FC, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Quagga from 'quagga';
import Scanner from './Scanner';

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

interface BarcodeInfo {
    format: string;
    code: string;
    direction: string;
    quality: number;
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

    const [isScannerActive, setIsScannerActive] = useState(false);
    const [barcode, setBarcode] = useState<number | null>(null);
    
    useEffect(() => {
        if (isScannerActive) {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#interactive') as HTMLElement,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: [
                        "ean_reader",
                        "ean_8_reader",
                        "upc_reader",
                        "upc_e_reader",
                        "code_128_reader",
                        "code_39_reader",
                        "codabar_reader",
                        "i2of5_reader"
                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                    }
                }
            }, (err: Error | null) => {
                if (err) {
                    console.error("Failed to initialize QuaggaJS:", err);
                    return;
                }
                console.log("QuaggaJS initialized. Ready to scan barcodes.");
                Quagga.start();
            });

            Quagga.onDetected((result: { codeResult: { format: string; code: string; direction: string; decodedCodes: { error: number }[] } }) => {
                const code = result.codeResult.code;
                console.log("Barcode detected:", barcode);

                setBarcode(barcode);
                handleBarcodeDetected(code);
                setIsScannerActive(false);
                Quagga.stop();
            });
        }

        return () => {
            if (isScannerActive) {
                Quagga.stop();
            }
        };
    }, [isScannerActive]);

    return (
        <div className="mx-auto w-full">
            <Navbar />
            <Scanner />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Scanner Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Scan Barcode</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            {isScannerActive ? (
                                <div id="interactive" className="viewport" />
                            ) : (
                                <button
                                    onClick={() => setIsScannerActive(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Start Scanner
                                </button>
                            )}
                        </div>
                        {barcodeInfo && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <h3 className="font-bold mb-2">Barcode Information:</h3>
                                <ul className="space-y-2">
                                    <li><strong>Format:</strong> {barcodeInfo.format}</li>
                                    <li><strong>Code:</strong> {barcodeInfo.code}</li>
                                    <li><strong>Direction:</strong> {barcodeInfo.direction}</li>
                                    <li><strong>Quality:</strong> {barcodeInfo.quality.toFixed(2)}</li>
                                </ul>
                            </div>
                        )}
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