import Image from "next/image";

export default function Header() {
    return (
        <header className="relative w-full h-32 md:h-40 lg:h-48">
            {/* Image de fond */}
            <div className="absolute inset-0">
                <Image
                    src="/images/header/header.jpg"
                    alt="Header background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/0"></div>
            </div>

            <div className="relative z-10 ml-4 h-full flex flex-col justify-between p-4 md:p-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                    <a href="/">
                        <Image
                            src="/images/header/arrow.png"
                            alt="Home"
                            width={20}
                            height={20}
                            className="rounded-[30px]"
                        />
                    </a>
                    <a href="/">
                        <Image
                            src="/images/header/house.png"
                            alt="Home"
                            width={20}
                            height={20}
                            className="rounded-[30px]"
                        />
                    </a>
                    <span>Accueil / Tous les produits</span>

                </div>

                {/* Titre responsive */}
                <h1 className="text-white pb-4 md:pb-7 font-medium leading-tight md:leading-[70px] tracking-normal min-w-[500px]: text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    Tous nos produits
                </h1>
            </div>
        </header>
    );
}