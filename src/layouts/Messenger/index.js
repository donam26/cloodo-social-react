import Header from "../../components/Layout/Header";

const MessengerLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <main className="flex-1 overflow-hidden pt-14">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MessengerLayout;