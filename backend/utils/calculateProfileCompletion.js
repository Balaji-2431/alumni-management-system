const DEFAULT_PROFILE_PIC = "/uploads/profilePic.jpg";

module.exports = function calculateProfileCompletion(user) {
  let score = 0;

  // 1️⃣ Core Info – 25%
  if (
    user.name &&
    user.registerNumber &&
    user.department &&
    user.batch
  ) {
    score += 25;
  }

  // 2️⃣ Contact – 15%
  if (
    user.email &&
    user.phone &&
    user.address?.city
  ) {
    score += 15;
  }

  // 3️⃣ Career OR Higher Studies – 25%
  const hasCareer =
    user.careerStatus === "Employed" &&
    user.jobDetails?.jobTitle &&
    user.jobDetails?.companyName;

  const hasHigherStudies =
    Array.isArray(user.higherStudies) &&
    user.higherStudies.length > 0;

  if (hasCareer || hasHigherStudies) {
    score += 25;
  }

  // 4️⃣ Profile Image – 15%
  if (
    user.profilePic &&
    user.profilePic !== DEFAULT_PROFILE_PIC
  ) {
    score += 15;
  }

  // 5️⃣ Social Presence – 10%
  if (user.linkedinProfile) {
    score += 10;
  }

  return Math.min(score, 100);
};