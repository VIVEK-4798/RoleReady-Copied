import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '@/utils/apiProvider';

const NicheSection = () => {
  const [showNiche, setShowNiche] = useState(true);
  const [role, setRole] = useState('user');
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user_id;
  console.log(userId);
  
  

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);

    if (userId && storedRole) {
      axios
        .get(`${api}/api/profile/get-niche-or-experience/${userId}/${storedRole}`)
        .then((res) => {
          if (res.data.value) {
            setValue(res.data.value);
            setSaved(true);
          }
        })
        .catch((err) => console.error('Fetch error:', err));
    }
  }, [userId]);

  const handleSave = () => {
    if (!value) return;

    axios
      .post(`${api}/api/profile/save-niche-or-experience`, {
        user_id: userId,
        role,
        value
      })
      .then(() => setSaved(true))
      .catch((err) => console.error('Save error:', err));
  };

  const mentorOptions = [
    '0 - 11 months',
    '1 - 2 years',
    '3 - 5 years',
    '6 - 10 years',
    '> 10 years'
  ];

  return (
    <>
      {showNiche && (
        <div className="bg-white shadow rounded p-3 mb-30">
          <h5 className="text-20 fw-600 mb-15">
            {role === 'mentor' ? 'Work Experience' : 'What’s your niche?'}
          </h5>
          <p className="text-16 text-light-1 mb-10">
            {role === 'mentor'
              ? 'What was your work experience & designation?'
              : 'Tell us your interest so we can help you grow!'}
          </p>
          <select
            className="form-select mb-10"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
          >
            {role === 'mentor' ? (
              <>
                <option value="">Select Experience</option>
                {mentorOptions.map((exp, i) => (
                  <option key={i} value={exp}>
                    {exp}
                  </option>
                ))}
              </>
            ) : (
              <>
                <option value="">Select Your Domain</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
              </>
            )}
          </select>
          <div className="d-flex justify-between">
            <button className="button -red-1 p-1" onClick={() => setShowNiche(false)}>
              Cancel
            </button>
            <button className="button -blue-1 p-1" onClick={handleSave} disabled={saved}>
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NicheSection;
