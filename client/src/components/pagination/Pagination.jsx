const [jobs, setJobs] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  fetch(`/jobs?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => {
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    });
}, [page]);

return (
  <>
    {jobs.map(job => <JobCard key={job._id} {...job} />)}

    <div className="pagination">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>⬅ Prev</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next ➡</button>
    </div>
  </>
);
