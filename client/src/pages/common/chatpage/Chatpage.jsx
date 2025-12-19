import { useState } from "react";
import ChatList from "../../../components/chatbox/ChatList";
import ChatBox from "../../../components/chatbox/Chatbox";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Chat List */}
        <div className={`${selectedChat ? "hidden lg:block" : "block"}`}>
          <ChatList onSelectChat={setSelectedChat} />
        </div>

        {/* Chat Box */}
        <div className={`lg:col-span-2 ${selectedChat ? "block" : "hidden lg:block"}`}>
          {selectedChat ? (
            <ChatBox chat={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
