import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";



const CustomerAffairs = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/inquiries/", {
        headers: {
          Authorization: `Admin`,
        },
      });

      console.log("Fetched inquiries:", response.data);

      const inquiries = response.data.inquiries || []; // Safeguard here
      const sortedInquiries = inquiries.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "complaint" ? -1 : 1;
      });
      setInquiries(sortedInquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const handleReplyClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    try {
      await axios.post(
        "http://localhost:8070/api/inquiries/reply",
        {
          inquiryId: selectedInquiry._id,
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer`,
          },
        }
      );
      toast.success("Reply sent successfully!");
      setSelectedInquiry(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply.");
    }
  };

  return (
    <div className="p-6 font-[Poppins] bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 mx-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Customer Affairs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry._id}
                    className={`p-4 transition-all ${
                      inquiry.type === "complaint"
                        ? "bg-red-100"
                        : index % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    }`}
                  >
                    <td className="p-3">{inquiry.userName}</td>
                    <td className="p-3">{inquiry.mail}</td>
                    <td className="p-3 capitalize">{inquiry.type}</td>
                    <td className="p-3">{inquiry.message}</td>
                    <td className="p-3">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        onClick={() => handleReplyClick(inquiry)}
                      >
                        Reply to Customer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reply Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-semibold mb-4">
                Reply to {selectedInquiry.userName}
              </h2>
              <textarea
                className="w-full border border-gray-300 p-2 rounded mb-4"
                rows="5"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleSendReply}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAffairs;

