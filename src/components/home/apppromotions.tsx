import { QrCode } from "lucide-react";

export default function AppPromotion() {
    return(
        <>
         <div className="my-12 bg-blue-900 rounded-lg overflow-hidden relative">
            <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-lg mb-6 md:mb-0">
                    <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
                        Drive smart with our App
                    </h2>
                    <p className="text-blue-100 mb-6">
                        Get exclusive deals , service updates , and more through our app. Download now for best car buying and selling experience.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-2 rounded-lg mb-2">
                        <img src="https://media.cars24.com/india/cms/prod/banners/root/2024/09/23/0b272e0e-5fa2-44fc-b37e-d78c221a4409-CARS24.png" className="h-24 w-24 text-white"/>
                    </div>
                        <span className="text-white text-sm">Scan to Download</span>
                </div>
                <div className="right-0 bottom-0 opacity-90">
                    <img src="https://media.cars24.com/india/cms/prod/banners/root/2025/01/24/fe810d6d-541a-4e4e-a55c-a5ffbf259932-New-desktop.png" alt="people with mobile phones" className="h-48 md:h-60 w-auto object-cover rounded-tl-lg"/>
                </div>
            </div>
         </div>
        </>
    )
}