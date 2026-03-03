import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useImageCrop } from "../../hooks/useImageCrop";
import ImageCropModal from "../../components/common/ImageCropModal";

const CreateJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const cropper = useImageCrop();
  const { role } = useAuth();
  const goBackPath = role === "admin" ? "/admin/jobs" : "/alumni/jobs";
  const [form, setForm] = useState({
    title: "",
    company: "",
    jobType: "",
    experience: "",
    location: "",
    qualification: "",
    salary: "",
    skills: "",
    applyLink: "",
  });

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    cropper.onSelectImage(file);
    e.target.value = null;
  };

  /* ===== VALIDATION ===== */
  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required";
    } else {
      if (
        ["title", "company", "location"].includes(name) &&
        value.trim().length < 3
      ) {
        error = "Minimum 3 characters required";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  /* ===== STEP VALIDATION ===== */
  const isStepOneValid =
    form.title.trim().length >= 3 &&
    form.company.trim().length >= 3 &&
    !errors.title &&
    !errors.company;

  const isStepTwoValid =
    form.jobType.trim() &&
    form.location.trim().length >= 3 &&
    !errors.jobType &&
    !errors.location;

  const isStepThreeValid =
    form.qualification.trim() &&
    form.salary.trim() &&
    form.skills.trim() &&
    form.applyLink.trim() &&
    !errors.qualification &&
    !errors.salary &&
    !errors.skills &&
    !errors.applyLink;

  const nextStep = () => {
    if (step === 1 && !isStepOneValid) return;
    if (step === 2 && !isStepTwoValid) return;
    setStep(step + 1);
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "skills") {
          formData.append(
            "skills",
            JSON.stringify(form.skills.split(",").map((s) => s.trim()))
          );
        } else {
          formData.append(key, form[key]);
        }
      });

    if (cropper.file) {
      formData.append("image", cropper.file);
    }

    await api.post("/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Job created successfully");
    setStep(4);
    } catch (err) {
      toast.error("Job creation failed");
    }
  };



  const inputClass = "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black";

  const labelClass = "text-sm font-medium text-zinc-700";

  return (
    <div className="min-h-screen bg-zinc-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl">

        {/* ===== STEPPER ===== */}
       <div className="mb-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center sm:w-[520px] px-8 py-3">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= s ? "bg-black text-white" : "bg-zinc-300 text-zinc-600"}`}
                  >
                    {step > s ? <MdDone /> : s}
                  </div>
                  {i !== 2 && (
                    <div
                      className={`w-16 sm:w-32 h-[2px] mx-2 ${
                        step > s ? "bg-black" : "bg-zinc-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="h-14" />
        </div>

        {/* ===== CARD ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div>
                <label className={labelClass}>Job Title *</label>
                <input
                  name="title"
                  className={inputClass}
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  name="company"
                  className={inputClass}
                  value={form.company}
                  onChange={handleChange}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>
                  Job Image <span className="text-zinc-400">(optional)</span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  id="jobImage"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <label
                  htmlFor="jobImage"
                  className="group cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 rounded-xl p-6 hover:border-black transition"
                >
              {cropper.preview ? (
                <img
                  src={cropper.preview}
                  className="w-full aspect-[16/9] object-cover rounded-lg"
                  alt="preview"
                />
              ) : (
                <>
                  <div className="text-sm text-zinc-500">Click to upload image</div>
                  <div className="text-xs text-zinc-400">JPG, PNG, WEBP</div>
                </>
              )}
                </label>

                {cropper.preview && (
                  <button
                    type="button"
                    onClick={() => {
                      cropper.reset();
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
              <h2 className="text-lg font-semibold">Job Details</h2>

              <div>
                <label className={labelClass}>Job Type *</label>
                <select
                  name="jobType"
                  className={inputClass}
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.jobType && (
                  <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Location *</label>
                <input
                  name="location"
                  className={inputClass}
                  value={form.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Additional Info</h2>
              <div>
                <label className={labelClass}>Experience</label>
                <select
                  name="experience"
                  className={inputClass}
                  value={form.experience}
                  onChange={handleChange}
                >
                  <option value="">Select experience</option>
                  <option value="fresher">Fresher</option>
                  <option value="1-3">1–3 Years</option>
                  <option value="3+">3+ Years</option>
                </select>
              </div>
              {["qualification", "salary", "skills", "applyLink"].map((field) => (
                <div key={field}>
                  <label className={labelClass}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} *
                  </label>
                  <input
                    name={field}
                    className={inputClass}
                    value={form[field]}
                    onChange={handleChange}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                Job Created Successfully 🎉
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
            <div className="flex justify-between mt-10">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 rounded-xl text-white ${
                  step === 1 ? "bg-zinc-400" : "bg-black"
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
        onCancel={cropper.cancelCrop}   // 👈 reset only
        onApply={cropper.applyCrop}
        closeModal={cropper.closeModal}
      />
    </div>
  );
};

export default CreateJob;
