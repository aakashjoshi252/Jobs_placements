import { useState } from "react";
import ChatList from "../../../components/chatbox/ChatList";
import ChatBox from "../../../components/chatbox/Chatbox";

const Chatpage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setIsMobileView(true);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setIsMobileView(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Chat List - Hidden on mobile when chat is selected */}
        <div
          className={`${
            isMobileView ? "hidden" : "block"
          } lg:block lg:col-span-1`}
        >
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* Chat Box */}
        <div
          className={`${
            isMobileView ? "block" : "hidden"
          } lg:block lg:col-span-2`}
        >
          {selectedChat ? (
            <ChatBox chat={selectedChat} onBack={handleBack} />
          ) : (
            <div className="hidden lg:flex h-full items-center justify-center bg-white rounded-lg shadow-lg">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Select a conversation
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a user from the list to start chatting
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
