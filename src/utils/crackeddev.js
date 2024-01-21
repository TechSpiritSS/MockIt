import axios from 'axios';

const API_KEY = import.meta.env.VITE_CRACKED_DEV_APIKEY;

export async function crackeddevs({
  limit = 10,
  minSalary,
  maxSalary,
  locationIso,
  jobTypes,
  skillLevels,
  degreeRequired,
  technologies,
} = {}) {
  const params = new URLSearchParams({
    limit,
  });

  // Add parameters to URL only if they are provided and not undefined or blank
  if (minSalary !== undefined && minSalary !== '')
    params.append('min_salary', minSalary);
  if (maxSalary !== undefined && maxSalary !== '')
    params.append('max_salary', maxSalary);
  if (locationIso !== undefined && locationIso !== '')
    params.append('location_iso', locationIso);
  if (jobTypes !== undefined && jobTypes !== '')
    params.append('job_types', jobTypes);
  if (skillLevels !== undefined && skillLevels !== '')
    params.append('skill_levels', skillLevels);
  if (degreeRequired !== undefined)
    params.append('degree_required', degreeRequired);
  if (technologies !== undefined && technologies !== '')
    params.append('technologies', technologies);

  const response = await axios.get(
    `https://api.crackeddevs.com/api/get-jobs?${params.toString()}`,
    {
      headers: {
        'api-key': API_KEY,
      },
    }
  );

  return response.data;
}
