import { useState } from "react";
import ChatList from "../../../components/chatbox/ChatList";
import ChatBox from "../../../components/chatbox/Chatbox";
import { HiChatAlt2 } from "react-icons/hi";

const Chatpage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="flex-1 flex lg:grid lg:grid-cols-12 max-w-7xl mx-auto w-full overflow-hidden">
        {/* CHAT LIST */}
        <div
          className={`
            absolute inset-0 z-10 bg-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${selectedChat ? "-translate-x-full" : "translate-x-0"}
            lg:relative lg:translate-x-0 lg:col-span-4 xl:col-span-3
            lg:rounded-l-2xl lg:border-r lg:border-gray-200
            flex flex-col h-full
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
            flex flex-col h-full
          `}
        >
          {selectedChat ? (
            <ChatBox chat={selectedChat} onBack={handleBack} />
          ) : (
            <div className="hidden lg:flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="text-center space-y-6 p-8 max-w-md">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                  <HiChatAlt2 className="text-6xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Start a Conversation
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Select a contact from the list to begin messaging and
                  collaborate on your job search journey
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <HiChatAlt2 className="text-lg" />
                    Choose a conversation to get started
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatpage;