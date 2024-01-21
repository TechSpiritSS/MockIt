import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { crackeddevs } from '../../utils/crackeddev';
import Filters from './Filters';
import './Jobs.css';

const Jobs = () => {
  const name = new URLSearchParams(window.location.search).get('name');

  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    minSalary: '',
    maxSalary: '',
    locationIso: '',
    jobTypes: '',
    skillLevels: '',
    degreeRequired: false,
    technologies: '',
  });
  const history = useNavigate();

  const getJobs = async () => {
    const jobslist = await crackeddevs(filters);
    setJobs(jobslist);
  };

  useEffect(() => {
    getJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClick = async () => {
    const promise = toast.promise(yourApiCallFunction(), {
      loading: 'Loading...',
      success: 'API call successful!',
      error: 'Failed to make API call',
    });

    try {
      await promise;
      history(`/$chat?name=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <div className="jobs-scroll-container">
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '1rem',
          padding: '1rem',
        }}
      >
        Jobs List
      </h1>

      {/* Filter Form */}
      <Filters
        filters={filters}
        handleFilterChange={handleFilterChange}
        getJobs={getJobs}
      />

      <div className="jobs-container">
        {/* Jobs List */}
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>
              {job.image_url && (
                <img
                  src={job.image_url}
                  alt="Company Logo"
                  className="company-logo"
                />
              )}
              <span>{job.title}</span> @ <span>{job.company}</span> -{' '}
            </h2>
            <p className="job-description">
              {truncateDescription(job.description, 3)}
            </p>
            <br />

            {job.technologies && (
              <div className="technologies">
                {job.technologies.map((tech) => (
                  <span
                    key={tech + job.company}
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      borderRadius: '5px',
                      padding: '2px',
                    }}
                  >
                    {tech}{' '}
                  </span>
                ))}
              </div>
            )}
            <div className="job-details">
              <span>{job.applications} Applications</span>
              {job.min_salary_usd && job.min_salary_usd > 0 && (
                <p>Min Salary: ${job.min_salary_usd}</p>
              )}
              {job.max_salary_usd && job.max_salary_usd > 0 && (
                <p>Max Salary: ${job.max_salary_usd}</p>
              )}
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Apply for the job
              </a>
              <button onClick={handleClick}>Mock Interview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const truncateDescription = (text, lines) => {
  const truncatedText = text.split('\n').slice(0, lines).join('\n');
  return `${truncatedText}...`;
};

export default Jobs;