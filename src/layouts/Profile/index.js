import Header from "../../components/Layout/Header";

const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main content */}
      <main className="h-screen pt-16">
        <div className="h-full max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default ProfileLayout;