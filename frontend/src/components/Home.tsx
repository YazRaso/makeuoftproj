import { FC, useState, useEffect } from 'react';
import { useRef } from 'react';
import Navbar from './Navbar';
import Quagga from 'quagga';

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

interface PackagingResponse {
    packaging_recycling?: {
        material: string;
        instructions: string;
    }[];
    error?: string;
}


const Home: FC = () => {
    const [packagingInfo, setPackagingInfo] = useState<PackagingResponse | null>(null);

    const [leaderboard] = useState<LeaderboardEntry[]>([
        { username: "User1", score: 100, rank: 1 },
        { username: "User2", score: 90, rank: 2 },
        { username: "User3", score: 80, rank: 3 },
    ]);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Welcome to our platform!", timestamp: "2024-02-15 10:00" }
    ]);

    const [isScannerActive, setIsScannerActive] = useState(false);
    
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

            Quagga.onDetected((result: { codeResult: { code: string } }) => {
                const code = result.codeResult.code;
                console.log(result);
                console.log("Barcode detected:", code);
            
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }
            
                debounceTimeout.current = setTimeout(() => {
                    handleBarcodeDetected(code);
                    setIsScannerActive(false);
                }, 1000); // Adjust the debounce delay as needed
            });
        }

        return () => {
            if (isScannerActive) {
                Quagga.stop();
            }
        };
    }, [isScannerActive]);


    const handleBarcodeDetected = async (code: string) => {
        try {
            console.log("Fetching barcode data for:", code);
            console.log("Fetching at:", `https://world.openfoodfacts.org/api/v2/product/${code}?fields=packaging`);
            const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}?fields=packaging`);
            
            if (response.ok) {
                const data = await response.json();
                console.log("Packaging data:", data);
                // You might want to store this in state
                const packagingInfo: PackagingResponse = {
                    packaging_recycling: data
                };
                setPackagingInfo(packagingInfo);

                //arduino integration
                // Send barcode to backend
                const backendResponse = await fetch("http://127.0.0.1:5000/open-bin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ barcode: code })
                });

                if (backendResponse.ok) {
                    const backendData = await backendResponse.json();
                    console.log("Backend response:", backendData);
                } else {
                    console.error("Failed to send barcode to backend");
                }
            } else {
                console.error("Barcode not found");
                const errorInfo: PackagingResponse = {
                    error: "Barcode not found!"
                };
                setPackagingInfo(errorInfo);
            }
        } catch (error) {
            console.error("Error fetching barcode data:", error);
            const errorInfo: PackagingResponse = {
                error: "Error fetching barcode data"
            };
            setPackagingInfo(errorInfo);
        }
    };

    return (
        <div className="mx-auto w-full">
            <Navbar />

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
                        {packagingInfo && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <h3 className="font-bold mb-2">Packaging Information:</h3>
                                {packagingInfo.error ? (
                                    <p className="text-red-600">{packagingInfo.error}</p>
                                ) : (
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(packagingInfo.packaging_recycling, null, 2)}
                                    </pre>
                                )}
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