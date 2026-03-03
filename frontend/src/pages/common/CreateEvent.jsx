import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import api from "../../api/axios.js";
import { toast } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useImageCrop } from "../../hooks/useImageCrop";
import ImageCropModal from "../../components/common/ImageCropModal";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const cropper = useImageCrop();

  const { role } = useAuth();
  const goBackPath = role === "admin" ? "/admin/events" : "/alumni/events";
  
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "",
    location: "",
    organizerName: "",
    registrationRequired: "no",
    registrationLink: "",
    lastRegistrationDate: "",
    eventLink: ""
  });

  const [errors, setErrors] = useState({});

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  cropper.onSelectImage(file);

  // 🔥 MUST reset file input
  e.target.value = null;
};

const validateField = (name, value) => {
  let error = "";

  /* ===== REQUIRED CHECK ===== */
  if (!value || !value.trim()) {
    error = "This field is required";
  }

  /* ===== TEXT RULES ===== */
  if (name === "title" && value.trim().length < 3) {
    error = "Minimum 3 characters required";
  }

if (name === "description" && value.trim().length < 20) {
  error = "Minimum 20 characters required";
}

  /* ===== DATE RULE ===== */
  if (name === "date") {
    const today = new Date().toISOString().split("T")[0];
    if (value < today) {
      error = "Date cannot be in the past";
    }
  }

  /* ===== TIME RULES (THIS WAS YOUR BUG) ===== */
  if (name === "endTime" && form.startTime && value <= form.startTime) {
    error = "End time must be after start time";
  }

  if (name === "startTime" && form.endTime && form.endTime <= value) {
    setErrors((prev) => ({
      ...prev,
      endTime: "End time must be after start time",
    }));
  }

  /* ===== SAVE ERROR ===== */
  setErrors((prev) => ({ ...prev, [name]: error }));
};

  const isStepOneValid =
  form.title.trim().length >= 3 &&
  form.category &&
  form.description.trim().length >= 20 &&
  !errors.title &&
  !errors.category &&
  !errors.description;

const isStepTwoValid =
  form.date &&
  form.startTime &&
  form.endTime &&
  form.endTime > form.startTime &&
  !errors.date &&
  !errors.startTime &&
  !errors.endTime;

const isStepThreeValid =
  form.mode &&
  form.organizerName.trim().length >= 3 &&
  (form.mode === "online" || form.location.trim().length >= 3) &&
  !errors.mode &&
  !errors.organizerName &&
  !errors.location;
  const nextStep = () => {
    if (step === 1 && !isStepOneValid) return;
    if (step === 2 && !isStepTwoValid) return;
    if (step === 3 && !isStepThreeValid) return;
    setStep(step + 1);
  };

  const prevStep = () => step > 1 && setStep(step - 1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };
const handleSubmit = async () => {
  try {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, value);
      }
    });

    if (cropper.file) {
      formData.append("image", cropper.file);
    }

    await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Event created successfully");
    setStep(4);
  } catch (err) {
    console.error(err);
    toast.error("Event creation failed");
  }
};



  const inputClass = "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black";
  const labelClass = "text-sm font-medium text-zinc-700 block py-2 px-1";

  const errorText = "text-xs text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-zinc-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* ===== STEPPER ===== */}
        <div className="mb-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center justify-between sm:w-[520px] rounded-full px-8 py-3">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= s ? "bg-black text-white" : "bg-zinc-300 text-zinc-600"
                    }`}
                  >
                    {step > s ? <MdDone /> : s}
                  </div>
                  {i !== 2 && (
                    <div
                      className={`w-18 sm:w-40 h-[2px] mx-2 ${
                        step > s ? "bg-black" : "bg-zinc-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="h-10" />
        </div>

        {/* ===== CARD ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div>
                <label className={labelClass}>
                  Event Title 
                </label>
                <input
                  name="title"
                  placeholder="Event Title"
                  required
                  className={inputClass}
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <p className={errorText}>{errors.title}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  Category
                </label>
                <select
                  name="category"
                  required
                  className={inputClass}
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="technical">Technical</option>
                  <option value="career">Career</option>
                  <option value="networking">Networking</option>
                  <option value="cultural">Cultural</option>
                </select>
                {errors.category && <p className={errorText}>{errors.category}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  Description 
                </label>
                <textarea
                  name="description"
                  placeholder="Event Description"
                  required
                  className={inputClass}
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className={errorText}>{errors.description}</p>
                )}
              </div>

<div className="space-y-2">
  <label className={labelClass}>
    Event Image <span className="text-zinc-400">(optional)</span>
  </label>

  <input
    type="file"
    accept="image/*"
    id="eventImage"
    onChange={handleImageChange}
    className="hidden"
  />

  <label
    htmlFor="eventImage"
    className="group cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-black transition"
  >
    {cropper.preview ? (
      <img
        src={cropper.preview}
        alt="Preview"
        className="w-full aspect-video object-cover rounded-lg"
      />
    ) : (
      <>
        <div className="text-sm text-zinc-500 group-hover:text-black">
          Click to upload image
        </div>
        <div className="text-xs text-zinc-400">
          JPG, PNG, WEBP (recommended)
        </div>
      </>
    )}
  </label>

  {cropper.preview && (
    <button
      type="button"
      onClick={() => {
        cropper.reset();
        //       setPreviewImage(null);
  //       setSelectedFile(null);
  //         setImageSrc(null);
  // setCrop({ x: 0, y: 0 });
  // setZoom(1);
      }}
      className="text-xs text-red-500 hover:underline"
    >
      Remove image
    </button>
  )}
</div>            
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Date & Time</h2>

              <div>
                <label className={labelClass}>
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && <p className={errorText}>{errors.date}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  className={inputClass}
                  value={form.startTime}
                  onChange={handleChange}
                />
                {errors.startTime && (
                  <p className={errorText}>{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  required
                  className={inputClass}
                  value={form.endTime}
                  onChange={handleChange}
                />
                {errors.endTime && (
                  <p className={errorText}>{errors.endTime}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Mode & Organizer</h2>

              <div>
                <label className={labelClass}>
                  Mode 
                </label>
                <select
                  name="mode"
                  required
                  className={inputClass}
                  value={form.mode}
                  onChange={handleChange}
                >
                  <option value="">Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.mode && <p className={errorText}>{errors.mode}</p>}
              </div>

              {form.mode !== "online" && (
                <div>
                  <label className={labelClass}>
                    Location
                  </label>
                  <input
                    name="location"
                    required
                    placeholder="Event Location"
                    className={inputClass}
                    value={form.location}
                    onChange={handleChange}
                  />
                  {errors.location && (
                    <p className={errorText}>{errors.location}</p>
                  )}
                </div>
              )}

              {(form.mode === "online" || form.mode === "hybrid") && (
                <div>
                  <label className={labelClass}>
                    Registration Required 
                  </label>
                  <select
                    name="registrationRequired"
                    className={inputClass}
                    value={form.registrationRequired}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>

                  {form.registrationRequired === "yes" && (
                    <div className="grid sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className={labelClass}>
                          Registration Link
                        </label>
                        <input
                          type="text"
                          name="registrationLink"
                          placeholder="Registration URL"
                          className={inputClass}
                          value={form.registrationLink}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Last Registration Date
                        </label>
                        <input
                          type="date"
                          name="lastRegistrationDate"
                          className={inputClass}
                          value={form.lastRegistrationDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {(form.mode === "online" || form.mode === "hybrid") &&
                    form.registrationRequired === "no" && (
                      <div>
                        <label className={labelClass}>
                          Event Link
                        </label>
                        <input
                          type="text"
                          name="eventLink"
                          placeholder="Zoom / Google Meet link"
                          className={inputClass}
                          value={form.eventLink}
                          onChange={handleChange}
                        />
                        {errors.eventLink && (
                          <p className={errorText}>{errors.eventLink}</p>
                        )}
                      </div>
                  )}
                </div>
              )}

              <div>
                <label className={labelClass}>
                  Organizer Name 
                </label>
                <input
                  name="organizerName"
                  required
                  placeholder="Organizer Name"
                  className={inputClass}
                  value={form.organizerName}
                  onChange={handleChange}
                />
                {errors.organizerName && (
                  <p className={errorText}>{errors.organizerName}</p>
                )}
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                Event Created Successfully 🎉
              </h2>
              <button
                onClick={() => navigate(goBackPath)}
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                Go Back
              </button>
            </div>
          )}

          {/* NAVIGATION */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 rounded-xl text-white ${
                  step === 1
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-black"
                }`}
              >
                Previous
              </button>


              {step === 3 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepThreeValid}
                  className={`px-6 py-3 rounded-xl text-white ${
                    isStepThreeValid ? "bg-black" : "bg-zinc-400"
                  }`}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !isStepOneValid) ||
                    (step === 2 && !isStepTwoValid)
                  }
                  className={`px-6 py-3 rounded-xl text-white ${
                    (step === 1 && isStepOneValid) ||
                    (step === 2 && isStepTwoValid)
                      ? "bg-black"
                      : "bg-zinc-400"
                  }`}
                >
                  Next
                </button>
              )}

            </div>
          )}
        </div>
      </div>
<ImageCropModal
  open={cropper.open}
  imageSrc={cropper.imageSrc}
  aspect={16 / 9} // Job image
  crop={cropper.crop}
  zoom={cropper.zoom}
  setCrop={cropper.setCrop}
  setZoom={cropper.setZoom}
  onCropComplete={(_, pixels) =>
    cropper.setCroppedPixels(pixels)
  }
  onCancel={cropper.cancelCrop}
  onApply={cropper.applyCrop}
    closeModal={cropper.closeModal}

/>
    </div>
  );
};

export default CreateEvent;
