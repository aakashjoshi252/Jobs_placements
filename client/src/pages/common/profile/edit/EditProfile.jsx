import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const role = user?.role;
    console.log(user)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await userApi.put(`/${user._id}`, formData);
            dispatch(loginSuccess(res.data.user));
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-white shadow-lg rounded-2xl p-8 border">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Edit Profile
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        Cancel
                    </button>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Full Name"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium text-gray-800 capitalize">{role}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function InputField({ label, name, value, onChange }) {
    return (
        <div>
            <label className="block font-semibold text-gray-700 mb-1">
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
        </div>
    );
}
