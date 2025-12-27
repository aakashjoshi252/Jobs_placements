import { useState } from "react";
import ChatList from "../../../components/chatbox/ChatList";
import ChatBox from "../../../components/chatbox/Chatbox";

const Chatpage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="relative h-full lg:grid lg:grid-cols-12 max-w-7xl mx-auto">
        {/* CHAT LIST */}
        <div
          className={`
            absolute inset-0 z-10 bg-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${selectedChat ? "-translate-x-full" : "translate-x-0"}
            lg:relative lg:translate-x-0 lg:col-span-4 xl:col-span-3
            lg:rounded-l-2xl lg:border-r lg:border-neutral-200
          `}
        >
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* CHAT BOX */}
        <div
          className={`
            absolute inset-0 z-20 bg-white
            transform transition-transform duration-300 ease-in-out
            ${selectedChat ? "translate-x-0" : "translate-x-full"}
            lg:relative lg:translate-x-0 lg:col-span-8 xl:col-span-9
            lg:rounded-r-2xl
          `}
        >
          {selectedChat ? (
            <ChatBox chat={selectedChat} onBack={handleBack} />
          ) : (
            <div className="hidden lg:flex h-full items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50">
              <div className="text-center space-y-4 p-8">
                <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">
                  Start a Conversation
                </h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  Select a contact from the list to begin messaging and
                  collaborate on your job search journey
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
