import React from 'react';
import './Filters.css';

const Filters = ({ filters, handleFilterChange, getJobs }) => {
  return (
    <form className="filter-form">
      <label>
        Min Salary:
        <input
          type="number"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Max Salary:
        <input
          type="number"
          name="maxSalary"
          value={filters.maxSalary}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Location ISO:
        <input
          type="text"
          name="locationIso"
          value={filters.locationIso}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Job Types:
        <input
          type="text"
          name="jobTypes"
          value={filters.jobTypes}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Skill Levels:
        <input
          type="text"
          name="skillLevels"
          value={filters.skillLevels}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Degree Required:
        <input
          type="checkbox"
          name="degreeRequired"
          checked={filters.degreeRequired}
          onChange={handleFilterChange}
        />
      </label>

      <label>
        Technologies:
        <input
          type="text"
          name="technologies"
          value={filters.technologies}
          onChange={handleFilterChange}
        />
      </label>

      <button type="button" onClick={getJobs}>
        Apply Filters
      </button>
    </form>
  );
};

export default Filters;
