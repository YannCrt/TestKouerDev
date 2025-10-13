import header from "../../../../../public/images/header.png";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
            <h1 className="text-xl font-bold">MonSite</h1>

            <nav className="flex gap-4">
                <a href="">Home</a>
                <a href="/about">À propos</a>
                <a href="/contact">Contact</a>
            </nav>
        </header>
    );
}
