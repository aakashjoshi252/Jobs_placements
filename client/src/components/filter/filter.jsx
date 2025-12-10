const [filters, setFilters] = useState({ location: "", jobType: "" });

const applyFilters = () => {
  fetch(`/jobs?location=${filters.location}&jobType=${filters.jobType}`)
    .then(res => res.json())
    .then(data => setJobs(data.jobs));
};

return (
  <aside className="filters-sidebar">
    <select onChange={(e)=>setFilters({...filters, location: e.target.value})}>
      <option value="">Choose Location</option>
      <option value="Mumbai">Mumbai</option>
      <option value="Delhi">Delhi</option>
    </select>

    <select onChange={(e)=>setFilters({...filters, jobType: e.target.value})}>
      <option value="">Job Type</option>
      <option value="Full Time">Full Time</option>
      <option value="Part Time">Part Time</option>
    </select>

    <button onClick={applyFilters}>Apply Filters</button>
  </aside>
);
