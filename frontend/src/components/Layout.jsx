import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark text-light font-sans">
            <Navbar />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
