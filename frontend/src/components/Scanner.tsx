import { FC, useEffect, useState } from 'react';
// @ts-expect-error because Quagga not ts compatible
import Quagga from 'quagga';

interface BarcodeResult {
    format: string;
    code: string;
    direction: string;
    quality: number;
}

const Scanner: FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [barcodeResult, setBarcodeResult] = useState<BarcodeResult | null>(null);

    const initializeScanner = () => {
        setIsScanning(true);
        
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
            }
        }, (err) => {
            if (err) {
                console.error("Failed to initialize QuaggaJS:", err);
                return;
            }
            console.log("QuaggaJS initialized. Ready to scan barcodes.");
            Quagga.start();
        });

        Quagga.onDetected((result) => {
            const barcodeData: BarcodeResult = {
                format: result.codeResult.format,
                code: result.codeResult.code,
                direction: result.codeResult.direction,
                quality: 1 - result.codeResult.decodedCodes[0].error
            };
            
            console.log("Barcode detected:", barcodeData);
            setBarcodeResult(barcodeData);
            stopScanner();
        });
    };

    const stopScanner = () => {
        Quagga.stop();
        setIsScanning(false);
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (isScanning) {
                Quagga.stop();
            }
        };
    }, [isScanning]);

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <div className="w-full max-w-2xl">
                {!isScanning ? (
                    <button
                        onClick={initializeScanner}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Start Scanner
                    </button>
                ) : (
                    <div className="relative">
                        <div id="interactive" className="viewport border rounded-lg overflow-hidden" />
                        <button
                            onClick={stopScanner}
                            className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Stop
                        </button>
                    </div>
                )}
            </div>

            {barcodeResult && (
                <div className="w-full max-w-2xl p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Scan Result:</h3>
                    <div className="space-y-2">
                        <p><strong>Format:</strong> {barcodeResult.format}</p>
                        <p><strong>Code:</strong> {barcodeResult.code}</p>
                        <p><strong>Direction:</strong> {barcodeResult.direction}</p>
                        <p><strong>Quality:</strong> {barcodeResult.quality.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;