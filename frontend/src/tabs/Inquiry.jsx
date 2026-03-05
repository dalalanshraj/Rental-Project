  import { useEffect, useState } from "react";
 import api from "../api/axios.js";

  export default function Inquiry() {
    const [inquiries, setInquiries] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
      api
        .get("/inquiries")
        .then(res => setInquiries(res.data));
    }, []);

    const download = (inq) => {
      const text = `
  Property: ${inq.property?.property?.title || "N/A"}
  Name: ${inq.name}
  Email: ${inq.email}
  Phone: ${inq.phone}
  Message: ${inq.message}
  Date: ${new Date(inq.createdAt).toLocaleString()}
      `;

      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "inquiry.txt";
      a.click();
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Inquiries
          </h1>
          <p className="text-sm text-gray-500">
            Messages sent by users from property pages
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{inq.name}</td>
                  <td className="p-3">{inq.property?.property?.title}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => setSelected(inq)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      onClick={() => download(inq)}
                      className="text-green-600 hover:underline cursor-pointer"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">

              <h2 className="text-xl font-bold mb-4">
                Inquiry Details
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p><b>Name:</b> {selected.name}</p>
                <p><b>Email:</b> {selected.email}</p>
                <p><b>Phone:</b> {selected.phone}</p>
                <p><b>Property:</b> {selected.property?.property?.title || "N/A"}</p>
                <p><b>Message:</b></p>
                <p className="bg-gray-100 p-3 rounded">
                  {selected.message}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-blue-600 hover:bg-blue-700
                            text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }
