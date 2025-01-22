import { FaFacebookMessenger } from "react-icons/fa";

const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <FaFacebookMessenger className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">Messenger</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src="/images/avatar.jpg"
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </header>

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