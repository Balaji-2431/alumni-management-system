import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ImageCropModal from "../../../components/common/ImageCropModal";
import { useImageCrop } from "../../../hooks/useImageCrop";
import { FaPhoneAlt, FaUser, FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";


/* ===================== STYLES ===================== */
// const inputClass ="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
// const disabledInputClass ="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const errorClass = "text-sm text-red-500 mt-1";
const inputClass = "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black";
const disabledInputClass = "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none bg-gray-100 text-gray-500 cursor-not-allowed";


/* ===================== COMPONENT ===================== */
const EditProfile = () => {
  const cropper = useImageCrop();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [readonly, setReadonly] = useState({
    registerNumber: "",
    email: "",
    department: "",
    batch: ""
  });
//   const [previewImage, setPreviewImage] = useState(null); // local preview
// const [selectedFile, setSelectedFile] = useState(null); // file to send to backend
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    yearOfPassing: "",
    linkedinProfile: "",
    careerStatus: "",
    profilePic: "",
    address: {
      city: "",
      district: "",
      state: "",
    },
    jobDetails: {
      jobTitle: "",
      companyName: "",
      experienceYears: ""
    },
    higherStudies: [],
    achievements: []
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const u = res.data.data;

        setReadonly({
          registerNumber: u.registerNumber,
          email: u.email,
          department: u.department,
          batch: u.batch
        });

        setForm({
          name: u.name || "",
          gender: u.gender || "",
          dateOfBirth: u.dateOfBirth?.substring(0, 10) || "",
          phone: u.phone || "",
          yearOfPassing: u.yearOfPassing || "",
          linkedinProfile: u.linkedinProfile || "",
          careerStatus: u.careerStatus || "",
          profilePic: u.profilePic || "",
          address: u.address || { city: "", district: "", state: "" },
          jobDetails: u.jobDetails || {
            jobTitle: "",
            companyName: "",
            experienceYears: ""
          },
          higherStudies: u.higherStudies || [],
          achievements: u.achievements || []
        });

        setLoading(false);
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);
const addAchievement = () => {
  setForm({
    ...form,
    achievements: [
      ...form.achievements,
      { title: "", year: "" }
    ]
  });
};

const updateAchievement = (i, field, value) => {
  const updated = [...form.achievements];
  updated[i][field] = value;
  setForm({ ...form, achievements: updated });
};

const removeAchievement = (i) => {
  const updated = [...form.achievements];
  updated.splice(i, 1);
  setForm({ ...form, achievements: updated });
};
// When user selects a new image
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  cropper.onSelectImage(file);

  // 🔥 IMPORTANT
  e.target.value = null;
};

// const applyCrop = async () => {
//   if (!croppedAreaPixels) {
//     return toast.error("Move crop box before applying!");
//   }
//   try {
//     const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
//     const uniqueFile = new File([croppedBlob], `${uuidv4()}.jpeg`, { type: "image/jpeg" });
//     setSelectedFile(uniqueFile);
//     setPreviewImage(URL.createObjectURL(uniqueFile));
//     setCropModal(false);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to crop image");
//   }
// };


// Remove current image
const handleRemoveImage = async () => {
  try {
    const res = await api.delete("/profile/remove-pic");

    setForm(prev => ({ ...prev, profilePic: res.data.data.profilePic }));
    cropper.reset(); // 🔥 IMPORTANT

    toast.success(res.data.message);
  } catch (err) {
    toast.error("Failed to remove image");
  }
};


// ================= HIGHER STUDIES =================
const addHigherStudy = () => {
  setForm((prev) => ({
    ...prev,
    higherStudies: [
      ...prev.higherStudies,
      {
        degreeName: "",
        institution: "",
        startYear: "",
        endYear: ""
      }
    ]
  }));
};

const updateHigherStudy = (index, field, value) => {
  const updated = [...form.higherStudies];
  updated[index][field] = value;

  setForm((prev) => ({
    ...prev,
    higherStudies: updated
  }));
};

const removeHigherStudy = (index) => {
  const updated = [...form.higherStudies];
  updated.splice(index, 1);

  setForm((prev) => ({
    ...prev,
    higherStudies: updated
  }));
};

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNested = (section, field, value) => {
    setForm({
      ...form,
      [section]: { ...form[section], [field]: value }
    });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};

    if (!form.name || form.name.length < 3)
      err.name = "Name must be at least 3 characters";

if (!form.phone || !/^\d{10}$/.test(form.phone)) {
  err.phone = "Phone number must be 10 digits";
}

    if (!form.yearOfPassing)
    err.yearOfPassing = "Year of passing is required";

    if (!form.gender) err.gender = "Gender is required";
    if (!form.dateOfBirth) err.dateOfBirth = "Date of birth required";

    if (
      form.linkedinProfile &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(form.linkedinProfile)
    ) {
      err.linkedinProfile = "Enter a valid LinkedIn profile URL";
    }

    if (!form.careerStatus)
      err.careerStatus = "Career status is required";

    if (form.careerStatus === "Employed") {
      if (!form.jobDetails.jobTitle)
        err.jobTitle = "Job title required";

      if (!form.jobDetails.companyName)
        err.companyName = "Company name required";

      if (!form.jobDetails.experienceYears)
        err.experienceYears = "Experience required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const formData = new FormData();
  
  // Add all fields
  Object.keys(form).forEach((key) => {
    if(key === "profilePic") return;
    if (key === "address" || key === "jobDetails") {
      formData.append(key, JSON.stringify(form[key]));
    } else if (key === "higherStudies" || key === "achievements") {
      formData.append(key, JSON.stringify(form[key]));
    } else {
      formData.append(key, form[key]);
    }
  });

    if (cropper.file) {
      formData.append("profilePic", cropper.file);
    }

  try {
    await api.put("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    toast.success("Profile updated successfully");
    navigate("/alumni/profile");
  } catch(err) {
    console.log(err.message)
    toast.error("Update failed");
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;

  /* ================= UI ================= */
return (
  <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white rounded-xl shadow-lg p-4 flex flex-col gap-6">

      {/* BACK BUTTON */}
      <div>
        <button
          onClick={() => navigate("/alumni/profile")}
          className="text-sm px-4 py-2 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Back to Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">

        {/* ================= FIRST ROW ================= */}
        <div className="w-full relative gap-3 flex flex-col md:flex-row">

          {/* PROFILE IMAGE */}
          <motion.div
            className="w-full md:flex-[35%] flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
          {/* <div className="w-full md:flex-[35%] flex justify-center"> */}
            <div className="p-6 w-full flex flex-col items-center gap-4">
            {/* <div className="w-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 w-full flex flex-col items-center gap-4"> */}
              
            <div className="w-34 h-34 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={
                    cropper.preview ||
                    `http://localhost:3000${form.profilePic}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 text-center">
                <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                  Change Profile Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {form.profilePic && (
                  <button
                    type="button"
                    className="text-sm text-red-500 hover:underline"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* BASIC INFO CARD */}
          <motion.div
              className="w-full md:flex-[60%] bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >            
            <div className=" flex flex-col gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass}>Register Number</label>
                <input disabled value={readonly.registerNumber} className={disabledInputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Department</label>
                  <input disabled value={readonly.department} className={disabledInputClass} />
                </div>
                <div>
                  <label className={labelClass}>Batch</label>
                  <input disabled value={readonly.batch} className={disabledInputClass} />
                </div>
              </div>
              
            </div>

          </motion.div>
        
        </div>

        {/* ================= SECOND ROW ================= */}
        <div className="w-full flex gap-3 flex-col md:flex-row">

          {/* LEFT CARD — Higher Studies & Achievements */}
          <motion.div
            className="w-full md:flex-[35%]  min-h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6 order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* CAREER */}
            <div>
              <label className={labelClass}>Career Status</label>
              <select
                value={form.careerStatus}
                onChange={(e) => setForm({ ...form, careerStatus: e.target.value })}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Employed">Employed</option>
                <option value="Higher Study">Higher Study</option>
                <option value="Unemployed">Unemployed</option>
              </select>
              {errors.careerStatus && <p className={errorClass}>{errors.careerStatus}</p>}
            </div>
            {form.careerStatus === "Employed" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <input
                  placeholder="Job Title"
                  value={form.jobDetails.jobTitle}
                  onChange={(e) => handleNested("jobDetails", "jobTitle", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Company Name"
                  value={form.jobDetails.companyName}
                  onChange={(e) => handleNested("jobDetails", "companyName", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Experience (Years)"
                  value={form.jobDetails.experienceYears}
                  onChange={(e) => handleNested("jobDetails", "experienceYears", e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {/* HIGHER STUDIES */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaGraduationCap /> Higher Studies
              </h3>
              {form.higherStudies.map((hs, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    className={inputClass}
                    placeholder="Degree"
                    value={hs.degreeName}
                    onChange={(e) => updateHigherStudy(i, "degreeName", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Institution"
                    value={hs.institution}
                    onChange={(e) => updateHigherStudy(i, "institution", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="Start Year"
                    value={hs.startYear}
                    onChange={(e) => updateHigherStudy(i, "startYear", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="End Year"
                    value={hs.endYear}
                    onChange={(e) => updateHigherStudy(i, "endYear", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeHigherStudy(i)}
                    className="text-red-500 text-sm col-span-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={addHigherStudy} className="cursor-pointer text-blue-600 text-sm">
                + Add Higher Study
              </button>
            </div>

            {/* ACHIEVEMENTS */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaGraduationCap /> Achievements
              </h3>
              {form.achievements.map((a, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    className={inputClass}
                    placeholder="Title"
                    value={a.title}
                    onChange={(e) => updateAchievement(i, "title", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="Year"
                    value={a.year}
                    onChange={(e) => updateAchievement(i, "year", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(i)}
                    className="cursor-pointer text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={addAchievement} className="cursor-pointer text-blue-600 text-sm">
                + Add Achievement
              </button>
            </div>

          </motion.div>

          {/* RIGHT CARD — Contact & Career */}
            <motion.div
            className="w-full md:flex-[60%] bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6 order-1 md:order-2"            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
          {/* <div className="w-full md:flex-[60%] bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6 order-1 md:order-2"> */}
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-3">
                <FaPhoneAlt /> Contact Info
              </h3>
            {/* CONTACT */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
              <div>
                <label className={labelClass}>Email</label>
              <input disabled value={readonly.email} className={disabledInputClass} />
              </div>
              <div>
                <label className={labelClass}>LinkedIn</label>
                <input
                  value={form.linkedinProfile}
                  onChange={(e) => setForm({ ...form, linkedinProfile: e.target.value })}
                  className={inputClass}
                />
                {errors.linkedinProfile && <p className={errorClass}>{errors.linkedinProfile}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input placeholder="City" value={form.address.city} onChange={(e) => handleNested("address", "city", e.target.value)} className={inputClass}/>
                  {/* {errors.name && <p className={errorClass}>{errors.name}</p>} */}
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input placeholder="District" value={form.address.district} onChange={(e) => handleNested("address", "district", e.target.value)} className={inputClass} />
                  {/* {errors.name && <p className={errorClass}>{errors.name}</p>} */}
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input placeholder="State" value={form.address.state} onChange={(e) => handleNested("address", "state", e.target.value)} className={inputClass} />
                  {/* {errors.name && <p className={errorClass}>{errors.name}</p>} */}
                </div>
              </div>

              </div>

              <div className="w-full">
                <h3 className=" flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-3">
                  <FaUser /> Basic Info
                </h3>
                <div className="w-full flex flex-col sm:flex-row gap-6">
                <div className="flex-1/2">
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
                  {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth}</p>}
                </div>

                <div className="flex-1/2">
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  {errors.gender && <p className={errorClass}>{errors.gender}</p>}
                </div>
                </div>
              </div>
              {/* <div>
                <label className={labelClass}>Year of Passing</label>
                <input
                  type="number"
                  value={form.yearOfPassing}
                  onChange={(e) => setForm({ ...form, yearOfPassing: e.target.value })}
                  className={inputClass}
                />
                {errors.yearOfPassing && <p className={errorClass}>{errors.yearOfPassing}</p>}
              </div> */}
           
            </div>

          </motion.div>

        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Changes
        </button>
      </form>

      <ImageCropModal
        open={cropper.open}
        imageSrc={cropper.imageSrc}
        aspect={1 / 1}
        crop={cropper.crop}
        zoom={cropper.zoom}
        setCrop={cropper.setCrop}
        setZoom={cropper.setZoom}
        onCropComplete={(_, pixels) => cropper.setCroppedPixels(pixels)}
        onCancel={cropper.cancelCrop}
        onApply={cropper.applyCrop}
        closeModal={cropper.closeModal}
      />
    </div>
  </div>
);
};

export default EditProfile;
